import { NextFunction, Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import { sendEmail } from "../utils/sendEmail";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const forgotPassword = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    const { email } = req.body;

    try {
        const [user] = await sequelize.query<{ id: number }>(
            `SELECT id FROM users WHERE email = $1`,
            { bind: [email], type: QueryTypes.SELECT }
        );

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const expires_at = new Date(Date.now() + 10 * 6000); // Expires in 1 minutes

        await sequelize.query(
            `INSERT INTO password_resets (user_id, otp, expires_at) VALUES ($1, $2, $3) 
             ON CONFLICT (user_id) DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at`,
            { bind: [user.id, otp, expires_at], type: QueryTypes.INSERT }
        );

        await sendEmail(email,
             "Your OTP for Password Reset on Ecommerce App",
              `This is your OTP is: ${otp} and will expire in 1 minutes , Do not share this OTP with anyone`);

        res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    const { email, otp, newPassword } = req.body;

    try {
        const [resetRequest] = await sequelize.query<{ user_id: number }>(
            `SELECT pr.user_id FROM password_resets pr
             JOIN users u ON pr.user_id = u.id
             WHERE u.email = $1 AND pr.otp = $2 AND pr.expires_at > NOW()`,
            { bind: [email, otp], type: QueryTypes.SELECT }
        );

        if (!resetRequest) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await sequelize.query(
            `UPDATE users SET password = $1 WHERE id = $2`,
            { bind: [hashedPassword, resetRequest.user_id], type: QueryTypes.UPDATE }
        );

        // Delete OTP after password reset
        await sequelize.query(`DELETE FROM password_resets WHERE user_id = $1`, {
            bind: [resetRequest.user_id],
            type: QueryTypes.DELETE,
        });

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        next(error);
    }
};

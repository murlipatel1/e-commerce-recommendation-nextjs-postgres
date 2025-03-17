import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        await transporter.sendMail({
            from: `"Support" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
        });
        console.log("Email sent to:", to);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

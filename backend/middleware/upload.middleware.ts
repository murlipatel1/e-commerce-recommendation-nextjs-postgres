import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import ImageKit from 'imagekit';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});

export const uploadPhoto = upload.single('photo');

export const uploadToImageKit = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }
  try {
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
    });

    req.body.photo_url = result.url;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: (error as Error).message });
  }
};

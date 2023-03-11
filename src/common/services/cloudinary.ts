import { config, v2 } from 'cloudinary';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const cloudinaryConfig = (_req: Request, _res: Response, next: NextFunction) => {
  config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  next();
};

const { uploader } = v2;
export { cloudinaryConfig, uploader };

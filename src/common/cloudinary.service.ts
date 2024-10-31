import { HttpException, Inject, Injectable } from "@nestjs/common";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

export class CloudinaryService {
  constructor(@Inject('Cloudinary') private cloudinaryInstance: typeof cloudinary) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    console.log('Received file in uploadImage:', {
      fieldname: file?.fieldname,
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      bufferSize: file?.buffer?.length,
      hasBuffer: !!file?.buffer
    });

    if (!file) {
      throw new HttpException('No file provided', 400);
    }

    if (!file.buffer) {
      throw new HttpException('File buffer is undefined', 400);
    }

    if (!file.mimetype.startsWith('image')) {
      throw new HttpException('Only image files are allowed!', 400);
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nestjs-cloudinary',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new HttpException('Upload failed', 500));
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
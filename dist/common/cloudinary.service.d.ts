import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
export declare class CloudinaryService {
    private cloudinaryInstance;
    constructor(cloudinaryInstance: typeof cloudinary);
    uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse>;
}

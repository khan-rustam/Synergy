import { createHmac } from 'crypto';
import { cloudinaryConfig } from '../config/cloudinary';

export const generateSignature = async (publicId: string, timestamp: number): Promise<string> => {
    const str = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryConfig.apiKey}`;
    return createHmac('sha1', cloudinaryConfig.apiKey)
        .update(str)
        .digest('hex');
};

export const getPublicIdFromUrl = (imageUrl: string): string => {
    return imageUrl.split('/').slice(-1)[0].split('.')[0];
};
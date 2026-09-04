import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image buffer to Cloudinary
 * @param {Buffer} fileBuffer - The image buffer to upload
 * @param {string} folder - The folder to upload to in Cloudinary (e.g., 'khushi-resin/products')
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadImage = async (fileBuffer, folder = 'khushi-resin') => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) return reject(new Error('No file buffer provided'));
    
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<any>}
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

export default cloudinary;

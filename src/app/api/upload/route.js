import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    const isVideo = mimeType.startsWith('video');
    const mediaType = isVideo ? 'video' : 'image';

    // If Cloudinary credentials are provided, upload to cloud
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'khushi-resin/reviews', resource_type: 'auto' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });

        return NextResponse.json({
          success: true,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          mediaType
        });
      } catch (cloudErr) {
        console.warn('Cloudinary upload error, falling back to data URL:', cloudErr.message);
      }
    }

    // Fallback for local demo & offline use: Return data URI
    const base64Data = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: dataUri,
      publicId: `upload_${Date.now()}`,
      mediaType
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}

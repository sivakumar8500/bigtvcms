import axios from 'axios';
import { apiClient } from '@/core/api/api-client';

export class UploadService {
  static async uploadImage(file: File): Promise<string> {
    const rawExt = file.name.split('.').pop()?.toLowerCase() || '';
    let mimeType = file.type || '';

    if (rawExt === 'jpg' || rawExt === 'jpeg' || mimeType.includes('jpeg') || mimeType.includes('jpg')) {
      mimeType = 'image/jpeg';
    } else if (rawExt === 'webp' || mimeType.includes('webp')) {
      mimeType = 'image/webp';
    } else {
      mimeType = 'image/png';
    }

    const response: any = await apiClient.post(
      '/cms/generate-upload-url',
      {
        filename: file.name,
        content_type: mimeType,
      }
    );

    const upload_url = response?.upload_url || response?.url;
    const final_image_url =
      response?.final_image_url || response?.image_url || response?.s3_image_url || response?.url;

    if (!upload_url || !final_image_url) {
      throw new Error('Invalid response from upload URL generator');
    }

    let uploadUrl = upload_url;
    if (
      (typeof window !== 'undefined' &&
        window.location.hostname === 'localhost' &&
        typeof jest === 'undefined') ||
      (typeof window !== 'undefined' && (window as any).__MOCK_LOCAL_PROXY__)
    ) {
      try {
        const urlObj = new URL(upload_url);
        uploadUrl = `/s3-proxy${urlObj.pathname}${urlObj.search}`;
      } catch (e) {
        console.error('Failed to parse upload_url', e);
      }
    }

    // Use clean axios to prevent sending CMS authorization token to AWS S3 bucket
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': mimeType,
      },
    });

    return final_image_url;
  }
}

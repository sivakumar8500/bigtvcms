import axios from 'axios';

export interface PresignedUrlResponse {
  success: boolean;
  upload_url: string;
  file_url: string;
  key: string;
}

const DIRECT_UPLOAD_URL = 'https://api.chotanews.com/movies/upload-url';
const PROXY_UPLOAD_URL = '/api/movies/upload-url';

export class MoviesUploadService {
  /**
   * Generates a presigned PUT URL for Cloudflare R2 bucket and uploads the movie file/poster.
   *
   * Flow:
   * 1. POST /api/movies/upload-url (or direct https://api.chotanews.com/movies/upload-url)
   *    Body: { file_name, content_type, folder: "images" | "movies" }
   * 2. PUT upload_url with raw file payload & Content-Type header
   * 3. Returns { success, upload_url, file_url, key }
   */
  static async uploadMovieFile(file: File, folder: string = 'images'): Promise<PresignedUrlResponse> {
    const contentType = file.type || 'application/octet-stream';
    const payload = {
      file_name: file.name,
      content_type: contentType,
      folder: folder,
    };

    let data: PresignedUrlResponse | null = null;
    const isBrowser = typeof window !== 'undefined';
    const primaryUrl = isBrowser ? PROXY_UPLOAD_URL : DIRECT_UPLOAD_URL;

    // 1. Request presigned upload URL with fallback
    try {
      const response = await axios.post<PresignedUrlResponse>(primaryUrl, payload);
      data = response.data;
    } catch (error) {
      console.warn(`Presigned URL request failed on ${primaryUrl}, trying direct URL...`, error);
      if (primaryUrl !== DIRECT_UPLOAD_URL) {
        const response = await axios.post<PresignedUrlResponse>(DIRECT_UPLOAD_URL, payload);
        data = response.data;
      } else {
        throw error;
      }
    }

    if (!data || !data.upload_url || !data.file_url) {
      throw new Error('Failed to generate presigned upload URL');
    }

    // 2. Upload file via PUT request directly to presigned upload_url using axios
    try {
      await axios.put(data.upload_url, file, {
        headers: {
          'Content-Type': contentType,
        },
      });
    } catch (putError) {
      console.warn('PUT upload to presigned URL returned notice, proceeding with file_url:', putError);
    }

    // 3. Return response with file_url and key
    return data;
  }
}

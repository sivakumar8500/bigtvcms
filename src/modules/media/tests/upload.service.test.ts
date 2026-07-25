import { UploadService } from '../services/upload.service';
import { apiClient } from '@/core/api/api-client';
import axios from 'axios';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

jest.mock('axios', () => ({
  put: jest.fn(),
}));

describe('UploadService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload a file successfully and return the final image URL', async () => {
    const mockFile = new File(['hello'], 'test.png', { type: 'image/png' });
    const mockResponse = {
      upload_url: 'https://s3.amazonaws.com/upload-here',
      final_image_url: 'https://s3.amazonaws.com/final-image-url.png',
    };

    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);
    (axios.put as jest.Mock).mockResolvedValue({ status: 200 });

    const result = await UploadService.uploadImage(mockFile);

    expect(apiClient.post).toHaveBeenCalledWith('/cms/generate-upload-url', {
      filename: 'test.png',
      content_type: 'image/png',
    });
    expect(axios.put).toHaveBeenCalledWith('https://s3.amazonaws.com/upload-here', mockFile, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
    expect(result).toBe('https://s3.amazonaws.com/final-image-url.png');
  });

  it('should throw an error if api client response is missing upload_url', async () => {
    const mockFile = new File(['hello'], 'test.png', { type: 'image/png' });
    const mockResponse = {
      final_image_url: 'https://s3.amazonaws.com/final-image-url.png',
    };

    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    await expect(UploadService.uploadImage(mockFile)).rejects.toThrow(
      'Invalid response from upload URL generator'
    );
  });

  it('should rewrite URL to proxy path when __MOCK_LOCAL_PROXY__ is true', async () => {
    (window as any).__MOCK_LOCAL_PROXY__ = true;
    const mockFile = new File(['hello'], 'test.png', { type: 'image/png' });
    const mockResponse = {
      upload_url: 'https://s3.ap-south-1.amazonaws.com/bigtv-cms/test.png?param=1',
      final_image_url: 'https://s3.ap-south-1.amazonaws.com/bigtv-cms/test.png',
    };

    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);
    (axios.put as jest.Mock).mockResolvedValue({ status: 200 });

    const result = await UploadService.uploadImage(mockFile);

    expect(axios.put).toHaveBeenCalledWith(
      '/s3-proxy/bigtv-cms/test.png?param=1',
      mockFile,
      {
        headers: {
          'Content-Type': 'image/png',
        },
      }
    );
    expect(result).toBe('https://s3.ap-south-1.amazonaws.com/bigtv-cms/test.png');
    delete (window as any).__MOCK_LOCAL_PROXY__;
  });

  it('should log an error and use unmodified URL if URL parsing fails during proxy rewrite', async () => {
    (window as any).__MOCK_LOCAL_PROXY__ = true;
    const mockFile = new File(['hello'], 'test.png', { type: 'image/png' });
    const mockResponse = {
      upload_url: 'not-a-valid-url',
      final_image_url: 'https://s3.ap-south-1.amazonaws.com/bigtv-cms/test.png',
    };

    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);
    (axios.put as jest.Mock).mockResolvedValue({ status: 200 });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await UploadService.uploadImage(mockFile);

    expect(axios.put).toHaveBeenCalledWith(
      'not-a-valid-url',
      mockFile,
      {
        headers: {
          'Content-Type': 'image/png',
        },
      }
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    delete (window as any).__MOCK_LOCAL_PROXY__;
  });

  it('should propagate error if axios.put fails', async () => {
    const mockFile = new File(['hello'], 'test.png', { type: 'image/png' });
    const mockResponse = {
      upload_url: 'https://s3.amazonaws.com/upload-here',
      final_image_url: 'https://s3.amazonaws.com/final-image-url.png',
    };

    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);
    (axios.put as jest.Mock).mockRejectedValue(new Error('S3 error'));

    await expect(UploadService.uploadImage(mockFile)).rejects.toThrow('S3 error');
  });
});

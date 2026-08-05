import axios from 'axios';
import { MoviesUploadService } from '../services/movies-upload.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MoviesUploadService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate presigned upload URL and execute upload', async () => {
    const mockFile = new File(['test content'], 'poster.jpg', { type: 'image/jpeg' });

    const mockPresignedResponse = {
      data: {
        success: true,
        upload_url:
          'https://bigtv-app.b1656d3be9835befd7b0266af4373b81.r2.cloudflarestorage.com/movies/716724ef4da9418ea1f1b709e079f834.jpg?mock_upload=true',
        file_url:
          'https://bigtv-app.b1656d3be9835befd7b0266af4373b81.r2.cloudflarestorage.com/movies/716724ef4da9418ea1f1b709e079f834.jpg',
        key: 'movies/716724ef4da9418ea1f1b709e079f834.jpg',
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockPresignedResponse);
    mockedAxios.put.mockResolvedValueOnce({ status: 200 });

    const result = await MoviesUploadService.uploadMovieFile(mockFile, 'movies');

    // Check step 1: presigned URL request payload
    expect(mockedAxios.post).toHaveBeenCalledWith(expect.stringMatching(/\/upload-url/), {
      file_name: 'poster.jpg',
      content_type: 'image/jpeg',
      folder: 'movies',
    });

    // Check step 2: PUT request to presigned upload_url
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://bigtv-app.b1656d3be9835befd7b0266af4373b81.r2.cloudflarestorage.com/movies/716724ef4da9418ea1f1b709e079f834.jpg?mock_upload=true',
      mockFile,
      {
        headers: {
          'Content-Type': 'image/jpeg',
        },
      }
    );

    // Check result output
    expect(result.file_url).toBe(
      'https://bigtv-app.b1656d3be9835befd7b0266af4373b81.r2.cloudflarestorage.com/movies/716724ef4da9418ea1f1b709e079f834.jpg'
    );
    expect(result.key).toBe('movies/716724ef4da9418ea1f1b709e079f834.jpg');
  });

  it('should throw error if presigned URL response is invalid', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    mockedAxios.post.mockResolvedValueOnce({ data: { success: false } });

    await expect(MoviesUploadService.uploadMovieFile(mockFile)).rejects.toThrow(
      'Failed to generate presigned upload URL'
    );
  });
});


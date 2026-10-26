import axios from 'axios';
import { WpRepository } from '../repositories/wp.repository';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WpRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEndpoint', () => {
    it('returns Malayalam endpoint for ml, malayalam, and malayala', () => {
      expect(WpRepository.getEndpoint('ml')).toBe('https://bigtv24x7.com/wp-json/wp/v2/posts');
      expect(WpRepository.getEndpoint('malayalam')).toBe('https://bigtv24x7.com/wp-json/wp/v2/posts');
      expect(WpRepository.getEndpoint('malayala')).toBe('https://bigtv24x7.com/wp-json/wp/v2/posts');
      expect(WpRepository.getEndpoint('  ML  ')).toBe('https://bigtv24x7.com/wp-json/wp/v2/posts');
    });

    it('returns Telugu endpoint for te, other languages, or default', () => {
      expect(WpRepository.getEndpoint('te')).toBe('https://www.bigtvlive.com/wp-json/wp/v2/posts');
      expect(WpRepository.getEndpoint('en')).toBe('https://www.bigtvlive.com/wp-json/wp/v2/posts');
      expect(WpRepository.getEndpoint()).toBe('https://www.bigtvlive.com/wp-json/wp/v2/posts');
      expect(WpRepository.getEndpoint('')).toBe('https://www.bigtvlive.com/wp-json/wp/v2/posts');
    });
  });

  describe('getPosts', () => {
    const mockPostData = [
      {
        id: 8959,
        title: { rendered: 'മുഖ്യമന്ത്രിമാരെ കാണാൻ മെറ്റാ ഗ്ലാസുമായി വന്നതാര് ?' },
        content: { rendered: '<p>Content in Malayalam</p>' },
        link: 'https://bigtv24x7.com/politics/meta-glass',
        date: '2026-10-25T17:06:38',
        yoast_head_json: {
          og_image: [{ url: 'https://malayalam-bigtv-images.s3.amazonaws.com/image.png' }],
          schema: {
            '@graph': [
              {
                '@type': 'NewsArticle',
                articleSection: ['Politics'],
              },
            ],
          },
        },
      },
    ];

    it('fetches posts from Malayalam endpoint when language is ml', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockPostData });

      const posts = await WpRepository.getPosts(1, 100, 'ml');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://bigtv24x7.com/wp-json/wp/v2/posts',
        {
          params: { page: 1, per_page: 100 },
        }
      );

      expect(posts).toHaveLength(1);
      expect(posts[0].id).toBe(8959);
      expect(posts[0].title).toBe('മുഖ്യമന്ത്രിമാരെ കാണാൻ മെറ്റാ ഗ്ലാസുമായി വന്നതാര് ?');
      expect(posts[0].categoryName).toBe('Politics');
      expect(posts[0].language).toBe('ml');
      expect(posts[0].image).toBe('https://malayalam-bigtv-images.s3.amazonaws.com/image.png');
      expect(posts[0].postUrl).toBe('https://bigtv24x7.com/politics/meta-glass');
    });

    it('fetches posts from Telugu endpoint by default or when language is te', async () => {
      mockedAxios.get.mockResolvedValue({
        data: [
          {
            id: 101,
            title: { rendered: 'తెలుగు వార్తలు' },
            content: { rendered: '<p>తెలుగు కథనం</p>' },
            link: 'https://www.bigtvlive.com/telugu-news',
            date: '2026-10-26T10:00:00',
            yoast_head_json: {
              schema: {
                '@graph': [
                  {
                    '@type': 'ImageObject',
                    url: 'https://www.bigtvlive.com/schema-img.jpg',
                  },
                ],
              },
            },
          },
        ],
      });

      const posts = await WpRepository.getPosts(2, 50, 'te');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://www.bigtvlive.com/wp-json/wp/v2/posts',
        {
          params: { page: 2, per_page: 50 },
        }
      );

      expect(posts).toHaveLength(1);
      expect(posts[0].id).toBe(101);
      expect(posts[0].language).toBe('te');
      expect(posts[0].image).toBe('https://www.bigtvlive.com/schema-img.jpg');
      expect(posts[0].categoryName).toBe('Uncategorized');
    });

    it('handles jetpack image fallback and missing fields gracefully', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [
          {
            id: 202,
            jetpack_featured_media_url: 'https://example.com/jetpack.jpg',
          },
          {
            id: 203,
          },
        ],
      });

      const posts = await WpRepository.getPosts(1, 10);
      expect(posts).toHaveLength(2);
      expect(posts[0].image).toBe('https://example.com/jetpack.jpg');
      expect(posts[0].title).toBe('');
      expect(posts[0].content).toBe('');
      expect(posts[0].categoryName).toBe('Uncategorized');
      expect(posts[1].image).toBe('');
    });

    it('handles errors gracefully and returns empty array', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const posts = await WpRepository.getPosts(1, 100, 'ml');

      expect(posts).toEqual([]);
    });
  });
});

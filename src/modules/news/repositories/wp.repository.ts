import axios from 'axios';

export interface WpPostDto {
  id: number;
  title: string;
  content: string;
  image: string;
  postUrl: string;
  date: string;
  categoryName?: string;
}

export class WpRepository {
  static async getPosts(page: number = 1, perPage: number = 100): Promise<WpPostDto[]> {
    try {
      const response = await axios.get(`https://www.bigtvlive.com/wp-json/wp/v2/posts`, {
        params: {
          page,
          per_page: perPage,
        },
      });

      return response.data.map((post: any) => ({
        id: post.id,
        title: post.title?.rendered || '',
        content: post.content?.rendered || '',
        image: post.yoast_head_json?.og_image?.[0]?.url || '',
        postUrl: post.link || '',
        date: post.date || '',
        categoryName: post.yoast_head_json?.schema?.['@graph']?.find((g: any) => g['@type'] === 'NewsArticle')?.articleSection?.[0] || 'Uncategorized',
      }));
    } catch (error) {
      console.error('Failed to fetch WordPress posts:', error);
      return [];
    }
  }
}

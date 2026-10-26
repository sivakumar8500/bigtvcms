import axios from 'axios';

export interface WpPostDto {
  id: number;
  title: string;
  content: string;
  image: string;
  postUrl: string;
  date: string;
  categoryName?: string;
  language?: string;
}

export class WpRepository {
  static readonly TELUGU_WP_URL =
    process.env.NEXT_PUBLIC_WP_TELUGU_API_URL ||
    'https://www.bigtvlive.com/wp-json/wp/v2/posts';

  static readonly MALAYALAM_WP_URL =
    process.env.NEXT_PUBLIC_WP_MALAYALAM_API_URL ||
    'https://bigtv24x7.com/wp-json/wp/v2/posts';

  static getEndpoint(language: string = 'te'): string {
    const lang = (language || '').toLowerCase().trim();
    const isMalayalam = lang === 'ml' || lang === 'malayala' || lang === 'malayalam';
    return isMalayalam ? this.MALAYALAM_WP_URL : this.TELUGU_WP_URL;
  }

  static async getPosts(
    page: number = 1,
    perPage: number = 100,
    language: string = 'te'
  ): Promise<WpPostDto[]> {
    try {
      const endpoint = this.getEndpoint(language);
      const response = await axios.get(endpoint, {
        params: {
          page,
          per_page: perPage,
        },
      });

      const lang = (language || '').toLowerCase().trim();
      const isMalayalam = lang === 'ml' || lang === 'malayala' || lang === 'malayalam';

      return response.data.map((post: any) => ({
        id: post.id,
        title: post.title?.rendered || '',
        content: post.content?.rendered || '',
        image:
          post.yoast_head_json?.og_image?.[0]?.url ||
          post.yoast_head_json?.schema?.['@graph']?.find((g: any) => g['@type'] === 'ImageObject')?.url ||
          post.jetpack_featured_media_url ||
          '',
        postUrl: post.link || '',
        date: post.date || '',
        categoryName:
          post.yoast_head_json?.schema?.['@graph']?.find(
            (g: any) => g['@type'] === 'NewsArticle'
          )?.articleSection?.[0] || 'Uncategorized',
        language: isMalayalam ? 'ml' : 'te',
      }));
    } catch (error) {
      console.error('Failed to fetch WordPress posts:', error);
      return [];
    }
  }
}

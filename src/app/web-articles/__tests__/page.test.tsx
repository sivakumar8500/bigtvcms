import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WebArticlesPage from '../page';
import { useLanguageStore } from '@/core/storage/language-store';
import { useUserStore } from '@/core/storage/user-store';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { NewsRepository } from '@/modules/news/repositories/news.repository';
import { WpRepository } from '@/modules/news/repositories/wp.repository';

jest.mock('next/navigation', () => ({
  usePathname: () => '/web-articles',
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/modules/news/repositories/wp.repository', () => ({
  WpRepository: {
    getPosts: jest.fn(),
  },
}));

jest.mock('@/modules/news/repositories/news.repository', () => ({
  NewsRepository: {
    getAllNews: jest.fn(),
    deleteNews: jest.fn(),
    createNews: jest.fn(),
    updateNews: jest.fn(),
  },
}));

jest.mock('@/modules/category/repositories/category.repository', () => ({
  CategoryRepository: {
    getCategories: jest.fn().mockResolvedValue([{ id: 1, englishName: 'Technology' }]),
  },
}));

jest.mock('@/modules/post-types/repositories/post-type.repository', () => ({
  PostTypeRepository: {
    getPostTypes: jest.fn().mockResolvedValue([{ id: 1, name: 'Standard' }]),
  },
}));

jest.mock('@/modules/location/repositories/location.repository', () => ({
  LocationRepository: {
    getLocations: jest.fn().mockResolvedValue([{ id: 1, state_name: 'Hyderabad' }]),
  },
}));

jest.mock('@/modules/tags/repositories/tags.repository', () => ({
  TagsRepository: {
    getTags: jest.fn().mockResolvedValue([{ id: 1, name: 'Breaking' }]),
  },
}));

describe('WebArticlesPage Component', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'en' });
    useUserStore.setState({
      user: {
        username: 'admin_user',
        name: 'Admin User',
        role: 'admin',
        isLoggedIn: true,
      },
    });

    (WpRepository.getPosts as jest.Mock).mockResolvedValue([
      {
        id: 101,
        title: 'Sample Web Article 1',
        content: 'Content for article 1',
        categoryName: 'Technology',
        categories: ['Technology'],
        is_web_post: true,
        web_post_url: 'https://example.com/article-1',
        date: '2026-07-31',
        language: 'te',
      },
    ]);

    (NewsRepository.getAllNews as jest.Mock).mockResolvedValue([
      {
        id: 101,
        title: 'Sample Web Article 1',
        content: 'Content for article 1',
        categories: ['Technology'],
        is_web_post: true,
        web_post_url: 'https://example.com/article-1',
        date: '2026-07-31',
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders Web Articles page title and defaults to Telugu source', async () => {
    render(
      <ThemeProvider>
        <WebArticlesPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Web Articles/i).length).toBeGreaterThan(0);
      expect(screen.getByText('Sample Web Article 1')).toBeInTheDocument();
      expect(screen.getByText('Telugu (te)')).toBeInTheDocument();
      expect(screen.getByText('Malayalam (ml)')).toBeInTheDocument();
      expect(screen.getByText('BigTV Telugu (bigtvlive.com)')).toBeInTheDocument();
    });

    expect(WpRepository.getPosts).toHaveBeenCalledWith(1, 100, 'te');
  });

  it('switches to Malayalam when clicking Malayalam tab', async () => {
    (WpRepository.getPosts as jest.Mock).mockResolvedValue([
      {
        id: 8959,
        title: 'Malayalam Web Article',
        content: 'Malayalam content',
        categoryName: 'Kerala',
        categories: ['Kerala'],
        is_web_post: true,
        web_post_url: 'https://bigtv24x7.com/kerala-news',
        date: '2026-10-25',
        language: 'ml',
      },
    ]);

    render(
      <ThemeProvider>
        <WebArticlesPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Malayalam (ml)')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Malayalam (ml)'));

    await waitFor(() => {
      expect(WpRepository.getPosts).toHaveBeenCalledWith(1, 100, 'ml');
      expect(screen.getByText('Malayalam Web Article')).toBeInTheDocument();
      expect(screen.getByText('BigTV Malayalam (bigtv24x7.com)')).toBeInTheDocument();
    });
  });

  it('automatically defaults to Malayalam when user comes from Malayalam language store', async () => {
    useLanguageStore.setState({ language: 'ml' });

    (WpRepository.getPosts as jest.Mock).mockResolvedValue([
      {
        id: 8959,
        title: 'Malayalam Auto Article',
        content: 'Auto Content',
        categoryName: 'Kerala',
        categories: ['Kerala'],
        web_post_url: 'https://bigtv24x7.com/auto',
        date: '2026-10-25',
        language: 'ml',
      },
    ]);

    render(
      <ThemeProvider>
        <WebArticlesPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(WpRepository.getPosts).toHaveBeenCalledWith(1, 100, 'ml');
      expect(screen.getByText('Malayalam Auto Article')).toBeInTheDocument();
    });
  });

  it('filters articles by search term', async () => {
    render(
      <ThemeProvider>
        <WebArticlesPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sample Web Article 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search Web Article Title...');
    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });

    expect(screen.queryByText('Sample Web Article 1')).not.toBeInTheDocument();
    expect(screen.getByText('No matching web articles found.')).toBeInTheDocument();
  });

  it('supports Telugu (te) language for Web Articles page', async () => {
    useLanguageStore.setState({ language: 'te' });

    render(
      <ThemeProvider>
        <WebArticlesPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/వెబ్ వ్యాసాలు/i).length).toBeGreaterThan(0);
    });
  });
});

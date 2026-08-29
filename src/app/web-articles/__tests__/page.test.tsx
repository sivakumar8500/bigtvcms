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

  it('renders Web Articles page title', async () => {
    render(
      <ThemeProvider>
        <WebArticlesPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Web Articles/i).length).toBeGreaterThan(0);
    });
  });

  it('renders web article list item', async () => {
    render(
      <ThemeProvider>
        <WebArticlesPage />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sample Web Article 1')).toBeInTheDocument();
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

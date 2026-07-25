import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from './page';
import { useLanguageStore } from '@/core/storage/language-store';

// Mock useRouter from next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/dashboard',
}));

// Mock apiClient
jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn().mockImplementation((url) => {
      if (url.includes('/news-posts')) {
        return Promise.resolve([
          {
            id: 1,
            title: '‘మన సినిమాలకు మరిన్ని ఆస్కార్లు’',
            content: 'భారతీయ సినిమాలకు భవిష్యత్తులో మరిన్ని ఆస్కార్లు',
            categoryName: ['సాధారణం'],
            language_id: 1,
            post_type: 'Standard',
            schedule: '2026-07-22T05:00:00.000Z',
          },
        ]);
      }
      if (url.includes('/languages')) {
        return Promise.resolve([]);
      }
      if (url.includes('/aitags')) {
        return Promise.resolve([]);
      }
      if (url.includes('/categories')) {
        return Promise.resolve([]);
      }
      if (url.includes('/locations')) {
        return Promise.resolve([]);
      }
      return Promise.resolve([]);
    }),
    post: jest.fn().mockResolvedValue({ id: 999, title: 'Mock Created Post' }),
    put: jest.fn().mockResolvedValue({ id: 999, title: 'Mock Updated Post' }),
    delete: jest.fn().mockResolvedValue({ message: 'Success' }),
  },
}));

// Mock file reader for base64 image uploader testing in dashboard page
class MockFileReader {
  onload: ((e: any) => void) | null = null;
  readAsDataURL(file: File) {
    if (this.onload) {
      this.onload({
        target: { result: 'data:image/png;base64,dummy' }
      });
    }
  }
}
(global as any).FileReader = MockFileReader;

describe('DashboardPage page component', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'en' });
  });

  it('should render the dashboard layout correctly', () => {
    render(<DashboardPage />);
    expect(screen.getByText('BigTV Newsroom')).toBeTruthy();
    expect(screen.getByPlaceholderText('Search News Title...')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Create News' })).toBeTruthy();
  });

  it('should filter posts based on search input', async () => {
    useLanguageStore.setState({ language: 'te' });
    render(<DashboardPage />);
    const searchInput = screen.getByPlaceholderText('వార్తల శీర్షికను శోధించండి...');
    
    // Type in a search value
    fireEvent.change(searchInput, { target: { value: 'ఆస్కార్లు' } });
    
    // The list should filter down to posts containing the query
    expect((await screen.findAllByText(/ఆస్కార్లు/)).length).toBeGreaterThan(0);
  });

  it('should open CreateNewsForm inline when clicking Create News button', () => {
    render(<DashboardPage />);
    const createNewsBtn = screen.getByRole('button', { name: 'Create News' });
    
    // Before click, form is not open
    expect(screen.queryByLabelText('Publish Location *')).toBeNull();

    fireEvent.click(createNewsBtn);

    // After click, form should be in the DOM
    expect(screen.getByLabelText('Publish Location *')).toBeTruthy();
  });

  it('should add a new post to the list when CreateNewsForm submits successfully and is confirmed', async () => {
    useLanguageStore.setState({ language: 'en' });
    const { container } = render(<DashboardPage />);
    
    // Open the form
    fireEvent.click(screen.getByRole('button', { name: 'Create News' }));

    // Input fields inside the form
    fireEvent.click(screen.getByRole('checkbox', { name: 'Entertainment' }));
    fireEvent.change(screen.getByPlaceholderText(/Enter news headline/i), { target: { value: 'Unique Testing Title' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter notification title/i), { target: { value: 'Unique Notification Title' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter image\/banner title/i), { target: { value: 'Unique Image Title' } });
    fireEvent.change(screen.getByPlaceholderText(/Write news body content/i), { target: { value: 'Unique body text.' } });
    
    // Select Location
    const locationSelect = screen.getByLabelText('Publish Location *');
    fireEvent.mouseDown(locationSelect);
    const locationOption = screen.getByRole('option', { name: 'Telangana' });
    fireEvent.click(locationOption);
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape', keyCode: 27 });

    // Select AI Tags
    const tagsSelect = screen.getByLabelText('AI Mapped Tags *');
    fireEvent.mouseDown(tagsSelect);
    const tagOption = screen.getByRole('option', { name: 'Trending' });
    fireEvent.click(tagOption);
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape', keyCode: 27 });

    // Upload banner image
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit the form (shows preview screen first)
    const createBtns = screen.getAllByRole('button', { name: 'Create News' });
    fireEvent.click(createBtns[createBtns.length - 1]);

    // Confirm and publish
    fireEvent.click(screen.getByRole('button', { name: 'Confirm & Publish' }));

    // Verify the new post title should be rendered in the table feed list!
    const titles = await screen.findAllByText('Unique Testing Title');
    expect(titles.length).toBeGreaterThan(0);
  }, 35000);
});

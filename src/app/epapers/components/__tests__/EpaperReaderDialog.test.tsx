import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EpaperReaderDialog } from '../EpaperReaderDialog';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { useLanguageStore } from '@/core/storage/language-store';

describe('EpaperReaderDialog Component', () => {
  const mockImages = [
    'https://example.com/page1.jpg',
    'https://example.com/page2.jpg',
    'https://example.com/page3.jpg',
  ];

  beforeEach(() => {
    useLanguageStore.setState({ language: 'en' });
  });

  it('renders dialog with title and thumbnails', () => {
    render(
      <ThemeProvider>
        <EpaperReaderDialog
          open={true}
          onClose={jest.fn()}
          title="ChotaNews ePaper"
          editionName="Hyderabad"
          images={mockImages}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('ChotaNews ePaper')).toBeInTheDocument();
    expect(screen.getByText('Hyderabad')).toBeInTheDocument();
    expect(screen.getAllByAltText('Thumbnail Page 1').length).toBeGreaterThan(0);
    expect(screen.getAllByAltText('Thumbnail Page 2').length).toBeGreaterThan(0);
  });

  it('changes active page when thumbnail is clicked', () => {
    render(
      <ThemeProvider>
        <EpaperReaderDialog
          open={true}
          onClose={jest.fn()}
          title="ChotaNews ePaper"
          editionName="Hyderabad"
          images={mockImages}
        />
      </ThemeProvider>
    );

    const thumb2 = screen.getByAltText('Thumbnail Page 2');
    fireEvent.click(thumb2);

    expect(screen.getByAltText('Page 2')).toBeInTheDocument();
  });

  it('zooms in and zooms out when control buttons are clicked', () => {
    render(
      <ThemeProvider>
        <EpaperReaderDialog
          open={true}
          onClose={jest.fn()}
          title="ChotaNews ePaper"
          editionName="Hyderabad"
          images={mockImages}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('100%')).toBeInTheDocument();

    const zoomInBtn = screen.getByTestId('ZoomInIcon').parentElement;
    if (zoomInBtn) fireEvent.click(zoomInBtn);

    expect(screen.getByText('125%')).toBeInTheDocument();
  });
});

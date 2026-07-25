import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useAppTheme } from '../ThemeProvider';

// A helper component to expose theme context values
const ThemeConsumer = () => {
  const { mode, toggleTheme } = useAppTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button data-testid="toggle" onClick={toggleTheme}>
        Toggle
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  it('should default to dark mode', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('should switch to light mode when toggleTheme is called', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });

  it('should toggle back to dark mode on second call', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('toggle'));
    fireEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('should render children', () => {
    render(
      <ThemeProvider>
        <span data-testid="child">Hello</span>
      </ThemeProvider>
    );
    expect(screen.getByTestId('child')).toBeTruthy();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Shared Button component', () => {
  it('should render children text normally', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('should not render children when loading is true', () => {
    render(<Button loading={true}>Click me</Button>);
    expect(screen.queryByText('Click me')).toBeNull();
  });

  it('should be disabled when loading is true', () => {
    render(<Button loading={true}>Submit</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled={true}>Disabled Button</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('should not be disabled by default', () => {
    render(<Button>Active Button</Button>);
    const btn = screen.getByRole('button');
    expect(btn).not.toBeDisabled();
  });
});

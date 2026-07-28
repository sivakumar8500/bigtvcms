import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocationDrawer } from '../components/LocationDrawer';

describe('LocationDrawer Component', () => {
  const mockProps = {
    open: true,
    isEditMode: false,
    form: { stateEn: '', stateTe: '', stateHi: '', stateMl: '' },
    uploadedImage: null,
    errors: {
      stateEn: 'English state name is required',
      stateTe: 'Telugu state name is required',
      stateHi: 'Hindi state name is required',
      stateMl: 'Malayalam state name is required',
    },
    onFieldChange: jest.fn(),
    onImageUploaded: jest.fn(),
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    isDark: false,
  };

  it('renders language input fields and error messages', () => {
    render(<LocationDrawer {...mockProps} />);

    expect(screen.getByTestId('input-stateEn')).toBeInTheDocument();
    expect(screen.getByTestId('input-stateTe')).toBeInTheDocument();
    expect(screen.getByTestId('input-stateMl')).toBeInTheDocument();

    expect(screen.getByText('English state name is required')).toBeInTheDocument();
    expect(screen.getByText('Telugu state name is required')).toBeInTheDocument();
    expect(screen.getByText('Malayalam state name is required')).toBeInTheDocument();
  });

  it('renders only active language input fields when activeLanguages prop is passed', () => {
    render(<LocationDrawer {...mockProps} activeLanguages={['en', 'te']} />);

    expect(screen.getByTestId('input-stateEn')).toBeInTheDocument();
    expect(screen.getByTestId('input-stateTe')).toBeInTheDocument();
    expect(screen.queryByTestId('input-stateHi')).not.toBeInTheDocument();
    expect(screen.queryByTestId('input-stateMl')).not.toBeInTheDocument();
  });

  it('calls onFieldChange when user types in inputs', () => {
    render(<LocationDrawer {...mockProps} />);
    const inputEn = screen.getByTestId('input-stateEn');
    fireEvent.change(inputEn, { target: { value: 'Karnataka' } });
    expect(mockProps.onFieldChange).toHaveBeenCalledWith('stateEn', 'Karnataka');
  });

  it('calls onSubmit when Save button is clicked', () => {
    render(<LocationDrawer {...mockProps} />);
    const saveBtn = screen.getByRole('button', { name: /save location/i });
    fireEvent.click(saveBtn);
    expect(mockProps.onSubmit).toHaveBeenCalled();
  });
});

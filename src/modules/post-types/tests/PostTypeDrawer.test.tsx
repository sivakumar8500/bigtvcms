import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PostTypeDrawer } from '../components/PostTypeDrawer';

describe('PostTypeDrawer Component', () => {
  const mockT = {
    addPostType: 'Add Post Type',
    editPostType: 'Edit Post Type',
    colTypename: 'Type Name',
    typenamePlaceholder: 'Enter post type name...',
    colStatus: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    cancel: 'Cancel',
    save: 'Save',
    update: 'Update',
  };

  const defaultProps = {
    open: true,
    isEditMode: false,
    form: { typename: 'Hai', typeStatus: true },
    errors: {},
    onFieldChange: jest.fn(),
    onClose: jest.fn(),
    onSubmit: jest.fn((e) => e?.preventDefault && e.preventDefault()),
    isDark: false,
    t: mockT,
  };

  it('renders drawer header and form in add mode', () => {
    render(<PostTypeDrawer {...defaultProps} />);
    expect(screen.getByText('Add Post Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hai')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders drawer header and button in edit mode', () => {
    render(<PostTypeDrawer {...defaultProps} isEditMode={true} />);
    expect(screen.getByText('Edit Post Type')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('triggers field change, close, and submit handlers', () => {
    render(<PostTypeDrawer {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter post type name...');
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(defaultProps.onFieldChange).toHaveBeenCalledWith('typename', 'New Value');

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(defaultProps.onClose).toHaveBeenCalled();

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
});

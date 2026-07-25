import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PostTypeTable } from '../components/PostTypeTable';
import { PostType } from '../domain/post-type.model';

describe('PostTypeTable Component', () => {
  const mockItems: PostType[] = [
    { typeId: 1, typename: 'Hai', typeStatus: true },
    { typeId: 2, typename: 'siva', typeStatus: false },
  ];

  const mockT = {
    colId: 'Type ID',
    colTypename: 'Type Name',
    colStatus: 'Status',
    colActions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    noPostTypesFound: 'No post types found',
  };

  const defaultProps = {
    paginatedData: mockItems,
    page: 1,
    recordsPerPage: 10,
    toggleActive: jest.fn(),
    handleEditClick: jest.fn(),
    handleDeleteClick: jest.fn(),
    t: mockT,
    isDark: false,
  };

  it('renders table header and rows correctly', () => {
    render(<PostTypeTable {...defaultProps} />);
    expect(screen.getByText('Type ID')).toBeInTheDocument();
    expect(screen.getByText('Type Name')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('Hai')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('siva')).toBeInTheDocument();
  });

  it('renders empty state when paginatedData is empty', () => {
    render(<PostTypeTable {...defaultProps} paginatedData={[]} />);
    expect(screen.getByText('No post types found')).toBeInTheDocument();
  });

  it('triggers edit and delete actions when buttons are clicked', () => {
    render(<PostTypeTable {...defaultProps} />);

    const editButtons = screen.getAllByRole('button', { name: /edit post type/i });
    fireEvent.click(editButtons[0]);
    expect(defaultProps.handleEditClick).toHaveBeenCalledWith(mockItems[0]);

    const deleteButtons = screen.getAllByRole('button', { name: /delete post type/i });
    fireEvent.click(deleteButtons[0]);
    expect(defaultProps.handleDeleteClick).toHaveBeenCalledWith(1);
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportButton from '../ReportButton';

describe('ReportButton', () => {
  // Mock window.open
  const mockWindowOpen = jest.fn();

  beforeAll(() => {
    delete window.open; // If it exists, this line removes the original window.open
    window.open = mockWindowOpen;
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  it('triggers window.open on button click', () => {
    render(<ReportButton />);
    const buttonElement = screen.getByText(/Download Report/i);

    fireEvent.click(buttonElement);
    expect(mockWindowOpen).toHaveBeenCalledWith('http://localhost:3001/generateCustomerReport', '_blank');
  });
});

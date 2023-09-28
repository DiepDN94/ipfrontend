import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReportButton from '../ReportButton';

describe('ReportButton', () => {
  // Mock window 
  const mockWindowOpen = jest.fn();

  // close all open windows if it is open
  beforeAll(() => {
    delete window.open;
    window.open = mockWindowOpen;
  });

  // Clear mock data
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('triggers window.open on button click to pdf file', () => {
    render(<ReportButton />);
    const buttonElement = screen.getByText(/Download Report/i);

    fireEvent.click(buttonElement);
    expect(mockWindowOpen).toHaveBeenCalledWith('http://localhost:3001/generateCustomerReport', '_blank');
  });
});

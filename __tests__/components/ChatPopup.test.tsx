import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatPopup } from '@/components/ChatPopup';
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

describe('ChatPopup', () => {
  const mockProps = {
    show: true,
    onClose: jest.fn(),
    videoId: 'test-video-id'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when show is false', () => {
    const { container } = render(<ChatPopup {...mockProps} show={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders chat interface when show is true', () => {
    render(<ChatPopup {...mockProps} />);
    expect(screen.getByText('Chat with Video Content')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask about the video content...')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<ChatPopup {...mockProps} />);
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('sends message and displays response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Test response from API' })
    });

    render(<ChatPopup {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Ask about the video content...');
    const form = input.closest('form')!;
    
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('test message')).toBeInTheDocument();
      expect(screen.getByText('Test response from API')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/chat', expect.any(Object));
  });

  it('displays error message when API call fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'API Error' })
    });

    render(<ChatPopup {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Ask about the video content...');
    const form = input.closest('form')!;
    
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Sorry, I encountered an error processing your request.')).toBeInTheDocument();
    });
  });

  it('disables input and button while loading', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    render(<ChatPopup {...mockProps} />);
    
    const input = screen.getByPlaceholderText('Ask about the video content...');
    const button = screen.getByText('Send');
    const form = input.closest('form')!;
    
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(input).toBeDisabled();
      expect(button).toBeDisabled();
      expect(screen.getByText('Processing your request...')).toBeInTheDocument();
    });
  });
});
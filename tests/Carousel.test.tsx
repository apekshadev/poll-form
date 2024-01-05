import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For custom matchers
import Carousel from '../src/component/Carousel';

describe('Carousel Component', () => {
  const mockSlides = [
    { question: 'Question 1', options: [{ name: 'Option 1', icon: '⭐' }] },
    { question: 'Question 2', options: [{ name: 'Option 2', icon: '🌟' }] },
  ];

  it('renders without crashing', () => {
    render(<Carousel initialSlides={() => Promise.resolve(mockSlides)} />);
  });

  it('changes slide on click', async () => {
    const { getByText } = render(<Carousel initialSlides={() => Promise.resolve(mockSlides)} />);
    
    fireEvent.click(getByText('Option 2'));
    await waitFor(() => expect(getByText('Summary')).toBeInTheDocument());
  });

});

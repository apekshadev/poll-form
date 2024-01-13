import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./component/PollForm', () => () => <div data-testid="mock-poll-form" />);

test('renders PollForm', () => {
  render(<App />);
  const mockPollForm = screen.getByTestId('mock-poll-form');
  expect(mockPollForm).toBeInTheDocument();
});
  
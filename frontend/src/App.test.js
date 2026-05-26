import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [],
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the todo workspace', async () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /todo workflow that stays out of your way/i })).toBeInTheDocument();
  expect(await screen.findByText(/no todos yet/i)).toBeInTheDocument();
});

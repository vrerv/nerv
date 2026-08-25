import { render, screen } from '@testing-library/react';

import Index from '@/pages/index';
import Hello, { Home } from '@/pages/hello';

jest.mock('@/lib/mdx', () => ({
  getAllFilesFrontMatter: jest.fn(),
}));

describe('Index page', () => {
  describe('Route component', () => {
    it('should serve the home page directly without a client redirect', () => {
      expect(Index).toBe(Home);
      expect(Index).not.toBe(Hello);
    });

    it.each([
      ['ko', '/'],
      ['en', '/en/'],
    ])('should redirect the legacy %s route to %s', (locale, destination) => {
      render(<Hello locale={locale} />);

      expect(screen.getByRole('link')).toHaveAttribute('href', destination);
    });
  });
});

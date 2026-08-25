import Index from '@/pages/index';
import Hello from '@/pages/hello';

jest.mock('@/lib/mdx', () => ({
  getAllFilesFrontMatter: jest.fn(),
}));

describe('Index page', () => {
  describe('Route component', () => {
    it('should serve the home page directly without a client redirect', () => {
      expect(Index).toBe(Hello);
    });
  });
});

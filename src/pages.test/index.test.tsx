import { render } from '@testing-library/react';
import Index from '@/pages/index';
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe('Index page', () => {
  describe('Render method', () => {
    it('should call router.push /hello', () => {
      const push = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({
        push,
        prefetch: jest.fn(),
        route: '/',
        pathname: '/',
        query: {},
        asPath: '/',
        events: {
          on: jest.fn(),
          off: jest.fn(),
          emit: jest.fn(),
        }
      });

      render(<Index />);

      expect(push).toHaveBeenCalledWith('/hello')
    });
  });
});

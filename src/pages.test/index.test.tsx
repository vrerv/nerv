import { render } from '@testing-library/react';

import Index from '@/pages/index';
import { useRouter } from "next/router";

// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479
// The mock has been moved to `__mocks__` folder to avoid duplication

const router = useRouter()
const routerSpy = jest.spyOn(router, 'push')

describe('Index page', () => {
  describe('Render method', () => {
    it('should call router.push /hello', () => {
      render(<Index />);

      expect(routerSpy).toHaveBeenCalledWith('/hello')
    });
  });
});

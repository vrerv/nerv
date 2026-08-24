import { render, screen, within } from '@testing-library/react';

import { FEATURED_PRODUCT, PRODUCTS } from '@/utils/products';

import { Main } from './Main';

describe('Main template', () => {
  describe('Render method', () => {
    it('should link the logo to the home page instead of toggling the theme', () => {
      render(<Main meta={null}>{null}</Main>);

      const homeLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href') === '/hello');

      expect(homeLinks.length).toBeGreaterThan(0);
    });

    it('should expose the theme toggle as its own button', () => {
      render(<Main meta={null}>{null}</Main>);

      expect(screen.getAllByRole('button', { name: 'toggleTheme' })).toHaveLength(1);
    });

    it('should not render the Collavre CTA in the header', () => {
      render(<Main meta={null}>{null}</Main>);

      const header = screen.getByRole('banner');

      expect(within(header).queryByRole('link', { name: 'ctaCollavre' })).not.toBeInTheDocument();
    });

    it('should send every Collavre link to the landing page', () => {
      render(<Main meta={null}>{null}</Main>);

      const collavreLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.includes('collavre.com'));

      expect(collavreLinks.length).toBeGreaterThan(0);
      collavreLinks.forEach((link) => {
        expect(link).toHaveAttribute('href', 'https://collavre.com/landing');
      });
    });

    it('should render the copyright with the current year', () => {
      render(<Main meta={null}>{null}</Main>);

      const copyright = screen.getByText(new RegExp(`© ${new Date().getFullYear()}`));

      expect(copyright).toBeInTheDocument();
    });

    it('should link to every product from the footer', () => {
      render(<Main meta={null}>{null}</Main>);

      const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));

      [FEATURED_PRODUCT, ...PRODUCTS].forEach((product) => {
        expect(hrefs).toContain(product.href);
      });
    });
  });
});

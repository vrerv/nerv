describe('Navigation', () => {
  describe('Static pages', () => {
    it('should navigate to the hello page automatically', () => {

      cy.visit('/');

      // Wait until the page is displayed
      cy.findByRole('link', { name: '안녕하세요' });

      cy.url().should('include', '/hello')
    });

    it('should navigate to the hello page', () => {
      // Start from the index page
      cy.visit('/');

      // Find a link containing "About" text and click it
      cy.findByRole('link', { name: '안녕하세요' }).click();

      // The new url should include "/about"
      cy.url().should('include', '/hello');

      // The new page should contain two "lorem ipsum" paragraphs
      cy.findAllByText('브레브에 오신것을 환영합니다.', { exact: false }).should(
        'have.length',
        1
      );
    });

    it('should take screenshot of the homepage', () => {
      cy.visit('/');

      // Wait until the page is displayed
      cy.findByRole('link', { name: '안녕하세요' });

      cy.percySnapshot('Homepage');
    });

    it('should take screenshot of the hello page', () => {
      cy.visit('/hello');

      // Wait until the page is displayed
      cy.findByRole('link', { name: '안녕하세요' });

      cy.percySnapshot('Hello');
    });
  });
});

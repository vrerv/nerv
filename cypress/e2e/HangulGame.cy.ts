describe('Hangul game', () => {
  it('is publicly available at /hangul-game', () => {
    cy.visit('/hangul-game');

    cy.findByRole('button', { name: /글자를 만드세요/ }).should('be.visible');
    cy.findByRole('button', { name: '다음 글자' }).should('be.visible');
    cy.url().should('include', '/hangul-game');
    cy.url().should('not.include', '/membership/auth/login');
  });
});

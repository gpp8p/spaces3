describe('MySpaces Test', () => {
    it('finding myspaces dialog', () => {
        cy.visit('http://localhost:8080');
        cy.get('[data-cy="login_user_id"]').should('be.visible').and('not.be.disabled')
        cy.get('[data-cy="login_user_id"]').type('gpp8pvirginia@gmail.com');
        cy.get('[data-cy="login_password"]').type('n1tad0g');
        cy.get('[data-cy="login_password"]').blur();
        cy.get('[data-cy="login_button"]').should('be.visible');
        cy.get('[data-cy="login_button"]').click();
        cy.get('[data-cy="menu_opt_myspaces"]').should('be.visible');
        cy.get('[data-cy="menu_opt_myspaces"]').click();
        cy.get('[data-cy="myspaces-row-4"]').should('be.visible');
        cy.get('[data-cy="myspaces-row-4"]').click();

    });
});

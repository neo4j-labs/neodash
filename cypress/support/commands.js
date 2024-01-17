// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getDataTest', (dataTestSelector) => {
    return cy.get(`[data-test="${dataTestSelector}"]`)
})

/**
 * Function to interact with a specific element and execute additional custom commands.
 * @param {Function} customAction - A callback function containing custom Cypress commands.
 */
Cypress.Commands.add('advancedSettings', (customAction) => {
    cy.get('.react-grid-layout:eq(0) .MuiGrid-root:eq(1)').within(() => {
        // Opening settings
        cy.get('button').eq(1).click();
        // Activating advanced settings
        cy.get('[role="switch"]').click();
        cy.wait(200);
        customAction();
    });
})

Cypress.Commands.add('setDropdownValue', (labelName, setting) => {
    cy.get('.ndl-dropdown').contains('label', labelName)
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type(`${setting}{enter}`);
});

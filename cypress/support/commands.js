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
    return cy.get(`[data-test="${dataTestSelector}"]`);
  });
  
  /**
   * Function to interact with a specific element and execute additional custom commands.
   * @param {Function} customAction - A callback function containing custom Cypress commands.
   */
  
  // Used to open the 2nd report card and activate 'advanced settings'
  Cypress.Commands.add('advancedSettings', (customAction) => {
    cy.get('.react-grid-layout:eq(0) .MuiGrid-root:eq(1)').within(() => {
      // Opening settings
      cy.get('button').eq(1).click();
      // Activating advanced settings
      cy.get('[role="switch"]').click();
      cy.wait(200);
      customAction();
    });
  });
  
  // Used to open 2nd the report card
  Cypress.Commands.add('openSettings', (customAction) => {
    cy.get('.react-grid-layout:eq(0) .MuiGrid-root:eq(1)').within(() => {
      // Opening settings
      cy.get('button').eq(1).click();
      cy.wait(200);
      customAction();
    });
  });
  
  // Needs to be used when already inside scole of a report card
  Cypress.Commands.add('setDropdownValue', (labelName, setting) => {
    cy.get('.ndl-dropdown')
      .contains('label', labelName)
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type(`${setting}{enter}`);
  });
  
  //Used in start_page.cy.js
  Cypress.Commands.add('checkInitialState', () => {
    // Check the starter cards
    cy.get('main .react-grid-item:eq(0)').should('contain', 'This is your first dashboard!');
    cy.get('main .react-grid-item:eq(1) .force-graph-container canvas').should('be.visible');
    cy.get('main .react-grid-item:eq(2) button').should('have.attr', 'aria-label', 'add report');
  });
  
  // Creates a card
  const WAITING_TIME = 20000;
  Cypress.Commands.add('createCard', () => {
    // Check the starter cards
    cy.get('main .react-grid-item button[aria-label="add report"]', { timeout: WAITING_TIME })
      .should('be.visible')
      .click();
    cy.wait(1000);
    cy.get('main .react-grid-item:eq(2)').should('contain', 'No query specified.');
  });
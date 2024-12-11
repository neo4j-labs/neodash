import { tableCypherQuery } from '../fixtures/cypher_queries';

const WAITING_TIME = 20000;
// Ignore warnings that may appear when using the Cypress dev server
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log(err, runnable);
  return false;
});

describe('Testing table', () => {
  beforeEach('open neodash', () => {
    cy.viewport(1920, 1080);
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    cy.get('#form-dialog-title', { timeout: 20000 }).should('contain', 'NeoDash - Neo4j Dashboard Builder').click();

    cy.get('#form-dialog-title').then(($div) => {
      const text = $div.text();
      if (text == 'NeoDash - Neo4j Dashboard Builder') {
        cy.wait(500);
        // Create new dashboard
        cy.contains('New Dashboard').click();
      }
    });

    cy.get('#form-dialog-title', { timeout: 20000 }).should('contain', 'Connect to Neo4j');

    cy.get('#url').clear().type('localhost');
    cy.get('#dbusername').clear().type('neo4j');
    cy.get('#dbpassword').type('test1234');
    cy.get('button').contains('Connect').click();
    cy.wait(100);
  });

  it.skip('create a table', () => {
    //Opens the div containing all report cards
    cy.get('.react-grid-layout:eq(0)')
      .first()
      .within(() => {
        //Finds the 2nd card
        cy.get('.MuiGrid-root')
          .eq(1)
          .within(() => {
            //Clicks the 2nd button (opens settings)
            cy.get('button').eq(1).click();
            // cy.get('div[role="textbox"')
          });
      });
    cy.get('.react-grid-layout')
      .first()
      .within(() => {
        //Finds the 2nd card
        cy.get('.MuiGrid-root')
          .eq(1)
          .within(() => {
            //Opens the drop down
            cy.getDataTest('type-dropdown').click();
          });
      });
    // Selects the Table option
    cy.get('[id^="react-select-5-option"]').contains(/Table/).should('be.visible').click({ force: true });
    cy.get('.react-grid-layout .MuiGrid-root:eq(1) #type input[name="Type"]').should('have.value', 'Table');

    //Removes text in cypher editor and types new query
    cy.get('.react-grid-layout')
      .first()
      .within(() => {
        //Finds the 2nd card
        cy.get('.MuiGrid-root')
          .eq(1)
          .within(() => {
            //Replaces default query with new query
            cy.get('.ndl-cypher-editor div[role="textbox"]').clear().type(tableCypherQuery);
            cy.get('button[aria-label="run"]').click();
          });
      });
  });
});

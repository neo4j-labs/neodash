import { tableCypherQuery } from '../../fixtures/cypher_queries';
import { Page } from '../../Page';

const page = new Page();
// Ignore warnings that may appear when using the Cypress dev server
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log(err, runnable);
  return false;
});

describe('Testing table', () => {
  beforeEach('open neodash', () => {
    page.init().createNewDashboard().connectToNeo4j();
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

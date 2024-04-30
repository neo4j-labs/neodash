import { stringArrayCypherQuery, intArrayCypherQuery, pathArrayCypherQuery } from '../../fixtures/cypher_queries';
import {
  enableReportActions,
  createReportOfType,
  closeSettings,
  toggleTableTranspose,
  openReportActionsMenu,
} from '../utils';

const WAITING_TIME = 20000;
const CARD_SELECTOR = 'main .react-grid-item:eq(2)';
// Ignore warnings that may appear when using the Cypress dev server
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log(err, runnable);
  return false;
});

describe('Testing array rendering', () => {
  beforeEach('open neodash', () => {
    cy.viewport(1920, 1080);
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    cy.get('#form-dialog-title', { WAITING_TIME: WAITING_TIME })
      .should('contain', 'NeoDash - Neo4j Dashboard Builder')
      .click();

    cy.get('#form-dialog-title').then(($div) => {
      const text = $div.text();
      if (text == 'NeoDash - Neo4j Dashboard Builder') {
        cy.wait(500);
        // Create new dashboard
        cy.contains('New Dashboard').click();
      }
    });

    cy.get('#form-dialog-title', { WAITING_TIME: WAITING_TIME }).should('contain', 'Connect to Neo4j');

    cy.get('#url').clear().type('localhost');
    cy.get('#dbusername').clear().type('neo4j');
    cy.get('#dbpassword').type('test1234');
    cy.get('button').contains('Connect').click();
    cy.wait(100);
  });

  it('creates a table that contains string arrays', () => {
    cy.checkInitialState();
    enableReportActions();
    createReportOfType('Table', stringArrayCypherQuery, true, true);

    // Standard array, displays strings joined with comma and whitespace
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-cell:eq(0)`).should('have.text', 'initial, list');
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-cell:eq(1)`).should('have.text', 'other, list');

    // Now, transpose the table
    toggleTableTranspose(CARD_SELECTOR, true);
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-columnHeaderTitle:eq(1)`, { timeout: WAITING_TIME }).should(
      'have.text',
      'initial,list'
    );
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-cell:eq(1)`).should('have.text', 'other, list');

    // Transpose back
    // And add a report action
    toggleTableTranspose(CARD_SELECTOR, false);
    openReportActionsMenu(CARD_SELECTOR);
    cy.get('.ndl-modal').find('button[aria-label="add"]').click();
    cy.get('.ndl-modal').find('input:eq(2)').type('column');
    cy.get('.ndl-modal').find('input:eq(5)').type('test_param');
    cy.get('.ndl-modal').find('input:eq(6)').type('column');
    cy.get('.ndl-modal').find('button').contains('Save').click();
    closeSettings(CARD_SELECTOR);
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-cell:eq(0)`)
      .find('button')
      .should('be.visible')
      .should('have.text', 'initial, list')
      .click();

    // Previous step's click set a parameter from the array
    // Test that parameter rendering works
    cy.get(`${CARD_SELECTOR} .MuiCardHeader-root`).find('input').type('$neodash_test_param').blur();
    cy.get(`${CARD_SELECTOR} .MuiCardHeader-root`).find('input').should('have.value', 'initial, list');
  });

  it.skip('creates a table that contains int arrays', () => {
    cy.checkInitialState();
    createReportOfType('Table', intArrayCypherQuery, true, true);

    // Standard array, displays strings joined with comma and whitespace
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-cell:eq(0)`).should('have.text', '1, 2');
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-cell:eq(1)`).should('have.text', '3, 4');

    // Now, transpose the table
    toggleTableTranspose(CARD_SELECTOR, true);
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-columnHeaderTitle:eq(1)`, { timeout: WAITING_TIME }).should(
      'have.text',
      '1,2'
    );
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-cell:eq(1)`).should('have.text', '3, 4');
  });

  it.skip('creates a table that contains nodes and rels', () => {
    cy.checkInitialState();
    createReportOfType('Table', pathArrayCypherQuery, true, true);

    // Standard array, displays a path with two nodes and a relationship
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-cell:eq(0)`).should('have.text', 'PersonACTED_INMovie');
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-cell:eq(0) button`).should('have.length', 2);
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-cell:eq(0) button:eq(0)`).should('have.text', 'Person');
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-cell:eq(0) button:eq(1)`).should('have.text', 'Movie');
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-cell:eq(0) .MuiChip-root`).should('have.length', 1);
    cy.get(`${CARD_SELECTOR} .MuiDataGrid-cell:eq(0) .MuiChip-root`).should('have.text', 'ACTED_IN');
  });

  it.skip('creates a single value report which is an array', () => {
    cy.checkInitialState();
    createReportOfType('Single Value', stringArrayCypherQuery, true, true);
    cy.get(CARD_SELECTOR).should('have.text', 'initial, list');
  });
});

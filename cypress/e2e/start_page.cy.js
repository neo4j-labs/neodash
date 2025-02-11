import {
  tableCypherQuery,
  barChartCypherQuery,
  mapChartCypherQuery,
  sunburstChartCypherQuery,
  iFrameText,
  markdownText,
  loadDashboardURL,
  sankeyChartCypherQuery,
  gaugeChartCypherQuery,
  formCypherQuery,
} from '../fixtures/cypher_queries';

import { Page } from '../Page';

const CARD_SELECTOR = 'main .react-grid-item:eq(2)';
const page = new Page(CARD_SELECTOR);

// Ignore warnings that may appear when using the Cypress dev server
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log(err, runnable);
  return false;
});

describe('NeoDash E2E Tests', () => {
  beforeEach(() => {
    page.init().createNewDashboard().connectToNeo4j();
    cy.wait(100);
  });

  it('initializes the dashboard', () => {
    cy.checkInitialState();
  });

  it('creates a new card', () => {
    cy.checkInitialState();
    cy.createCard();
  });

  // Test each type of card
  it('creates a table report', () => {
    cy.checkInitialState();
    cy.get('main .react-grid-item button[aria-label="add report"]').should('be.visible').click();
    cy.get('main .react-grid-item')
      .contains('No query specified.')
      .parentsUntil('.react-grid-item')
      .find('button[aria-label="settings"]', { timeout: 2000 })
      .should('be.visible')
      .click();

    cy.get('main .react-grid-item:eq(2) #type input[name="Type"]').should('have.value', 'Table');
    cy.get('main .react-grid-item:eq(2) .ReactCodeMirror').type(tableCypherQuery);
    cy.wait(400);

    cy.get('main .react-grid-item:eq(2)').contains('Advanced settings').click();

    cy.get('main .react-grid-item:eq(2) button[aria-label="run"]').click();
    cy.get('main .react-grid-item:eq(2) .MuiDataGrid-columnHeaders')
      .should('contain', 'title')
      .and('contain', 'released')
      .and('not.contain', '__id');
    // cy.get('main .react-grid-item:eq(2) .MuiDataGrid-virtualScroller .MuiDataGrid-row').should('have.length', 8);
    // cy.get('main .react-grid-item:eq(2) .MuiDataGrid-footerContainer').should('contain', '1–8 of 8');
    // cy.get('main .react-grid-item:eq(2) .MuiDataGrid-footerContainer button[aria-label="Go to next page"]').click();
    // cy.get('main .react-grid-item:eq(2) .MuiDataGrid-virtualScroller .MuiDataGrid-row').should('have.length', 3);
    // cy.get('main .react-grid-item:eq(2) .MuiDataGrid-footerContainer').should('contain', '6–8 of 8');
  });

  it('creates a bar chart report', () => {
    cy.checkInitialState();
    page.createReportOfType('Bar Chart', barChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) #index input[name="Category"]').should('have.value', 'released');
    cy.get('main .react-grid-item:eq(2) #value input[name="Value"]').should('have.value', 'count');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 8);
  });

  it('creates a pie chart report', () => {
    cy.checkInitialState();
    page.createReportOfType('Pie Chart', barChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) #index input[name="Category"]').should('have.value', 'released');
    cy.get('main .react-grid-item:eq(2) #value input[name="Value"]').should('have.value', 'count');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 3);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g > path').should('have.length', 5);
  });

  it('creates a line chart report', () => {
    cy.checkInitialState();
    page.createReportOfType('Line Chart', barChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) #x input[name="X-value"]').should('have.value', 'released');
    cy.get('main .react-grid-item:eq(2) #value input[name="Y-value"]').should('have.value', 'count');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 6);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g:nth-child(2) > line').should(
      'have.length',
      11
    );
  });

  it('creates a map chart report', () => {
    cy.checkInitialState();
    page.createReportOfType('Map', mapChartCypherQuery, true);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > path').should('have.length', 5);
  });

  it('creates a single value report', () => {
    cy.checkInitialState();
    page.createReportOfType('Single Value', barChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root > div > div:nth-child(2) > span')
      .invoke('text')
      .then((text) => {
        expect(text).to.be.oneOf(['1999', '1,999', '1 999']);
      });
  });

  it.skip('creates a gauge chart report', () => {
    page.enableAdvancedVisualizations();
    cy.checkInitialState();
    page.createReportOfType('Gauge Chart', gaugeChartCypherQuery);
    cy.get('.text-group > text').contains('69');
  });

  it('creates a sunburst chart report', () => {
    page.enableAdvancedVisualizations();
    cy.checkInitialState();
    page.createReportOfType('Sunburst Chart', sunburstChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) #index input[name="Path"]').should('have.value', 'x.path');
    cy.get('main .react-grid-item:eq(2) #value input[name="Value"]').should('have.value', 'x.value');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g:nth-child(1) > path').should('have.length', 5);
  });

  it('creates a circle packing report', () => {
    page.enableAdvancedVisualizations();
    cy.checkInitialState();
    page.createReportOfType('Circle Packing', sunburstChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) #index input[name="Path"]').should('have.value', 'x.path');
    cy.get('main .react-grid-item:eq(2) #value input[name="Value"]').should('have.value', 'x.value');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > circle').should('have.length', 6);
  });

  it('creates a tree map report', () => {
    page.enableAdvancedVisualizations();
    cy.checkInitialState();
    page.createReportOfType('Treemap', sunburstChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) #index input[name="Path"]').should('have.value', 'x.path');
    cy.get('main .react-grid-item:eq(2) #value input[name="Value"]').should('have.value', 'x.value');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 6);
  });

  it('creates a sankey chart report', () => {
    page.enableAdvancedVisualizations();
    cy.checkInitialState();
    page.createReportOfType('Sankey Chart', sankeyChartCypherQuery, true);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > path').should('have.attr', 'fill-opacity', 0.5);
  });

  it('creates a raw json report', () => {
    cy.checkInitialState();
    page.createReportOfType('Raw JSON', barChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root textarea:nth-child(1)', { timeout: 45000 }).should(
      ($div) => {
        const text = $div.text();
        expect(text.length).to.eq(1387);
      }
    );
  });

  it('creates a parameter select report', () => {
    cy.checkInitialState();
    page.selectReportOfType('Parameter Select');
    cy.wait(500);
    cy.get('#autocomplete-label-type').type('Movie');
    cy.get('#autocomplete-label-type-option-0').click();
    cy.wait(500);
    cy.get('#autocomplete-property').type('title');
    cy.get('#autocomplete-property-option-0').click();
    cy.get('main .react-grid-item:eq(2) button[aria-label="run"]').click();
    cy.get('#autocomplete').type('The Matrix');
    cy.get('#autocomplete-option-0').click();
  });

  it('creates an iframe report', () => {
    cy.checkInitialState();
    page.createReportOfType('iFrame', iFrameText);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root iframe', { timeout: 45000 }).should('be.visible');
  });

  it('creates a markdown report', () => {
    cy.checkInitialState();
    page.createReportOfType('Markdown', markdownText);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root h1', { timeout: 45000 }).should('have.text', 'Hello');
  });

  it.skip('creates a form report', () => {
    page.enableFormsExtension();
    cy.checkInitialState();
    page.createReportOfType('Form', formCypherQuery, true, false);
    cy.get('main .react-grid-item:eq(2) .form-add-parameter').click();
    cy.wait(200);
    cy.get('#autocomplete-label-type').type('Movie');
    cy.get('#autocomplete-label-type-option-0').click();
    cy.wait(200);
    cy.get('#autocomplete-property').type('title');
    cy.get('#autocomplete-property-option-0').click();

    cy.get('.ndl-dialog-close').click();

    cy.get('main .react-grid-item:eq(2) button[aria-label="run"]').scrollIntoView().should('be.visible').click();
    cy.wait(500);
    cy.get('#form-submit').should('be.disabled');
    cy.get('#autocomplete').type('The Matrix');
    cy.get('#autocomplete-option-0').click();
    cy.get('#form-submit').should('not.be.disabled');
    cy.get('#form-submit').click();
    cy.wait(500);
    cy.get('.form-submitted-message').should('have.text', 'Form Submitted.Reset Form');
  });

  // Test load stress-test dashboard from file
  // TODO - this test is flaky, especially in GitHub actions environment.
  it.skip('test load dashboard from file and stress test report customizations', () => {
    try {
      const NUMBER_OF_PAGES_IN_STRESS_TEST_DASHBOARD = 5;
      const file = cy.request(loadDashboardURL).should((response) => {
        cy.get('#root .MuiDrawer-root .MuiIconButton-root:eq(2)').click();
        cy.get('.MuiDialog-root .MuiPaper-root .MuiDialogContent-root textarea:eq(0)')
          .invoke('val', response.body)
          .trigger('change');
        cy.get('.MuiDialog-root .MuiPaper-root .MuiDialogContent-root textarea:eq(0)').type(' ');
        cy.get('.MuiDialog-root .MuiDialogContent-root .MuiButtonBase-root:eq(2)').click();
        cy.wait(2500);

        // Click on each page and wait ~3 seconds for it to load completely
        for (let i = 1; i < NUMBER_OF_PAGES_IN_STRESS_TEST_DASHBOARD; i++) {
          cy.get('.MuiAppBar-root .react-grid-item:eq(' + i + ')').click();
          cy.wait(3000);
        }
      });
    } catch (e) {
      console.log('Unable to fetch test dashboard. Skipping test.');
    }
  });
});

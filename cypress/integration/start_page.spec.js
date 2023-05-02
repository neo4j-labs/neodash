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
} from '../fixtures/cypher_queries';

// Ignore warnings that may appear when using the Cypress dev server
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log(err, runnable);
  return false;
});

describe('NeoDash E2E Tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.viewport(1920, 1080);
    // Navigate to index
    cy.visit('/');
    cy.wait(1000);

    cy.get('#form-dialog-title').then(($div) => {
      const text = $div.text();
      if (text == 'NeoDash - Neo4j Dashboard Builder⚡') {
        cy.wait(300);
        // Create new dashboard
        cy.contains('New Dashboard').click();
      }
    });

    cy.wait(300);
    // If an old dashboard exists in cache, do a check to make sure we clear it.
    // if (cy.contains("Create new dashboard")) {
    //     cy.contains('Yes').click()
    // }

    cy.get('#form-dialog-title').should('contain', 'Connect to Neo4j');

    // Connect to Neo4j database
    // cy.get('#protocol').click()
    // cy.contains('neo4j').click()
    cy.get('#url').clear().type('localhost');
    cy.wait(100);
    // cy.get('#database').type('neo4j')
    cy.get('#dbusername').clear().type('neo4j');
    cy.get('#dbpassword').type('test');
    cy.wait(100);
    cy.get('button').contains('Connect').click();
    cy.wait(100);
  });

  it('initializes the dashboard', () => {
    // Check the starter cards
    cy.get('main .react-grid-item:eq(0)').should('contain', 'This is your first dashboard!');
    cy.get('main .react-grid-item:eq(1) .force-graph-container canvas').should('be.visible');
    cy.get('main .react-grid-item:eq(2) button').should('have.attr', 'aria-label', 'add');
  });

  it('creates a new card', () => {
    cy.get('main .react-grid-item:eq(2) button').click();
    cy.get('main .react-grid-item:eq(2)').should('contain', 'No query specified.');
  });

  // Test each type of card
  it('creates a table report', () => {
    cy.get('main .react-grid-item:eq(2) button').click();
    cy.get('main .react-grid-item:eq(2) button[aria-label="settings"]').click();
    cy.get('main .react-grid-item:eq(2) .MuiInputLabel-root').contains('Type').next().should('contain', 'Table');
    cy.get('main .react-grid-item:eq(2) .ReactCodeMirror').type(tableCypherQuery);
    cy.get('main .react-grid-item:eq(2) button[aria-label="save"]').click();
    cy.get('main .react-grid-item:eq(2) .MuiDataGrid-columnHeaders')
      .should('contain', 'title')
      .and('contain', 'released')
      .and('not.contain', '__id');
    cy.get('main .react-grid-item:eq(2) .MuiDataGrid-virtualScroller .MuiDataGrid-row').should('have.length', 5);
    cy.get('main .react-grid-item:eq(2) .MuiDataGrid-footerContainer').should('contain', '1–5 of 8');
    cy.get('main .react-grid-item:eq(2) .MuiDataGrid-footerContainer button[aria-label="Go to next page"]').click();
    cy.get('main .react-grid-item:eq(2) .MuiDataGrid-virtualScroller .MuiDataGrid-row').should('have.length', 3);
    cy.get('main .react-grid-item:eq(2) .MuiDataGrid-footerContainer').should('contain', '6–8 of 8');
  });

  it('creates a bar chart report', () => {
    createReportOfType('Bar Chart', barChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root')
      .contains('Category')
      .next()
      .should('contain', 'released');
    cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root')
      .contains('Value')
      .next()
      .should('contain', 'count');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 8);
  });

  it('creates a pie chart report', () => {
    createReportOfType('Pie Chart', barChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root')
      .contains('Category')
      .next()
      .should('contain', 'released');
    cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root')
      .contains('Value')
      .next()
      .should('contain', 'count');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 3);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g:nth-child(2) > path').should('have.length', 5);
  });

  it('creates a line chart report', () => {
    createReportOfType('Line Chart', barChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root')
      .contains('X-value')
      .next()
      .should('contain', 'released');
    cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root')
      .contains('Y-value')
      .next()
      .should('contain', 'count');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 6);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g:nth-child(2) > line').should(
      'have.length',
      11
    );
  });

  it('creates a map chart report', () => {
    createReportOfType('Map', mapChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > path').should('have.length', 5);
  });

  it('creates a single value report', () => {
    createReportOfType('Single Value', barChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root > div > div:nth-child(2) > span')
      .invoke('text')
      .then((text) => {
        expect(text).to.be.oneOf(['1999', '1,999']);
      });
  });

  it('creates a gauge chart report', () => {
    enableAdvancedVisualizations();
    createReportOfType('Gauge Chart', gaugeChartCypherQuery);
    cy.get('.text-group > text').contains('69');
  });

  it('creates a sunburst chart report', () => {
    enableAdvancedVisualizations();
    createReportOfType('Sunburst Chart', sunburstChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root')
      .contains('Path')
      .next()
      .should('contain', 'x.path');
    cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root')
      .contains('Value')
      .next()
      .should('contain', 'x.value');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g:nth-child(1) > path').should('have.length', 5);
  });

  it('creates a circle packing report', () => {
    enableAdvancedVisualizations();
    createReportOfType('Circle Packing', sunburstChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root')
      .contains('Path')
      .next()
      .should('contain', 'x.path');
    cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root')
      .contains('Value')
      .next()
      .should('contain', 'x.value');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > circle').should('have.length', 6);
  });

  it('creates a tree map report', () => {
    enableAdvancedVisualizations();
    createReportOfType('Treemap', sunburstChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root')
      .contains('Path')
      .next()
      .should('contain', 'x.path');
    cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root')
      .contains('Value')
      .next()
      .should('contain', 'x.value');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 6);
  });

  it('creates a sankey chart report', () => {
    enableAdvancedVisualizations();
    createReportOfType('Sankey Chart', sankeyChartCypherQuery, true);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > path').should('have.attr', 'fill-opacity', 0.5);
  });

  it('creates a raw json report', () => {
    createReportOfType('Raw JSON', barChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root textarea:nth-child(1)').should(($div) => {
      const text = $div.text();
      expect(text.length).to.eq(1387);
    });
  });

  it('creates a parameter select report', () => {
    cy.get('main .react-grid-item:eq(2) button').click();
    cy.get('main .react-grid-item:eq(2) button[aria-label="settings"]').click();
    cy.get('main .react-grid-item:eq(2) .MuiInputLabel-root').contains('Type').next().click();
    cy.contains('Parameter Select').click();
    cy.wait(300);
    cy.get('#autocomplete-label-type').type('Movie');
    cy.get('#autocomplete-label-type-option-0').click();
    cy.wait(300);
    cy.get('#autocomplete-property').type('title');
    cy.get('#autocomplete-property-option-0').click();
    cy.get('main .react-grid-item:eq(2) button[aria-label="save"]').click();
    cy.get('#autocomplete').type('The Matrix');
    cy.get('#autocomplete-option-0').click();
  });

  it('creates an iframe report', () => {
    createReportOfType('iFrame', iFrameText);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root iframe');
  });

  it('creates a markdown report', () => {
    createReportOfType('Markdown', markdownText);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root h1').should('have.text', 'Hello');
  });

  // it('creates a radar report', () => {
  //     // TODO - create a test for radar.
  // })

  // it('creates a sankey report', () => {
  //     // TODO - create a test for sankey charts.
  // })

  // Test load stress-test dashboard from file
  // TODO - this test is flaky, especially in GitHub actions environment.
  it.skip('test load dashboard from file and stress test report customizations', () => {
    try {
      var NUMBER_OF_PAGES_IN_STRESS_TEST_DASHBOARD = 5;
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

function enableAdvancedVisualizations() {
  cy.get('#extensions-sidebar-button').click();
  cy.wait(100);
  cy.get('#checkbox-advanced-charts').click();
  cy.wait(100);
  cy.get('#extensions-modal-close-button').click();
  cy.wait(200);
}

function createReportOfType(type, query, fast = false) {
  cy.get('main .react-grid-item:eq(2) button').click();
  cy.get('main .react-grid-item:eq(2) button[aria-label="settings"]').click();
  cy.get('main .react-grid-item:eq(2) .MuiInputLabel-root').contains('Type').next().click();
  cy.contains(type).click();
  if (fast) {
    cy.get('main .react-grid-item:eq(2) .ReactCodeMirror').type(query, { delay: 1, parseSpecialCharSequences: false });
  } else {
    cy.get('main .react-grid-item:eq(2) .ReactCodeMirror').type(query, { parseSpecialCharSequences: false });
  }

  cy.get('main .react-grid-item:eq(2) button[aria-label="save"]').click();
}

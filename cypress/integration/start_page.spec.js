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
    cy.viewport(1920, 1080);
    // Navigate to index
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    cy.get('#form-dialog-title', { timeout: 2000 }).should('be.visible');

    cy.get('#form-dialog-title').then(($div) => {
      const text = $div.text();
      if (text == 'NeoDash - Neo4j Dashboard Builder') {
        cy.wait(500);
        // Create new dashboard
        cy.contains('New Dashboard').click();
      }
    });

    // If an old dashboard exists in cache, do a check to make sure we clear it.
    // if (cy.contains("Create new dashboard")) {
    //     cy.contains('Yes').click()
    // }

    cy.get('#form-dialog-title').should('contain', 'Connect to Neo4j');

    // Connect to Neo4j database
    // cy.get('#protocol').click()
    // cy.contains('neo4j').click()
    cy.get('#url').clear().type('localhost');
    // cy.get('#database').type('neo4j')
    cy.get('#dbusername').clear().type('neo4j');
    cy.get('#dbpassword').type('test');
    cy.get('button').contains('Connect').click();
    cy.wait(100);
  });

  it('initializes the dashboard', () => {
    // Check the starter cards
    cy.get('main .react-grid-item:eq(0)').should('contain', 'This is your first dashboard!');
    cy.get('main .react-grid-item:eq(1) .force-graph-container canvas').should('be.visible');
    cy.get('main .react-grid-item:eq(2) button').should('have.attr', 'aria-label', 'add report');
  });

  it('creates a new card', () => {
    cy.get('main .react-grid-item:eq(2)  button[aria-label="add report"]').click();
    cy.get('main .react-grid-item:eq(2)').should('contain', 'No query specified.');
  });

  // Test each type of card
  it('creates a table report', () => {
    cy.get('main .react-grid-item .ndl-spin', { timeout: 30000 }).should('not.exist');
    cy.get('main .react-grid-item button[aria-label="add report"]').should('be.visible').click();
    cy.get('main .react-grid-item')
      .contains('No query specified.')
      .parentsUntil('.react-grid-item')
      .find('button[aria-label="settings"]', { timeout: 2000 })
      .should('be.visible')
      .click();

    cy.get('main .react-grid-item:eq(2) #type input[name="Type"]').should('have.value', 'Table');
    cy.get('main .react-grid-item:eq(2) .ReactCodeMirror').type(tableCypherQuery);
    cy.get('main .react-grid-item:eq(2) button[aria-label="save"]').click();
    cy.get('main .react-grid-item .ndl-spin', { timeout: 30000 }).should('not.exist');
    cy.get('main .react-grid-item:eq(2) .MuiDataGrid-columnHeaders', { timeout: 30000 })
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
    cy.get('main .react-grid-item input[name="Category"]', { timeout: 45000 }).should('have.value', 'released');
    cy.get('main .react-grid-item input[name="Value"]', { timeout: 45000 }).should('have.value', 'count');
    cy.get('main .react-grid-item .MuiCardContent-root svg > g > g', { timeout: 45000 }).should('have.length', 8);
  });

  it('creates a pie chart report', () => {
    createReportOfType('Pie Chart', barChartCypherQuery);
    cy.get('main .react-grid-item input[name="Category"]', { timeout: 45000 }).should('have.value', 'released');
    cy.get('main .react-grid-item input[name="Value"]', { timeout: 45000 }).should('have.value', 'count');
    cy.get('main .react-grid-item .MuiCardContent-root svg > g > g', { timeout: 45000 }).should('have.length', 3);
    cy.get('main .react-grid-item .MuiCardContent-root svg > g > g:nth-child(2) > path', { timeout: 45000 }).should(
      'have.length',
      5
    );
  });

  it('creates a line chart report', () => {
    createReportOfType('Line Chart', barChartCypherQuery);
    cy.get('main .react-grid-item input[name="X-value"]', { timeout: 45000 }).should('have.value', 'released');
    cy.get('main .react-grid-item input[name="Y-value"]', { timeout: 45000 }).should('have.value', 'count');
    cy.get('main .react-grid-item .MuiCardContent-root svg > g > g', { timeout: 45000 }).should('have.length', 6);
    cy.get('main .react-grid-item .MuiCardContent-root svg > g > g:nth-child(2) > line', { timeout: 45000 }).should(
      'have.length',
      11
    );
  });

  it('creates a map chart report', () => {
    createReportOfType('Map', mapChartCypherQuery, true);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > path', { timeout: 45000 }).should(
      'have.length',
      5
    );
  });

  it('creates a single value report', () => {
    createReportOfType('Single Value', barChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root > div > div:nth-child(2) > span', { timeout: 45000 })
      .invoke('text')
      .then((text) => {
        expect(text).to.be.oneOf(['1999', '1,999', '1 999']);
      });
  });

  it('creates a gauge chart report', () => {
    enableAdvancedVisualizations();
    createReportOfType('Gauge Chart', gaugeChartCypherQuery);
    cy.get('.text-group > text', { timeout: 45000 }).contains('69');
  });

  it('creates a sunburst chart report', () => {
    enableAdvancedVisualizations();
    createReportOfType('Sunburst Chart', sunburstChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) #index input[name="Path"]', { timeout: 45000 }).should('have.value', 'x.path');
    cy.get('main .react-grid-item:eq(2) #value input[name="Value"]').should('have.value', 'x.value');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g:nth-child(1) > path').should('have.length', 5);
  });

  it('creates a circle packing report', () => {
    enableAdvancedVisualizations();
    createReportOfType('Circle Packing', sunburstChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) #index input[name="Path"]', { timeout: 45000 }).should('have.value', 'x.path');
    cy.get('main .react-grid-item:eq(2) #value input[name="Value"]').should('have.value', 'x.value');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > circle').should('have.length', 6);
  });

  it('creates a tree map report', () => {
    enableAdvancedVisualizations();
    createReportOfType('Treemap', sunburstChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) #index input[name="Path"]', { timeout: 45000 }).should('have.value', 'x.path');
    cy.get('main .react-grid-item:eq(2) #value input[name="Value"]').should('have.value', 'x.value');
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 6);
  });

  it('creates a sankey chart report', () => {
    enableAdvancedVisualizations();
    createReportOfType('Sankey Chart', sankeyChartCypherQuery, true);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > path', { timeout: 45000 }).should(
      'have.attr',
      'fill-opacity',
      0.5
    );
  });

  it('creates a raw json report', () => {
    createReportOfType('Raw JSON', barChartCypherQuery);
    cy.get('main .react-grid-item:eq(2) .MuiCardContent-root textarea:nth-child(1)', { timeout: 60000 }).should(
      ($div) => {
        const text = $div.text();
        expect(text.length).to.eq(1387);
      }
    );
  });

  it('creates a parameter select report', () => {
    selectReportOfType('Parameter Select');
    cy.wait(500);
    cy.get('#autocomplete-label-type').type('Movie');
    cy.get('#autocomplete-label-type-option-0').click();
    cy.wait(500);
    cy.get('#autocomplete-property').type('title');
    cy.get('#autocomplete-property-option-0').click();
    cy.get('main .react-grid-item:eq(2) button[aria-label="save"]').click();
    cy.get('#autocomplete').type('The Matrix');
    cy.get('#autocomplete-option-0').click();
  });

  it('creates an iframe report', () => {
    createReportOfType('iFrame', iFrameText);
    cy.get('main .react-grid-item .MuiCardContent-root iframe', { timeout: 60000 }).should('be.visible');
  });

  it('creates a markdown report', () => {
    createReportOfType('Markdown', markdownText);
    cy.get('main .react-grid-item .MuiCardContent-root h1', { timeout: 45000 }).should('have.text', 'Hello');
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
  cy.get('#extensions-sidebar-button').should('be.visible').click();
  cy.get('#checkbox-advanced-charts').should('be.visible').click();
  cy.get('.ndl-dialog-close').should('be.visible').click();
  cy.wait(200);
}

function selectReportOfType(type) {
  cy.get('main .react-grid-item button[aria-label="add report"]').should('be.visible').click();
  cy.get('main .react-grid-item')
    .contains('No query specified.')
    .parentsUntil('.react-grid-item')
    .find('button[aria-label="settings"]', { timeout: 2000 })
    .should('be.visible')
    .click();
  cy.get('main .react-grid-item:eq(2) #type', { timeout: 2000 }).should('be.visible').click();
  cy.contains(type).click();
}

function createReportOfType(type, query, fast = false) {
  cy.get('main .react-grid-item .ndl-spin', { timeout: 60000 }).should('not.exist');
  selectReportOfType(type);
  if (fast) {
    cy.get('main .react-grid-item:eq(2) .ReactCodeMirror').type(query, { delay: 1, parseSpecialCharSequences: false });
  } else {
    cy.get('main .react-grid-item:eq(2) .ReactCodeMirror').type(query, { parseSpecialCharSequences: false });
  }
  cy.get('main .react-grid-item:eq(2) button[aria-label="save"]').click();
  cy.get('main .react-grid-item .ndl-spin', { timeout: 60000 }).should('not.exist');
}

import { barChartCypherQuery } from '../../fixtures/cypher_queries';
import { Page } from '../../Page';

const CARD_SELECTOR = '.react-grid-layout:eq(0) .MuiGrid-root:eq(2)';
const page = new Page(CARD_SELECTOR);

// Ignore warnings that may appear when using the Cypress dev server
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log(err, runnable);
  return false;
});

describe('Testing bar chart', () => {
  beforeEach('open neodash', () => {
    page.init().createNewDashboard().connectToNeo4j().createReportOfType('Bar Chart', barChartCypherQuery);
  });

  it('Checking Colour Picker settings', () => {
    //Opens advanced settings
    cy.get('.react-grid-layout')
      .first()
      .within(() => {
        //Finds the 2nd card
        cy.get('.MuiGrid-root:eq(2)').within(() => {
          // Access advanced settings
          cy.get('button').eq(1).click();
          cy.get('[role="switch"]').click();
          cy.wait(200);
          // Changing setting for colour picker
          cy.get('[data-testid="colorpicker-input"]').find('input').click().type('{selectall}').type('red');
          cy.get('button[aria-label="run"]').click();
          // Checking that colour picker was applied correctly
          cy.get('.card-view').should('have.css', 'background-color', 'rgb(255, 0, 0)');
          cy.wait(200);
          // Changing colour back to white
          cy.get('button').eq(1).click();
          cy.get('[data-testid="colorpicker-input"]').find('input').click().type('{selectall}').type('white');
          cy.get('button[aria-label="run"]').click();
          // Checking colour has been set back to white
          cy.wait(200);
          cy.get('.card-view').should('have.css', 'background-color', 'rgb(255, 255, 255)');
        });
      });
  });

  it('Checking Selector Description', () => {
    //Opens first 2nd card
    cy.get('.react-grid-layout:eq(0) .MuiGrid-root:eq(2)').within(() => {
      // Access advanced settings
      cy.get('button').eq(1).click();
      cy.get('[role="switch"]').click();
      cy.wait(200);
      // Changing Selector Description to 'Test'
      cy.get('.ndl-textarea').contains('span', 'Selector Description').click().type('Test');
      cy.get('button[aria-label="run"]').click();
      // Pressing Selector Description button
      cy.get('button[aria-label="details"]').click();
    });
    // Checking that Selector Description is behaving as expected
    cy.get('.MuiDialog-paper').should('be.visible').and('contain.text', 'Test');
    cy.wait(1000);

    // Click elsewhere on the page to close dialog box
    cy.get('div[role="dialog"]').parent().click(-100, -100, { force: true });
  });

  it('Checking full screen bar chart setting', () => {
    page.updateDropdownAdvancedSetting('Fullscreen enabled', 'on');
    cy.get('button[aria-label="maximize"]').click();
    // Checking existence of full-screen modal
    cy.get('.dialog-xxl').should('be.visible');
    // Action to close full-screen modal
    cy.get('button[aria-label="un-maximize"]').click();
    // Checking that fullscreen has un-maximized
    // Check that the div is no longer in the DOM
    cy.get('div[data-focus-lock-disabled="false"]').should('not.exist');
  });

  it('Checking "Autorun Query" works as intended', () => {
    page.updateDropdownAdvancedSetting('Auto-run query', 'off');
    cy.get('.MuiCardContent-root').find('.ndl-cypher-editor').should('be.visible');
    cy.get('.MuiCardContent-root').find('g').should('not.exist');
    cy.wait(100);
    cy.get('.MuiCardContent-root').find('button[aria-label="run"]').filter(':visible').click();
    cy.get('g').should('exist');
  });

  it('Checking Legend integration works as intended', () => {
    page.updateDropdownAdvancedSetting('Show Legend', 'on');
    // Checking that legend matches value specified: in the case - 'count'
    cy.get('svg g g text').last().contains(/count/i);

    page.updateDropdownAdvancedSetting('Show Legend', 'off');
    cy.get('svg g g text').last().contains(/count/i).should('not.exist');
  });

  it('Checking the stacked grouping function works as intended', () => {
    const TRANSLATE_REGEXP = /translate\(([0-9]{1,3}), [0-9]{1,3}\)/;

    page
      .updateChartQuery(
        'MATCH (p:Person)-[:DIRECTED]->(n:Movie) RETURN n.released AS released, p.name AS Director, count(n.title) AS count LIMIT 5'
      )
      .updateDropdownAdvancedSetting('Grouping', 'on');

    cy.get('.MuiGrid-root:eq(2)')
      .find('.ndl-dropdown:contains("Group")')
      .find('svg')
      .parent()
      .click()
      .type('Director{enter}');
    // Checking that the groups are stacked
    cy.get('.MuiGrid-root:eq(2)')
      .find('g')
      .children('g')
      .eq(3) // Get the fourth g element (index starts from 0)
      .invoke('attr', 'transform')
      .then((transformValue) => {
        // Captures the first number in the translate attribute using the parenthesis to capture the first digit and put it in the second value of the resulting array
        // if transformValue is translate(100,200), then it will produce an array like ["translate(100,200)", "100"],
        const match = transformValue.match(TRANSLATE_REGEXP);
        if (match?.[1]) {
          const xValue = match[1];
          // Now find sibling g elements with the same x transform value
          cy.get('.MuiCardContent-root')
            .find('g')
            .children('g')
            .filter((_, element) => {
              const siblingTransform = Cypress.$(element).attr('transform');
              return siblingTransform?.includes(`translate(${xValue},`);
            })
            .should('have.length', 3); // Check that there's at least one element
        } else {
          throw new Error('Transform attribute not found or invalid format');
        }
      });
    cy.get('.ndl-dropdown:contains("Group")').find('svg').parent().click().type('(none){enter}');
    //Checking that the stacked grouped elements do not exist
    cy.get('.MuiCardContent-root')
      .find('g')
      .children('g')
      .eq(3) // Get the fourth g element (index starts from 0)
      .invoke('attr', 'transform')
      .then((transformValue) => {
        // Captures the first number in the translate attribute using the parenthesis to capture the first digit and put it in the second value of the resulting array
        // if transformValue is translate(100,200), then it will produce an array like ["translate(100,200)", "100"],
        const match = transformValue.match(TRANSLATE_REGEXP);
        if (match?.[1]) {
          const xValue = match[1];
          // Now find sibling g elements with the same x transform value
          cy.get('.MuiCardContent-root')
            .find('g')
            .children('g')
            .filter((_, element) => {
              const siblingTransform = Cypress.$(element).attr('transform');
              return siblingTransform?.includes(`translate(${xValue},`);
            })
            .should('have.length', 1); // Check that there are no matching elements
        } else {
          throw new Error('Transform attribute not found or invalid format');
        }
      });
  });

  // How to properly test this?
  it.skip('Testing grouped grouping mode', () => {
    page
      .updateChartQuery(
        'MATCH (p:Person)-[:DIRECTED]->(n:Movie) RETURN n.released AS released, p.name AS Director, count(n.title) AS count LIMIT 5'
      )
      .updateDropdownAdvancedSetting('Grouping', 'on')
      .updateDropdownAdvancedSetting('Group Mode', 'grouped');
    cy.get('.ndl-dropdown:contains("Group")').find('svg').parent().click().type('Director{enter}');
  });

  it('Testing "Show Value on Bars"', () => {
    page.updateDropdownAdvancedSetting('Show Values On Bars', 'on');
    cy.get('.react-grid-layout:eq(0) .MuiGrid-root:eq(2)').find('div svg > g > g > text').should('have.length', 5);

    page.updateDropdownAdvancedSetting('Show Values On Bars', 'off');
    cy.get('.react-grid-layout:eq(0) .MuiGrid-root:eq(2)').find('div svg > g > g > text').should('not.exist');
  });

  describe('Y axis display', () => {
    it('Checking Y axis is displayed', () => {
      page.updateDropdownAdvancedSetting('Display Y axis', 'on');
      cy.get('.MuiCardContent-root svg > g > g:nth-child(3)')
        .invoke('attr', 'transform')
        .should('eq', 'translate(0,0)');
    });

    it('Checking Y axis is hidden', () => {
      page.updateDropdownAdvancedSetting('Display Y axis', 'off');
      cy.get('.MuiCardContent-root svg > g > g:nth-child(3)')
        .invoke('attr', 'transform')
        .should('not.eq', 'translate(0,0)');
    });
  });

  describe('Y grid lines display', () => {
    it('Checking Y grid lines are displayed', () => {
      page.updateDropdownAdvancedSetting('Display Y grid lines', 'on');
      cy.get('.MuiCardContent-root svg g > g > line').invoke('attr', 'stroke').should('eq', '#dddddd');
    });

    it('Checking Y grid lines are hidden', () => {
      page.updateDropdownAdvancedSetting('Display Y grid lines', 'off');
      cy.get('.MuiCardContent-root svg g > g > line').invoke('attr', 'stroke').should('not.eq', '#dddddd');
    });
  });
});

import { barChartCypherQuery } from '../fixtures/cypher_queries';

const WAITING_TIME = 20000;
// Ignore warnings that may appear when using the Cypress dev server
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log(err, runnable);
  return false;
});

describe('Testing bar chart', () => {
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

    //Opens the div containing all report cards
    cy.get('.react-grid-layout:eq(0)').within(() => {
      //Finds the 2nd card
      cy.get('.MuiGrid-root')
        .eq(1)
        .within(() => {
          //Clicks the 2nd button (opens settings)
          cy.get('button').eq(1).click();
        });
    });
    cy.get('.react-grid-layout:eq(0)').within(() => {
      //Finds the 2nd card
      cy.get('.MuiGrid-root')
        .eq(1)
        .within(() => {
          //Opens the drop down
          cy.getDataTest('type-dropdown').click();
        });
    });
    // Selects the Bar option
    cy.get('[id^="react-select-5-option"]')
      .contains(/Bar Chart/i)
      .should('be.visible')
      .click({ force: true });
    cy.get('.react-grid-layout .MuiGrid-root:eq(1) #type input[name="Type"]').should('have.value', 'Bar Chart');

    // Creates basic bar chart
    cy.get('.react-grid-layout')
      .first()
      .within(() => {
        //Finds the 2nd card
        cy.get('.MuiGrid-root')
          .eq(1)
          .within(() => {
            //Removes text in cypher editor and types new query
            cy.get('.ndl-cypher-editor div[role="textbox"]')
              .should('be.visible')
              .click()
              .clear()
              .type(barChartCypherQuery);

            cy.wait(400);
            cy.get('button[aria-label="run"]').click();
          });
      });

    cy.wait(500);
  });

  it.skip('Checking Colour Picker settings', () => {
    //Opens advanced settings
    cy.get('.react-grid-layout')
      .first()
      .within(() => {
        //Finds the 2nd card
        cy.get('.MuiGrid-root')
          .eq(1)
          .within(() => {
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

  it.skip('Checking Selector Description', () => {
    //Opens first 2nd card
    cy.get('.react-grid-layout:eq(0) .MuiGrid-root:eq(1)').within(() => {
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

  it.skip('Checking full screen bar chart setting', () => {
    //Opens first 2nd card
    cy.get('.react-grid-layout:eq(0) .MuiGrid-root:eq(1)').within(() => {
      // Opening settings
      cy.get('button').eq(1).click();
      // Activating advanced settings
      cy.get('[role="switch"]').click();
      cy.wait(200);
      // Finding fullscreen setting and changing it to 'on'
      cy.get('.ndl-dropdown')
        .contains('label', 'Fullscreen enabled')
        .scrollIntoView()
        .should('be.visible')
        .click()
        .type('on{enter}');
      // Pressing run to return to card view
      cy.get('button[aria-label="run"]').click();
      cy.get('button[aria-label="maximize"]').click();
    });
    // Modal outside of scope of card
    // Checking existence of full-screen modal
    cy.get('.dialog-xxl').should('be.visible');
    // Action to close full-screen modal
    cy.get('button[aria-label="un-maximize"]').click();
    // Checking that fullscreen has un-maximized
    // Check that the div is no longer in the DOM
    cy.get('div[data-focus-lock-disabled="false"]').should('not.exist');
  });

  it.skip('Checking "Autorun Query" works as intended', () => {
    // Custom command to open advanced settings
    cy.advancedSettings(() => {
      // Finding 'Auto-run query setting and changing it to 'off'
      cy.get('.ndl-dropdown')
        .contains('label', 'Auto-run query')
        .scrollIntoView()
        .should('be.visible')
        .click()
        .type('off{enter}');
      cy.wait(200);
      cy.get('button[aria-label="run"]').click();
      cy.get('.ndl-cypher-editor').should('be.visible');
      cy.get('g').should('not.exist');
      cy.wait(100);
      cy.get('.MuiCardContent-root').find('button[aria-label="run"]').filter(':visible').click();
      cy.get('g').should('exist');
    });
  });

  it.skip('Checking Legend integration works as intended', () => {
    cy.advancedSettings(() => {
      // Checking that legend appears
      cy.setDropdownValue('Show Legend', 'on');
      cy.wait(100);
      cy.get('button[aria-label="run"]').click();
      cy.wait(100);
      //Checking that legend matches value specified: in the case - 'count'
      cy.get('svg g g text').last().contains(/count/i);
    });
    cy.advancedSettings(() => {
      // Activating advanced settings
      cy.get('[role="switch"]').click();
      // Checking that legend disappears
      cy.setDropdownValue('Show Legend', 'off');
      cy.wait(100);
      cy.get('button[aria-label="run"]').click();
      cy.wait(100);
      cy.get('svg g g text').last().contains(/count/i).should('not.exist');
    });
  });

  it.skip('Checking the stacked grouping function works as intended', () => {
    cy.advancedSettings(() => {
      cy.get('.ndl-cypher-editor div[role="textbox"]')
        .should('be.visible')
        .click()
        .clear()
        .type(
          'MATCH (p:Person)-[:DIRECTED]->(n:Movie) RETURN n.released AS released, p.name AS Director, count(n.title) AS count LIMIT 5'
        );
      cy.setDropdownValue('Grouping', 'on');
      cy.wait(100);
      cy.get('button[aria-label="run"]').click();
      cy.get('.ndl-dropdown:contains("Group")').find('svg').parent().click().type('Director{enter}');
      // Checking that the groups are stacked
      cy.get('.MuiCardContent-root')
        .find('g')
        .children('g')
        .eq(3) // Get the fourth g element (index starts from 0)
        .invoke('attr', 'transform')
        .then((transformValue) => {
          // Captures the first number in the tranlsate attribute using the parenthisis to capture the first digit and put it in the second value of the resulting array
          // if transformValue is translate(100,200), then transformValue.match(/translate\((\d+),\d+\)/) will produce an array like ["translate(100,200)", "100"],
          const match = transformValue.match(/translate\((\d+),\d+\)/);
          if (match?.[1]) {
            const xValue = match[1];
            console.log('xValue: ', xValue);

            // Now find sibling g elements with the same x transform value
            cy.get('.MuiCardContent-root')
              .find('g')
              .children('g')
              .filter((index, element) => {
                const siblingTransform = Cypress.$(element).attr('transform');
                return siblingTransform?.includes(`translate(${xValue},`);
              })
              .should('have.length', 3); // Check that there's at least one element
          } else {
            throw new Error('Transform attribute not found or invalid format');
          }
        });
    });
    cy.get('.ndl-dropdown:contains("Group")').find('svg').parent().click().type('(none){enter}');
    // Checking that the stacked grouped elements do not exist
    cy.get('.MuiCardContent-root')
      .find('g')
      .children('g')
      .eq(3) // Get the fourth g element (index starts from 0)
      .invoke('attr', 'transform')
      .then((transformValue) => {
        // Captures the first number in the tranlsate attribute using the parenthisis to capture the first digit and put it in the second value of the resulting array
        // if transformValue is translate(100,200), then transformValue.match(/translate\((\d+),\d+\)/) will produce an array like ["translate(100,200)", "100"],
        const match = transformValue.match(/translate\((\d+),\d+\)/);
        if (match?.[1]) {
          const xValue = match[1];
          console.log('xValue: ', xValue);

          // Now find sibling g elements with the same x transform value
          cy.get('.MuiCardContent-root')
            .find('g')
            .children('g')
            .filter((index, element) => {
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
    cy.advancedSettings(() => {
      cy.get('.ndl-cypher-editor div[role="textbox"]')
        .should('be.visible')
        .click()
        .clear()
        .type(
          'MATCH (p:Person)-[:DIRECTED]->(n:Movie) RETURN n.released AS released, p.name AS Director, count(n.title) AS count LIMIT 5'
        );
      cy.setDropdownValue('Grouping', 'on');
      cy.setDropdownValue('Group Mode', 'grouped');
      cy.wait(400);
      cy.get('button[aria-label="run"]').click();
      cy.get('.ndl-dropdown:contains("Group")').find('svg').parent().click().type('Director{enter}');
    });
  });

  it.skip('Testing "Show Value on Bars"', () => {
    cy.advancedSettings(() => {
      cy.setDropdownValue('Show Values On Bars', 'on');
      cy.get('button[aria-label="run"]').click();
      cy.get('.MuiCardContent-root')
        .find('div svg > g > g > text')
        .should('have.length', 5)
        .then((textElements) => {
          cy.log('Number of text elements:', textElements.length);
        });
    });
    cy.wait(100);
    cy.openSettings(() => {
      cy.setDropdownValue('Show Values On Bars', 'off');
      cy.get('button[aria-label="run"]').click();
      cy.get('.MuiCardContent-root').find('div svg > g > g > text').should('not.exist');
    });
  });
});

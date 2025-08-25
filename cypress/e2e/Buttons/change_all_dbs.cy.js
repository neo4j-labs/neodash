import { createDB2 } from '../../fixtures/cypher_queries';
import { Page } from '../../Page';

const CARD_SELECTOR = 'main .react-grid-item:eq(2)';
const page = new Page(CARD_SELECTOR);

// Ignore warnings that may appear when using the Cypress dev server
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log(err, runnable);
  return false;
});

describe('Tests for change all db button', () => {
    beforeEach('open neodash', () => {
        page.init().createNewDashboard().connectToNeo4j();
        cy.wait(100);
    });

    it('Testing menu population', () => {
        //Create a second db
        page.createReportOfType('Table', createDB2, true, true);
        
        //Check menus are populated
        page.selectReportDatabase('db2')
        cy.get('[style="padding-bottom: 6px; width: 440px; height: 430px; position: absolute; transform: translate(460px, 10px);"] > .n-bg-neutral-bg-weak > .MuiCollapse-entered > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiPaper-root > .card-view > .MuiCardHeader-root > .MuiCardHeader-action > .ndl-icon-btn')
            .should('be.visible')
            .click()
        cy.get('.ndl-btn').should('be.visible').click()
        cy.contains('db2')
    });

    it('Testing changing the dbs for all cards', () => {
        //Create a second db
        page.createReportOfType('Table', createDB2, true, true);
        
        //Change all db button
        cy.get('.ndl-btn').should('be.visible').click()
        cy.contains('db2').should('be.visible').click()
        cy.contains('Continue').should('be.visible').click()
        cy.get('[style="border-width: 1px; border-style: solid; color: rgb(var(--palette-primary-bg-strong)); border-color: rgb(var(--palette-primary-bg-strong)); border-radius: 8px;"] > .n-flex-row > .n-flex > .ndl-menu-item-title')
        .should('contain', 'db2')

        //Check reports
        cy.get('[data-testid="popover-backdrop"]').click()

        //Report 1
        cy.get('[style="padding-bottom: 6px; transform: translate(909px, 10px); width: 440px; height: 430px; position: absolute;"] > .n-bg-neutral-bg-weak > .MuiCollapse-entered > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiPaper-root > .card-view > .MuiCardHeader-root > .MuiCardHeader-action > .ndl-icon-btn')
            .should('be.visible')
            .click()
        cy.get('[data-test="database-dropdown"] > .css-b62m3t-container > .css-19x0je5-control > .css-1fdsijx-ValueContainer > .css-4zo8aq-Input')
            .should('be.visible')
            .click()
        cy.get('#react-select-11-option-0').should('be.visible').should('contain', 'db2')
        cy.get('[style="padding-bottom: 6px; transform: translate(909px, 10px); width: 440px; height: 430px; position: absolute;"] > .n-bg-neutral-bg-weak > .MuiCollapse-entered > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiPaper-root > .card-view > .MuiCardHeader-root > .MuiCardHeader-action > .ndl-icon-btn')
            .should('be.visible')
            .click()

        //Report 2
        cy.get('[style="padding-bottom: 6px; width: 440px; height: 430px; position: absolute; transform: translate(460px, 10px);"] > .n-bg-neutral-bg-weak > .MuiCollapse-entered > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiPaper-root > .card-view > .MuiCardHeader-root > .MuiCardHeader-action > .ndl-icon-btn')
            .should('be.visible')
            .click()
        cy.get('[style="padding-bottom: 6px; width: 440px; height: 430px; position: absolute; transform: translate(460px, 10px);"] > .n-bg-neutral-bg-weak > .MuiCollapse-entered > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiPaper-root > .card-view > .sc-bcXHqe > .MuiCardContent-root > [data-test="database-dropdown"] > .css-b62m3t-container > .css-19x0je5-control > .css-1fdsijx-ValueContainer > .css-4zo8aq-Input')
            .should('be.visible')
            .click()
        cy.get('#react-select-15-option-0').should('be.visible').should('contain', 'db2')
    });

    it('Test no popover', () => {
        //Create a second db
        page.createReportOfType('Table', createDB2, true, true);

        //Check menus are populated
        cy.get('.ndl-btn').should('be.visible').click()
        cy.contains('db2').should('be.visible').click()
        cy.get('.ndl-form-item-label > input').should('be.visible').click()
        cy.contains('Continue').should('be.visible').click()
        cy.get('[data-testid="popover-backdrop"]').click()

        //Click without popover
        cy.get('.ndl-btn').should('be.visible').click()
        cy.get('[style=""] > .n-flex-row > .n-flex > .ndl-menu-item-title').contains('neo4j').should('be.visible').click()
        
    });
});
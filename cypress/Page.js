const DB_URL = 'localhost';
const DB_USERNAME = 'neo4j';
const DB_PASSWORD = 'test1234';

export class Page {
  constructor(cardSelector) {
    this.cardSelector = cardSelector;
  }

  init() {
    cy.viewport(1920, 1080);
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
    return this;
  }

  createNewDashboard() {
    cy.get('#form-dialog-title').then(($div) => {
      const text = $div.text();
      if (text == 'NeoDash - Neo4j Dashboard Builder') {
        cy.wait(100);
        // Create new dashboard
        cy.contains('New Dashboard').click();
      }
    });
    return this;
  }

  connectToNeo4j() {
    cy.get('#form-dialog-title', { timeout: 20000 }).should('contain', 'Connect to Neo4j');
    cy.get('#protocol').type('neo4j{enter}');
    cy.get('#url').clear().type(DB_URL);
    cy.get('#dbusername').clear().type(DB_USERNAME);
    cy.get('#dbpassword').type(DB_PASSWORD);
    cy.get('button').contains('Connect').click();
    cy.wait(100);
    return this;
  }

  enableReportActions() {
    cy.get('main button[aria-label="Extensions').should('be.visible').click();
    cy.get('#checkbox-actions').scrollIntoView();
    cy.get('#checkbox-actions').should('be.visible').click();
    cy.get('.ndl-dialog-close').scrollIntoView().should('be.visible').click();
    cy.wait(100);
    return this;
  }

  enableAdvancedVisualizations() {
    cy.get('main button[aria-label="Extensions').should('be.visible').click();
    cy.get('#checkbox-advanced-charts').should('be.visible').click();
    cy.get('.ndl-dialog-close').scrollIntoView().should('be.visible').click();
    cy.wait(100);
    return this;
  }

  enableFormsExtension() {
    cy.get('main button[aria-label="Extensions').should('be.visible').click();
    cy.get('#checkbox-forms').scrollIntoView();
    cy.get('#checkbox-forms').should('be.visible').click();
    cy.get('.ndl-dialog-close').scrollIntoView().should('be.visible').click();
    cy.wait(100);
    return this;
  }

  selectReportOfType(type) {
    cy.get('main .react-grid-item button[aria-label="add report"]').should('be.visible').click();
    cy.get('main .react-grid-item')
      .contains('No query specified.')
      .parentsUntil('.react-grid-item')
      .find('button[aria-label="settings"]', { timeout: 2000 })
      .should('be.visible')
      .click();
    cy.get(`${this.cardSelector} #type`, { timeout: 2000 }).should('be.visible').click();
    cy.contains(type).click();
    cy.wait(100);
    return this;
  }

  createReportOfType(type, query, fast = false, run = true) {
    this.selectReportOfType(type);
    if (fast) {
      cy.get(`${this.cardSelector} .ReactCodeMirror`).type(query, {
        delay: 1,
        parseSpecialCharSequences: false,
      });
    } else {
      cy.get(`${this.cardSelector} .ReactCodeMirror`).type(query, { parseSpecialCharSequences: false });
    }
    cy.wait(400);

    if (run) {
      this.closeSettings();
    }

    cy.wait(100);
    return this;
  }

  openSettings() {
    cy.get(this.cardSelector).find('button[aria-label="settings"]', { WAITING_TIME: 2000 }).click();
    cy.wait(100);
    return this;
  }

  closeSettings() {
    cy.get(`${this.cardSelector} button[aria-label="run"]`).click();
    cy.wait(100);
    return this;
  }

  openAdvancedSettings() {
    this.openSettings();
    cy.get(this.cardSelector).contains('Advanced settings').click();
    cy.wait(100);
    return this;
  }

  closeAdvancedSettings() {
    cy.get(this.cardSelector).contains('Advanced settings').click();
    this.closeSettings();
    return this;
  }

  openReportActionsMenu() {
    this.openSettings();
    cy.get(this.cardSelector).find('button[aria-label="custom actions"]').click();
    cy.wait(100);
    return this;
  }

  updateDropdownAdvancedSetting(settingLabel, targetValue) {
    this.openAdvancedSettings();
    cy.get(`${this.cardSelector} .ndl-dropdown`).contains(settingLabel).siblings('div').click();
    cy.contains(targetValue).click();
    this.closeAdvancedSettings();
    return this;
  }

  updateChartQuery(query) {
    this.openSettings();

    cy.get(this.cardSelector)
      .find('.ndl-cypher-editor div[role="textbox"]')
      .should('be.visible')
      .click()
      .clear()
      .type(query);
    cy.wait(100);

    this.closeSettings();
    return this;
  }
}

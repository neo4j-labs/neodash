export function enableReportActions() {
  cy.get('main button[aria-label="Extensions').should('be.visible').click();
  cy.get('#checkbox-actions').scrollIntoView();
  cy.get('#checkbox-actions').should('be.visible').click();
  cy.get('.ndl-dialog-close').scrollIntoView().should('be.visible').click();
  cy.wait(200);
}

export function enableAdvancedVisualizations() {
  cy.get('main button[aria-label="Extensions').should('be.visible').click();
  cy.get('#checkbox-advanced-charts').should('be.visible').click();
  cy.get('.ndl-dialog-close').scrollIntoView().should('be.visible').click();
  cy.wait(200);
}

export function enableFormsExtension() {
  cy.get('main button[aria-label="Extensions').should('be.visible').click();
  cy.get('#checkbox-forms').scrollIntoView();
  cy.get('#checkbox-forms').should('be.visible').click();
  cy.get('.ndl-dialog-close').scrollIntoView().should('be.visible').click();
  cy.wait(200);
}

export function selectReportOfType(type) {
  cy.get('main .react-grid-item button[aria-label="add report"]').should('be.visible').click();
  cy.get('main .react-grid-item')
    .contains('No query specified.')
    .parentsUntil('.react-grid-item')
    .find('button[aria-label="settings"]', { timeout: 2000 })
    .should('be.visible')
    .click();
  cy.get('main .react-grid-item:eq(2) #type', { timeout: 2000 }).should('be.visible').click();
  cy.contains(type).click();
  cy.wait(100);
}

export function createReportOfType(type, query, fast = false, run = true) {
  selectReportOfType(type);
  if (fast) {
    cy.get('main .react-grid-item:eq(2) .ReactCodeMirror').type(query, { delay: 1, parseSpecialCharSequences: false });
  } else {
    cy.get('main .react-grid-item:eq(2) .ReactCodeMirror').type(query, { parseSpecialCharSequences: false });
  }
  cy.wait(400);

  if (run) {
    closeSettings('main .react-grid-item:eq(2)');
  }
}

export function openSettings(cardSelector) {
  cy.get(cardSelector).find('button[aria-label="settings"]', { WAITING_TIME: 2000 }).click();
}

export function closeSettings(cardSelector) {
  cy.get(`${cardSelector} button[aria-label="run"]`).click();
}

export function openAdvancedSettings(cardSelector) {
  openSettings(cardSelector);
  cy.get(cardSelector).contains('Advanced settings').click();
}

export function closeAdvancedSettings(cardSelector) {
  cy.get(cardSelector).contains('Advanced settings').click();
  closeSettings(cardSelector);
}

export function openReportActionsMenu(cardSelector) {
  openSettings(cardSelector);
  cy.get(cardSelector).find('button[aria-label="custom actions"]').click();
}

export function updateDropdownAdvancedSetting(cardSelector, settingLabel, targetValue) {
  openAdvancedSettings(cardSelector);
  cy.get(`${cardSelector} .ndl-dropdown`).contains(settingLabel).siblings('div').click();
  cy.contains(targetValue).click();
  closeAdvancedSettings(cardSelector);
}

export function toggleTableTranspose(cardSelector, enable) {
  let transpose = enable ? 'on' : 'off';
  updateDropdownAdvancedSetting(cardSelector, 'Transpose Rows & Columns', transpose);
}

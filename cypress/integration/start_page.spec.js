import {tableCypherQuery, barChartCypherQuery, mapChartCypherQuery, sunburstChartCypherQuery, iFrameText, markdownText, loadFileDashboard} from "../fixtures/cypher_queries"

describe('The Dashboard Page', () => {
    beforeEach(() => {
        cy.clearLocalStorage()
        cy.viewport(1920, 1080) 
        // Navigate to index
        cy.visit('/')
        cy.get('#form-dialog-title').should('contain', 'NeoDash - Neo4j Dashboard Builder')
        cy.wait(300)

        // Create new dashboard
        cy.contains('New Dashboard').click()
        cy.wait(300)

        if(cy.contains("Create new dashboard")) {
            cy.contains('Yes').click()
        } 
        cy.get('#form-dialog-title').should('contain', 'Connect to Neo4j')

        // Connect to Neo4j database
        cy.get('#protocol').click()
        cy.contains('neo4j+s').click()
        cy.get('#url').clear().type('demo.neo4jlabs.com')
        cy.get('#database').type('movies')
        cy.get('#dbusername').clear().type('movies')
        cy.get('#dbpassword').type('movies')
        cy.get('button').contains('Connect').click()
    })

    it('initializes the dashboard', () => {
        // Check the starter cards
        cy.get('main .react-grid-item:eq(0)').should('contain', "This is your first dashboard!")
        cy.get('main .react-grid-item:eq(1) .force-graph-container canvas').should('be.visible')
        cy.get('main .react-grid-item:eq(2) button').should('have.attr', 'aria-label', 'add')
    })

    it('creates a new card', () => {
        cy.get('main .react-grid-item:eq(2) button').click()
        cy.get('main .react-grid-item:eq(2)').should('contain', 'No query specified.')
    })

    // Test each type of card
    it('creates a table report', () => {
        cy.get('main .react-grid-item:eq(2) button').click()
        cy.get('main .react-grid-item:eq(2) button[aria-label="settings"]').click()
        cy.get('main .react-grid-item:eq(2) .MuiInputLabel-root').contains("Type").next().should('contain', 'Table')
        cy.get('main .react-grid-item:eq(2) .ReactCodeMirror').type(tableCypherQuery)
        cy.get('main .react-grid-item:eq(2) button[aria-label="save"]').click()
        cy.get('main .react-grid-item:eq(2) .MuiDataGrid-columnHeaders').should('contain', 'title').and('contain', 'released')
        cy.get('main .react-grid-item:eq(2) .MuiDataGrid-virtualScroller .MuiDataGrid-row').should('have.length', 5)
        cy.get('main .react-grid-item:eq(2) .MuiDataGrid-footerContainer').should('contain', '1–5 of 8')
        cy.get('main .react-grid-item:eq(2) .MuiDataGrid-footerContainer button[aria-label="Go to next page"]').click()
        cy.get('main .react-grid-item:eq(2) .MuiDataGrid-virtualScroller .MuiDataGrid-row').should('have.length', 3)
        cy.get('main .react-grid-item:eq(2) .MuiDataGrid-footerContainer').should('contain', '6–8 of 8')
    })

    it('creates a bar chart report', () => {
        createReportOfType('Bar Chart', barChartCypherQuery)
        cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Category').next()
                                                                                   .should('contain', 'released')
        cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Value').next()
                                                                                   .should('contain', 'count')
        cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 8)
    })

    it('creates a pie chart report', () => {
        createReportOfType('Pie Chart', barChartCypherQuery)
        cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Category').next()
                                                                                   .should('contain', 'released')
        cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Value').next()
                                                                                   .should('contain', 'count')
        cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 3)
        cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g:nth-child(2) > path').should('have.length', 5)
    })

    it('creates a line chart report', () => {
        createReportOfType('Line Chart', barChartCypherQuery)
        cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('X-value').next()
                                                                                   .should('contain', 'released')
        cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Y-value').next()
                                                                                   .should('contain', 'count')
        cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 6)
        cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g:nth-child(2) > line').should('have.length', 11)
    })

    it('creates a map chart report', () => {
        createReportOfType('Map', mapChartCypherQuery)
        cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > path').should('have.length', 5)
    })

    it('creates a single value report', () => {
        createReportOfType('Single Value', barChartCypherQuery)
        cy.get('main .react-grid-item:eq(2) .MuiCardContent-root > div > div:nth-child(2) > span').contains('1,999')
    })

    it('creates a sunburst chart report', () => {
        createReportOfType('Sunburst Chart', sunburstChartCypherQuery)
        cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Path').next()
        .should('contain', 'x.path')
        cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Value').next()
                                                                                   .should('contain', 'x.value')
        cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g:nth-child(1) > path').should('have.length', 5)                                                                           
    })

    it('creates a circle packing report', () => {
        createReportOfType('Circle Packing', sunburstChartCypherQuery)
        cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Path').next()
        .should('contain', 'x.path')
        cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Value').next()
                                                                                   .should('contain', 'x.value')
        cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > circle').should('have.length', 6)                                                                           
    })

    it('creates a tree map report', () => {
        createReportOfType('Treemap', sunburstChartCypherQuery)
        cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Path').next()
        .should('contain', 'x.path')
        cy.get('main .react-grid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Value').next()
                                                                                   .should('contain', 'x.value')
        cy.get('main .react-grid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 6)                                                                           
    })

    it('creates a raw json report', () => {
        createReportOfType('Raw JSON', barChartCypherQuery)
        cy.get('main .react-grid-item:eq(2) .MuiCardContent-root textarea:nth-child(1)').should(($div) => {
            const text = $div.text()
          
            expect(text.length).to.eq(1387)
          })
    })

    it('creates a parameter select report', () => {
    cy.get('main .react-grid-item:eq(2) button').click()
    cy.get('main .react-grid-item:eq(2) button[aria-label="settings"]').click()
    cy.get('main .react-grid-item:eq(2) .MuiInputLabel-root').contains("Type").next().click()
    cy.contains('Parameter Select').click()
    cy.get('#autocomplete-label-type').type('Movie')
    cy.get('#autocomplete-label-type-option-0').click()
    cy.wait(300)
    cy.get('#autocomplete-property').type('title')
    cy.get('#autocomplete-property-option-0').click()
    cy.get('main .react-grid-item:eq(2) button[aria-label="save"]').click()
    cy.get('#autocomplete').type('The Matrix')
    cy.get('#autocomplete-option-0').click()
    })

    it('creates an iframe report', () => {
        createReportOfType('iFrame', iFrameText)
        cy.get('main .react-grid-item:eq(2) .MuiCardContent-root iframe')
    })

    it('creates a markdown report', () => {
        createReportOfType('Markdown', markdownText)
        cy.get('main .react-grid-item:eq(2) .MuiCardContent-root h1').should('have.text', 'Hello')
    })

 
    // Test card deletion

    // Test create/delete new page

    // Test load dashboard from file
    // Niels to provide file test case
    it.only('test load dashboard from file', () => {
        cy.get('#root .MuiDrawer-root .MuiIconButton-root:eq(2)').click()
        cy.get('.MuiDialog-root .MuiPaper-root .MuiDialogContent-root textarea:eq(0)').invoke('val',loadFileDashboard).trigger('change')
        cy.get('.MuiDialog-root .MuiPaper-root .MuiDialogContent-root textarea:eq(0)').type(' ')
        cy.get('.MuiDialog-root .MuiDialogContent-root .MuiButtonBase-root:eq(2)').click()
        cy.wait(500)
    })

    // Test opening existing dashboard ?
  })

function createReportOfType(type, query) {
    cy.get('main .react-grid-item:eq(2) button').click()
    cy.get('main .react-grid-item:eq(2) button[aria-label="settings"]').click()
    cy.get('main .react-grid-item:eq(2) .MuiInputLabel-root').contains("Type").next().click()
    cy.contains(type).click()
    cy.get('main .react-grid-item:eq(2) .ReactCodeMirror').type(query, {parseSpecialCharSequences: false})
    cy.get('main .react-grid-item:eq(2) button[aria-label="save"]').click()
}
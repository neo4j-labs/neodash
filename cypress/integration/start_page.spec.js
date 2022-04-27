import {tableCypherQuery, barChartCypherQuery} from "../fixtures/cypher_queries"

describe('The Dashboard Page', () => {
    beforeEach(() => {
        // Navigate to index
        cy.visit('/')
        cy.get('#form-dialog-title').should('contain', 'NeoDash - Neo4j Dashboard Builder')

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
        cy.get('main .MuiGrid-item:eq(0)').should('contain', "This is your first dashboard!")
        cy.get('main .MuiGrid-item:eq(1) .force-graph-container canvas').should('be.visible')
        cy.get('main .MuiGrid-item:eq(2) button').should('have.attr', 'aria-label', 'add')
    })

    it('creates a new card', () => {
        cy.get('main .MuiGrid-item:eq(2) button').click()
        cy.get('main .MuiGrid-item:eq(2)').should('contain', 'No query specified.')
    })

    // Test each type of card
    it('creates a table report', () => {
        cy.get('main .MuiGrid-item:eq(2) button').click()
        cy.get('main .MuiGrid-item:eq(2) button[aria-label="settings"]').click()
        cy.get('main .MuiGrid-item:eq(2) .MuiInputLabel-root').contains("Type").next().should('contain', 'Table')
        cy.get('main .MuiGrid-item:eq(2) .ReactCodeMirror').type(tableCypherQuery)
        cy.get('main .MuiGrid-item:eq(2) button[aria-label="save"]').click()
        cy.get('main .MuiGrid-item:eq(2) .MuiDataGrid-columnHeaders').should('contain', 'title').and('contain', 'released')
        cy.get('main .MuiGrid-item:eq(2) .MuiDataGrid-virtualScroller .MuiDataGrid-row').should('have.length', 5)
        cy.get('main .MuiGrid-item:eq(2) .MuiDataGrid-footerContainer').should('contain', '1–5 of 8')
        cy.get('main .MuiGrid-item:eq(2) .MuiDataGrid-footerContainer button[aria-label="Go to next page"]').click()
        cy.get('main .MuiGrid-item:eq(2) .MuiDataGrid-virtualScroller .MuiDataGrid-row').should('have.length', 3)
        cy.get('main .MuiGrid-item:eq(2) .MuiDataGrid-footerContainer').should('contain', '6–8 of 8')
    })

    it('creates a bar chart report', () => {
        createReportOfType('Bar Chart', barChartCypherQuery)
        cy.get('main .MuiGrid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Category').next()
                                                                                   .should('contain', 'released')
        cy.get('main .MuiGrid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Value').next()
                                                                                   .should('contain', 'count')
        cy.get('main .MuiGrid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 8)
    })

    it('creates a pie chart report', () => {
        createReportOfType('Pie Chart', barChartCypherQuery)
        cy.get('main .MuiGrid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Category').next()
                                                                                   .should('contain', 'released')
        cy.get('main .MuiGrid-item:eq(2) .MuiCardActions-root .MuiInputLabel-root').contains('Value').next()
                                                                                   .should('contain', 'count')
        cy.get('main .MuiGrid-item:eq(2) .MuiCardContent-root svg > g > g').should('have.length', 3)
        cy.get('main .MuiGrid-item:eq(2) .MuiCardContent-root svg > g > g:nth-child(2) > path').should('have.length', 5)
    })

    // Test card deletion

    // Test create/delete new page

    // Test load dashboard from file
    // Niels to provide file test case

    // Test opening existing dashboard ?
  })

function createReportOfType(type, query) {
    cy.get('main .MuiGrid-item:eq(2) button').click()
    cy.get('main .MuiGrid-item:eq(2) button[aria-label="settings"]').click()
    cy.get('main .MuiGrid-item:eq(2) .MuiInputLabel-root').contains("Type").next().click()
    cy.contains(type).click()
    cy.get('main .MuiGrid-item:eq(2) .ReactCodeMirror').type(query)
    cy.get('main .MuiGrid-item:eq(2) button[aria-label="save"]').click()
}
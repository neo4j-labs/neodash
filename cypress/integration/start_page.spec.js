import {defaultCypherQuery} from "../fixtures/cypher_queries"

describe('The Dashboard Page', () => {
    beforeEach(() => {
        // Navigate to index
        cy.visit('/')
        cy.get('#form-dialog-title').should('contain', 'NeoDash - Neo4j Dashboard Builder')

        // Create new dashboard
        cy.contains('New Dashboard').click()
        cy.wait(300)
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

    it('successfully initializes the dashboard', () => {
        // Check the starter cards
        cy.get('main .MuiGrid-item:eq(0)').should('contain', "This is your first dashboard!")
        cy.get('main .MuiGrid-item:eq(1) .force-graph-container canvas').should('be.visible')
        cy.get('main .MuiGrid-item:eq(2) button').should('have.attr', 'aria-label', 'add')
    })

    // Test card creation
    it('successfully creates a new card', () => {
        cy.get('main .MuiGrid-item:eq(2) button').click()
    })

    // Test each type of card

    // Test card deletion

    // Test create/delete new page

    // Test load dashboard from file
    // Niels to provide file test case

    // Test rename dashboard

    // Test opening existing dashboard ?
  })
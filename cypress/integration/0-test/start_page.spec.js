describe('The Start Page', () => {
    it('successfully loads', () => {

        // Navigate to index
        cy.visit('/')
        cy.get('#form-dialog-title').should('contain', 'NeoDash - Neo4j Dashboard Builder')

        // Create new dashboard
        cy.contains('New Dashboard').click()
        cy.wait(300)
        cy.get('#form-dialog-title').should('contain', 'Connect to Neo4j')

        // Connect to Neo4j database
        cy.get('#dbpassword').type("secret1234")
        cy.get('button').contains('Connect').click()

        // Check the starter cards
        cy.get('.card-view:eq(0)').contains("This is your first dashboard!")
        cy.get('.card-view:eq(1)').get('svg').should('be.visible')
        cy.get('main .MuiGrid-item:eq(2) button').should('have.attr', 'aria-label', 'add')
    })
  })
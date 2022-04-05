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
        cy.contains("This is your first dashboard!")
    })
  })
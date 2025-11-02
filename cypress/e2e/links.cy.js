describe('LinkShala Links', () => {
  it('should display preview link cards on landing page', () => {
    cy.visit('/')
    cy.wait(2000)
    cy.get('.cursor-pointer.group', { timeout: 10000 }).should('have.length.greaterThan', 0)
  })

  it('should show link titles', () => {
    cy.visit('/')
    cy.wait(2000)
    cy.get('.font-vintage.font-bold', { timeout: 10000 }).should('have.length.greaterThan', 0)
  })

  it('should display categories section', () => {
    cy.visit('/')
    cy.wait(2000)
    cy.contains('Explore by Category', { timeout: 10000 })
  })
})

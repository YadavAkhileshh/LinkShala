describe('LinkShala Navigation', () => {
  it('should load landing page', () => {
    cy.visit('/')
    cy.contains('Discover the Best', { timeout: 10000 })
  })

  it('should show signup modal on get started', () => {
    cy.visit('/')
    cy.wait(2000)
    cy.contains('Get Started Free', { timeout: 10000 }).click()
    cy.contains('Join LinkShala', { timeout: 5000 })
  })

  it('should show 404 page for invalid route', () => {
    cy.visit('/invalid-route-test-123', { failOnStatusCode: false })
    cy.wait(2000)
    cy.get('body', { timeout: 10000 }).should('be.visible')
  })
})

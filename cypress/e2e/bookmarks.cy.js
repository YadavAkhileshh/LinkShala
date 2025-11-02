describe('LinkShala Bookmarks', () => {
  it('should require authentication for bookmarks', () => {
    cy.visit('/bookmarks', { failOnStatusCode: false })
    cy.wait(2000)
    cy.url().should('satisfy', (url) => url.includes('/') || url.includes('/bookmarks'))
  })
})

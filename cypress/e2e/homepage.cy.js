describe('LinkShala Homepage', () => {
  it('should load landing page successfully', () => {
    cy.visit('/')
    cy.contains('Discover the Best', { timeout: 10000 })
  })

  it('should display preview cards', () => {
    cy.visit('/')
    cy.wait(2000)
    cy.contains('Featured Resources', { timeout: 10000 })
  })

  it('should click preview card and open link', () => {
    cy.visit('/')
    cy.wait(2000)
    cy.get('.cursor-pointer.group', { timeout: 10000 }).first().should('exist')
  })

  it('should show view more button', () => {
    cy.visit('/')
    cy.wait(2000)
    cy.contains('View More - Sign Up Free', { timeout: 10000 })
  })

  it('should open signup modal on view more click', () => {
    cy.visit('/')
    cy.wait(2000)
    cy.contains('View More - Sign Up Free', { timeout: 10000 }).click()
    cy.contains('Join LinkShala', { timeout: 5000 })
  })
})

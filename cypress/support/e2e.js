// Cypress support file for E2E tests
// Add custom commands and global configurations here

// Example: Custom command to login
// Cypress.Commands.add('login', (email, password) => {
//   cy.visit('/login')
//   cy.get('input[name=email]').type(email)
//   cy.get('input[name=password]').type(password)
//   cy.get('button[type=submit]').click()
// })

// Ignore uncaught exceptions (optional - useful for third-party scripts)
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  // Only for known issues like chatbase or analytics scripts
  if (err.message.includes('chatbase') || err.message.includes('gtag')) {
    return false
  }
  return true
})

// Custom Cypress commands for LinkShala

// Example: Clear bookmarks
Cypress.Commands.add('clearBookmarks', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('linkshala_bookmarks')
  })
})

// Example: Add bookmark
Cypress.Commands.add('addBookmark', (linkId) => {
  cy.window().then((win) => {
    const bookmarks = JSON.parse(win.localStorage.getItem('linkshala_bookmarks') || '[]')
    bookmarks.push(linkId)
    win.localStorage.setItem('linkshala_bookmarks', JSON.stringify(bookmarks))
  })
})

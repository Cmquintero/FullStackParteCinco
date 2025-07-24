describe('Blog app', function() {
  it('front page can be opened',  function() {
    cy.visit('http://localhost:5173')
    cy.contains('Blog')
    cy.contains('Blog app, Department of Computer Science, University of Helsinki 2023')
  })


  it('front page contains random text', function() {
    cy.visit('http://localhost:5173')
    cy.contains('wtf is this app?')
  })
})
describe('Note app', function() {

  beforeEach(function() {
    cy.visit('http://localhost:5173')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })

  it('login form can be opened', function() {
    cy.contains('log in').click()
  })
})
Blog
describe('Drupal 8 Login', function() {
  it('successfully allows a login', function() {
    cy.visit('/user/login')
    cy.get("#edit-name").type(Cypress.env("TEST_USER"))
    cy.get("#edit-pass").type(Cypress.env("TEST_PASSWORD")).wait(4000)
    // cy.get("#edit-submit").click()
    cy.get("#user-login-form").submit()
    cy.get("#toolbar-item-user")
  })
})
describe('Drupal 8', function() {
  this.beforeEach(() => {
    cy.visit('/user/login')
    cy.get("#edit-name").type(Cypress.env("TEST_USER"))
    cy.get("#edit-pass").type(Cypress.env("TEST_PASSWORD")).wait(4000)
    cy.get("#edit-submit").click()
  })

  this.afterEach(() => {
    cy.get('#header a[href^="/user/logout"]').click()
    cy.url().should('eq', Cypress.config("baseUrl")+"/")
  })

  it('allows a user to login', function(){
    cy.get("#toolbar-item-user").should('exist')
  })

  it('allows creation of a content item', function() {
    cy.visit('/node/add/page')
    cy.get("h1.page-title").should('have.text', "Create Basic page")
    cy.get("#edit-title-0-value").type("Test page 123")
    cy.get("#edit-field-summary-0-value").type("Test summary")
    cy.get("input.form-submit[value='Save and publish']").click()
    cy.get("div.messages").should('have.text', '\n                  Status message\n                    Basic page Test page 123 has been created.\n            ')
    cy.contains("a","Delete").click();
    cy.get("input#edit-submit").click();
    cy.get("div.messages").should('have.text', '\n                  Status message\n                    The Basic page Test page 123 has been deleted.\n            ')
  })

  it('allows editing of a content item', function() {
    cy.visit('/node/add/document')
    cy.get("h1.page-title").should('have.text', "Create Document")
    cy.get("#edit-title-0-value").type('My Test Document')
    cy.get("#edit-field-doc-id-type").select('114')
    cy.get("#edit-field-summary160-0-value").type('my document summary is here.')
   	cy.get("input.form-submit[value='Save and publish']").click()
    cy.get("div.messages").should('have.text', '\n                  Status message\n                    Document My Test Document has been created.\n            ')
    cy.contains("a","Delete").click();
    cy.get("input#edit-submit").click();
    cy.get("div.messages").should('have.text', '\n                  Status message\n                    The Document My Test Document has been deleted.\n            ')
  })

})
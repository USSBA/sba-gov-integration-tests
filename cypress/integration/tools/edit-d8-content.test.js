describe('Drupal 8 Edit Content', function() {
  it('successfully allows a content node to be edited', function() {
    cy.visit('/user/login')
    cy.get("#edit-name").type(Cypress.env("TEST_USER"))
    cy.get("#edit-pass").type(Cypress.env("TEST_PASSWORD")).wait(4000)
    cy.get("#user-login-form").submit()
    // navigate "Document" to document page
    cy.visit('/node/add/document')
    cy.get("h1.page-title").should('have.text', "Create Document")
    // add a "Title" value
    cy.get("#edit-title-0-value").type('My Test Document')
    // select "Type of document", "114" which is "Policy Guidance"
    cy.get("#edit-field-doc-id-type").select('114')
     // add a "Summary" value
    cy.get("#edit-field-summary160-0-value").type('my document summary is here.')
    // submit form
   	cy.get("input.form-submit[value='Save and publish']").click()
    // delete node
    cy.get("div.messages").should('have.text', '\n                  Status message\n                    Document My Test Document has been created.\n            ')
    cy.contains("a","Delete").click();
    cy.get("input#edit-submit").click();
    cy.get("div.messages").should('have.text', '\n                  Status message\n                    The Document My Test Document has been deleted.\n            ')
  })
})

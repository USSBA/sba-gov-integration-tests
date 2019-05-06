describe("Footer", function () {
  it("has GovDelivery form", function() {
    cy.visit("/")
    cy.get("[data-testid=newsletter-form]").parent().parent().should('have.id', 'sba-footer')
  })

  it("Subscribe button in GovDelivery redirects to /updates", function() {
    // the elements in /updates page is tested in govdelivery.test.js file
    const baseUrl = Cypress.config("baseUrl")
    cy.visit("/")
    cy.get("[data-testid=newsletter-form]").contains("Subscribe").click()
    cy.url().should('include', '/updates')
    cy.url().should('eq', `${baseUrl}/updates`)
  })
})
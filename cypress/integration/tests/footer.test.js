describe("Footer", function () {
  describe("GovDelivery form", function() {

    it("renders correct elements", function() {
      cy.visit("/")
      cy.get("#sba-footer").find("[data-testid=newsletter-form]")
        .should("have.length", 1)
        .parent().parent()
        .should('have.id', 'sba-footer')
      cy.get("#sba-footer").find("[data-testid=newsletter-form]")
        .contains("p", "Sign up for SBA email updates")
      cy.get("#sba-footer").find("[data-testid=newsletter-form]")
        .should("not.have.id", "div#newsletter-email-address-container")
      cy.get("#sba-footer").find("[data-testid=newsletter-form]")
        .should("not.have.id", "div#newsletter-zip-code-container")
    })

    it("Subscribe button redirects to /updates", function() {
      // elements and functionalities in /updates page is tested in govdelivery.test.js file
      const baseUrl = Cypress.config("baseUrl")
      cy.visit("/")
      cy.get("#sba-footer").find("[data-testid=newsletter-form]")
        .contains("Subscribe")
        .should('have.attr', 'href', '/updates')
        .click()
      cy.url().should('eq', `${baseUrl}/updates`)
    })
  })
})
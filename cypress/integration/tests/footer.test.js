describe("Footer", function () {
  describe("GovDelivery form", function() {

    it("renders correct elements", function() {
      cy.visit("/")
      cy.get("[data-testid=newsletter-form]").parent().parent().should('have.id', 'sba-footer')
      cy.get("[data-testid=newsletter-form]")
        .should("have.length", 1)
      cy.get("[data-testid=newsletter-form]").contains("p", "Sign up for SBA email updates").should("exist")
    })

    it("doesn't render e-mail and zip code textboxes", function() {
      cy.visit("/")
      cy.get("#newsletter-email-address-container").should("not.exist")
      cy.get("#newsletter-zip-code-container").should("not.exist")
    })

    it("Subscribe button redirects to /updates", function() {
      // elements and functionalities in /updates page is tested in govdelivery.test.js file
      const baseUrl = Cypress.config("baseUrl")
      cy.visit("/")
      cy.get("[data-testid=newsletter-form]").contains("Subscribe").click()
      cy.url().should('include', '/updates')
      cy.url().should('eq', `${baseUrl}/updates`)
    })
  })
})
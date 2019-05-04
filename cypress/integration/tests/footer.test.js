describe("Footer", function () {
  describe("GovDelivery form", function() {

    it("renders correct elements", function() {
      cy.visit("/")
      cy.get("#sba-footer").find("[data-testid=newsletter-form]").as("form")
        .should("have.length", 1)
        .parent().parent()
        .should('have.id', 'sba-footer')
      cy.get("@form")
        .contains("p", "Sign up for SBA email updates")
      cy.get("@form")
        .should("not.have.id", "div#newsletter-email-address-container")
      cy.get("@form")
        .should("not.have.id", "div#newsletter-zip-code-container")
    })

    it("Subscribe button redirects to /updates", function() {
      // elements and functionalities in /updates page is tested in govdelivery.test.js file
      const baseUrl = Cypress.config("baseUrl")
      cy.visit("/")
      cy.get("#sba-footer").find("[data-testid=newsletter-form]")
        .contains("[data-testid=button]", "Subscribe")
        .should('have.attr', 'href', '/updates')
        .click()
      cy.url().should('eq', `${baseUrl}/updates`)
    })

    it("title and button is in Spanish when langCode is es", function() {
      const baseUrl = Cypress.config("baseUrl")
      cy.visit("/?lang=es")
      cy.get("#sba-footer").find("[data-testid=newsletter-form]").as("form")
        .contains("[data-testid=newsletter-footer-title]", "Reciba las noticias de SBA por email")
      cy.get("@form")
        .contains("[data-testid=button]", "Suscríbase")
    })
  })
})
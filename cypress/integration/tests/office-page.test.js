describe("District Office Page", function () {
    beforeEach(function(){
        cy.request("GET", '/api/content/sbaOffices.json')
        .then((result) => {
            cy.wrap(result.body[0]).as("validOffice")
        })
    })

    it("loads and pulls an office for content", function () {
        cy.server()
        cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
        cy.visit(`/offices/district/${this.validOffice.id}`)
        cy.wait("@OfficeRequest")
        cy.contains(this.validOffice.title)
    })

    it("displays the newsletter signup", function () {
        cy.server()
        cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
        cy.visit(`/offices/district/${this.validOffice.id}`)
        cy.wait("@OfficeRequest")

        cy.get("[data-testid='office-newsletter']").should("contain", "Sign up for national and local SBA newsletters")
        cy.get("[data-testid=newsletter-form]").as("form")
            .should("have.length", 2)
            .find("[data-testid=button]")
            .contains("Subscribe")
        cy.get("@form")
            .find("[data-testid=caption-text]")
            .contains("Please enter your zip code to get information about business news and events in your area.")
        cy.get("@form")
            .find("[data-testid=newsletter-email-address-container]").within(() => {
        cy.get("[data-testid=newsletter-email-address-label]").contains("Email address")
            .get("[data-testid=newsletter-email-address]")
        })
        cy.get("@form")
            .find("[data-testid=newsletter-zip-code-container]").within(() => {
        cy.get("[data-testid=newsletter-zip-code-label]").contains("Zip code")
            .get("[data-testid=newsletter-zip-code]")
      })
    })

    it("Subscribe button is enabled when e-mail address is valid and zip code field is empty", function() {
        cy.server()
        cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
        cy.visit(`/offices/district/${this.validOffice.id}`)
        cy.wait("@OfficeRequest")

        cy.get("[data-testid=newsletter-email-address]")
          .type("test4@test4.com")
        cy.get("[data-testid=newsletter-form]")
          .find("[data-testid=button]").first()
          .should("not.be.disabled")
      })
    
      it("shows error message and disables Subscribe button when e-mail address is invalid", function() {
        cy.server()
        cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
        cy.visit(`/offices/district/${this.validOffice.id}`)
        cy.wait("@OfficeRequest")

        cy.get("[data-testid=newsletter-email-address]").type("test@.com")
        cy.get("[data-testid=newsletter-zip-code]").type("12345")
        cy.get("[data-testid=newsletter-form]").contains("Subscribe").first().should("be.disabled")
        cy.get("[data-testid=newsletter-email-address-error]").contains("Enter a valid email address")
      })
    
      it("shows error message and disables Subscribe button when e-mail address is valid, but zip code is incomplete", function() {
        cy.server()
        cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
        cy.visit(`/offices/district/${this.validOffice.id}`)
        cy.wait("@OfficeRequest")
        
        cy.get("[data-testid=newsletter-zip-code]").type("3456")
        cy.get("[data-testid=newsletter-email-address]").type("test4@test4.com")
        cy.get("[data-testid=newsletter-form]").contains("Subscribe").first().should("be.disabled")
        cy.get("[data-testid=newsletter-zip-code-error]").contains("Enter a valid zip code")
      })

    it("displays a 404 for a non existing office page", function() {
        cy.visit("/offices/district/1", { failOnStatusCode: false }) // not a valid office
        cy.get("[data-cy='error-page-title']").should("have.text", '404')
        cy.get("[data-cy='error-page-message']").should("contain", 'local assistance page')
    })
})
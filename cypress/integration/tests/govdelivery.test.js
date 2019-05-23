describe("Newsletter Form", function () {

  it("is in correct path and displays required elements", function() {
    cy.visit("/updates")
    // there should be two newsletter forms found when visiting "/updates" path
    // one on the program page, another on the footer
    cy.get("[data-testid=newsletter-form]").as("form")
      .should("have.length", 2)
      .find("[data-testid=button]")
      .contains("Subscribe")
    cy.get("@form")
      .find("[data-testid=caption-text]")
      .contains("Please enter your zip code to receive local news.")
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
    cy.visit("/updates")
    cy.get("[data-testid=newsletter-email-address]")
      .type("test4@test4.com")
    cy.get("[data-testid=newsletter-form]")
      .find("[data-testid=button]").first()
      .should("not.be.disabled")
  })

  it("shows error message and disables Subscribe button when e-mail address is invalid", function() {
    cy.visit("/updates")
    cy.get("[data-testid=newsletter-email-address]").type("test@.com")
    cy.get("[data-testid=newsletter-zip-code]").type("12345")
    cy.get("[data-testid=newsletter-form]").contains("Subscribe").first().should("be.disabled")
    cy.get("[data-testid=newsletter-email-address-error]").contains("Enter a valid email address")
  })

  it("shows error message and disables Subscribe button when e-mail address is valid, but zip code is incomplete", function() {
    cy.visit("/updates")
    cy.get("[data-testid=newsletter-zip-code]").type("3456")
    cy.get("[data-testid=newsletter-email-address]").type("test4@test4.com")
    cy.get("[data-testid=newsletter-form]").contains("Subscribe").first().should("be.disabled")
    cy.get("[data-testid=newsletter-zip-code-error]").contains("Enter a valid zip code")
  })

  it("Subscribe button is enabled and shows successful message with its elements when valid inputs have been entered and button is clicked", function() {
    // captures low level XHR response
    cy.server()
    cy.route({
      method: "POST",
      response: {},
      status: "201",
      url: "/actions/misc/gov-delivery"
    }).as("getUpdates")
    // cy.route("POST", "/actions/misc/gov-delivery").as("getUpdates")
    cy.visit("/updates")
    cy.get("[data-testid=newsletter-email-address]").type("test@test.com")
    cy.get("[data-testid=newsletter-zip-code]").type("12345")
    cy.get("[data-testid=newsletter-form]").as("form")
      .contains("[data-testid=button]", "Subscribe").first()
      .should("not.be.disabled")
      .click()
    cy.wait("@getUpdates").its("status").should("eq", 201)
    cy.get("@form")
      .find("[data-testid=newsletter-success-icon]")
      .should("have.class", "fa fa-check-circle")
    cy.get("@form")
      .contains("[data-testid=newsletter-success-title]", "You're all done here!")
    cy.get("@form")
      .contains("[data-testid=newsletter-success-message]", "You're all signed up for the SBA newsletter.")
    cy.get("@form")
      .contains("[data-testid=newsletter-refresh-link]", "Refresh")
  })

  it("Renders fail message with its elements when connection fails", function() {
    cy.server()
    cy.route({
      method: "POST",
      response: {},
      status: "500",
      url: "/actions/misc/gov-delivery"
    }).as("getUpdates")
    cy.visit("/updates")
    cy.get("[data-testid=newsletter-email-address]").type("test2@test2.com")
    cy.get("[data-testid=newsletter-zip-code]").type("23456")
    cy.get("[data-testid=newsletter-form]").as("form")
      .contains("[data-testid=button]", "Subscribe").first()
      .should("not.be.disabled")
      .click()
    cy.wait("@getUpdates")
    cy.get("@form")
      .find("[data-testid=newsletter-error-icon]")
      .should("have.class", "fa fa-times-circle")
    cy.get("@form")
      .contains("[data-testid=newsletter-error-title]", "Sorry, we're having issues")
    cy.get("@form")
      .contains("[data-testid=newsletter-error-message]", "We are unable to subscribe you to the SBA newsletter. Please try again later.")
    cy.get("@form")
      .contains("[data-testid=newsletter-refresh-link]", "Refresh")
  })

  it("Refresh link resets the form", function() {
    cy.server()
    cy.route({
      method: "POST",
      response: {},
      status: "201",
      url: "/actions/misc/gov-delivery"
    }).as("getUpdates")
    // cy.route("POST", "/actions/misc/gov-delivery").as("getUpdates")
    cy.visit("/updates")
    cy.get("[data-testid=newsletter-email-address]").type("test3@test3.com")
    cy.get("[data-testid=newsletter-zip-code]").type("34567")
    cy.get("[data-testid=newsletter-form]").as("form")
      .contains("[data-testid=button]", "Subscribe").first()
      .click()
    cy.wait("@getUpdates")
    cy.get("@form")
      .contains("[data-testid=newsletter-refresh-link]", "Refresh")
      .click()
    cy.get("[data-testid=newsletter-email-address-container]").within(() => {
      cy.get("[data-testid=newsletter-email-address-label]").contains("Email address")
      .get("[data-testid=newsletter-email-address]")
    })
    cy.get("#newsletter-zip-code-container").within(() => {
      cy.get("[data-testid=newsletter-zip-code-label]").contains("Zip code")
      .get("[data-testid=newsletter-zip-code]")
    })
  })
})
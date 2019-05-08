describe("Newsletter Form", function () {

  it("is in correct path and displays required elements", function() {
    cy.visit("/updates")
    // there should be two newsletter forms found when visiting "/updates" path
    // one on the program page, another on the footer
    cy.get("[data-testid=newsletter-form]").as("form")
      .should("have.length", 2)
      .contains("button", "Subscribe")
    cy.get("@form")
      .find("[data-testid=caption-text]")
      .contains("Please enter your zip code to receive local news.")
    cy.get("@form")
      .find("#newsletter-email-address-container").within(() => {
        cy.get("label").contains("Email address")
        cy.get("input#newsletter-email-address").should("exist")
      })
    cy.get("@form")
      .find("#newsletter-zip-code-container").within(() => {
        cy.get("label").contains("Zip code")
        cy.get("input#newsletter-zip-code").should("exist")
      })
  })

  it("Subscribe button is enabled when e-mail address is valid and zip code field is empty", function() {
    cy.visit("/updates")
    cy.get("input#newsletter-email-address")
      .type("test4@test4.com")
    cy.get("[data-testid=newsletter-form]")
      .contains("Subscribe").first()
      .should("not.be.disabled")
  })

  it("shows error message and disables Subscribe button when e-mail address is invalid", function() {
    cy.visit("/updates")
    cy.get("input#newsletter-email-address").type("test@.com")
    cy.get("input#newsletter-zip-code").type("12345")
    cy.get("[data-testid=newsletter-form]").contains("Subscribe").first().should("be.disabled")
    cy.get("p#newsletter-email-address-error").contains("Enter a valid email address")
  })

  it("shows error message and disables Subscribe button when e-mail address is valid, but zip code is incomplete", function() {
    cy.visit("/updates")
    cy.get("input#newsletter-zip-code").type("3456")
    cy.get("input#newsletter-email-address").type("test4@test4.com")
    cy.get("[data-testid=newsletter-form]").contains("Subscribe").first().should("be.disabled")
    cy.get("p#newsletter-zip-code-error").contains("Enter a valid zip code")
  })

  it("Subscribe button is enabled and shows successful message with its elements when valid inputs have been entered and button is clicked", function() {
    // captures low level XHR response
    cy.server()
    cy.route("POST", "/actions/misc/gov-delivery").as("getUpdates")
    cy.visit("/updates")
    cy.get("input#newsletter-email-address").type("test@test.com")
    cy.get("input#newsletter-zip-code").type("12345")
    cy.get("[data-testid=newsletter-form]").as("form")
      .contains("Subscribe").first()
      .should("not.be.disabled")
      .click()
    cy.wait("@getUpdates").its("status").should("eq", 201)
    cy.get("@form").find("i").should("have.class", "fa fa-check-circle")
    cy.get("@form").contains("h3", "You're all done here!")
    cy.get("@form").contains("p", "You're all signed up for the SBA newsletter.")
    cy.get("@form").contains("Refresh")
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
    cy.get("input#newsletter-email-address").type("test2@test2.com")
    cy.get("input#newsletter-zip-code").type("23456")
    cy.get("[data-testid=newsletter-form]").as("form")
      .contains("Subscribe").first()
      .should("not.be.disabled")
      .click()
    cy.wait("@getUpdates")
    cy.get("@form").find("i").should("have.class", "fa fa-times-circle")
    cy.get("@form")
      .contains("h3", "Sorry, we're having issues")
    cy.get("@form")
      .contains("p", "We are unable to subscribe you to the SBA newsletter. Please try again later.")
    cy.get("@form").contains("Refresh").should("exist")
  })

  it.only("Refresh link resets the form", function() {
    cy.server()
    cy.route("POST", "/actions/misc/gov-delivery").as("getUpdates")
    cy.visit("/updates")
    cy.get("input#newsletter-email-address").type("test3@test3.com")
    cy.get("input#newsletter-zip-code").type("34567")
    cy.get("[data-testid=newsletter-form]").as("form")
      .contains("Subscribe")
      .first()
      .click()
    cy.wait("@getUpdates")
    cy.get("@form").contains("Refresh").click()
    cy.get("#newsletter-email-address-container").within(() => {
      cy.get("label").contains("Email address")
      cy.get("input#newsletter-email-address").should("exist")
    })
    cy.get("#newsletter-zip-code-container").within(() => {
      cy.get("label").contains("Zip code")
      cy.get("input#newsletter-zip-code").should("exist")
    })
  })
})
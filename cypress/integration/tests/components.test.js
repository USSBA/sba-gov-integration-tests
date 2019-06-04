describe("Component", function () {
    describe("exit modal", function () {

        it("displays with accessible features", function () {
            cy.server()
            cy.route("GET", "/api/content/6134.json").as("HomepageContent")
            cy.visit("/")
            cy.wait("@HomepageContent")
            cy.get("[alt='SBA Facebook page']")
                .click()
            cy.contains("You're leaving the Small Business Administration website.")
            cy.get("[data-cy='close button']")
                .should('have.attr', "aria-label", "Close this modal.")
            cy.get('button').contains("CONTINUE")
            cy.get('button').contains("CANCEL")
        })

        it("closes with the escape button", function () {
            cy.server()
            cy.route("GET", "/api/content/6134.json").as("HomepageContent")
            cy.visit("/")
            cy.wait("@HomepageContent")
            cy.get("[alt='SBA Facebook page']")
                .click()
            cy.contains("You're leaving the Small Business Administration website.")
                .type('{esc}')
            cy.contains("You're leaving the Small Business Administration website.").should("not.exist")
        })

        it("closes when the cancel button is activated", function () {
            cy.server()
            cy.route("GET", "/api/content/6134.json").as("HomepageContent")
            cy.visit("/")
            cy.wait("@HomepageContent")
            cy.get("[alt='SBA Facebook page']")
                .click()
            cy.contains('CANCEL')
                .click()
            cy.contains("You're leaving the Small Business Administration website.").should("not.exist")
        })
    })
})

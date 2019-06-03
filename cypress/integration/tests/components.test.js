describe("Component", function () {
    describe("exit modal", function () {
        beforeEach(function () {
            cy.server()
            cy.fixture("basic-page/links.json").as("LinkPage")
            cy.route("GET", "/api/content/5.json", "@LinkPage").as("PageRequest")
        })
    
        it("displays when there is a link to an external site", function () {
            cy.visit('/business-guide/launch-your-business/choose-your-business-name')
            cy.wait("@PageRequest")
            cy.contains("External non-.gov link")
              .and('have.class', 'external-link-marker')
              .click()
            // maybe need a better way to identify the modal?
            cy.contains("You're leaving the Small Business Administration website.")
        })
    
        it("does not display when there is a link to a .gov site", function () {
            cy.visit('/business-guide/launch-your-business/choose-your-business-name')
            cy.wait("@PageRequest")
            cy.contains("External .gov link")
              .and('not.have.class', 'external-link-marker')
              .click()
            // maybe need a better way to identify the modal?
            cy.contains("You're leaving the Small Business Administration website.").should('not.exist')
        })
    
        it("does not display when the link is a relative link", function () {
          cy.visit('/business-guide/launch-your-business/choose-your-business-name')
          cy.wait("@PageRequest")
          cy.contains("Internal relative link")
            .and('not.have.class', 'external-link-marker')
            .click()
          // maybe need a better way to identify the modal?
          cy.contains("You're leaving the Small Business Administration website.").should('not.exist')    })
      })
})

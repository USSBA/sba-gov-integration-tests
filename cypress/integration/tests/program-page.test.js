describe("Program Page", function () {
    beforeEach(function () {
        cy.server()
        cy.fixture("program-page/child-menu-page.json").as("ChildMenuProgramPage")
        cy.fixture("program-page/child-menu-siteMap.json").as("SiteMap")
        cy.route("GET", "/api/content/node/**", "@ChildMenuProgramPage")
        cy.route("GET", "/api/content/search/siteMap.json", "@SiteMap")
    })
    describe("child page menu", function () {
        it("displays on the page with site menu children", function () {
            const expectedTitle = "Test Child Page 2"
            const expectedSubtitle = "Test Page 2 Summary"
            const expectedLink = "/partners/lenders/test2"

            cy.visit("/partners/lenders")
            cy.get('[data-testid="card"]').eq(1).as("Card2")
            cy.get("@Card2").find('[data-testid="card image"]').should("not.exist")
            cy.get("@Card2").find('[data-testid="card title"]').contains(expectedTitle).as("CardTitle")
            cy.get("@CardTitle").should('have.attr', 'href', expectedLink)
            cy.get("@Card2").find('[data-testid="card subtitle text"]').contains(expectedSubtitle)
            cy.get("@Card2").find('[data-testid="card link"]').as("CardLink")
            cy.get("@CardLink").contains("Learn more")
            cy.get("@CardLink").should('have.attr', 'href', expectedLink)
        })

        it("displays all children in the collection", function () {
            const expectedChildren = 2
            cy.visit("/partners/lenders")
            cy.get('[data-testid="card"]').should('have.length', expectedChildren)
        })
    })
})
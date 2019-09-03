describe("Office Page", function () {
    beforeEach(function () {
        cy.fixture("office/6386.json").as("MockOffice")
    })
    describe("Hero section tests", function () {
        it("Shows the hero", function () {
            cy.server()
            this.MockOffice.title = "My Test Office"
            cy.route("GET", "/api/content/6386.json", this.MockOffice).as("OfficeRequest")
            cy.visit("/offices/district/6386")
            cy.wait("@OfficeRequest")
        })
    })
})
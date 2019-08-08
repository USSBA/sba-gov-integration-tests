describe("District Office Page", function () {
    before(function(){
        cy.request("GET", '/api/content/sbaOffices.json')
        .then((result) => {
            cy.wrap(result.body[0]).as("validOffice")
        })
    })

    it("loads and pulls an office for content", function () {
        cy.server()
        cy.route("GET", `/api/content/${this.validOffice.id}`).as("OfficeRequest")
        cy.visit(`/offices/district/${this.validOffice.id}`)
        cy.wait("@OfficeRequest")
        cy.contains(this.validOffice.title)
    })
})
describe("Events Find Page", function () {
    it('should load and have a title', function () {
        cy.visit("/events/find")
        cy.get("h3").should("have.text", "events find")
        cy.get("head > title").should("have.text", "Small Business Administration")
    })
})
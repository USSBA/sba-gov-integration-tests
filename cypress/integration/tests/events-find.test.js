describe("Events Find Page", function () {
    it('should load and have a title', function () {
        cy.visit("/events/find")
        cy.get("head > title").should("have.text", "Small Business Administration")
    })

    it("should have a labeled keyword field", function(){
        cy.visit("/events/find")
        cy.get("[data-cy='keyword search']").as("EventKeyword")
        cy.get("@EventKeyword").should("exist")
        cy.get("@EventKeyword").parent().siblings().get('label').should("have.text", "Search")
    })

    it("takes a string of text as a keyword", function(){
        const expectedKeyword = "testkeyword"
        cy.visit("/events/find")
        cy.get("[data-cy='keyword search']").as("EventKeyword")
        cy.get("button.button").as("SubmitButton")
        cy.get("@EventKeyword").type(expectedKeyword)
        cy.get("@SubmitButton").click()
        cy.get("@EventKeyword").invoke("val").should("equal", expectedKeyword)
        cy.url().should("include", `q=${expectedKeyword}`)
    })
})
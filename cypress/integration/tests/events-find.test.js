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
        // TODO: replace when changed from office
        cy.get('#office-primary-search-bar-title').should("have.text", "Find events")
        cy.get("head > title").should("have.text", "Small Business Administration")
    })

    it('should have a submit button', function() {
        cy.visit("/events/find")
        // TODO: replace when changed from office
        cy.get('#office-primary-search-bar-search-button').should('exist')
    })

    it('should have a labeled zip code field', function(){
        cy.visit("/events/find")
        cy.get("[data-cy='zip']").as("ZipInput")
        cy.get("@ZipInput").should("exist")
        cy.get("@ZipInput").parent().siblings("label").as("ZipLabel")
        cy.get("@ZipLabel").should("have.text", "Near")
    })

    it('should allow valid zip codes to be entered', function(){
        cy.visit("/events/find")
        cy.get("[data-cy='zip']").as("ZipInput")
        cy.get("@ZipInput").type("99999")
        // TODO: replace when changed from office
        cy.get('#office-primary-search-bar-search-button').click();
        cy.get("@ZipInput").invoke("val").should("eq","99999")
    })

    it('should display an error for non-numeric zip codes', function(){
        cy.visit("/events/find")
        cy.get("[data-cy='zip']").as("ZipInput")
        cy.get("@ZipInput").type("abcde")
        // TODO: replace when changed from office
        cy.get('#office-primary-search-bar-search-button').click();
        cy.get('#zip-error').should("exist")
    })
})
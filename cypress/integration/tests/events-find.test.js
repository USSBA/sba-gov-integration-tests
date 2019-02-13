describe("Events Find Page", function () {
    it('should load and have a title', function () {
        cy.visit("/events/find")
        cy.get("head > title").should("have.text", "Small Business Administration")
    })

    it("should have a labeled keyword field", function(){
        cy.visit("/events/find")
        cy.get("[data-cy='keyword search']").as("EventKeyword")
        cy.get("@EventKeyword").should("exist")
        cy.get('label[for="keyword-search"]').should("have.text", "Search")
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
        cy.get('#events-primary-search-bar-title').should("have.text", "Find events")
        cy.get("head > title").should("have.text", "Small Business Administration")
    })

    it('should have a submit button', function() {
        cy.visit("/events/find")
        cy.get('#events-primary-search-bar-search-button').should('exist')
    })

    it('should have a labeled zip code field', function(){
        cy.visit("/events/find")
        cy.get("[data-cy='zip']").as("ZipInput")
        cy.get("@ZipInput").should("exist")
        cy.get("@ZipInput").parent().siblings("label").as("ZipLabel")
        cy.get('label[for="zip"]').should("have.text", "Near")
    })

    it('should allow valid zip codes to be entered', function(){
        cy.visit("/events/find")
        cy.get("[data-cy='zip']").as("ZipInput")
        cy.get("@ZipInput").type("99999")
        cy.get('#events-primary-search-bar-search-button').click();
        cy.get("@ZipInput").invoke("val").should("eq","99999")
    })

    it('should display an error for non-numeric zip codes', function(){
        cy.visit("/events/find")
        cy.get("[data-cy='zip']").as("ZipInput")
        cy.get("@ZipInput").type("abcde")
        cy.get('#events-primary-search-bar-search-button').click();
        cy.get('#zip-error').should("exist")
    })

    it("takes a number as zip code", function(){
        const expectedZip = "12345"
        cy.visit("/events/find")
        cy.get("[data-cy='zip']").as("ZipInput")
        cy.get("button.button").as("SubmitButton")
        cy.get("@ZipInput").type(expectedZip)
        cy.get("@SubmitButton").click()
        cy.get("@ZipInput").invoke("val").should("equal", expectedZip)
        cy.url().should("include", `address=${expectedZip}`)
    })
})
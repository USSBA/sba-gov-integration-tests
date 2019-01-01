describe("Local Assistance Find", function(){

    it("has fields for searching offices", function(){
        cy.visit("/local-assistance/find")
        expect(cy.get("input#search")).to.exist
        expect(cy.get("input#zip")).to.exist
        expect(cy.get("#officetype-select")).to.exist
        expect(cy.get("button#office-primary-search-bar-search-button")).to.exist
        expect(cy.get("button").contains("Search")).to.exist
    })

    it("can search for an office by keyword", function() {
        cy.server()
        cy.route("GET","/api/content/offices.json**").as("OfficeSearch")
        cy.visit("/local-assistance/find")
        cy.get("input#search").type("district")
        cy.get("button").contains("Search").click();
        cy.wait("@OfficeSearch")
        expect(cy.get("#office-results").as("Results")).to.exist
        // Claims it has 5 results
        expect(cy.get("@Results").contains("Results 1 - 5")).to.exist
        // Actually has 5 results
        expect(cy.get("a.card-layout").eq(4)).to.exist
    })

    it("can search for an office by zip code", function(){
        cy.server()
        cy.route("GET","/api/content/offices.json**").as("OfficeSearch")
        cy.visit("/local-assistance/find")
        cy.get("input#zip").type("20024")
        cy.get("button").contains("Search").click();
        cy.wait("@OfficeSearch")
        expect(cy.get("#office-results").as("Results")).to.exist
        // Claims it has 5 results
        expect(cy.get("@Results").contains("Results 1 - 5")).to.exist
        // Actually has 5 results
        expect(cy.get("a.card-layout").eq(4)).to.exist
    })


})
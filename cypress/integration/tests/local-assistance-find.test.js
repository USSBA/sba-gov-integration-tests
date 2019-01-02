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

    it("can search for offices by office type", function(){
        cy.server()
        cy.route("GET","/api/content/offices.json**").as("OfficeSearch")
        cy.visit("/local-assistance/find")
        cy.get("#officetype-select").click()
        cy.get("#officetype-select").contains("SBA District Office").click();
        cy.get("button").contains("Search").click();
        cy.wait("@OfficeSearch")
        expect(cy.get("#office-results").as("Results")).to.exist
        // Claims it has 5 results
        expect(cy.get("@Results").contains("Results 1 - 5")).to.exist
        // Actually has 5 results
        expect(cy.get("a.card-layout").eq(4)).to.exist
    })

    it("displays office details in search results", function(){
        cy.visit("/local-assistance/find/?type=SBA%20District%20Office&q=SBA&pageNumber=1")
        cy.get("#office-results").within((results => {
           expect(cy.get(".search-info-panel").contains("Results 1 - 5")).to.exist
           expect(cy.get("#office-result-container-result-0")).to.exist
           expect(cy.get("#office-miles-result-0")).to.exist
           expect(cy.get("#office-title-result-0")).to.exist
           expect(cy.get("#office-type-result-0")).to.exist
        }))
    })

    it("paginates through search results", function(){
        cy.server()
        cy.route("GET","/api/content/offices.json**").as("OfficeSearch")
        cy.visit("/local-assistance/find/?pageNumber=1&address=20024")
        cy.wait("@OfficeSearch")
        expect(cy.get(".paginator").as("Pagination")).to.exist
        expect(cy.get("@Pagination").contains("Showing 1 - 5")).to.exist
        expect(cy.get("@Pagination").get("i.fa-chevron-left")).to.exist
        expect(cy.get("@Pagination").get("i.fa-chevron-right")).to.exist

        // Forward pagination
        cy.get("@Pagination").within(($pagination) => {
            cy.get("i.fa-chevron-right").click()
        })
        expect(cy.get("@Pagination").contains("Showing 6 - 10")).to.exist

        // Backwards pagination
        cy.get("@Pagination").within(($pagination) => {
            cy.get("i.fa-chevron-left").click()
        })
        expect(cy.get("@Pagination").contains("Showing 1 - 5")).to.exist
    })

})
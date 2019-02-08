describe("Local Assistance Find", function(){

    it("has fields for searching offices", function(){
        cy.visit("/local-assistance/find")
        expect(cy.get("input#search")).to.exist
        expect(cy.get("input#zip")).to.exist
        expect(cy.get("#officetype-select")).to.exist
        expect(cy.get("button#office-primary-search-bar-search-button")).to.exist
        expect(cy.get("[data-cy='search button']")).to.exist
    })

    it("can search for an office by keyword", function() {
        cy.server()
        cy.route("GET","/api/content/offices.json**").as("OfficeSearch")
        cy.visit("/local-assistance/find")
        cy.get("input#search").type("district")
        cy.get("[data-cy='search button']").click()
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
        cy.get("[data-cy='search button']").click()
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
        cy.get("[data-cy='search button']").click()
        cy.wait("@OfficeSearch")
        expect(cy.get("#office-results").as("Results")).to.exist
        // Claims it has 5 results
        expect(cy.get("@Results").contains("Results 1 - 5")).to.exist
        // Actually has 5 results
        expect(cy.get("a.card-layout").eq(4)).to.exist
    })

    it("displays office info in search results", function(){
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

    it("shows office detail view when a result is selected", () => {
        cy.server()
        cy.fixture("local-assistance/search-results.json").as("SearchResult")
        cy.route("GET", "/api/content/offices.json**", "@SearchResult").as("OfficeSearch")
        cy.visit("/local-assistance/find")
        cy.get("[data-cy='search button']").click()
        cy.get("#office-results")
        cy.get("[data-cy='open detail']").eq(0).click()
        expect(cy.get("#office-detail")).to.exist
    })

    it("displays all office details when they exist", () => {
        cy.server()
        cy.fixture("local-assistance/search-results.json").as("SearchResult")
        cy.route("GET", "/api/content/offices.json**", "@SearchResult").as("OfficeSearch")
        cy.visit("/local-assistance/find")
        cy.get("[data-cy='search button']").eq(0).click()
        cy.get("[data-cy='open detail']").eq(0).click()

        expect(cy.get("#office-detail")).to.exist
        cy.get("#office-miles").should("have.text", "0.8 miles")
        cy.get(".office-title").should("have.text", "Office of the Chief Human Capital Officer - MAIN")
        cy.get("#office-type").should("have.text", "SBA Headquarters Office")
        cy.get("[data-cy='contact address']").should("have.text", "4091 3rd St SW, Suite 5300Washington, DC 20416")
        cy.get("[data-cy='contact phone']").should("have.text", "(202) 205-6780")
        cy.get("[data-cy='contact fax']").should("have.text", "(202) 555-0000")
        cy.get("[data-cy='contact link']").should("have.text", "Visit website")
        cy.get("[data-cy='contact email']").should("have.text", "sbaheadquarters@usa.gov")
    })

    it("returns to results list when office details is closed", () => {
        cy.visit("/local-assistance/find/?type=SBA%20District%20Office&q=SBA&pageNumber=1")
        cy.get("#office-results")
        cy.get("[data-cy='open detail']").eq(0).click()
        cy.get('[data-cy="close detail"]').click()
        expect(cy.get("#office-results").contains("Results 1 - 5")).to.exist
    })
})

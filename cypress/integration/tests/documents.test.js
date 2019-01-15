describe("Document", function(){
    describe("Search", function(){
        it("contains a pdf icon when the document is pdf", function(){
            cy.server()
            cy.fixture("document/search-result.json").as("SearchResult")
            cy.route("GET", "/api/content/documents.json**", "@SearchResult").as("DocumentSearch")
            cy.visit('/document')
            cy.get(".card-container").should("have.length", 2)

            // Icon is present on the download link for a PDF
            cy.get(".document-card-download").first().should("have.text", "Download pdf")
            cy.get(".document-card-download").first().find("[data-cy='pdf icon']").should("exist")

            // Icon is not present on the download link for a non PDF
            cy.get(".document-card-download").eq(1).should("have.text", "Download zip")
            cy.get(".document-card-download").eq(1).find("i").should("not.exist")
        })
    })
})
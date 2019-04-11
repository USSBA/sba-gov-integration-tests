describe("Document", function(){
    describe("Search", function(){
        it("contains a pdf icon when the document is pdf", function(){
            cy.server()
            cy.fixture("document/search-result.json").as("SearchResult")
            cy.route("GET", "/api/content/search/documents.json**", "@SearchResult").as("DocumentSearch")
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

    describe("Detail Page", function(){
        it("displays an icon in the version list", function(){
            cy.server()
            cy.fixture("document/document-versions.json").as("Document")
            cy.route("GET", "/api/content/search/node/**", "@Document").as("NodeLookup")
            cy.visit("/document/report--agency-financial-report")
            cy.wait("@NodeLookup")
            cy.get(".document-article-title").should("have.text", "Agency Financial Report")

            //Icon is present for PDFs
            cy.get('a').contains("Download pdf").find("[data-cy='pdf icon']").should("exist")
            // No icon for non PDFs
            cy.get('a').contains("Download txt").find("i").should("not.exist")
        })
        it('displays the 404 page when the document is NOT found', function() {
          cy.visit("document/foo", { failOnStatusCode: false })
          cy.get("[data-cy='error-page-title']").should("have.text", '404')
          cy.get("[data-cy='error-page-message']").should("contain", 'home page')
        })
    })
})

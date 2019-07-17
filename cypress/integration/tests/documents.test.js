describe("Document", function(){
    describe("Search Page", function () {

        beforeEach(function () {
            cy.fixture('office/sbaOffices.json').as("SBAOffices")
        })

        it("displays fields for searching", function () {
            cy.server()
            cy.route("GET", "/api/content/sbaOffices.json", "@SBAOffices").as("OfficeListRequest")

            cy.visit("/document")
            cy.wait("@OfficeListRequest")

            cy.get("[data-cy='office']").as("OfficeDropdown").within((dropdown) => {
                cy.get("label").should("have.text", "Office")
                cy.get('.Select-arrow-zone').click()
                cy.get("div.Select-menu-outer").as("OfficeOptions")
                cy.get("@OfficeOptions")
                    .should("contain", "All")
                cy.wrap(this.SBAOffices).each((office, index, offices) => {
                    cy.get("@OfficeOptions")
                        .should("contain", office.title)
                 })
            })
        })
    })

    describe("Search", function(){
        it("contains a pdf icon when the document is pdf", function(){
            cy.server()
            cy.fixture("document/search-result.json").as("SearchResult")
            cy.route("GET", "/api/content/search/documents.json**", "@SearchResult").as("DocumentSearch")
            cy.visit('/document')
            cy.get(".card-container").should("have.length", 2)

            // Icon is present on the download link for a             
            cy.get('.detail-card').eq(0)
                .find("a").contains("Download pdf").as("DownloadPdfLink")

            // Icon is not present on the download link for a non PDF
            cy.get('.detail-card').eq(1)
                .find('a').contains("Download zip").as("DownloadZipLink")
            cy.get("@DownloadZipLink").siblings("i").should("not.exist")
        })

        it("passes an office id as a query param when an office is selected", function(){
            const officeIndex = 0
            const officeId = this.SBAOffices[officeIndex].id
            cy.server()
            cy.route("GET", "/api/content/sbaOffices.json", "@SBAOffices").as("OfficeListRequest")
            cy.route("GET", `/api/content/search/documents.json**&office=${officeId}**`).as("DocumentSearchQuery")

            cy.visit("/document")
            cy.wait("@OfficeListRequest")
            cy.get("[data-cy='office']").as("OfficeDropdown").within((dropdown) => {
                cy.get('.Select-arrow-zone').click()
                cy.get("div.Select-menu-outer").as("OfficeOptions")
                cy.get("@OfficeOptions").contains(this.SBAOffices[0].title).click()
            })
            cy.get("[data-testid='button']").contains("Apply").click()
            cy.wait(1000)
            cy.get("@DocumentSearchQuery.all").should('have.length', 1)
        })
    })

    describe("Detail Page", function(){
        it("displays an icon in the version list", function(){
            cy.server()
            cy.fixture("document/document-versions.json").as("Document")
            cy.route("GET", /\/api\/content\/\d+\.json/, "@Document").as("NodeLookup")
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

describe("Articles", function () {
    describe("Search Page", function () {
        beforeEach(function () {
            cy.fixture('office/sbaOffices.json').as("SBAOffices")
            cy.fixture("articles/basic-search-results.json").as("ArticleSearchResults")
            cy.fixture("articles/empty-search-results.json").as("ArticleEmptySearchResults")
            cy.fixture("articles/special-search-results.json").as("ArticleSpecialSearchResults")
        })

        it("displays a search section", function () {
            cy.server()
            cy.route("GET", "/api/content/sbaOffices.json", "@SBAOffices").as("OfficeListRequest")
            cy.visit("/article")
            cy.wait("@OfficeListRequest")
            cy.get('[data-testid=lookup-field-section]').contains('Article Lookup')
        })

        it("displays fields for searching", function () {
            cy.server()
            cy.route("GET", "/api/content/sbaOffices.json", "@SBAOffices").as("OfficeListRequest")
            cy.visit("/article")
            cy.wait("@OfficeListRequest")
            cy.get("[data-testid=office]")
            cy.get("[data-testid=document-lookup-text-input-container]").within((field) => {
                cy.get('[data-testid=document-lookup-text-input-label]').contains("Search")
                cy.get("[data-testid=document-lookup-text-input]")
            })
            cy.get("[data-testid=articlecategory-select]")
            cy.get("[data-testid=program-select]")
            cy.get("[data-testid=sort-by-select]")
            cy.get("[data-testid=button]")
        })

        it("displays office list in the office dropdown", function () {
            cy.server()
            cy.route("GET", "/api/content/sbaOffices.json", "@SBAOffices").as("OfficeListRequest")
            cy.visit("/article")
            cy.wait("@OfficeListRequest")
            cy.get("[data-testid=office]").as("OfficeDropdown").within((dropdown) => {
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

        it("displays results for a search that has results", function() {
            cy.server()
            cy.route("GET", "/api/content/search/articles.json**", "@ArticleSearchResults").as("ArticleSearch")
            cy.visit("/article")
            cy.wait("@ArticleSearch")
            cy.contains(this.ArticleSearchResults.items[0].title)
            cy.get("[data-cy=detail-card-collection]").within((collection) => {
                cy.get("[data-cy=detail-card-collection-container]").should('have.length', 3)
            })
        })

        it("displays a message when there are no search results", function () {
            cy.server()
            cy.route("GET", "/api/content/search/articles.json**", "@ArticleEmptySearchResults").as("ArticleSearch")
            cy.visit("/article")
            cy.wait("@ArticleSearch")
            cy.contains("Sorry, we couldn't find any articles matching that query.")
            cy.get("[data-cy=detail-card-collection]").should('not.exist')
        })

        it("displays results when visiting the search page with a url with query parameters", function () {
            const expectedURLParams     = "sortBy=Title&search=&articleCategory=All&program=All&office=All&page=1"
            const expectedSearchParams  = "sortBy=Title&searchTerm=&articleCategory=all&program=all&office=all&page=1&start=0&end=30"
            cy.server()
            cy.route("GET", "/api/content/search/articles.json?"+expectedSearchParams, "@ArticleSpecialSearchResults").as("ArticleSearch")
            cy.visit("/article?"+expectedURLParams)
            cy.wait("@ArticleSearch")   
            cy.get("[data-cy=detail-card-collection]").within((collection) => {
                cy.get("[data-cy=detail-card-collection-container]").should('have.length', 3)
            })
            cy.contains(this.ArticleSpecialSearchResults.items[0].title)
        })
            
    })
})
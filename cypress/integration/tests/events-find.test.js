describe("Events Find Page", function () {
    it("loads and has a title", function () {
        cy.visit("/events/find")
        cy.get("head > title").should("have.text", "Small Business Administration")
    })

    it("has a labeled keyword field", function(){
        cy.visit("/events/find")
        cy.get("[data-cy='keyword search']").as("EventKeyword")
        cy.get("@EventKeyword").should("exist")
        cy.get('label[for="keyword-search"]').should("have.text", "Search")
    })

    it("takes a string of text as a keyword", function(){
        const expectedKeyword = "testkeyword"
        cy.visit("/events/find")
        cy.get("[data-cy='keyword search']").as("EventKeyword").type(expectedKeyword)
        cy.get("[data-cy='search button']").as("SubmitButton").click()
        cy.get("@EventKeyword").invoke("val").should("equal", expectedKeyword)
        cy.url().should("include", `q=${expectedKeyword}`)
    })

    it("has a submit button", function() {
        cy.visit("/events/find")
        cy.get('[data-cy="search button"]').should('exist')
    })

    it("has a labeled zip code field", function(){
        cy.visit("/events/find")
        cy.get("[data-cy='zip']").as("ZipInput").should("exist")
        cy.get('label[for="zip"]').should("have.text", "Near")
    })

    it("allows valid zip codes to be entered", function(){
        cy.visit("/events/find")
        cy.get("[data-cy='zip']").as("ZipInput")
        cy.get("@ZipInput").type("99999")
        cy.get('#events-primary-search-bar-search-button').click();
        cy.get("@ZipInput").invoke("val").should("eq","99999")
    })

    it("displays an error for non-numeric zip codes", function(){
        cy.visit("/events/find")
        cy.get("[data-cy='zip']").as("ZipInput")
        cy.get("@ZipInput").type("abcde")
        cy.get('#events-primary-search-bar-search-button').click();
        cy.get('#zip-error').should("exist")
    })

    it("sets query parameters from form values", function(){
        const expectedZip = "12345"
        const expectedKeyword = "test"
        const expectedDateRange ="tomorrow"

        cy.visit("/events/find")
        cy.get("[data-cy='zip']").type(expectedZip)
        cy.get("[data-cy='keyword search']").type(expectedKeyword)
        cy.get("[data-cy='date']").click().find(".Select-menu-outer").contains("Tomorrow").click()
        cy.get("[data-cy='search button']").click()

        cy.url().should("include", `address=${expectedZip}`)
        cy.url().should("include", `q=${expectedKeyword}`)
        cy.url().should("include", `dateRange=${expectedDateRange}`)
    })

    it("sets form values from query parameters", function(){
        const expectedZip = "23456"
        const expectedKeyword = "test123"
        const expectedDateRange ="Next 7 Days"

        cy.visit("/events/find/?dateRange=7days&address=23456&q=test123")
        cy.get("[data-cy='zip']").invoke('val').should("equal", expectedZip)
        cy.get("[data-cy='keyword search']").invoke('val').should("equal", expectedKeyword)
        cy.get("[data-cy='date']").find(".Select-value").should("have.text",expectedDateRange)
    })

    it("has a date range filter with options", function(){
        cy.visit("/events/find")
        cy.get('label[for="date-filter"]').should("have.text", "Date Range")
        cy.get("[data-cy='date']").as("DateRange")
        cy.get("@DateRange").click().find(".Select-menu-outer").as("DateRangeOptions")
        cy.get("@DateRangeOptions").contains("All Upcoming").should("exist")
        cy.get("@DateRangeOptions").contains("Today").should("exist")
        cy.get("@DateRangeOptions").contains("Tomorrow").should("exist")
        cy.get("@DateRangeOptions").contains("Next 7 Days").should("exist")
        cy.get("@DateRangeOptions").contains("Next 30 Days").should("exist")
    })

    it("has a date range default of All Upcoming", function() {
        cy.server()
        cy.route("GET", "/api/content/events.json**").as("EventsRequest")
        cy.visit("/events/find")
        cy.wait("@EventsRequest").then((xhr) => {
            expect(xhr.url).to.contain("dateRange=all")
        })
        cy.get("[data-cy='date']").find(".Select-value").should("have.text", "All Upcoming")
    })

    it('submits an events.json request when a search is submitted', function(){
        cy.server()
        cy.route("GET", "/api/content/events.json**").as("EventsRequest")
        cy.visit('/events/find')
        cy.wait("@EventsRequest")

        cy.get("[data-cy='keyword search']").type("test")
        cy.get("[data-cy='zip']").type("99999")
        cy.get("[data-cy='date']").as("DateRange").click()
        cy.get("@DateRange").find(".Select-menu-outer").contains("Tomorrow").click()

        cy.get("[data-cy='search button']").click()

        cy.wait("@EventsRequest").then((xhr) => {
            expect(xhr.url).to.contain("pageSize=5")
            expect(xhr.url).to.contain("start=0")
            expect(xhr.url).to.contain("q=test")
            expect(xhr.url).to.contain("address=9999")
            expect(xhr.url).to.contain("dateRange=tomorrow")
        })
    })

    it("has a date range filter with options", function(){
        cy.visit("/events/find")
        cy.get('label[for="date-filter"]').should("have.text", "Date Range")
        cy.get("[data-cy='date']").as("DateRange")
        cy.get("@DateRange").click()
        cy.get(".Select-menu-outer").as("DateRangeOptions")
        cy.get("@DateRangeOptions").contains("All Upcoming").should("exist")
        cy.get("@DateRangeOptions").contains("Today").should("exist")
        cy.get("@DateRangeOptions").contains("Tomorrow").should("exist")
        cy.get("@DateRangeOptions").contains("Next 7 Days").should("exist")
        cy.get("@DateRangeOptions").contains("Next 30 Days").should("exist")
    })
})
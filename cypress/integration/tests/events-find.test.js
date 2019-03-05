describe("Events Find Page", function () {
    it("loads and has a title", function () {
        cy.visit("/events/find")
        cy.get("head > title").should("have.text", "Small Business Administration")
    })

    it("has a labeled keyword field", function(){
        cy.visit("/events/find")
        cy.get("[data-cy='keyword search']").as("EventKeyword")
        cy.get("@EventKeyword")
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
        cy.get('[data-cy="search button"]')
    })

    it("has a labeled zip code field", function(){
        cy.visit("/events/find")
        cy.get("[data-cy='zip']").as("ZipInput")
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
        cy.get('#zip-error')
    })

    it("sets query parameters from form values", function(){
        const expectedZip = "12345"
        const expectedKeyword = "test"
        const expectedDateRange ="tomorrow"
        const expectedDistance = "50"

        cy.visit("/events/find")
        cy.get("[data-cy='zip']").type(expectedZip)
        cy.get("[data-cy='keyword search']").type(expectedKeyword)
        cy.get("[data-cy='date']").click().find(".Select-menu-outer").contains("Tomorrow").click()
        cy.get("[data-cy='distance']").as("Distance").click()
        cy.get("@Distance").find(".Select-menu-outer").contains("50 miles").click()
        cy.get("[data-cy='search button']").click()

        cy.url().should("include", `address=${expectedZip}`)
        cy.url().should("include", `q=${expectedKeyword}`)
        cy.url().should("include", `dateRange=${expectedDateRange}`)
        cy.url().should("include", `distance=${expectedDistance}`)
    })

    it("sets form values from query parameters", function(){
        const expectedZip = "23456"
        const expectedKeyword = "test123"
        const expectedDateRange ="Next 7 Days"
        const expectedDistance = "25 miles"

        cy.visit("/events/find/?dateRange=7days&address=23456&q=test123&distance=25")
        cy.get("[data-cy='zip']").invoke('val').should("equal", expectedZip)
        cy.get("[data-cy='keyword search']").invoke('val').should("equal", expectedKeyword)
        cy.get("[data-cy='date']").find(".Select-value").should("have.text",expectedDateRange)
        cy.get("[data-cy='distance']").find(".Select-value").should("have.text",expectedDistance)
    })

    it("has a date range filter with options", function(){
        cy.visit("/events/find")
        cy.get('label[for="date-filter"]').should("have.text", "Date Range")
        cy.get("[data-cy='date']").as("DateRange")
        cy.get("@DateRange").click().find(".Select-menu-outer").as("DateRangeOptions")

        cy.get("@DateRangeOptions").contains("All Upcoming")
        cy.get("@DateRangeOptions").contains("Today")
        cy.get("@DateRangeOptions").contains("Tomorrow")
        cy.get("@DateRangeOptions").contains("Next 7 Days")
        cy.get("@DateRangeOptions").contains("Next 30 Days")
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
        cy.route("GET", "/api/content/events.json?pageSize=10&start=0&dateRange=tomorrow&distance=50&q=test&address=99999").as("ExpectedRequest")
        cy.visit('/events/find')
        cy.get("[data-cy='keyword search']").type("test")
        cy.get("[data-cy='zip']").type("99999")
        cy.get("[data-cy='date']").as("DateRange").click()
        cy.get("@DateRange").find(".Select-menu-outer").contains("Tomorrow").click()
        cy.get("[data-cy='distance']").as("Distance").click()
        cy.get("@Distance").find(".Select-menu-outer").contains("50 miles").click()
        cy.get("[data-cy='search button']").click()
        cy.wait("@ExpectedRequest")
    })

    it("has a date range filter with options", function(){
        cy.visit("/events/find")
        cy.get('label[for="date-filter"]').should("have.text", "Date Range")
        cy.get("[data-cy='date']").as("DateRange")
        cy.get("@DateRange").click()
        cy.get(".Select-menu-outer").as("DateRangeOptions")

        cy.get("@DateRangeOptions").contains("All Upcoming")
        cy.get("@DateRangeOptions").contains("Today")
        cy.get("@DateRangeOptions").contains("Tomorrow")
        cy.get("@DateRangeOptions").contains("Next 7 Days")
        cy.get("@DateRangeOptions").contains("Next 30 Days")
    })

    it("has a miles dropdown with options", function(){
        cy.visit("/events/find")
        cy.get('label[for="distance-filter"]').should("have.text", "Distance")
        cy.get("[data-cy='distance']").as("Distance")
        cy.get("@Distance").click()
        cy.get("@Distance").find(".Select-menu-outer").as("DistanceOptions")

        cy.get("@DistanceOptions").contains("200 miles")
        cy.get("@DistanceOptions").contains("100 miles")
        cy.get("@DistanceOptions").contains("50 miles")
        cy.get("@DistanceOptions").contains("25 miles")
    })

    it("has a distance default of 200 miles", function() {
        cy.server()
        cy.route("GET", "/api/content/events.json**").as("EventsRequest")
        cy.visit("/events/find")
        cy.wait("@EventsRequest").then((xhr) => {
            expect(xhr.url).to.contain("distance=200")
        })
        cy.get("[data-cy='distance']").find(".Select-value").should("have.text", "200 miles")
    })

    describe("event results", function(){
        it("has a date", function(){
            cy.server()
            cy.fixture("event/search-results.json").as("EventResults").then((event) => {
                event.items[0].startDate = "2019-02-28T23:30:00-08:00"
                cy.route("GET", "/api/content/events.json**", "@EventResults")
            })
            const expectedDate = "Thursday, February 28"
            cy.visit("/events/find")
            cy.get("[data-cy='event result']").eq(0).find("[data-cy='date']").should("have.text", expectedDate)
        })

        it("has a time", function(){
            cy.server()
            cy.fixture("event/search-results.json").as("EventResults").then((event) => {
                event.items[0].startDate = "2019-02-28T23:30:00-08:00"
                event.items[0].endDate = "2019-03-01T01:30:00-08:00"
                event.items[0].timezone = "PST"
                cy.route("GET", "/api/content/events.json**", "@EventResults")
            })
            const expectedTime = "11:30 pm–1:30 am PST"
            cy.visit("/events/find")
            cy.get("[data-cy='event result']").eq(0).find("[data-cy='time']").should("have.text", expectedTime)
        })

        it("has a title", function(){
            cy.server()
            cy.fixture("event/search-results.json").as("EventResults").then((event) => {
                event.items[0].title = "Chuck Norris Business Classes (now with more roundhouse)"
                cy.route("GET", "/api/content/events.json**", "@EventResults")
            })
            const expectedTitle = "Chuck Norris Business Classes (now with more roundhouse)"
            cy.visit("/events/find")
            cy.get("[data-cy='event result']").eq(0).find("[data-cy= 'title']").should("have.text", expectedTitle)
        })

        it("has a location", function(){
            cy.server()
            cy.fixture("event/search-results.json").as("EventResults").then((event) => {
                event.items[0].location.city = "Deep In The Heart O"
                event.items[0].location.state = "Texas"
                cy.route("GET", "/api/content/events.json**", "@EventResults")
            })
            const expectedLocation = "Deep In The Heart O, Texas"
            cy.visit("/events/find")
            cy.get("[data-cy='event result']").eq(0).find("[data-cy= 'location']").should("have.text", expectedLocation)
        })

        it("has a cost with a dollar value", function(){
            cy.server()
            cy.fixture("event/search-results.json").as("EventResults").then((event) => {
                event.items[0].cost = "13.37"
                cy.route("GET", "/api/content/events.json**", "@EventResults")
            })
            const expectedCost = "$13.37"
            cy.visit("/events/find")
            cy.get("[data-cy='event result']").eq(0).find("[data-cy='cost']").should("have.text", expectedCost)
        })

        it("has a cost when free", function(){
            cy.server()
            cy.fixture("event/search-results.json").as("EventResults").then((event) => {
                event.items[0].cost = "0.00"
                cy.route("GET", "/api/content/events.json**", "@EventResults")
            })
            const expectedCost = "Free"
            cy.visit("/events/find")
            cy.get("[data-cy='event result']").eq(0).find("[data-cy='cost']").should("have.text", expectedCost)
        })

        it("has a registration link with the label register", function(){
            cy.server()
            cy.fixture("event/search-results.json").as("EventResults").then((event) => {
                event.items[0].registrationUrl = "https://doesnt.matter"
                cy.route("GET", "/api/content/events.json**", "@EventResults")
            })
            const expectedRegistrationLabel = "REGISTER"
            cy.visit("/events/find")
            cy.get("[data-cy='event result']").eq(0).find("[data-cy='registration']").should("have.text", expectedRegistrationLabel)
        })

        // ToDo:  enable this test later on when this feature is enabled
        it.skip("has no registration button with no registration url", function(){
            cy.server()
            cy.fixture("event/search-results.json").as("EventResults").then((event) => {
                event.items[0].registrationUrl = ""
                cy.route("GET", "/api/content/events.json**", "@EventResults")
            })
            cy.visit("/events/find")
            expect(cy.get("[data-cy='event result']").eq(0).find("[data-cy='registration']")).not.to.exist
        })

    })

    it("allow to click on title", function(){
        cy.server()
        cy.fixture("event/search-results.json").as("EventResults")
        cy.route("GET", "/api/content/events.json**", "@EventResults")

        cy.visit("/events/find")
        cy.get("[data-cy='event result']").eq(0).find("[data-cy= 'title']").click()
        expect(cy.url())
        
    })

    it("paginates through search results", function(){
        cy.server()
        cy.fixture("event/search-results.json").as("EventResults")
        cy.route("GET", "/api/content/events.json**", "@EventResults")

        cy.visit("events/find")
        cy.get("[data-cy= 'showing results text']").as("Pagination")
        cy.get("[data-cy= 'previous button']").as("Prev")
        cy.get("[data-cy= 'next button']").as("Next")
        expect(cy.get("@Pagination").contains("Showing 1 - 10 of ")).to.exist
        expect(cy.get("@Prev")).to.exist
        expect(cy.get("@Next")).to.exist

        //Forward pagination
        cy.get("@Next").click()
        expect(cy.get("@Pagination").contains("Showing 11 - 20 of ")).to.exist

        //Backwards pagination
        cy.get("@Prev").click()
        expect(cy.get("@Pagination").contains("Showing 1 - 10 of ")).to.exist
    })

    it("displays 10 results", function(){
        cy.server()
        cy.fixture("event/search-results.json").as("EventResults")
        cy.route("GET", "/api/content/events.json**", "@EventResults")

        cy.visit("events/find")
        cy.get("[data-cy= 'event result']").should('have.length', 10)
    })

})
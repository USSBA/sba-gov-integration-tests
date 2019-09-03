describe("District Office Page", function () {
    beforeEach(function(){
        cy.request("GET", '/api/content/sbaOffices.json')
        .then((result) => {
            cy.wrap(result.body[0]).as("validOffice")
        })
    })

    it("loads and pulls an office for content", function () {
        cy.server()
        cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
        cy.visit(`/offices/district/${this.validOffice.id}`)
        cy.wait("@OfficeRequest")
        cy.contains(this.validOffice.title)
    })

    it("displays a CTA for a district office page", function() {
        cy.server()
        cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
        cy.visit(`/offices/district/${this.validOffice.id}`)
        cy.get("[data-testid='call-to-action']")
            .find('a')
                .should("has.attr", "data-testid", 'button')
                .should('contain', "Search Nearby")
                .should("has.attr", "href", '/local-assistance/find')
    })

    it("displays the upcoming events section with events for a district office", function() {
        cy.server()
        cy.fixture("office/events.json").as("EventResults")
        cy.route("GET", "/api/content/search/events.json**", "@EventResults")
        cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
        cy.visit(`/offices/district/${this.validOffice.id}`)
        cy.get("[data-testid='events']")
        cy.get("[data-cy='event result']").should('have.length', 5)
        cy.get("[data-testid='events-button']").find('a').should("has.attr", "href", '/events/find/')
    })

    describe("Newsletter sign up section", () => {
        it("displays the newsletter signup", function () {
            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.get("[data-testid='office-newsletter']").should("contain", "Sign up for national and local SBA newsletters")
            cy.get("[data-testid=newsletter-form]").as("form")
                .should("have.length", 2)
                .find("[data-testid=button]")
                .contains("Subscribe")
            cy.get("@form")
                .find("[data-testid=caption-text]")
                .contains("Please enter your zip code to get information about business news and events in your area.")
            cy.get("@form")
                .find("[data-testid=newsletter-email-address-container]").within(() => {
            cy.get("[data-testid=newsletter-email-address-label]").contains("Email address")
                .get("[data-testid=newsletter-email-address]")
            })
            cy.get("@form")
                .find("[data-testid=newsletter-zip-code-container]").within(() => {
            cy.get("[data-testid=newsletter-zip-code-label]").contains("Zip code")
                .get("[data-testid=newsletter-zip-code]")
          })
        })

        it("Subscribe button is enabled when e-mail address is valid and zip code field is empty", function() {
            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.get("[data-testid=newsletter-email-address]")
              .type("test4@test4.com")
            cy.get("[data-testid=newsletter-form]")
              .find("[data-testid=button]")
              .should("not.be.disabled")
          })

        it("shows error message and disables Subscribe button when e-mail address is invalid", function() {
            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.get("[data-testid=newsletter-email-address]").type("test@.com")
            cy.get("[data-testid=newsletter-zip-code]").type("12345")
            cy.get("[data-testid=newsletter-form]").contains("Subscribe").should("be.disabled")
            cy.get("[data-testid=newsletter-email-address-error]").contains("Enter a valid email address")
        })

        it("shows error message and disables Subscribe button when e-mail address is valid, but zip code is incomplete", function() {
            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.get("[data-testid=newsletter-zip-code]").type("3456")
            cy.get("[data-testid=newsletter-email-address]").type("test4@test4.com")
            cy.get("[data-testid=newsletter-form]").contains("Subscribe").first().should("be.disabled")
            cy.get("[data-testid=newsletter-zip-code-error]").contains("Enter a valid zip code")
        })

        it("shows the lender match link component", function() {
            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.get("[data-testid=office-lender-match]")
                .find('a')
                    .should('contain', "Learn More")
                    .should("has.attr", "href", '/lendermatch')
        })

        it("displays a 404 for a non existing office page", function() {
            cy.visit("/offices/district/1", { failOnStatusCode: false }) // not a valid office
            cy.get("[data-cy='error-page-title']").should("have.text", '404')
            cy.get("[data-cy='error-page-message']").should("contain", 'local assistance page')
        })
    })

    describe("Office Leadership Section", function () {
        it("displays when people are assigned as office leadership", function () {
            const expectedLeaders = [111, 222, 333]
            cy.server()
            cy.fixture("office/district-office.json").as("DistrictOffice").then((office) => {
                office.officeLeadership = expectedLeaders
                cy.route("GET", `/api/content/${this.validOffice.id}.json`, office).as("OfficeRequest")
            })
            cy.fixture("persons/leader1.json").as("LeaderPerson1")
            cy.fixture("persons/leader2.json").as("LeaderPerson2")
            cy.fixture("persons/leader3.json").as("LeaderPerson3")
            cy.route("GET",`/api/content/${expectedLeaders[0]}.json`, "@LeaderPerson1").as("Leader1")
            cy.route("GET",`/api/content/${expectedLeaders[1]}.json`, "@LeaderPerson2").as("Leader2")
            cy.route("GET",`/api/content/${expectedLeaders[2]}.json`, "@LeaderPerson3").as("Leader3")
            
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")
            cy.wait("@Leader1")
            cy.wait("@Leader2")
            cy.wait("@Leader3")

            cy.get("[data-testid='office-leadership']").within(() =>{
                cy.get('[data-testid=authorCard]').should('have.length', 3)
                cy.get('[data-testid=authorCard]').eq(0).should('contain', "Leader One")
                cy.get('[data-testid=authorCard]').eq(1).should('contain', "Leader Two")
                cy.get('[data-testid=authorCard]').eq(2).should('contain', "Leader Three")
            })
        })

        it("does not display when there are no office leadership people assigned", function () {
            cy.server()
            cy.fixture("office/district-office.json").as("DistrictOffice").then((office) => {
                delete office.officeLeadership
                cy.route("GET", `/api/content/${this.validOffice.id}.json`, office).as("OfficeRequest")
            })
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.get("[data-testid=office-leadership]").should('not.exist')
        })

        it("only displays 3 leaders even if more are listed", function () {
            const expectedLeaders = [111, 222, 333, 444]
            cy.server()
            cy.fixture("office/district-office.json").as("DistrictOffice").then((office) => {
                office.officeLeadership = expectedLeaders
                cy.route("GET", `/api/content/${this.validOffice.id}.json`, office).as("OfficeRequest")
            })
            cy.fixture("persons/leader1.json").as("LeaderPerson1")
            cy.route("GET",`/api/content/${expectedLeaders[0]}.json`, "@LeaderPerson1").as("Leader1")
            cy.route("GET",`/api/content/${expectedLeaders[1]}.json`, "@LeaderPerson1").as("Leader2")
            cy.route("GET",`/api/content/${expectedLeaders[2]}.json`, "@LeaderPerson1").as("Leader3")
            cy.route("GET",`/api/content/${expectedLeaders[3]}.json`, "@LeaderPerson1").as("Leader4")
            
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")
            cy.wait("@Leader1")
            cy.wait("@Leader2")
            cy.wait("@Leader3")
            cy.wait("@Leader4")

            cy.get("[data-testid='office-leadership']").within(() =>{
                cy.get('[data-testid=authorCard]').should('have.length', 3)
            })
        })

        it("displays leaders even if one fails", function () {
            const expectedLeaders = [111, 222, 333]
            cy.server()
            cy.fixture("office/district-office.json").as("DistrictOffice").then((office) => {
                office.officeLeadership = expectedLeaders
                cy.route("GET", `/api/content/${this.validOffice.id}.json`, office).as("OfficeRequest")
            })
            cy.fixture("persons/leader1.json").as("LeaderPerson1")
            cy.route("GET",`/api/content/${expectedLeaders[0]}.json`, "@LeaderPerson1").as("Leader1")
            cy.route("GET",`/api/content/${expectedLeaders[1]}.json`, "@LeaderPerson1").as("Leader2")

            cy.route({
                method: "GET",
                url: `/api/content/${expectedLeaders[2]}.json`,
                status: "404",
                response: "{}"
            }).as("Leader3")
            
            cy.visit(`/offices/district/${this.validOffice.id}`, {failOnStatusCode: false})
            cy.wait("@OfficeRequest")
            cy.wait("@Leader1")
            cy.wait("@Leader2")

            cy.get("[data-testid='office-leadership']").within(() =>{
                cy.get('[data-testid=authorCard]').should('have.length', 2)
            })
        })
    })
})
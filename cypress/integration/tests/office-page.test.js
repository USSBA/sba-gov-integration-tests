describe("District Office Page", function () {
    beforeEach(function(){
        cy.request("GET", '/api/content/sbaOffices.json')
        .then((result) => {
            cy.wrap(result.body[0]).as("validOffice")
        })
        cy.fixture("office/genericOffice.json").as("GenericOffice")
    })

    it("loads and pulls an office for content", function () {
        cy.server()
        cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
        cy.visit(`/offices/district/${this.validOffice.id}`)
        cy.wait("@OfficeRequest")
        cy.contains(this.validOffice.title)
    })

    describe("social media section", function() {
        it("displays social media text and image link when twitter link exists", function() {
            const expectedHeaderText = 'Follow us'
            const expectedAltText = 'link to twitter'
            const expectedTwitterLink = 'http://twitter.com/sbagov'
            this.GenericOffice.twitterLink = expectedTwitterLink

            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, this.GenericOffice).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.findByTestId("social-media-section").within(()=>{
                cy.get('h4').should('contain', expectedHeaderText)

                cy.get('> span > a > img')
                    .should('have.attr', 'alt', expectedAltText)
                    .click()
            })
            cy.get('[data-cy="external url"]').should('contain', expectedTwitterLink)
        })

        it("does NOT display social media section when twitter link does NOT exist", function() {
            delete this.GenericOffice.twitterLink

            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, this.GenericOffice).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.findByTestId("social-media-section").should('not.exist')
        })
    })

    describe("office services provided section", () => {
        it("displays the correct information when office service information exists", function () {
            cy.server()
            cy.fixture("office/services/officeWithServices.json").as("OfficeResponse")
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, "@OfficeResponse").as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")
            cy.findByTestId("office-services-section")
                .should('contain', "Some content")
        })
        it("does NOT display the office service section when no information is present", function () {
            cy.server()
            cy.fixture("office/services/officeWithNoServices.json").as("OfficeResponse")
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, "@OfficeResponse").as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")
            cy.findByTestId("office-services-section").should('not.exist')
        })
        it("does NOT display the office service section when the information is not in a String data", function () {
            cy.server()
            cy.fixture("office/services/officeWithServiceObject.json").as("OfficeResponse")
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, "@OfficeResponse").as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")
            cy.findByTestId("office-services-section").should('not.exist')
        })
    })

    describe('location information section', function () {
        beforeEach(function(){
            cy.fixture("office/alternateOffice.json").as("AlternateOffice")
            cy.fixture("office/regionalOffice.json").as("RegionalOffice")
        })

        it('displays the main office location with all location information', function () {
            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, this.GenericOffice).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            const mainLocation = this.GenericOffice.location[0]

            cy.findByTestId("location-info").within(()=>{
                cy.findByTestId("main-location").within(()=>{
                    cy.findByTestId("contact card title").should('have.text', mainLocation.name)
                    cy.findByTestId("contact phone").should('have.text', mainLocation.phoneNumber)
                    cy.findByTestId("contact fax").should('have.text', mainLocation.fax)
                    cy.findByTestId("contact email").should('have.text', mainLocation.email)
                    cy.findByTestId("contact address").should('contain', mainLocation.streetAddress)
                        .and('contain', mainLocation.city)
                        .and('contain', mainLocation.state)
                        .and('contain', mainLocation.zipCode)
                    cy.findByTestId("hours of operation").should('have.text', mainLocation.hoursOfOperation)
                })
            })
        })

        it('displays an alternate office location', function () {
            this.GenericOffice.alternateLocations = [111]
            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, this.GenericOffice).as("OfficeRequest")
            cy.route("GET", `/api/content/${this.GenericOffice.alternateLocations[0]}.json`, this.AlternateOffice).as("AlternateOfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")
            cy.wait("@AlternateOfficeRequest")

            cy.findByTestId("location-info").within(()=>{
                cy.findAllByTestId("alternate-location")
                    .should('have.length', 1)
            })
        })

        it('displays a maximum of two alternate office locations when there are multiple alternate locations', function () {
            this.GenericOffice.alternateLocations = [111, 222, 333]
            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, this.GenericOffice).as("OfficeRequest")
            cy.route("GET", `/api/content/${this.GenericOffice.alternateLocations[0]}.json`, this.AlternateOffice).as("AlternateOfficeRequest")
            cy.route("GET", `/api/content/${this.GenericOffice.alternateLocations[1]}.json`, this.AlternateOffice).as("AlternateOfficeRequest")
            cy.route("GET", `/api/content/${this.GenericOffice.alternateLocations[2]}.json`, this.AlternateOffice).as("AlternateOfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")
            cy.wait("@AlternateOfficeRequest")

            cy.findByTestId("location-info").within(()=>{
                cy.findAllByTestId("alternate-location")
                    .should('have.length', 2)
            })
        })

        it('displays region location with "Serving..." text when there are is a regional office', function () {
            const regionalOfficeId = this.GenericOffice.office = 444
            this.RegionalOffice.areasServed = 'Serving anyone who follows the yellow brick road.'

            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, this.GenericOffice).as("OfficeRequest")
            cy.route("GET", `/api/content/${regionalOfficeId}.json`, this.RegionalOffice).as("RegionalOfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")
            cy.wait("@RegionalOfficeRequest")

            cy.findByTestId("location-info").within(()=>{
                cy.findByTestId("region-location").within(() => {
                    cy.findByTestId("message").should('have.text', this.RegionalOffice.areasServed)
                })
            })
        })

        it('does NOT display "Serving..." text for main location or alternate locations', function () {
            this.GenericOffice.alternateLocations = [111]
            const alternateOfficeId = this.GenericOffice.alternateLocations[0]

            this.GenericOffice.areasServed = 'Serving near our main office.'
            this.AlternateOffice.areasServed = 'Serving near our alternate office.'

            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, this.GenericOffice).as("OfficeRequest")
            cy.route("GET", `/api/content/${alternateOfficeId}.json`, this.AlternateOffice).as("AlternateOfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")
            cy.wait("@AlternateOfficeRequest")

            cy.findByTestId("location-info").within(()=>{
                cy.findByTestId("main-location").within(() => {
                    cy.findByTestId("message").should('not.exist')
                })
                cy.findByTestId("alternate-location").within(() => {
                    cy.findByTestId("message").should('not.exist')
                })
            })
        })

        it('does NOT display the location section when there is no location in the office data', function () {
            delete this.GenericOffice.location
            delete this.GenericOffice.alternateLocations
            delete this.GenericOffice.office

            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, this.GenericOffice).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.findByTestId("location-info").should('not.exist')
        })

        it('does NOT display the corresponding section when it does not exist in the office data', function () {
            delete this.GenericOffice.location[0].name
            delete this.GenericOffice.location[0].phoneNumber
            delete this.GenericOffice.location[0].fax
            delete this.GenericOffice.location[0].email
            delete this.GenericOffice.location[0].streetAddress
            delete this.GenericOffice.location[0].hoursOfOperation

            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, this.GenericOffice).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.findByTestId("location-info").within(()=>{
                cy.findByTestId("main-location").within(()=>{
                    cy.findByTestId("contact card title").should('not.have.text')
                    cy.findByTestId("contact phone").should('not.exist')
                    cy.findByTestId("contact fax").should('not.exist')
                    cy.findByTestId("contact email").should('not.exist')
                    cy.findByTestId("contact address").should('not.exist')
                    cy.findByTestId("hours of operation").should('not.exist')
                })
            })
        })
    })

    describe("news releases secion",  () => {
        it("displays the correct news releases when news releases exist",  function () {
            cy.server()
            cy.fixture("office/newsReleases.json").as("NewsReleaseResults")
            cy.route("GET",
                     `/api/content/search/articles.json?office=${this.validOffice.id}&articleCategory=Press release&sortBy=Last Updated&start=0&end=3`,
                     "@NewsReleaseResults")
                .as("NewsRequest")
            cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")
            cy.wait("@NewsRequest")
            cy.findByTestId("news-cards")
                .find("[data-cy='detail-card-collection-container']")
                .should('have.length', 3).first()
                .and('contain',"First Article")
                .and('contain', "Another example of a news release")
            cy.findByTestId("news-more-button")
                .find('a')
                    .should('contain', "View All")
                    .and("has.attr", "href", `/article?office=${this.validOffice.id}&articleCategory=Press release`)
        })

        it("displays the correct news releases when ONLY 1 news releases exist",  function () {
            cy.server()
            cy.fixture("office/oneNewsReleases.json").as("NewsReleaseResults")
            cy.route("GET",
                     `/api/content/search/articles.json?office=${this.validOffice.id}&articleCategory=Press release&sortBy=Last Updated&start=0&end=3`,
                     "@NewsReleaseResults")
                .as("NewsRequest")
            cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")
            cy.wait("@NewsRequest")
            cy.findByTestId("news-cards")
                .find("[data-cy='detail-card-collection-container']")
                .should('have.length', 1)
                .and('contain',"First Article")
            cy.findByTestId("news-more-button")
                .find('a')
                    .should('contain', "View All")
                    .and("has.attr", "href", `/article?office=${this.validOffice.id}&articleCategory=Press release`)
        })
        
        it("does NOT display the news release component when NO news releases exist",  function () {
            cy.server()
            cy.fixture("office/noNewsReleases.json").as("NewsReleaseResults")
            cy.route("GET",
                    `/api/content/search/articles.json?office=${this.validOffice.id}&articleCategory=Press release&sortBy=Last Updated&start=0&end=3`,
                     "@NewsReleaseResults")
                .as("NewsRequest")
            cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")
            cy.wait("@NewsRequest")
            cy.findByTestId("news-cards").should('not.exist')
            cy.findByTestId("news-more-button").should('not.exist')
        })
    })


    it("displays a CTA for a district office page", function() {
        cy.server()
        cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
        cy.visit(`/offices/district/${this.validOffice.id}`)
        cy.findByTestId("call-to-action").within(() => {
            cy.findByTestId("button")
            .should('contain', "Search Nearby")
            .should("has.attr", "href", '/local-assistance/find')
        })
    })

    it("displays the upcoming events section with events for a district office", function() {
        cy.server()
        cy.fixture("office/events.json").as("EventResults")
        cy.route("GET", "/api/content/search/events.json**", "@EventResults")
        cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
        cy.visit(`/offices/district/${this.validOffice.id}`)
        cy.findByTestId("events")
        cy.get("[data-cy='event result']").should('have.length', 5)
        cy.findByTestId("events-button").find('a').should("has.attr", "href", '/events/find/')
    })

    describe("Newsletter sign up section", () => {
        it("displays the newsletter signup", function () {
            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.findByTestId("office-newsletter")
                .should("contain", "Sign up for national and local SBA newsletters")
                .within(() => {
                    cy.findByTestId("newsletter-form").as("form")
                    .should("have.length", 1)
                    .findByTestId("button")
                    .contains("Subscribe")
                    cy.get("@form")
                        .findByTestId("caption-text")
                        .contains("Please enter your zip code to get information about business news and events in your area.")
                    cy.get("@form")
                        .findByTestId("newsletter-email-address-container").within(() => {
                    cy.findByTestId("newsletter-email-address-label").contains("Email address")
                        .findByTestId("newsletter-email-address")
                    })
                    cy.get("@form")
                        .findByTestId("newsletter-zip-code-container").within(() => {
                    cy.findByTestId("newsletter-zip-code-label").contains("Zip code")
                        .findByTestId("newsletter-zip-code")
                    })
                })
        })

        it("Subscribe button is enabled when e-mail address is valid and zip code field is empty", function() {
            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.findByTestId("office-newsletter")
                .within(() => {
                    cy.findByTestId("newsletter-email-address")
                    .type("test4@test4.com")
                    cy.findByTestId("newsletter-form")
                    .findByTestId("button")
                    .should("not.be.disabled")
                })
          })

        it("shows error message and disables Subscribe button when e-mail address is invalid", function() {
            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.findByTestId("office-newsletter")
            .within(() => {
                cy.findByTestId("newsletter-email-address").type("test@.com")
                cy.findByTestId("newsletter-zip-code").type("12345")
                cy.findByTestId("newsletter-form").contains("Subscribe").should("be.disabled")
                cy.findByTestId("newsletter-email-address-error").contains("Enter a valid email address")
            })
        })

        it("shows error message and disables Subscribe button when e-mail address is valid, but zip code is incomplete", function() {
            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.findByTestId("office-newsletter")
            .within(() => {
                cy.findByTestId("newsletter-zip-code").type("3456")
                cy.findByTestId("newsletter-email-address").type("test4@test4.com")
                cy.findByTestId("newsletter-form").contains("Subscribe").first().should("be.disabled")
                cy.findByTestId("newsletter-zip-code-error").contains("Enter a valid zip code")
            })
        })

        it("shows the lender match link component", function() {
            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.findByTestId("office-lender-match")
                .find('a')
                    .should('contain', "Learn More")
                    .should("has.attr", "href", '/lendermatch')
        })
    })

    describe("hero section", function () {
        it("displays essential components", function () {
            const expectedTitle = "Test Title"
            const expectedSummary = "Test blurb about office"
            const expectedImageUrl = "/sites/default/files/2017-05/Grants_Hero.jpeg"
            const expectedAltText = "Alt Image Text"
            const expectedButtonUrl = "https://google.com"

            this.GenericOffice.title = expectedTitle
            this.GenericOffice.summary = expectedSummary
            this.GenericOffice.bannerImage.image.url = expectedImageUrl
            this.GenericOffice.bannerImage.image.alt = expectedAltText
            this.GenericOffice.bannerImage.link.url = expectedButtonUrl

            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, this.GenericOffice).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.findByTestId("hero").within(()=>{
                cy.findByTestId("title")
                    .should('have.text',expectedTitle)
                cy.findByTestId("message")
                    .should('have.text', expectedSummary)
                cy.findByTestId("button")
                    .contains("Learn More")
                    .and('has.attr', "href", expectedButtonUrl)
                cy.get("div")
                    .should('have.css', 'background-image', `url("${Cypress.config().baseUrl}${expectedImageUrl}")`)
                    .and('have.attr', 'aria-label', expectedAltText)
            })
        })

        it("does not display a button when there is no banner link", function () {
            delete this.GenericOffice.bannerImage.link.url

            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, this.GenericOffice).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.findByTestId("hero").within(()=>{
                cy.findByTestId("button").should('not.exist')
            })
        })

        it("still displays the hero with no banner content", function() {
            delete this.GenericOffice.bannerImage
            const expectedTitle = "Test Title"
            const expectedSummary = "Test blurb about office"
            this.GenericOffice.title = expectedTitle
            this.GenericOffice.summary = expectedSummary

            cy.server()
            cy.route("GET", `/api/content/${this.validOffice.id}.json`, this.GenericOffice).as("OfficeRequest")
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")

            cy.findByTestId("hero").within(()=>{
                cy.findByTestId("title")
                    .should('have.text',expectedTitle)
                cy.findByTestId("message")
                    .should('have.text', expectedSummary)
            })
        })
    })

    it("displays a 404 for a non existing office page", function() {
        cy.visit("/offices/district/1", { failOnStatusCode: false }) // not a valid office
        cy.get("[data-cy='error-page-title']").should("have.text", '404')
        cy.get("[data-cy='error-page-message']").should("contain", 'local assistance page')
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

            cy.findByTestId("office-leadership").within(() =>{
                cy.findAllByTestId("authorCard").should('have.length', 3)
                cy.findAllByTestId("authorCard").eq(0).should('contain', "Leader One")
                cy.findAllByTestId("authorCard").eq(1).should('contain', "Leader Two")
                cy.findAllByTestId("authorCard").eq(2).should('contain', "Leader Three")
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

            cy.findByTestId("office-leadership").should('not.exist')
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

            cy.findByTestId("office-leadership").within(() =>{
                cy.findAllByTestId("authorCard").should('have.length', 3)
            })
        })

        it("displays when there are fewer than 3 leaders", function () {
            const expectedLeaders = [111]
            cy.server()
            cy.fixture("office/district-office.json").as("DistrictOffice").then((office) => {
                office.officeLeadership = expectedLeaders
                cy.route("GET", `/api/content/${this.validOffice.id}.json`, office).as("OfficeRequest")
            })
            cy.fixture("persons/leader1.json").as("LeaderPerson1")
            cy.route("GET",`/api/content/${expectedLeaders[0]}.json`, "@LeaderPerson1").as("Leader1")
            
            cy.visit(`/offices/district/${this.validOffice.id}`)
            cy.wait("@OfficeRequest")
            cy.wait("@Leader1")

            cy.findByTestId("office-leadership").within(() =>{
                cy.findByTestId("authorCard").should('have.length', 1)
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

            cy.findByTestId("office-leadership").within(() =>{
                cy.findAllByTestId("authorCard").should('have.length', 2)
            })
        })
    })
})
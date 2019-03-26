describe("Event details page", function(){

    beforeEach(function(){
        cy.fixture("event/99999.json").as("event")
    })

    it("has all the event details", function(){
        cy.server()
        cy.route("GET", "/api/content/event/99999.json", "@event").as("TestEventDetails")
        cy.visit("/event/99999")

        const expectedDescriptionLabel = "Description"
        const expectedHeaderDate = "Tuesday, March 19"
        const expectedDate = "Tuesday, March 19, 2019"
        const expectedRecurringText = "Recurs weekly"
        const expectedTime = "5am–12pm " + this.event.timezone

        cy.get("[data-cy='event-title']").should("have.text", this.event.title)
        cy.get("[data-cy='event-header-date']").should("have.text", expectedHeaderDate)
        cy.get("[data-cy='event-details-date']").should("have.text", expectedDate)
        cy.get("[data-cy='event-details-time']").should("have.text", expectedTime)
        cy.get("[data-cy='event-description-label']").should("have.text", expectedDescriptionLabel)
        cy.get("[data-cy='event-description']").should('have.text', this.event.description)
        cy.get("[data-cy='event-details-cost']").should('have.text', "$"+this.event.cost)
        cy.get("[data-cy='event-details-recurring']").should('have.text', expectedRecurringText)
        cy.get("[data-cy='event-details-location']")
            .should('contain', this.event.location.name)
            .and('contain', this.event.location.address)
            .and('contain', this.event.location.address_additional)
            .and('contain', this.event.location.city)
            .and('contain', this.event.location.zipcode)
            .and('contain', this.event.location.state)
        cy.get("a#event-details-location-link").should("have.text", "View on map")
        cy.get("[data-cy=event-details-organizer]").should('have.text', this.event.contact.name)
        cy.get('[data-cy=email]').should('have.text', this.event.contact.email)
        cy.get('[data-cy=event-details-phone]').should('have.text', this.event.contact.phone)
    })

    it("displays free when there is no cost", function(){
        cy.server()
        cy.fixture("event/99999.json").as("specialEvent").then(event => {
            event.cost = "0.00"
            cy.route("GET", "/api/content/event/99999.json", "@specialEvent").as("TestEventDetails")
        })
        cy.visit("/event/99999")
        cy.get("[data-cy=event-details-cost").should("have.text", "Free")
    })

    it("displays minutes in the time", function(){
        cy.server()
        cy.fixture("event/99999.json").as("specialEvent").then(event => {
            event.startDate =  "2019-03-19T05:55:00-04:00"
            event.endDate = "2019-03-19T12:12:00-04:00"
            event.timezone = "PST"
            cy.route("GET", "/api/content/event/99999.json", "@specialEvent").as("TestEventDetails")
        })
        const expectedTime = "5:55am–12:12pm PST" 

        cy.visit("/event/99999")
        cy.get("[data-cy='event-details-time']").should("have.text", expectedTime)
    })

    it("displays both am and pm in the time", function(){
        cy.server()
        cy.fixture("event/99999.json").as("specialEvent").then(event => {
            event.startDate =  "2019-03-19T10:00:00-04:00"
            event.endDate = "2019-03-19T20:00:00-04:00"
            event.timezone = "PST"
            cy.route("GET", "/api/content/event/99999.json", "@specialEvent").as("TestEventDetails")
        })
        const expectedTime = "10am–8pm PST" 

        cy.visit("/event/99999")
        cy.get("[data-cy='event-details-time']").should("have.text", expectedTime)
    })

    it("displays only pm when both times are pm", function(){
        cy.server()
        cy.fixture("event/99999.json").as("specialEvent").then(event => {
            event.startDate =  "2019-03-19T17:00:00-04:00"
            event.endDate = "2019-03-19T20:00:00-04:00"
            event.timezone = "PST"
            cy.route("GET", "/api/content/event/99999.json", "@specialEvent").as("TestEventDetails")
        })
        const expectedTime = "5–8pm PST" 

        cy.visit("/event/99999")
        cy.get("[data-cy='event-details-time']").should("have.text", expectedTime)
    })

    it("should display leaving sba modal when registration button is clicked", function(){
        cy.server()
        const expectedUrl = this.event.registrationUrl
        cy.route("GET", "/api/content/event/99999.json", "@event").as("EventDetailRoute")
        cy.visit("/event/99999")
        cy.get('[data-cy="registration"]')
        cy.get('button').contains("REGISTER").click()
        cy.get("[data-cy='external url']").should("have.text", expectedUrl)
    })

    it("should display details for an online event", function(){
        cy.server()
        cy.fixture("event/99999.json").as("specialEvent").then(event => {
            event.locationType =  "Online"
            cy.route("GET", "/api/content/event/99999.json", "@specialEvent").as("TestEventDetails")
        })
        cy.visit("/event/99999")
        cy.get("#event-details-location").should("have.text", "Online")
    })

    it("should have a default for unknown recurring values", function(){
        cy.server()
        cy.fixture("event/99999.json").as("specialEvent").then(event => {
            event.recurring =  "Yes"
            event.recurringType = "Recurs semi bi annually"
            cy.route("GET", "/api/content/event/99999.json", "@specialEvent").as("TestEventDetails")
        })
        const expectedRecurringText = "This is a recurring event"
        cy.visit("/event/99999")
        cy.get("[data-cy='event-details-recurring']").should('have.text', expectedRecurringText)
    })

    it("should not display contact section if contact is null", function(){
        cy.server()
        cy.fixture("event/99999.json").as("specialEvent").then(event => {
            event.contact.name =  null
            event.contact.email = "test@test.com"
            event.contact.phone = "1234567890"
            cy.route("GET", "/api/content/event/99999.json", "@specialEvent").as("TestEventDetails")
        })
        cy.visit("/event/99999")
        cy.get("[data-cy='event-details-contact-label']").should('not.exist')
        cy.get("[data-cy=event-details-organizer]").should('not.exist')
        cy.get('[data-cy=email]').should('not.exist')
        cy.get('[data-cy=event-details-phone]').should('not.exist')
    })

    it("should not display recurring details when an event does not recur", function(){
        cy.server()
        cy.fixture("event/99999.json").as("specialEvent").then(event => {
            event.recurring =  "No"
            event.recurringType = "Recurs semi bi annually"
            cy.route("GET", "/api/content/event/99999.json", "@specialEvent").as("TestEventDetails")
        })
        cy.visit("/event/99999")
        cy.get("[data-cy='event-details-recurring']").should("not.exist")
    })
})

describe('Event 404 page', () => {
  it('displays the 404 page when the event is NOT found', function() {
    cy.visit("/event/foo", { failOnStatusCode: false })
    cy.get("[data-cy='error-page-title']").should("have.text", '404')
    cy.get("[data-cy='error-page-message']").should("contain", 'find events page')
  })
})

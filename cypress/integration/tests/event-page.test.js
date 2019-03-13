const mockEventData = require('../../fixtures/event/event.json')

describe('Event page', () => {
    let firstEventId, firstEventTitle, firstEventRegistrationUrl

    before(() => {
        cy.request("/api/content/events.json").then(response => {
            firstEventId = response.body.items[0].id
            firstEventTitle = response.body.items[0].title
            cy.log("Found event id: " + firstEventId)
        });

    })

    let testUrlBase = "/event/"

    it('should load and have a title', function() {
        cy.visit(testUrlBase + firstEventId)
        cy.get("head > title").should("have.text", firstEventTitle)
    })

    it('displays a title for an event', () => {
        cy.server()
        cy.fixture("event/event.json").as("EventDetailResult")
        cy.route("GET", "/api/content/event/" + firstEventId + ".json", "@EventDetailResult").as("EventDetailRoute")
        const expectedTitle = "Event Title"
        cy.visit(testUrlBase + firstEventId)
        cy.get("[data-cy='event-title']").as("EventTitle").should('exist')
        cy.get("@EventTitle").should("have.text", expectedTitle)
    })

    it("should display leaving sba modal when registration button is clicked", function(){
        cy.server()
        const expectedUrl = mockEventData.registrationUrl
        cy.fixture("event/event.json").as("EventDetailResult")
        cy.route("GET", "/api/content/event/" + firstEventId + ".json", "@EventDetailResult").as("EventDetailRoute")
        cy.visit(testUrlBase + firstEventId)
        cy.get('[data-cy="registration"]').should("exist")
        cy.get('button').contains("REGISTER").click()
        cy.get("[data-cy='external url']").should("have.text", expectedUrl)
    })
})

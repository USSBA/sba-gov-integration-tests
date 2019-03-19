const mockEventData = require('../../fixtures/event/event.json')

describe('Event page', () => {
    let firstEventId, firstEventTitle, firstEventRegistrationUrl, firstEventDescription, 

    before(() => {
        cy.request("/api/content/events.json").then(response => {
            firstEventId = response.body.items[0].id
            firstEventTitle = response.body.items[0].title
            firstEventDescription = response.body.items[0].description
            firstEventCost = response.body.items[0].cost
            firstEventLocation = response.body.items[0].location
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

    it('should load and have a description', function() {
        cy.visit(testUrlBase + firstEventId)
        cy.get("[data-cy='event-description']").should("have.text", firstEventDescription)
    })

    it('displays a description for an event', () => {
        cy.server()
        cy.fixture("event/event.json").as("EventDetailResult")
        cy.route("GET", "/api/content/event/" + firstEventId + ".json", "@EventDetailResult").as("EventDetailRoute")
        const expectedDetails = "This is an event description"
        cy.visit(testUrlBase + firstEventId)
        cy.get("[data-cy='event-description']").as("EventDetails").should('exist')
        cy.get("@EventDetails").should("have.text", expectedDetails)
    })

    it('displays cost in details box', () => {
        cy.server()
        cy.fixture("event/event.json").as("EventDetailResult")
        cy.route("GET", "/api/content/event/" + firstEventId + ".json", "@EventDetailResult").as("EventDetailRoute")
        const expectedCost = "$25.00"
        cy.visit(testUrlBase + firstEventId)
        cy.get("[data-cy='event-details-cost']").as("EventCost").should('exist')
        cy.get("@EventDetails").should("have.text", expectedCost)

    it('displays cost in details box', () => {
        cy.server()
        cy.fixture("event/event.json").as("EventDetailResult")
        cy.route("GET", "/api/content/event/" + firstEventId + ".json", "@EventDetailResult").as("EventDetailRoute")
        const expectedCost = "Fayetteville State University1200 Murchison Road, Fayetteville, North Carolina 28301View on Map"
        cy.visit(testUrlBase + firstEventId)
        cy.get("[data-cy='event-details-location']").as("EventLocation").should('exist')
        cy.get("@EventDetails").should("have.text", expectedLocation)

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
describe('Event 404 page', () => {
  let testUrlBase = "/event/"
  it('displays the 404 page when the event is NOT found', function() {
    cy.visit(testUrlBase + 'foo', { failOnStatusCode: false })
    cy.get("[data-cy='error-page-title']").should("have.text", '404')
    cy.get("[data-cy='error-page-message']").should("contain", 'find events page')
  })
})

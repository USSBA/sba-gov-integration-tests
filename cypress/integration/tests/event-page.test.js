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
    it("should have a breadcrumb leading back to the home page", function() {
      cy.server()
      cy.fixture("event/event.json").as("EventDetailResult")
      cy.route("GET", "/api/content/event/" + firstEventId + ".json", "@EventDetailResult").as("EventDetailRoute")
      cy.visit("/event/" + firstEventId)
      const expectedTitle = "Event Title"
      cy.get("[data-cy='last-breadcrumb']").should("contain", expectedTitle)
      cy.get("[data-cy='navigation-breadcrumb-0']").should("contain", 'Find Events')
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

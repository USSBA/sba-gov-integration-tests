describe('Event page', () => {
    let firstEventId, firstEventTitle;

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
})
describe('Event 404 page', () => {
  let testUrlBase = "/event/"
  it('displays the 404 page when the event is NOT found', function() {
    cy.visit(testUrlBase + 'foo', { failOnStatusCode: false })
    cy.get("[data-cy='error-page-title']").should("have.text", '404')
    cy.get("[data-cy='error-page-message']").should("contain", 'find events page')
  })
})

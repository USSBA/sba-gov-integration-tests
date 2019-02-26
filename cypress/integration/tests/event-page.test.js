describe('Event page', () => {
    let firstEventId, firstEventTitle;

    before(() => {
        cy.request("/api/content/events.json").then(response => {
            firstEventId = response.body[0].id
            firstEventTitle = response.body[0].title
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

describe('Event page', () => {
    let firstEventId, firstEventTitle, firstEventDescription;

    before(() => {
        cy.request("/api/content/events.json").then(response => {
            firstEventId = response.body.items[0].id
            firstEventTitle = response.body.items[0].title
            firstEventDescription = response.body.items[0].description
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
})

describe("Course Search Page", function () {
    beforeEach(function() {
        cy.server()
        cy.fixture("course/course-list.json").as("CourseSearchResults")
        cy.route("GET", "/api/content/search/courses.json?businessStage=&sortBy=Title", "@CourseSearchResults").as("CourseSearch")
    })

    describe("course card", function () {

        it("is displayed in the card collection", function () {
            cy.visit("/course")
            cy.wait("@CourseSearch")
            cy.get('[data-testid="card"]').eq(0).as("Card1")
            cy.get("@Card1").find('[data-testid="card image"]').should("have.attr", "alt", "Image 1 Alt")
            cy.get("@Card1").find('[data-testid="card title"]').contains("Course #1")
            cy.get("@Card1").find('[data-testid="card subtitle text"]').contains("Summary for the first course in the list")
            cy.get("@Card1").find('[data-testid="card link"]').as("CardLink")
            cy.get("@CardLink").contains("View course")
            cy.get("@CardLink").should('have.attr', 'href', '/course/course1')
        })
    })

    describe("card collection", function () {
        it("displays the number of cards as results", function () {
            cy.visit("/course")
            cy.get('[data-testid="card"]').should('have.length', this.CourseSearchResults.length)
        })
    })
})
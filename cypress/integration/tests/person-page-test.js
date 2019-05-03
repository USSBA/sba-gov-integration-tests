describe("Person Page", function () {
    before(function () {
        cy.request("/api/content/search/persons.json").then( (persons) => {
            cy.wrap(persons.body[0].url).as("validPersonUrl")
        })
    })

    beforeEach(function () {
        cy.fixture
    })
    
    describe("blog section", function () {
        it("does not display when a person has no blogs", function () {
            cy.server()
            cy.route("GET", "/api/content/search/blogs.json**", {"total":0,"blogs":[]}).as("EmptyBlogRequest")
            cy.visit(this.validPersonUrl)
            cy.wait("@EmptyBlogRequest")
            cy.get("[data-testid='blog-section']").should("not.exist")
        })

        it("displays blog cards when the user has blog posts", function () {
            cy.server()
            cy.fixture("blogs/author-blogs.json").as("AuthorBlogs")
            cy.route("GET", "/api/content/search/blogs.json**", "@AuthorBlogs").as("BlogRequest")
            cy.visit(this.validPersonUrl)
            cy.wait("@BlogRequest")
            cy.get("[data-testid='blog-section']")
        })
    })
    
})
describe("Person Page", function () {

    describe("blog section", function () {
        before(function () {
            cy.request("/api/content/search/persons.json").then( (persons) => {
                cy.wrap(persons.body[0].url).as("validPersonUrl")
            })
        })

        beforeEach(function () {
            cy.fixture("blogs/author-blogs.json").as("AuthorBlogs")
        })

        it("does not display when a person has no blogs", function () {
            cy.server()
            cy.route("GET", "/api/content/search/blogs.json**", {"total":0,"blogs":[]}).as("EmptyBlogRequest")
            cy.visit(this.validPersonUrl)
            cy.wait("@EmptyBlogRequest")
            cy.get("[data-testid='blog-section']").should("not.exist")
        })

        it("displays blog cards when the user has blog posts", function () {
            cy.server()
            cy.route("GET", "/api/content/search/blogs.json**", "@AuthorBlogs").as("BlogRequest")
            cy.visit(this.validPersonUrl)
            cy.wait("@BlogRequest")
            cy.get("[data-testid='blog-section']").within((blogSection) => {
                cy.get("[data-testid='blog-section-header']")
                cy.get("[data-testid='paginator']").should('have.length', 2)
                cy.get("[data-testid='card']")
                    .should('have.length', 6)
                    .each((blog, index) => {
                        cy.get("[data-testid='card']").eq(index).within((card) => {
                            cy.get("[data-testid='card title']")
                                .should('have.text', this.AuthorBlogs.blogs[index].title)
                            cy.get("[data-testid='card italic text']")
                                .should('have.text', "May 2, 2019")
                            cy.get("[data-testid='card subtitle text']")
                                .should('have.text', this.AuthorBlogs.blogs[index].summary)
                            cy.get("[data-testid='card link']")
                                .should('have.attr', 'href', this.AuthorBlogs.blogs[index].url)
                    })
                })
            })
        })

        it("paginates to the next and previous page of results", function() {
            cy.server()
            cy.route("GET", "/api/content/search/blogs.json**", "@AuthorBlogs").as("BlogRequest")
            cy.visit(this.validPersonUrl)
            cy.wait("@BlogRequest")
            cy.get("[data-testid='paginator']").eq(0)
                .find("[data-testid='showing results text']").should("have.text", "Showing 1 - 6 of "+ this.AuthorBlogs.blogs.length)

            // Next page navigation
            cy.get("[data-testid='paginator']").eq(0)
                .find("[data-testid='next button']").click()
            cy.get("[data-testid='paginator']").eq(0)
                .find("[data-testid='showing results text']").should("have.text", "Showing 7 - 7 of "+ this.AuthorBlogs.blogs.length)
            
            // Previous page navigation
            cy.get("[data-testid='paginator']").eq(0)
                .find("[data-testid='previous button']").click()
            cy.get("[data-testid='paginator']").eq(0)
                .find("[data-testid='showing results text']").should("have.text", "Showing 1 - 6 of "+ this.AuthorBlogs.blogs.length)
        })

        it("does not allow pagination navigation there are no more results", function () {
            cy.server()
            cy.fixture("blogs/author-blogs.json").then(function(singleBlogResult) {
                singleBlogResult.blogs = singleBlogResult.blogs.slice(-1)
                singleBlogResult.total = singleBlogResult.blogs.length
                cy.route("GET", "/api/content/search/blogs.json**", singleBlogResult).as("BlogRequest")
            })
            cy.visit(this.validPersonUrl)
            cy.wait("@BlogRequest")
            cy.get("[data-testid='paginator']").eq(0)
                .find("[data-testid='showing results text']").should("have.text", "Showing 1 - 1 of 1")
            cy.get("[data-testid='paginator']").eq(0)
                .find("[data-testid='next button']").click()
            cy.get("[data-testid='paginator']").eq(0)
                .find("[data-testid='showing results text']").should("have.text", "Showing 1 - 1 of 1")
        })
    })    
})
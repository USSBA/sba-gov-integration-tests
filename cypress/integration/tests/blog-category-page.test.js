import moment from 'moment'
describe("Blog Category Page", function () {

    beforeEach(function () {
        cy.fixture("blogs/industry-word-blogs-page-1.json").as("IndustryWordDataPage1")
        cy.fixture("blogs/industry-word-blogs-page-2.json").as("IndustryWordDataPage2")
    })

    const blogCategories = [
        {
            name: "News and Views",
            title: "SBA News and Views",
            url: "/blogs/news-and-views",
            subtitle: "Insights and updates from SBA's small business experts.",
            fixture: 'news-and-views-blogs-page-1.json',
        }, 
        {
            name: "Industry Word",
            title: "Industry Word",
            url: "/blogs/industry-word",
            subtitle: "Commentary and advice from leaders in the small business industry.",
            fixture: 'industry-word-blogs-page-1.json',
        }
    ]

    blogCategories.forEach((category) => {
        it(`${category.name} displays blogs for that category`, function(){
            cy.server()
            cy.fixture(`blogs/${category.fixture}`).as("BlogData")
            cy.route("GET", `/api/content/search/blogs.json?category=${category.name}&start=0&end=12`, `@BlogData`).as("BlogRequest")
            
            cy.visit(category.url)
            cy.wait("@BlogRequest")
            cy.get("[data-testid='blog-category-title']")
                .contains(`${category.title} posts`)
            cy.get("[data-testid='blog-category-subtitle']")
                .contains(category.subtitle)
            cy.get("[data-testid='blog-top-paginator']")
                .should('have.text', "Showing 1 - 12 of 18")
            cy.get("[data-testid='blog-bottom-paginator']")
                .should('have.text', "Showing 1 - 12 of 18")
            cy.get("[data-testid='card']").then(($card) => {
                cy.wrap($card).should("have.length", this.BlogData.blogs.length)
            })
            .each(($blogCard, index) => {
                cy.wrap($blogCard).within(function(){
                    cy.get('[data-testid="card italic text"]')
                        .should('have.text', moment.unix(this.BlogData.blogs[index].created).format("MMMM D, YYYY"))
                    cy.get('[data-testid="card title"]')
                        .should('have.text', this.BlogData.blogs[index].title)
                    cy.get('[data-testid="card subtitle text"]')
                        .should('have.text', this.BlogData.blogs[index].summary)
                    cy.get('[data-testid="card link"]')
                        .should('have.text', "Read full post")
                        .and('have.attr', 'href', this.BlogData.blogs[index].url)
                })
            })
        })
    })

    it("allows paginating through results", function(){
        cy.server()
        cy.route("GET", `/api/content/search/blogs.json?category=Industry Word&start=0&end=12`, this.IndustryWordDataPage1).as("BlogRequest1")
        cy.route("GET", `/api/content/search/blogs.json?category=Industry Word&start=12&end=24`,this.IndustryWordDataPage2).as("BlogRequest2")

        cy.visit("/blogs/industry-word")
        cy.wait("@BlogRequest1")
        cy.get('[data-testid=blog-top-paginator]')
            .should('have.text', "Showing 1 - 12 of 18")
            .find('[data-testid="next button"]')
            .click()
        cy.wait("@BlogRequest2")
        cy.get('[data-testid=blog-top-paginator]')
            .should("have.text", "Showing 13 - 18 of 18")
        cy.get("[data-testid='card']").then(($cards) => {
            cy.wrap($cards)
            .should("have.length", this.IndustryWordDataPage2.blogs.length)
            .each(($card, index) => {
                cy.wrap($card)
                .find('[data-testid="card title"]')
                .should('have.text',  this.IndustryWordDataPage2.blogs[index].title)
            })
        })
    })

    it("does not allow pagination backwards from the first page", function(){
        cy.server()
        cy.route("GET", `/api/content/search/blogs.json?category=Industry Word&start=0&end=12`, this.IndustryWordDataPage1).as("BlogRequest1")
        cy.route("GET", `/api/content/search/blogs.json?category=Industry Word&start=12&end=24`,this.IndustryWordDataPage2).as("BlogRequest2")

        cy.visit("/blogs/industry-word")
        cy.wait("@BlogRequest1")
        cy.get('[data-testid=blog-top-paginator]')
            .should('have.text', "Showing 1 - 12 of 18")
            .find('[data-testid="previous button"]')
            .click()
        cy.wait("@BlogRequest1")
        cy.get('[data-testid=blog-top-paginator]')
            .should('have.text', "Showing 1 - 12 of 18")
    })

    it("does not allow pagination forwards from the last page", function(){
        cy.server()
        cy.route("GET", `/api/content/search/blogs.json?category=Industry Word&start=0&end=12`, this.IndustryWordDataPage1).as("BlogRequest1")
        cy.route("GET", `/api/content/search/blogs.json?category=Industry Word&start=12&end=24`,this.IndustryWordDataPage2).as("BlogRequest2")

        cy.visit("/blogs/industry-word")
        cy.wait("@BlogRequest1")
        cy.get('[data-testid=blog-top-paginator]')
            .should('have.text', "Showing 1 - 12 of 18")
            .find('[data-testid="next button"]')
            .click()
        cy.wait("@BlogRequest2")
        cy.get('[data-testid=blog-top-paginator]')
            .should("have.text", "Showing 13 - 18 of 18")
            .find('[data-testid="next button"]')
            .click()
        cy.wait("@BlogRequest2")
        cy.get('[data-testid=blog-top-paginator]')
            .should("have.text", "Showing 13 - 18 of 18")
    })
})
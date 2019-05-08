import moment from 'moment'
describe("Blog Category Page", function () {
    beforeEach(function () {
        cy.fixture("blogs/news-and-views-blogs-page-1.json").as("NewsViewsPage1")
        cy.fixture("blogs/news-and-views-blogs-page-2.json").as("NewsViewsPage2")
    })

    it("News and Views displays blogs for this category", function () {
        cy.server()
        cy.route("GET", "/api/content/search/blogs.json?category=News and Views&start=0&end=12", "@NewsViewsPage1").as("BlogRequest")
        cy.visit("/blogs/news-and-views")
        cy.get("[data-testid='blog-category-title']")
            .contains("SBA News and Views posts")
        cy.get("[data-testid='blog-category-subtitle']")
            .contains("Insights and updates from SBA's small business experts.")
        cy.get("[data-testid='blog-top-paginator']")
        cy.get("[data-testid='blog-bottom-paginator']")
        cy.get("[data-testid='card']")
            .should("have.length", 12)
            .each(($blogCard, index) => {
                cy.wrap($blogCard).within(function(){
                    cy.get('[data-testid="card italic text"]')
                        .should('have.text', moment.unix(this.NewsViewsPage1.blogs[index].created).format("MMMM D, YYYY"))
                    cy.get('[data-testid="card title"]')
                        .should('have.text', this.NewsViewsPage1.blogs[index].title)
                    cy.get('[data-testid="card subtitle text"]')
                        .should('have.text', this.NewsViewsPage1.blogs[index].summary)
                    cy.get('[data-testid="card link"]')
                        .should('have.text', "Read full post")
                        .and('have.attr', 'href', this.NewsViewsPage1.blogs[index].url)
                })
            })
    })
})
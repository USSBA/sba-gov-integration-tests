import moment from 'moment'

describe("Blogs landing page", function() {
  beforeEach(function() {
    cy.fixture("blogs/news-and-views-blogs.json").as("NewsAndViewsBlogs")
    cy.fixture("blogs/industry-word-blogs.json").as("IndustryWordBlogs")
  })

  it('displays the blog landing page hero', function() {
    cy.visit("/blogs/")
    cy.get("[data-testid=blogs-hero]")
  })

  it('displays category information for both categories', function() {
    cy.server()
    cy.route("GET", "/api/content/search/blogs.json?category=News and Views&end=3&order=desc", this.NewsAndViewsBlogs).as("NewsAndViewsRequest")
    cy.route("GET", "/api/content/search/blogs.json?category=Industry Word&end=3&order=desc", this.IndustryWordBlogs).as("IndustryWordRequest")

    const newsAndViewsCategory = {
      title: 'SBA News & Views posts',
      subtitle: "Insights and updates from SBA's small business experts."
    }

    const industryWordCategory = {
      title: 'Industry Word posts',
      subtitle: "Commentary and advice from leaders in the small business industry."
    }

    cy.visit("/blogs/")
    cy.wait("@NewsAndViewsRequest")
    cy.wait("@IndustryWordRequest")

    cy.get("[data-testid='SBA News & Views posts']").within((NewsAndViewsCategory) => {
      cy.get("[data-testid=category-title]").should("have.text", newsAndViewsCategory.title)
      cy.get("[data-testid=category-subtitle]").should("have.text", newsAndViewsCategory.subtitle)
      cy.get("[data-testid=card]").should('have.length', 3)
      cy.get("[data-testid='see more button']").should("have.text", "SEE MORE POSTS")
      cy.get("[data-testid='see more button']").should("have.attr","href", "/blogs/news-and-views")
    })

    cy.get("[data-testid='Industry Word posts']").within((IndustryWordCategory) => {
      cy.get("[data-testid=category-title]").should("have.text", industryWordCategory.title)
      cy.get("[data-testid=category-subtitle]").should("have.text", industryWordCategory.subtitle)
      cy.get("[data-testid=card]").should('have.length', 3)
      cy.get("[data-testid='see more button']").should("have.text", "SEE MORE POSTS")
      cy.get("[data-testid='see more button']").should("have.attr","href", "/blogs/industry-word")
    })
  })
      
  it("displays blog information on the card", function() {
    cy.server()
    cy.route("GET", "/api/content/search/blogs.json?category=News and Views&end=3&order=desc", "@NewsAndViewsBlogs").as("NewsAndViewsRequest")
    cy.visit("/blogs/")
    cy.wait("@NewsAndViewsRequest")

    cy.get('[data-testid="card"]').eq(0).as("Card1").within(function(FirstBlogCard) {
      const formattedDate = moment.unix(this.NewsAndViewsBlogs[0].created).format('MMMM D, YYYY')

      cy.get('[data-testid="card title"]').should("have.text", this.NewsAndViewsBlogs[0].title)
      cy.get('[data-testid="card italic text"]').should("have.text", formattedDate)
      cy.get('[data-testid="card subtitle text"]').should("have.text", this.NewsAndViewsBlogs[0].summary)
      cy.get('[data-testid="card link"]').should("have.text", "Read full post")
    })
  })
})

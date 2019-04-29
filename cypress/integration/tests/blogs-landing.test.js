describe("Blogs landing page", function() {
  it('displays the blog landing page hero', function() {
    cy.visit("/blogs/")
    cy.get("[data-testid=blogs-hero]")
  })

  it('displays both category titles and subtitles', function() {
    cy.server()
    cy.fixture("blogs/news-and-views-blogs.json").as("NewsAndViewsBlogs").then(() => {
      cy.route("GET", "/api/content/search/blogs.json?category=News and Views&end=3&order=desc", "@NewsAndViewsBlogs")
    })
    cy.fixture("blogs/industry-word-blogs.json").as("IndustryWordBlogs").then(() => {
      cy.route("GET", "/api/content/search/blogs.json?category=Industry Word&end=3&order=desc", "@IndustryWordBlogs")
    })

    const firstCategory = {
      title: 'SBA News & Views posts',
      subtitle: "Insights and updates from SBA's small business experts."
    }

    const secondCategory = {
      title: 'Industry Word posts',
      subtitle: "Commentary and advice from leaders in the small business industry."
    }

    cy.visit("/blogs/")
    cy.get("[data-testid=category-title]").eq(0).should("have.text", firstCategory.title)
    cy.get("[data-testid=category-subtitle]").eq(0).should("have.text", firstCategory.subtitle)
    cy.get("[data-testid=category-title]").eq(1).should("have.text", secondCategory.title)
    cy.get("[data-testid=category-subtitle]").eq(1).should("have.text", secondCategory.subtitle)
  })

  it('displays three blogs for a category', function() {
    cy.server()
    cy.fixture("blogs/news-and-views-blogs.json").as("NewsAndViewsBlogs").then(() => {
      cy.route("GET", "/api/content/search/blogs.json?category=News and Views&end=3&order=desc", "@NewsAndViewsBlogs")
    })

    cy.visit("/blogs/")

    cy.get("[data-testid='SBA News & Views posts']").as("NewsAndViewsCategory")
      .find("[data-testid=card]").should('have.length', 3)
  })
})

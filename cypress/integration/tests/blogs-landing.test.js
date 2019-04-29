describe("Blogs landing page", function() {
  it('displays the blog landing page hero', function() {
    cy.visit("/blogs/")
    cy.get("[data-testid=blogs-hero]")
  })

  it('displays category information for both categories', function() {
    cy.server()
    cy.fixture("blogs/news-and-views-blogs.json").as("NewsAndViewsBlogs").then(() => {
      cy.route("GET", "/api/content/search/blogs.json?category=News and Views&end=3&order=desc", "@NewsAndViewsBlogs")
    })
    cy.fixture("blogs/industry-word-blogs.json").as("IndustryWordBlogs").then(() => {
      cy.route("GET", "/api/content/search/blogs.json?category=Industry Word&end=3&order=desc", "@IndustryWordBlogs")
    })

    const newsAndViewsCategory = {
      title: 'SBA News & Views posts',
      subtitle: "Insights and updates from SBA's small business experts."
    }

    const industryWordCategory = {
      title: 'Industry Word posts',
      subtitle: "Commentary and advice from leaders in the small business industry."
    }

    cy.visit("/blogs/")

    cy.get("[data-testid='SBA News & Views posts']").within((NewsAndViewsCategory) => {
      cy.get("[data-testid=category-title]").should("have.text", newsAndViewsCategory.title)
      cy.get("[data-testid=category-subtitle]").should("have.text", newsAndViewsCategory.subtitle)
      cy.get("[data-testid=card]").should('have.length', 3)
      cy.get("[data-testid='see more button']").should("have.text", "SEE MORE POSTS")
    })

    cy.get("[data-testid='Industry Word posts']").within((IndustryWordCategory) => {
      cy.get("[data-testid=category-title]").should("have.text", industryWordCategory.title)
      cy.get("[data-testid=category-subtitle]").should("have.text", industryWordCategory.subtitle)
      cy.get("[data-testid=card]").should('have.length', 3)
      cy.get("[data-testid='see more button']").should("have.text", "SEE MORE POSTS")
    })
  })
})

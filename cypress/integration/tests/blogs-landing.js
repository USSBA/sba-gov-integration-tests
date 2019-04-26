describe("Blogs landing page", function() {
  it('displays a the blog landing page hero', function() {
    cy.visit("/blogs/")
    cy.get("[data-testid=blogs-hero]")
  })
})

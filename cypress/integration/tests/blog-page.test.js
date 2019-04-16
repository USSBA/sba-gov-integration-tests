describe('Blog Page', function () {
    before(function () {
        // This will only work temporarily.  We should be using the
        // blogs endpoint to get a valid blog 
        cy.wrap('18343').as("validBlogId")
    })

    it('displays a basic blog for a valid blog', function() {
        cy.visit(`/blog/${this.validBlogId}`)
        cy.get("[data-testid=blog-content]")
    })

    it('displays an error for an invalid blog', function() {
        cy.server()
        cy.route({
            method: "GET",
            force404: true,
            response: { things: "thing" },
            status: '404',
            url: "/api/content/node/**"
        }
        ).as("BlogRequest")
        cy.visit(`/blog/${ this.validBlogId }`)
        cy.get('[data-testid=blog-error]')
        cy.contains("404")
    })

    it('displays a loader when the page is loading', function(){
        cy.server({delay: 10000})
        cy.route("GET", "/api/content/node/**", { data: "things" }).as("BlogRequest")
        cy.visit(`/blog/${ this.validBlogId }`)
        cy.get('[data-testid=blog-loader]')
        cy.get('[data-cy=loader]')
    })
})
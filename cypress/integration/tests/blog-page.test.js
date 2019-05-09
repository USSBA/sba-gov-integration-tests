describe('Blog Page', function () {
    before(function () {
        cy.request("GET", "/api/content/search/blogs.json?end=1")
        .then((blog)=>{
            cy.wrap(blog.body.blogs[blog.body.blogs.length-1].url.replace("/blog/", "")).as("validBlogUrl")
            cy.wrap(blog.body.blogs[blog.body.blogs.length-1].id).as("validBlogId")
            cy.wrap(blog.body.blogs[blog.body.blogs.length-1].author).as("validBlogAuthor")
        })

        cy.request("GET", "/api/content/persons.json")
        .then((person) =>{
            cy.wrap(person.body[person.body.length-1].id).as("ValidAuthorId")
        })
    })
    
    beforeEach(function () {
        cy.fixture("blog/blog-page.json").as("BlogPage")
        cy.fixture("blog/blog-author.json").as("BlogAuthor")
    })

    it('displays a basic blog for a valid blog', function() {
        cy.server()
        this.BlogPage.author = this.validBlogAuthor
        cy.route("GET", `/api/content/${ this.validBlogId }.json`, "@BlogPage" )
        cy.route("GET", `/api/content/${ this.validBlogAuthor }.json`, "@BlogAuthor" )

        cy.visit(`/blog/${ this.validBlogUrl }`)

        // Header Content
        cy.get("[data-testid=blog-content]")
        cy.get("[data-testid=postAuthor]").contains(this.BlogAuthor.name)
        cy.get("[data-testid=postDate]").should('contain', "01/01/2019")
        cy.get("[data-testid=postCategory]").should('contain', this.BlogPage.blogCategory)
        cy.get("[data-testid=title]")
        cy.get("[data-testid=summary]")

        // Sections
        cy.get("data-testid=blog-section").each((section, index) => {
            section.find("[data-testid=blog-text]")
                .should("have.text", this.BlogPage.blogBody[index].blogSectionText)
            section.find("[data-testid=blog-image]")
                .should("have.attr", "src", this.BlogPage.blogBody[index].blogSectionImage.url)
        })

        // Author Card
        cy.get("[data-testid=authorCard]").as("AuthorCard")
        cy.get("@AuthorCard").find("[data-testid=name]").should('contain',this.BlogAuthor.name)
        cy.get("@AuthorCard").find("[data-testid=title]").should('contain', this.BlogAuthor.title)
        cy.get("@AuthorCard").find("[data-testid=bio]").should('contain', this.BlogAuthor.shortBio)
        cy.get("@AuthorCard").find("[data-testid=read-more]")
            .should('contain', "Read More")
            .find('a').should("has.attr", "href", this.BlogAuthor.url)
        cy.get("[data-testid=picture]").should("not.exist")
    })

    it("displays an author card with an image", function () {
        cy.server()
        this.BlogPage.author = this.validBlogAuthor
        this.BlogAuthor.highResolutionPhoto = "/sites/default/files/2019-02/steven-lancellotta-hires.jpg"
        this.BlogAuthor.picture.src = "/sites/default/files/2019-02/steven-lancellotta.jpg"
        this.BlogAuthor.picture.alt = "Author Name Alt Text"

        cy.route("GET", `/api/content/${ this.validBlogId }.json`, "@BlogPage" )
        cy.route("GET", `/api/content/${ this.validBlogAuthor }.json`, "@BlogAuthor" )
        cy.visit(`/blog/${ this.validBlogUrl }`)
        cy.get("[data-testid=authorCard]").find("[data-testid=picture]").find("img").as("AuthorPicture")
            .should("have.attr", "src", this.BlogAuthor.picture.src )
            .and("have.attr", "alt", this.BlogAuthor.picture.alt )
    })

    it('displays a "fake" 404 when an author cannot be retireved', function(){
        cy.server()
        this.BlogPage.author = this.validBlogAuthor
        cy.route("GET", `/api/content/${ this.validBlogId }.json`, "@BlogPage" )
        cy.route({
            method: "GET",
            force404: true,
            response: { things: "thing" },
            status: '404',
            url: `/api/content/${ this.validBlogAuthor }.json`
        }
        ).as("AuthorRequest")
        cy.visit(`/blog/${ this.validBlogUrl }`)
        cy.get('[data-testid=blog-error]')
        cy.contains("404")
    })

    it('displays a "fake" 404 when a blog cannot be retrieved', function() {
        cy.server()
        cy.route({
            method: "GET",
            force404: true,
            response: { things: "thing" },
            status: '404',
            url: `/api/content/${ this.validBlogId }.json`
        }
        ).as("BlogRequest")
        cy.route("GET", `/api/content/${ this.validBlogAuthor }.json`, "@BlogAuthor" )
        cy.visit(`/blog/${ this.validBlogUrl }`)
        cy.get('[data-testid=blog-error]')
        cy.contains("404")
    })

    it('displays a loader when the page is loading', function(){
        cy.server({delay: 10000})
        cy.route("GET", `/api/content/${ this.validBlogId }.json`, { data: "things" }).as("BlogRequest")
        cy.visit(`/blog/${ this.validBlogUrl }`)
        cy.get('[data-testid=blog-loader]')
        cy.get('[data-cy=loader]')
    })
})
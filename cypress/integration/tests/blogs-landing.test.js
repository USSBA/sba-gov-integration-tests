import moment from 'moment'

describe("Blogs landing page", function() {
  beforeEach(function() {
    cy.fixture("blogs/news-and-views-blogs.json").as("NewsAndViewsBlogs")
    cy.fixture("blogs/industry-word-blogs.json").as("IndustryWordBlogs")
    cy.fixture("blogs/blog-authors.json").as("BlogAuthors")
    cy.fixture("blogs/authors/111.json").as("Author111")
    cy.fixture("blogs/authors/222.json").as("Author222")
    cy.fixture("blogs/authors/333.json").as("Author333")
    cy.fixture("blogs/authors/444.json").as("Author444")
    cy.fixture("blogs/authors/555.json").as("Author555")
    cy.fixture("blogs/authors/666.json").as("Author666")
  })
  
  it('displays all landing page elements', function() {
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

    cy.get("[data-testid=blogs-hero]")
    
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

    cy.get("[data-testid=authorSection]").within((AuthorSection) => {
      cy.get("[data-testid=authorSectionTitle]")  // check the author section title
      cy.get("[data-testid=authorSectionSubtitle]") // check the author section subtitle
      cy.get("[data-testid=authorCardCollection]")
      cy.get("[data-testid=authorCard]").should('have.length', 6)
    })
  })
      
  it("displays blog information on the card", function() {
    cy.server()
    cy.route("GET", "/api/content/search/blogs.json?category=News and Views&end=3&order=desc", "@NewsAndViewsBlogs").as("NewsAndViewsRequest")
    cy.visit("/blogs/")
    cy.wait("@NewsAndViewsRequest")

    cy.get('[data-testid="card"]').eq(0).as("Card1").within(function(FirstBlogCard) {
      const formattedDate = moment.unix(this.NewsAndViewsBlogs.blogs[0].created).format('MMMM D, YYYY')

      cy.get('[data-testid="card title"]').should("have.text", this.NewsAndViewsBlogs.blogs[0].title)
      cy.get('[data-testid="card italic text"]').should("have.text", formattedDate)
      cy.get('[data-testid="card subtitle text"]').should("have.text", this.NewsAndViewsBlogs.blogs[0].summary)
      cy.get('[data-testid="card link"]').should("have.text", "Read full post")
    })
  })

  describe("author section", function () {
    it("displays no authors when no authors are in the authors.json", function () {
      const expectedAuthors = []
      cy.server()
      cy.route("GET", "/api/content/search/authors.json", expectedAuthors).as("AuthorsRequest")
      cy.visit('/blogs')
      cy.wait("@AuthorsRequest")
      cy.get("[data-testid=authorCardCollection]").should('not.exist')
      cy.get("[data-testid=authorCard").should('not.exist')
    })

    it("does not display author cards for invalid authors", function(){
      const expectedAuthor = 9999999
      const expectedAuthors = [expectedAuthor]
      cy.server()
      cy.route("GET", "/api/content/search/authors.json", expectedAuthors).as("AuthorsRequest")
      cy.route({
        method: 'GET',
        url: `/api/content/${expectedAuthor}.json`,
        status: 404,
        response: { 'null' : null }
      }).as("AuthorRequest")
      cy.visit('/blogs')
      cy.wait("@AuthorsRequest")
      cy.wait("@AuthorRequest")
      cy.get("[data-testid=authorCardCollection]").should('not.exist')
      cy.get("[data-testid=authorCard]").should('not.exist')
    })

    it("displays a card for a valid author found", function(){
      const expectedAuthors = [111]
      cy.server()
      cy.route("GET", "/api/content/search/authors.json", expectedAuthors).as("AuthorsRequest")
      cy.route("GET", "/api/content/111.json", "@Author111").as("AuthorPersonRequest")
      cy.visit('/blogs')
      cy.wait("@AuthorsRequest")
      cy.wait("@AuthorPersonRequest")
      cy.get("[data-testid=authorCard]").should("have.length", 1)
      cy.get("[data-testid=authorCard]").eq(0).within((card)=>{
        cy.get("[data-testid=name]").should("have.text", this.Author111.name)
        cy.get("[data-testid=title]").should("have.text", this.Author111.title)
        cy.get("[data-testid=bio]").should("have.text", this.Author111.shortBio)
        cy.get("[data-testid=see-all-posts] a").should("have.attr", "href", this.Author111.url + '#posts')
      })
    })

    it("displays a card for multiple authors found", function () {
      const expectedAuthors = [111, 222, 333]
      cy.server()
      cy.route("GET", "/api/content/search/authors.json", expectedAuthors).as("AuthorsRequest")
      cy.route("GET", "/api/content/111.json", "@Author111").as("AuthorRequest111")
      cy.route("GET", "/api/content/222.json", "@Author222").as("AuthorRequest222")
      cy.route("GET", "/api/content/333.json", "@Author333").as("AuthorRequest333")

      cy.visit('/blogs')

      cy.wait("@AuthorsRequest")
      cy.wait("@AuthorRequest111")
      cy.wait("@AuthorRequest222")
      cy.wait("@AuthorRequest333")


      cy.get("[data-testid=authorCard]").should("have.length", 3)
      cy.get("[data-testid=authorCard]").eq(0)
        .find("[data-testid=name]").should("have.text", this.Author111.name)
      cy.get("[data-testid=authorCard]").eq(1)
        .find("[data-testid=name]").should("have.text", this.Author222.name)
      cy.get("[data-testid=authorCard]").eq(2)
        .find("[data-testid=name]").should("have.text", this.Author333.name)
    })

    it("displays many authors in the author section", function(){
      const expectedAuthors = [111, 111, 111, 111, 111, 111, 111, 111]
      cy.server()
      cy.route("GET", "/api/content/search/authors.json", expectedAuthors).as("AuthorsRequest")
      cy.route("GET", "/api/content/111.json", "@Author111").as("Author111")
      cy.visit('/blogs')
      cy.wait("@AuthorsRequest")
      cy.wait("@Author111")
      cy.get("[data-testid=authorCard]").should("have.length", 8)
    })
  })
})

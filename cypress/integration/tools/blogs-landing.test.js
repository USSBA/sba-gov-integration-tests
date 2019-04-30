//import moment from 'moment'

describe("Blogs landing page", function() {
  beforeEach(function() {
    cy.fixture("blogs/news-and-views-blogs.json").as("NewsAndViewsBlogs")
    cy.fixture("blogs/industry-word-blogs.json").as("IndustryWordBlogs")
  })

  it('displays with whatever I want!', function() {
    cy.server()

    // Setting viewport sizes
    // cy.viewport(1000,1000)
    // cy.viewport(500,1000)
    
    // Removing posts
    // this.NewsAndViewsBlogs.pop()
    // this.NewsAndViewsBlogs.pop()

    // Adding multiple items
    // this.NewsAndViewsBlogs.push(this.NewsAndViewsBlogs[2])
    // this.NewsAndViewsBlogs.push(this.NewsAndViewsBlogs[2])
    // this.NewsAndViewsBlogs.push(this.NewsAndViewsBlogs[2])
    // this.NewsAndViewsBlogs.push(this.NewsAndViewsBlogs[2])

    // Customizing the first post
    // this.NewsAndViewsBlogs[0].title="First Blog Ttitle"
    // this.NewsAndViewsBlogs[0].created="1114819200"
    // this.NewsAndViewsBlogs[0].summary = "This is a summary for the first blog"
    // this.NewsAndViewsBlogs[0].url=null
    
    cy.route("GET", "/api/content/search/blogs.json?category=News and Views&end=3&order=desc", this.NewsAndViewsBlogs).as("NewsAndViewsRequest")
    cy.route("GET", "/api/content/search/blogs.json?category=Industry Word&end=3&order=desc", this.IndustryWordBlogs).as("IndustryWordRequest")

    cy.visit("/blogs/")
    cy.wait("@NewsAndViewsRequest")
    cy.wait("@IndustryWordRequest")

  })
})

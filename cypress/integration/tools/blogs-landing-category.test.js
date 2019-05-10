//import moment from 'moment'

describe("Blogs landing page", function() {
  beforeEach(function() {
    cy.fixture("blogs/news-and-views-blogs.json").as("NewsAndViewsBlogs")
    cy.fixture("blogs/industry-word-blogs.json").as("IndustryWordBlogs")
  })

  it('displays with whatever I want!', function() {
    cy.server()

    const expectedAuthors = [ 123412341234, 182121341]

    const NewsAndViewsResponse = {
      "total": 226,
      "blogs": [
      {
      "author": 1111,
      "blogBody": [],
      "blogCategory": "News and Views",
      "blogTags": "Managing a Business",
      "summary": "Summary: News and Views",
      "type": "blog",
      "title": "Title: News and Views",
      "id": 18965,
      "updated": 1557245538,
      "created": 1556726992,
      "langCode": "en",
      "url": "/blog/news-and-views-page"
      }
    ]
    }

    const IndustryWordResponse = 
    {
      "total": 226,
      "blogs": [
      {
      "author": 2222,
      "blogBody": [],
      "blogCategory": "Industry Word",
      "blogTags": "Managing a Business",
      "summary": "Summary: Industry Word",
      "type": "blog",
      "title": "Title: Industry Word",
      "id": 18965,
      "updated": 1557245538,
      "created": 1556726992,
      "langCode": "en",
      "url": "/blog/industry-word-page"
      }
    ]
    }
    
    cy.route(
      {
        method: "GET",
        url: "/api/content/search/blogs.json?category=News and Views&end=3&order=desc",
        delay: 1000,
        response: NewsAndViewsResponse
      }
     ).as("NewsAndViewsRequest")

    cy.route(
      {
        method: "GET",
        url: "/api/content/search/blogs.json?category=Industry Word&end=3&order=desc",
        response: IndustryWordResponse
      }
     ).as("IndustryWordRequest")

    cy.visit("/blogs/")

  })
})

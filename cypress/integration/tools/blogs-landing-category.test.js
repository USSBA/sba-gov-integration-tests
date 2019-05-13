describe("Blogs landing page", function () {

  it('display blogs in the correct categories', function () {
    cy.server()

    const NewsAndViewsResponse = {
      "total": 226,
      "blogs": [
        {
          "author": 1111,
          "blogBody": [],
          "blogCategory": "SBA News and Views",
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
        url: "/api/content/search/blogs.json?category=SBA News and Views&end=3&order=desc",
        delay: 10000,
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
    cy.wait("@NewsAndViewsRequest")
    cy.wait("@IndustryWordRequest")
    cy.get("[data-testid='Industry Word posts']")
      .find("[data-testid='card title']")
      .should("have.text", IndustryWordResponse.blogs[0].title)
    cy.get("[data-testid='SBA News & Views posts']")
      .find("[data-testid='card title']")
      .should("have.text", NewsAndViewsResponse.blogs[0].title)
  })
})

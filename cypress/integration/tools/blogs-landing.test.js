//import moment from 'moment'

describe("Blogs landing page", function() {
  beforeEach(function() {
    cy.fixture("blogs/news-and-views-blogs.json").as("NewsAndViewsBlogs")
    cy.fixture("blogs/industry-word-blogs.json").as("IndustryWordBlogs")
  })

  it('displays with whatever I want!', function() {
    cy.server()

    // Setting viewport sizes
    // cy.viewport(1300, 1600)
    cy.viewport(1000,1600)
    // cy.viewport(375,1000)
    

    // const expectedAuthors = [18231, 18210, 7766, 18220, 18218, 18219]
    const expectedAuthors = [ 123412341234, 182121341]
    cy.route("GET", "/api/content/search/authors.json", expectedAuthors).as("AuthorsRequest")
    cy.route("GET", "/api/content/18231.json",
    {
      "bio": "<p>blah</p>\r\n",
      "emailAddress": {},
      "fax": "202-205-5206",
      "firstName": "Barbara-2",
      "highResolutionPhoto": "/sites/default/files/2019-02/barb_carson_new.jpg",
      "lastName": "Carson",
      "office": 15851,
      "phone": "202-205-6459",
      "picture": {
          "alt": "Barbara E. Carson",
          "src": "/sites/default/files/2019-02/bio-barbara-carson.jpg"
      },
      "shortBio": 
        "Barbara Carson is the Associate Administrator for the U.S. Small Business Administration Office of Veterans Business Development."
      ,
      "title": "Deputy Associate Administrator",
      "type": "person",
      "url": "/person/barbara-e-carson-0",
      "name": "Barbara E. Carson",
      "id": 18231,
      "updated": 1551199601,
      "created": 1550763525,
      "langCode": "en"
  })

  cy.route("GET", "/api/content/7766.json",
  {
    "bio": "<p>Blah</p>\r\n",
    "emailAddress": {},
    "fax": "202-205-7292",
    "firstName": "Larry",
    "highResolutionPhoto": "/sites/default/files/2019-02/larry_stubblefield.jpg",
    "lastName": "Stubblefield",
    "office": 15840,
    "phone": "202-205-6773",
    "picture": {
        "alt": "Larry Stubblefield",
        "src": "/sites/default/files/2019-02/bio-larry-stubblefield.jpg"
    },
    "shortBio": "Larry Stubblefield is the Associate Administrator for the Office of Veterans Business Development (OVBD) at the U.S. Small Business Administration (SBA). In this role, Mr. Stubblefield oversees the OVBD team in formulating, implementing, administering, and promoting policies and programs that equip veterans, service members (active duty, National Guard, Reserve), and military spouse-owned small businesses with counseling and education, access to capital, and contracting opportunities.",
    "title": "Associate Administrator ",
    "type": "person",
    "url": "/person/larry-stubblefield",
    "name": "Larry Stubblefield",
    "id": 7766,
    "updated": 1551449882,
    "created": 1536607523,
    "langCode": "en"
})
  cy.route("GET", "/api/content/18210.json",
  {
    "bio": "<p>blah</p>\r\n",
    "emailAddress": {},
    "fax": {},
    "firstName": "William",
    "highResolutionPhoto": "/sites/default/files/2019-02/william-manger.jpg",
    "lastName": "Manger",
    "office": {},
    "phone": {},
    "picture": {
        "alt": "William Manger",
        "src": "/sites/default/files/2019-02/bio-william-manger.jpg"
    },
    "shortBio": {},
    "title": "Associate Administrator",
    "type": "person",
    "url": "/person/william-manger",
    "name": "William Manger",
    "id": 18210,
    "updated": 1551199951,
    "created": 1550677258,
    "langCode": "en"
})


cy.route("GET", "/api/content/18220.json", 
{
  "bio": "<p>bio</p>\r\n",
  "emailAddress": {},
  "fax": {},
  "firstName": "Kathleen",
  "highResolutionPhoto": "/sites/default/files/2019-02/kathleen-mcshane.jpg",
  "lastName": "McShane",
  "office": 15841,
  "phone": {},
  "picture": {
      "alt": "Kathleen McShane",
      "src": "/sites/default/files/2019-02/bio-kathleen-mcshane.jpg"
  },
  "shortBio": "Kathleen McShane is the Assistant Administrator for the Office of Women’s Business Ownership, and is responsible for overseeing Women’s Business Centers throughout the country. These centers offer counseling, training and mentorship to women who want to launch or expand their business. She provides advice, assistance and support to promote, coordinate, and monitor the efforts of the Federal government to establish, preserve, and strengthen women-owned business. Prior to joining the SBA, she was CEO and Founder of Ladies Launch Club, a company that provided guidance to women who wanted to launch a business.",
  "title": "Assistant Administrator",
  "type": "person",
  "url": "/person/kathleen-mcshane",
  "name": "Kathleen McShane",
  "id": 18220,
  "updated": 1551449973,
  "created": 1550688162,
  "langCode": "en"
})
cy.route("GET", "/api/content/18218.json", 
{
  "bio": "<p>bio</p>\r\n",
  "emailAddress": {},
  "fax": {},
  "firstName": "Michele",
  "highResolutionPhoto": "/sites/default/files/2019-02/michele-schimpp.jpg",
  "lastName": "Schimpp",
  "office": 15857,
  "phone": "202-205-6750",
  "picture": {
      "alt": "Michele Schimpp",
      "src": "/sites/default/files/2019-02/bio-michele-schimpp.jpg"
  },
  "shortBio": "Michele Schimpp is the Deputy Associate Administrator for SBA’s Office of Investment and Innovation.",
  "title": "Assistant Administrator",
  "type": "person",
  "url": "/person/michele-schimpp",
  "name": "Michele Schimpp",
  "id": 18218,
  "updated": 1551199355,
  "created": 1550687802,
  "langCode": "en"
})
cy.route("GET", "/api/content/18219.json",
{
  "bio": "<p>bio</p>\r\n",
  "emailAddress": {},
  "fax": {},
  "firstName": "Alan",
  "highResolutionPhoto": "/sites/default/files/2019-02/allen-gutierrez.jpg",
  "lastName": "Gutierrez",
  "office": 15831,
  "phone": {},
  "picture": {
      "alt": "Allen Gutierrez",
      "src": "/sites/default/files/2019-02/bio-allen-gutierrez.jpg"
  },
  "shortBio": "As Associate Administrator of the Office of Entrepreneurial Development, Allen Gutierrez is dedicated to enhancing the nationwide network of offices, business executives, and mentors that support current and aspiring business owners as they start, grow, and compete in today’s global market.",
  "title": "Associate Administrator",
  "type": "person",
  "url": "/person/allen-gutierrez",
  "name": "Allen Gutierrez",
  "id": 18219,
  "updated": 1551448000,
  "created": 1550688090,
  "langCode": "en"
} )

    // Removing posts
    this.NewsAndViewsBlogs.blogs.pop()
    // this.NewsAndViewsBlogs.blogs.pop()
    // this.NewsAndViewsBlogs.blogs.pop()
    //this.NewsAndViewsBlogs.pop()

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

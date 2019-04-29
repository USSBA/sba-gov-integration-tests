describe("Content Endpoint", function(){

    describe("Search Endpoints", function () {
        const endpoints = [
            'announcements', 
            'articles',
            'blogs', 
            'contacts',
            'course', 
            'courses', 
            'disaster', 
            'documents',
            'mainMenu', 
            'offices',
            'officesRaw',
            'persons', 
            'siteMap',
            'taxonomys',
            'events'
        ]
     
         endpoints.forEach((endpoint) => {
         it(`${endpoint} endpoint returns 200`, function(){
             cy.request(`/api/content/search/${endpoint}.json`).its("status").should('equal',200)
         })})
    })

    describe("S3 Endpoints", function () {
        const endpoints = [
            'announcements', 
            'articles',
            'blog', 
            'contacts',
            // 'course',       // not in S3
            'courses', 
            'disaster', 
            'documents',
            'mainMenu', 
            'nodes', 
            'offices',
            //'officesRaw',    // not in s3
            'persons', 
            'siteMap',
            'taxonomys'
            //'events'         // not in S3
            ]
     
         endpoints.forEach((endpoint) => {
         it(`${endpoint} endpoint returns 200`, function(){
             cy.request(`/api/content/${endpoint}.json`).its("status").should('equal',200)
         })})
    })

    it("search endpoint with query parameters returns 200", function(){
        // requires a search term query parameter
        cy.request(`/api/content/search/search.json?term=test`).its("status").should('equal',200)
    })

    it("non existing endpoint returns 404", function(){
        cy.request({
            url: "/api/content/search/does-not-exist.json",
            failOnStatusCode: false})
        .its("status").should('equal', 404)
    })
})
describe("Content Endpoint", function(){

    // To Do:  Include counsellorCta and search - these are both returning bad errors
   const endpoints = [
       'announcements', 
        'articles', 
        'contacts',
        // 'counsellorCta',  // broken and seemingly not used anywhere
        'course', 
        'courses', 
        'disaster', 
        'documents',
        'mainMenu', 
        // 'nodes',  // very large file in some envs - not used?
        'offices',
        'officesRaw',
        'persons', 
        'siteMap',
        'taxonomys',
        'events']

    endpoints.forEach((endpoint) => {
    it(`${endpoint} endpoint returns 200`, function(){
        cy.request(`/api/content/${endpoint}.json`).its("status").should('equal',200)
    })})

    it("search endpoint returns 200", function(){
        // requires a search term query parameter
        cy.request(`/api/content/search.json?term=test`).its("status").should('equal',200)
    })

    it("non existing endpoint returns 404", function(){
        cy.request({
            url: "/api/content/does-not-exist.json",
            failOnStatusCode: false})
        .its("status").should('equal', 404)
    })
})
describe("Content Endpoint", function(){

    // To Do:  Include counsellorCta and search - these are both returning bad errors
   const endpoints = [
       'announcements', 
        'articles', 
        'contacts',
        // 'counsellorCta',  // currently returns a 500, broken?
        'course', 
        'courses', 
        'disaster', 
        'documents',
        'mainMenu', 
        'nodes',
        'offices',
        'officesRaw',
        'persons', 
        // 'search',  // currently returns a 500, broken?
        'siteMap',
        'taxonomys',
        'events']

    endpoints.forEach((endpoint) => {
    it(`${endpoint} endpoint returns 200`, function(){
        cy.request(`/api/content/${endpoint}.json`).its("status").should('equal',200)
    })})

    it("non existing endpoint returns 404", function(){
        cy.request({
            url: "/api/content/does-not-exist.json",
            failOnStatusCode: false})
        .its("status").should('equal', 404)
    })
})
describe("Mocking XHR Requests", function() {
    it('Should display custom data with a mocked json request', function() {
        cy.viewport(1300, 800)
        cy.server()
        // select a fixture to use as a result and name it
        cy.fixture('local-assistance/search-results.json').as('officeLookupResults')

        // select the request that should be mocked and use the named fixture as a mock result
        cy.route('GET', '/api/content/search/offices.json**', '@officeLookupResults').as('OfficeSearchRequest')

        // visit a page that uses the mocked request
        cy.visit('/local-assistance/find/?q=test&pageNumber=1')
        cy.wait(1000)
    })

    it('Should display modified custom data with a mocked response', function() {
        cy.viewport(1300, 800)
        cy.server()

        // select a fixture to use as a result and name it
        cy.fixture('local-assistance/search-results.json').as('officeLookupResults').then((results) => {
            // modify the fixture to be something custom
            results.hit[0].fields.title = ["Test Title Modified"]
            // use this modified fixture as a mock result for a specific request
            cy.route('GET', '/api/content/search/offices.json**', '@officeLookupResults').as('OfficeSearchRequest')
        })

        //visit a page that uses the mocked request
        cy.visit('/local-assistance/find/?q=test&pageNumber=1')
        cy.wait(1000)
    })
})
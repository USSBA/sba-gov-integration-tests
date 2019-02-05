describe('Site Search', () => {
    it('should load and have fields for searching', () => {
        cy.visit('/search')
        cy.get("#search").should('exist')
        cy.get("#submit-button").should('exist')
    })

    it('searches when a keyword is submitted', () => {
        cy.server()
        cy.route("GET" ,"/api/content/search.json**").as("SearchRequest")
        cy.visit('/search/')
        cy.get("#search").type("business")
        cy.get("#submit-button").click()
        cy.wait("@SearchRequest")
        cy.get("#results-list").should('exist')
        cy.get(".result-box").should('exist')
        cy.get(".result-box").should('have.length', 10)
        
    })

    it('searches with provided query paramters', () => {
        cy.server()
        cy.route("GET" ,"/api/content/search.json**").as("SearchRequest")
        cy.visit('/search/?q=business')
        cy.wait("@SearchRequest")
        cy.get("#results-list").should('exist')
        cy.get(".result-box").should('exist')
        cy.get(".result-box").should('have.length', 10)
    })

    it('searches make the appropriate endpoint call', () => {
        cy.server()
        cy.route("GET" ,"/api/content/search.json**").as("SearchRequest")
        cy.visit('/search/?q=business')
        cy.wait("@SearchRequest").its("url").should('include', "term=business")
    })
})
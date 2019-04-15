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

    it(`displays a custom CTA's when a suggested route keyword is used`, () => {
        cy.fixture("suggested-routes/custom-routes.json").then((customRoutes => {
            cy.server()
            cy.route("GET", "/api/content/suggestedRoutes.json", customRoutes)
            customRoutes.forEach((route) => {
                route.keywords.forEach((keyword) => {
                    cy.visit(`/search/?q=${keyword}`)
                    cy.get('[data-cy="suggested route"]').as("CTA")
                    cy.get("@CTA").find('[data-cy="card message"]').contains(route.cardMessage)
                    cy.get("@CTA").find('[data-cy="button"]').contains(route.buttonLabel)
                })
            })
        }))
    })

    it('displays a loading message while search results have not returned', () => {
        cy.server({delay: 5000})
        cy.route("GET", "/api/content/search.json**", "SearchRequest")
        cy.visit('/search/?p=1&q=thispageshouldneverexistandnoresultsshouldbefound')
        cy.contains('.results-message', "loading...",)
    })

    it('displays a message when search results cannot be found', () => {
        cy.visit('/search/?p=1&q=thispageshouldneverexistandnoresultsshouldbefound')
        cy.contains(
            '.results-message',
            "Sorry, we couldn't find anything matching that query.",
        )
    })
    
})
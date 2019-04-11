describe('Business Guide Basic Page', () => {
    it('should render the read more', () => {
        cy.server()
        cy.fixture('business-guide/basic-page.json').as('BasicPage')
        cy.route("GET", "/api/content/search/node/47.json", "@BasicPage" )
        cy.visit('/business-guide/plan-your-business/market-research-competitive-analysis')
    })
})
describe('Basic page', function() {
  it('head section should have Open Graph metadata', function() {
    cy.visit('/business-guide/plan-your-business/write-your-business-plan')

    // Checks open graph title metadata
    cy.get('#titleSectionTitleId').invoke('text').then((title) => {
      cy.get('head meta[property="og:title"]').should('have.attr', 'content', title)
      cy.get('head meta[property="og:site_name"]').should('have.attr', 'content', title)
      // This is the alternative to should, using expect instead which requires using a jquery element
      // expect(Cypress.$('head meta[property="og:title"]')).to.have.attr("content", title)
    })

    // Checks open graph description metadata
    cy.get('#titleSectionSummaryId').invoke('text').then((description) => {
      cy.get('head meta[property="og:description"]').should('have.attr', 'content', description)
    })
  })

  it('head section should have Twitter metadata', function() {
    cy.visit('/business-guide/manage-your-business/manage-your-finances')

    // Checks twitter title metadata
    cy.get('#titleSectionTitleId').invoke('text').then((title) => {
      cy.get('head meta[name="twitter:title"]').should('have.attr', 'content', title)
    })

    // Checks twitter description metadata
    cy.get('#titleSectionSummaryId').invoke('text').then((description) => {
      cy.get('head meta[name="twitter:description"]').should('have.attr', 'content', description)
    })
  })
})
describe('Basic page', function() {
  it('Should have head metadata', function() {
    cy.visit('/business-guide/plan-your-business/write-your-business-plan')
    cy.get('#titleSectionTitleId').invoke('text').then((title) => {
      cy.get('head meta[property="og:title"]').should('have.attr', 'content', title)

      // This is the alternative to should, using expect instead which requires using a jquery element
      // expect(Cypress.$('head meta[property="og:title"]')).to.have.attr("content", title)
    })
  })
})
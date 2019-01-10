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

  describe("contact cards", function(){
    it('display a website link when it is included in the contact data', function(){
      cy.server()
      cy.fixture('contacts/microloans.json').as('MicroloanContacts')
      cy.route("GET", "/api/content/contacts.json?category=Microloan", "@MicroloanContacts" ).as("ContactRequest")
      
      cy.visit('/partners/lenders/microloan-program/list-lenders')
      cy.get(".basicpage-titlesection > div[id^='lookup-']").as("ContactLookup")
      cy.get("@ContactLookup").get("#lookup-select").click();
      cy.get("@ContactLookup").get("#lookup-select").contains("Arkansas").click()

      cy.get("@ContactLookup").get('.contact-card').contains("Visit website").should("exist")
    })

    it('does not display a website link when it is missing in the contact data', function(){
      cy.server()
      cy.fixture('contacts/microloans.json').as('MicroloanContacts')
      cy.route("GET", "/api/content/contacts.json?category=Microloan", "@MicroloanContacts" ).as("ContactRequest")
      
      cy.visit('/partners/lenders/microloan-program/list-lenders')
      cy.get(".basicpage-titlesection > div[id^='lookup-']").as("ContactLookup")
      cy.get("@ContactLookup").get("#lookup-select").click();
      cy.get("@ContactLookup").get("#lookup-select").contains("Alaska").click()

      cy.get("@ContactLookup").get('.contact-card').contains("Visit website").should("not.exist")
    })
  })
})
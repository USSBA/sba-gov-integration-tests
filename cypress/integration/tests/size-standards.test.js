describe("Size Standards Tool", function(){
    it('validate a naics code with revenue as a small business', function(){
        cy.visit('/size-standards/')
        cy.get('.submit-button > .button').click()

        cy.get('#naics-lookup').type('111110')
        cy.get('#react-autowhatever-1-section-0-item-0').click()
        cy.get('button').contains('Next').click()

        cy.get('#revenue').type('1')
        cy.get('button').contains('See results').click()

        cy.get('.naics-codes-list .right').contains('YES').should('exist')
    })

    it('validate a naics code with revenue as not a small business', function(){
        cy.visit('/size-standards/')
        cy.get('.submit-button > .button').click()

        cy.get('#naics-lookup').type('111110')
        cy.get('#react-autowhatever-1-section-0-item-0').click()
        cy.get('button').contains('Next').click()

        cy.get('#revenue').type('999999999')
        cy.get('button').contains('See results').click()

        cy.get('.naics-codes-list .right').contains('NO').should('exist')
    })

    it('validate a naics code with an exception and revenue as a small business', function(){
        cy.visit('/size-standards/')
        cy.get('.submit-button > .button').click()

        cy.get('#naics-lookup').type('541330')
        cy.get('#react-autowhatever-1-section-0-item-0').click()
        cy.get('button').contains('Next').click()

        cy.get('#revenue').type('1')
        cy.get('button').contains('See results').click()

        cy.get('.naics-codes-list .right').contains('YES').should('exist')
    })
})
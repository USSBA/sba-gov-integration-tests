describe('Program Page', () => {

    it('with a hero image', () => {
        cy.server()
        cy.fixture('program-page/generic.json').as('programPage')
        cy.route("GET", "/api/content/node/58.json", "@programPage" )
        cy.visit('/funding-programs/investment-capital')
    })

    it('without a hero image', () => {
        cy.server()
        cy.fixture('program-page/generic.json').as('programPage').then((page) => {
            page.bannerImage = {}
        })
        cy.route("GET", "/api/content/node/58.json", "@programPage" )
        cy.visit('/funding-programs/investment-capital')
    })

    it('with a hero and without a button', ()=>{
        cy.server()
        cy.fixture('program-page/generic.json').as('programPage').then((page) => {
            page.buttons = {}
        })
        cy.route("GET", "/api/content/node/58.json", "@programPage" )
        cy.visit('/funding-programs/investment-capital')
    })

    it('without a hero and without a button', ()=>{
        cy.server()
        cy.fixture('program-page/generic.json').as('programPage').then((page) => {
            page.bannerImage = {}
            page.buttons = []
        })
        cy.route("GET", "/api/content/node/58.json", "@programPage" )
        cy.visit('/funding-programs/investment-capital')
    })

    it('without a hero and without a button with no text', ()=>{
        cy.server()
        cy.fixture('program-page/generic.json').as('programPage').then((page) => {
            page.bannerImage = {}
            page.buttons =  [{
                    "url": "#paragraph-11",
                }]
        })
        cy.route("GET", "/api/content/node/58.json", "@programPage" )
        cy.visit('/funding-programs/investment-capital')
    })
})
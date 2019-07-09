describe("Translated Pages", function () {

    beforeEach(function(){
        cy.fixture("program-page/translated-page.json").as("TranslatedPage")
        cy.fixture("menu/translated.json").as("TranslatedMenu")
    })

    it("display spanish translation content on program pages for spanish urls", function () {
        cy.server()
        cy.route("GET", "/api/content/6010.json", this.TranslatedPage).as("ContentRequest")
        
        cy.visit("/contratacion-federal/guia-sobre-contratacion")
        cy.wait("@ContentRequest")

        cy.get(".hero").within(($hero) => {
            cy.get('h1')
                .contains(this.TranslatedPage.spanishTranslation.title)
            cy.get('h5')
                .contains(this.TranslatedPage.spanishTranslation.summary)
            cy.get('[data-testid=button]')
                .contains(this.TranslatedPage.spanishTranslation.buttons[0].title)
        })
        cy.get("#section-header-0")
            .contains(this.TranslatedPage.spanishTranslation.paragraphs[0].text)
    })

    it("display english content on program pages for english urls", function () {
        cy.server()
        cy.route("GET", "/api/content/6010.json", this.TranslatedPage).as("ContentRequest")
        
        cy.visit("/federal-contracting/contracting-guide")
        cy.wait("@ContentRequest")

        cy.get(".hero").within(($hero) => {
            cy.get('h1')
                .contains(this.TranslatedPage.title)
            cy.get('h5')
                .contains(this.TranslatedPage.summary)
            cy.get('[data-testid=button]')
                .contains(this.TranslatedPage.buttons[0].title)
        })
        cy.get("#section-header-0")
            .contains(this.TranslatedPage.paragraphs[0].text)
    })

    it("display spanish menu when set to spanish", function () {
        cy.server()
        cy.route("GET","/api/content/search/mainMenu.json", this.TranslatedMenu).as("MenuRequest")
        cy.visit("/?lang=es")
        cy.wait("@MenuRequest")
        cy.get("#sub-menu-0-title")
            .contains(this.TranslatedMenu[0].spanishTranslation.linkTitle)
            .should('have.attr', 'href', this.TranslatedMenu[0].spanishTranslation.link )
    })

    it("display english menu when set to english", function () {
        cy.server()
        cy.route("GET","/api/content/search/mainMenu.json", this.TranslatedMenu).as("MenuRequest")
        cy.visit("/")
        cy.wait("@MenuRequest")
        cy.get("#sub-menu-0-title")
            .contains(this.TranslatedMenu[0].linkTitle)
            .should('have.attr', 'href', this.TranslatedMenu[0].link )
    })

    it("displays hardcoded spanish items when set to spanish", function () {
        cy.visit("/?lang=es")
        cy.get("#sba-footer").contains("Atención al cliente")
        cy.get("#deskop-mini-nav").contains('Para los socios')
    })

    it("displays hardcoded english items when set to english", function () {
        cy.visit("/")
        cy.get("#sba-footer").contains("Customer Service")
        cy.get("#deskop-mini-nav").contains('For Partners')
    })

})
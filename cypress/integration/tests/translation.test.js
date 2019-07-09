describe("Translated Pages", function () {

    beforeEach(function(){
        cy.fixture("program-page/translated-page.json").as("TranslatedPage")
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
})
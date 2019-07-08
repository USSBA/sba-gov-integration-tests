describe("Component", function () {
    describe("text section", function () {

        beforeEach(function () {
            cy.server()
            cy.fixture("basic-page/links.json").as("LinkPage")
            cy.route("GET", "/api/content/5.json", "@LinkPage").as("PageRequest")
        })
    
        it("displays an exit modal for a link to an external site", function () {
            cy.visit('/business-guide/launch-your-business/choose-your-business-name')
            cy.wait("@PageRequest")
            cy.contains("External non-.gov link")
              .and('have.class', 'external-link-marker')
              .click()
            cy.contains("You're leaving the Small Business Administration website.")
        })

        it("does not display an exit modal when the link is a relative link", function () {
            cy.visit('/business-guide/launch-your-business/choose-your-business-name')
            cy.wait("@PageRequest")
            cy.contains("Internal relative link")
              .and('not.have.class', 'external-link-marker')
              .click()
            cy.contains("You're leaving the Small Business Administration website.").should('not.exist')
        })
    
        it("does not put an exit modal class on a link to a .gov site", function () {
            cy.visit('/business-guide/launch-your-business/choose-your-business-name')
            cy.wait("@PageRequest")
            cy.contains("External .gov link")
              .and('not.have.class', 'external-link-marker')
            // exit modal should not display without an external-link-marker
        })
    
        it("does not put an exit modal class on a link to a .gov site with a path", function () {
            cy.visit('/business-guide/launch-your-business/choose-your-business-name')
            cy.wait("@PageRequest")
            cy.contains("External .gov link with path")
              .and('not.have.class', 'external-link-marker')
            // exit modal should not display without an external-link-marker
        })
    })
    
    describe("exit modal", function () {

        it("displays with accessible features", function () {
            cy.server()
            cy.route("GET", "/api/content/6134.json").as("HomepageContent")
            cy.visit("/")
            cy.wait("@HomepageContent")
            cy.get("[alt='SBA Facebook page']")
                .click()
            cy.contains("You're leaving the Small Business Administration website.")
            cy.get("[data-cy='close button']")
                .should('have.attr', "aria-label", "Close this modal.")
            cy.get('button').contains("CONTINUE")
            cy.get('button').contains("CANCEL")
        })

        it("closes with the escape button", function () {
            cy.server()
            cy.route("GET", "/api/content/6134.json").as("HomepageContent")
            cy.visit("/")
            cy.wait("@HomepageContent")
            cy.get("[alt='SBA Facebook page']")
                .click()
            cy.contains("You're leaving the Small Business Administration website.")
                .type('{esc}')
            cy.contains("You're leaving the Small Business Administration website.").should("not.exist")
        })

        it("closes when the cancel button is activated", function () {
            cy.server()
            cy.route("GET", "/api/content/6134.json").as("HomepageContent")
            cy.visit("/")
            cy.wait("@HomepageContent")
            cy.get("[alt='SBA Facebook page']")
                .click()
            cy.contains('CANCEL')
                .click()
            cy.contains("You're leaving the Small Business Administration website.").should("not.exist")
        })
    })

    describe.only("document quick links", function () {
        beforeEach(function() {
            cy.server()
            cy.route("GET", "/api/content/search/documents.json**").as("DocumentQuicklinksRequest")
            cy.fixture("program-page/quicklinks.json").then((page) => {
                page.paragraphs[0].typeOfLinks[0].sectionHeaderText = ""
                page.paragraphs[0].typeOfLinks[0].documentActivity =  []
                page.paragraphs[0].typeOfLinks[0].documentOffice = null
                page.paragraphs[0].typeOfLinks[0].documentProgram = []
                page.paragraphs[0].typeOfLinks[0].documentType = []
            }).as("page")
            cy.fixture("document/search-result-complete.json").as("DocumentSearchResults")
        })

        it("displays a basic quick links section", function () {
            const expectedQuicklinksTitle = "Custom Lookup"
            this.page.paragraphs[0].typeOfLinks[0].sectionHeaderText = expectedQuicklinksTitle
            cy.route("GET", "/api/content/2936.json", this.page).as("ProgramPage")
            cy.route("GET", "/api/content/search/documents.json**", "@DocumentSearchResults").as("DocumentQuicklinksRequestCustom")

            cy.visit("/partners/lenders/7a-loan-program")

            cy.wait("@ProgramPage")
            cy.wait("@DocumentQuicklinksRequestCustom").its("url")
                .should('contain',"program=all")
                .and('contain', 'sortBy=Last Updated')
                .and('contain', 'activity=all')
                .and('contain', 'type=all')
                .and('contain', 'start=0')
                .and('contain', 'end=3')
                .and('contain', `office=all`)
            cy.get(`#quickLinks-0 h4`).contains(expectedQuicklinksTitle)
            cy.get("#quickLinks-0 a:first-of-type").should('have.attr', 'href', '/document?&')
            cy.get("a").contains(this.DocumentSearchResults.items[0].title)
            cy.get("a").contains(this.DocumentSearchResults.items[1].title)
            cy.get("a").contains(this.DocumentSearchResults.items[2].title)
        })

        it("filters for offices", function () {
            const expectedOffice = 9999
            this.page.paragraphs[0].typeOfLinks[0].documentOffice = expectedOffice
            cy.route("GET", "/api/content/2936.json", this.page).as("ProgramPage")
            
            cy.visit("/partners/lenders/7a-loan-program")

            cy.wait("@ProgramPage")
            cy.wait("@DocumentQuicklinksRequest").its("url")
                .should('contain',"program=all")
                .and('contain', 'sortBy=Last Updated')
                .and('contain', 'activity=all')
                .and('contain', 'type=all')
                .and('contain', 'start=0')
                .and('contain', 'end=3')
                .and('contain', `office=${expectedOffice}`)
        })

        it("filters for document type", function () {
            const expectedDocumentType = "Information notice"
            this.page.paragraphs[0].typeOfLinks[0].documentType = [expectedDocumentType]
            cy.route("GET", "/api/content/2936.json", this.page).as("ProgramPage")

            cy.visit("/partners/lenders/7a-loan-program")

            cy.wait("@ProgramPage")
            cy.wait("@DocumentQuicklinksRequest").its("url")
                .should('contain',"program=all")
                .and('contain', 'sortBy=Last Updated')
                .and('contain', `activity=all`)
                .and('contain', `type=${expectedDocumentType}`)
                .and('contain', 'start=0')
                .and('contain', 'end=3')
                .and('contain', `office=all`)
        })

        it("filters for document program", function () {
            const expectedDocumentProgram = "7(a)"
            this.page.paragraphs[0].typeOfLinks[0].documentProgram = [expectedDocumentProgram]
            cy.route("GET", "/api/content/2936.json", this.page).as("ProgramPage")

            cy.visit("/partners/lenders/7a-loan-program")

            cy.wait("@ProgramPage")
            cy.wait("@DocumentQuicklinksRequest").its("url")
                .should('contain',`program=${expectedDocumentProgram}`)
                .and('contain', 'sortBy=Last Updated')
                .and('contain', `activity=all`)
                .and('contain', `type=all`)
                .and('contain', 'start=0')
                .and('contain', 'end=3')
                .and('contain', `office=all`)
        })

        it("filters for document activity", function () {
            const expectedDocumentActivity = "General"
            this.page.paragraphs[0].typeOfLinks[0].documentActivity = [expectedDocumentActivity]
            cy.route("GET", "/api/content/2936.json", this.page).as("ProgramPage")

            cy.visit("/partners/lenders/7a-loan-program")

            cy.wait("@ProgramPage")
            cy.wait("@DocumentQuicklinksRequest").its("url")
                .should('contain',`program=all`)
                .and('contain', 'sortBy=Last Updated')
                .and('contain', `activity=${expectedDocumentActivity}`)
                .and('contain', `type=all`)
                .and('contain', 'start=0')
                .and('contain', 'end=3')
                .and('contain', `office=all`)
        })
    })
})

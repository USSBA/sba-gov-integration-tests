describe("Accessibility", function(){
    it("on the homepage has no violations", function(){
        cy.visit("/")
        cy.injectAxeCore();
        cy.checkAccessibility();
    })
})
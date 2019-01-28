// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("injectAxeCore", () => {
    cy.window().then(window => {
    const axe = require('axe-core')
    window.eval(axe.source)
    })
})

Cypress.Commands.add("checkAccessibility", () => {
    cy.window().then(window => {
        return window.axe.run(window.document)
    }).then(({violations}) => {
        Cypress.log({
            consoleProps: () => {
                return { "Violation Count": violations.length }
            }
        })
        
        violations.forEach(v => {
            Cypress.log({
                consoleProps: () => {
                    return {
                        "Impact" : v.impact,
                        "Desc": v.description
                    }
                }
            })
        })
    })
})
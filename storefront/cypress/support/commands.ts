/// <reference path="./commands.d.ts" />
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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom iframe command
(Cypress.Commands as any).add("iframe", (iframeSelector: string) => {
  return cy
    .get(iframeSelector)
    .its("0.contentDocument")
    .should("exist")
    .its("body")
    .should("not.be.undefined")
    .then(($body) => {
      return cy.wrap($body)
    })
})

// Wait until the iframe's document is fully loaded
(Cypress.Commands as any).add("frameLoaded", (iframeSelector: string) => {
  return cy
    .get(iframeSelector)
    .its("0.contentDocument.readyState")
    .should((state) => {
      // readyState should be 'interactive' or 'complete'
      expect(["interactive", "complete"]).to.include(state)
    })
})

// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//       iframe(iframeSelector: string): Chainable<Element>
//     }
//   }
// }

// Prevent TypeScript from reading file as legacy script
export {}

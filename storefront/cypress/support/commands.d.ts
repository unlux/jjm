/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      iframe(iframeSelector: string): Chainable<JQuery<HTMLElement>>
      frameLoaded(iframeSelector: string): Chainable<void>
    }
  }
}

export {}

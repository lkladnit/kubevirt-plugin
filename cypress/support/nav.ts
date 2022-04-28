import './selectors';
import { loadingBox } from '../views/selector';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      visitCatalog(): void;
      visitVMs(): void;
      loaded(): Chainable<Element>;
    }
  }
}

Cypress.Commands.add('visitCatalog', () => {
  cy.clickNavLink(['Virtualization', 'Catalog']);
});

Cypress.Commands.add('visitVMs', () => {
  cy.clickNavLink(['Virtualization', 'VirtualMachines']);
});

Cypress.Commands.add('loaded', () => {
  cy.get(loadingBox).should('be.visible');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
});

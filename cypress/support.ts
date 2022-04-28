/* eslint-disable @typescript-eslint/no-namespace */
import './support/selectors';
import './support/login';
import './support/nav';
import './support/project';
import './support/resource';

declare global {
  namespace Cypress {
    interface Chainable {
      install(encrypted?: boolean): Chainable<Element>;
    }
  }
}

Cypress.on('uncaught:exception', () => {
  // don't fail on Cypress' internal errors.
  return false;
});

Cypress.Cookies.debug(true);

Cypress.Cookies.defaults({
  preserve: ['openshift-session-token', 'csrf-token'],
});

export const testName = `test-${Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5)}`;

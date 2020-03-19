//Workaround for cypress not being able to capture XHR graphql responses
//https://github.com/cypress-io/cypress/issues/95
function fetchToXhr() {
  let polyfill

  before(() => {
    cy.readFile('node_modules/whatwg-fetch/dist/fetch.umd.js')
      .then((contents) => polyfill = contents)
    Cypress.on('window:before:load', (win) => {
      delete win.fetch
      win.eval(polyfill)
    })
  })
}

fetchToXhr()

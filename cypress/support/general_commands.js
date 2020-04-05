
export function get(selector) {
  return cy.get(selector);
}

export function visit(url) {
  return cy.visit(url);
}

export function clearAndTypeText(selector, text) {
  return cy
    .get(selector)
    .clear()
    .type(text);
}

export function typeText(selector, text) {
  return cy
    .get(selector)
    .type(text);
}

export function verifyElementHasText(selector, text) {
  return cy.get(selector).should('have.text', text)
}

export function click(selector) {
  return cy.get(selector).click()
}

//use when cypress incorrectly cancels a XHR during a form submit due to default behavior not being prevented in app
export function preventFormSubmitDefault(selector) {
  cy.get(selector).then(form$ => {
    form$.on("submit", e => {
      e.preventDefault();
    });
  });
}

export function mockGeoLocation(latitude, longitude) {
  cy.window().then($window => {
    cy.stub($window.navigator.geolocation, "getCurrentPosition", callback => {
      return callback({ coords: { latitude, longitude } });
    });
  });
};

export function uploadFile(fileName, selector, mimeType) {
  return cy.fixture(fileName).then(fileContent => {
    cy.get(selector).upload({ fileContent, fileName, mimeType: mimeType });
  });
}

////////////////////Storage and Cookies Related///////////////////////////
let LOCAL_STORAGE_MEMORY = {};
let COOKIE_MEMORY = {};

export function saveSession() {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
  cy.getCookies().then((cookies) => {
    cookies.forEach(cookie => {
      COOKIE_MEMORY[cookie.name] = cookie
    })
  })
}

export function restoreSession() {
  restoreLocalStorage()
  restoreCookies()
}

export function restoreLocalStorage(){
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    setLocalStorage(key, LOCAL_STORAGE_MEMORY[key]);
  });
}

export function restoreCookies() {
  Object.keys(COOKIE_MEMORY).forEach(key => {
    setCookie(key, COOKIE_MEMORY[key].value);
  });
};

export function clearSession() {
  try {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
  } catch (err) {
    cy.log(`error during clearing session: ${err}`);
  }
}

export function setCookie(name, value) {
  cy.setCookie(name, value);
}

export function setLocalStorage(name, value) {
  localStorage.setItem(name, value);
}

//////////////////Iframe Support ///////////////////////
//Workaround for getting elements that cypress can't select because they are inside and iframe
export function getIframeBody (locator) {
  // get the iframe > document > body
  // and retry until the body element is not empty
  return cy
    .get(locator)
    .its('0.contentDocument.body').should('not.be.empty')
    // wraps "body" DOM element to allow
    // chaining more Cypress commands, like ".find(...)"
    // https://on.cypress.io/wrap
    .then(cy.wrap)
}


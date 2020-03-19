
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

export function click(selector) {
  return cy.get(selector).click()
}

export function typeText(selector, text) {
  return cy
    .get(selector)
    .type(text);
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

export function setCookie(env, jwt) {
  cy.setCookie(env, jwt);
}

export function setLocalStorage(env, jwt) {
  localStorage.setItem(env, JSON.stringify(jwt));
}

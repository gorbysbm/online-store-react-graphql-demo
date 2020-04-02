import { getDateTimeStamp } from './utils';

Cypress.Commands.add("getCurrentUserApi", (failOnApiError = true) => {
  let promiseRes;
  return cy
    .request({
      url: Cypress.env("api"),
      method: "POST",
      body: {
        query:`query CURRENT_USER_QUERY {   me {     id     email     name     permissions     cart {
               id       quantity       item {         id         price         image         title  description  } } } } `
      },
    })
    .then(res => {
      promiseRes = res;
      if (failOnApiError)
        verifyNoErrorsInApiResponse(res);
    })
    .then(() => Promise.resolve(promiseRes));
});



Cypress.Commands.add("loginApi", (email, password, failOnApiError = true) => {
  let promiseRes;
  return cy
    .request({
      url: Cypress.env("api"),
      method: "POST",
      body: {
        query: `mutation SIGNIN_MUTATION($email: String!, $password: String!)
        {  signin(email: $email, password: $password) {    id    email    name    __typename  }}`,

        variables: {
          email: email,
          password: password,
          name: ""
        },
      },
    })
    .then(res => {
      promiseRes = res;
      if (failOnApiError)
        verifyNoErrorsInApiResponse(res);
    })
    .then(() => Promise.resolve(promiseRes));
});

export function generateRandomUser() {
  let username = `samS${getDateTimeStamp("MMDDhhmmss")}@automation.com`
  let name = "Sam"
  let password = "test1234"
  cy.signUpUserApi(username, name,  password)
}

Cypress.Commands.add("signUpUserApi", (email, name, password, failOnApiError = true) => {
  let promiseRes;
  return cy
    .request({
      url: Cypress.env("api"),
      method: "POST",
      body: {
        operationName: "SIGNUP_MUTATION",
        query: `mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
          signUp(email: $email, name: $name, password: $password) {    id    email    name    __typename }}`,
        variables:
          {
            email: email,
            name: name,
            password: password
          }
      },
    })
    .then(res => {
      promiseRes = res;
      if (failOnApiError)
        verifyNoErrorsInApiResponse(res);
    })
    .then(() => Promise.resolve(promiseRes));
});


/************ Utility Functions for APIs************/

//Use to workaround cypress' limitation of stubbing graphql calls
//since all calls are made to the same endpoint
//You define the responses for *every* graphql operation involved in the graphQlFixture file
Cypress.Commands.add('stubGraphQL', (graphQlFixture) => {
  cy.fixture(graphQlFixture).then((mockedData) => {
    cy.on('window:before:load', (win) => {
      function fetch(path, { body }) {
        const { operationName } = JSON.parse(body)
        return responseStub(mockedData[operationName])
      }
      cy.stub(win, 'fetch', fetch).withArgs("/graphql").as('graphql');
    });
  })
})

const responseStub = result => Promise.resolve({
  json: () => Promise.resolve(result),
  text: () => Promise.resolve(JSON.stringify(result)),
  ok: true,
})


Cypress.Commands.add("waitForApiResponse", (alias, operationName) => {
    cy.wait(alias).then(({ request, response }) => {
        let queryFound = false;
        for (let key in request.body) {
            if (request.body[key] === operationName) {
                queryFound = true;
                verifyNoErrorsInApiResponse(response)
                return getJsonFromBlob(response.body)
            }
        }
        // If the captured request doesn't match the operation name of your query
        // it will wait again for the next one until it gets matched.
        if (request.body.operationName !== operationName && !queryFound) {
            return cy.waitForApiResponse(alias, operationName);
        }
    });
});

function getOperationName(body, operationName) {
  if (body === operationName){
      return operationName;
    }
    //workaround when operation name is present somewhere in query / mutation
  else{
    const opNameRegexp = /((query|mutation)\s)([a-zA-Z]*)\W/gm;
    const matches = opNameRegexp.exec(body.query);
    return body.operationName || matches[3];
  }
}

function getJsonFromBlob(blob) {
  return Cypress.Blob.blobToBase64String(blob)
    .then(x => atob(x))
    .then(JSON.parse)
    .then(parsedJson => {
      return parsedJson;
    });
}

function verifyNoErrorsInApiResponse(res) {
    if (res.body.errors) {
        expect(res.body.errors[0].message).to.not.exist;
    }
}

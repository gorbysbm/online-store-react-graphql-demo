/// <reference types="cypress" />
import { apiShopper, invalidCredentialsShopper } from '../constants/users';
import { watch } from '../constants/items';
import { clearSession, restoreCookies, restoreSession, saveSession } from '../support/general_commands';

before(() => {
  let {email, password} = apiShopper

  cy.loginApi(email, password).then(res => {
    //save a logged in session to be used for later tests
    saveSession()
    clearSession()
  })
})


it(' verify api response from a valid login', () => {
  let {name, id, email, password} = apiShopper

  cy.loginApi(email, password)
    .then(response => {
      expect(response.status).to.eq(200);
      expect(response.headers["content-type"]).to.eq("application/json");
      expect(response.headers["set-cookie"]).to.have.length(1)
      expect(response.headers["set-cookie"][0]).to.contain("token")
      expect(response.body).to.not.be.null;
      expect(response.body.data.signin.name).to.eq(name)
      expect(response.body.data.signin.id).to.eq(id)
      expect(response.body.data.signin.email).to.eq(email)
    })
})

it(' verify api response from an invalid email login', () => {
  let {invalidEmail, validPassword} = invalidCredentialsShopper

  cy.loginApi(invalidEmail, validPassword, false)
    .then(response => {
      expect(response.status).to.eq(200);
      expect(response.headers["content-type"]).to.eq("application/json");
      expect(response.headers["set-cookie"]).to.not.exist
      expect(response.body).to.not.be.null;
      expect(response.body.errors).to.have.length(1)
      expect(response.body.errors[0].message).to.equal(`Invalid Username or Password. You used email: ${invalidEmail}`)
    })
})

it(' verify api response from logged in user adding item to cart', () => {
  let item = watch

  restoreSession()
  cy.addItemToCart(item).then(response => {
    expect(response.status).to.eq(200);
    expect(response.headers["content-type"]).to.eq("application/json");
    expect(response.body).to.not.be.null;
    expect(response.body.data.addToCart.id).to.eq(item.dbid);
  })
})

/************ Functions ************/

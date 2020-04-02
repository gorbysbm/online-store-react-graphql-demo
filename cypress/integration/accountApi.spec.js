/// <reference types="cypress" />
import * as auto from '../support/general_commands';
import { apiShopper } from '../constants/users';

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



/************ Functions ************/
function login(username, password){
  let email = '[data-testid="signin-form"] input[type="email"]'
  let psw = '[data-testid="signin-form"] input[type="password"]'
  let submit = '[data-testid="signin-form"] button[type="submit"]'
  auto.clearAndTypeText(email,username)
  auto.clearAndTypeText(psw, password)
  auto.click(submit)
}

function verifyLoggedIn() {
  auto.get('[data-testid="navbar"] button').contains("Sign Out")
}

function verifyErrorDisplayed(text){
  auto.get('[data-test="graphql-error"]').contains(text)
}

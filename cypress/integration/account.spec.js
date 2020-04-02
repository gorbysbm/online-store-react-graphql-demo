/// <reference types="cypress" />
import * as auto from '../support/general_commands';
import { invalidCredentialsShopper, regularShopper } from '../constants/users';


beforeEach(() => {
  auto.visit('/')
})

it('allows an existing user to login to their account using correct credentials', () => {
  let user = regularShopper

  auto.visit('/'+"signup")
  login(user.email, user.password)
  verifyLoggedIn()
})

it('prevents an existing user from logging in when using an incorrect password', () => {
  let user = invalidCredentialsShopper
  let errorMsg = "Invalid Username or Password"

  auto.visit('/'+"signup")
  login(user.validEmail, user.invalidPassword)
  verifyErrorDisplayed(errorMsg)
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

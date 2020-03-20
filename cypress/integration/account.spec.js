/// <reference types="cypress" />
import * as auto from "../support/general_commands";


beforeEach(() => {
  auto.visit('/',
  )
})

it('allows an existing user to login to their account using correct credentials', () => {
  let username = "samS@automation.com"
  let password = "test1234"

  auto.visit('/'+"signup")
  login(username, password)
  verifyLoggedIn()
})


it('prevents an existing user from logging in when using an incorrect password', () => {
  let username = "samS@automation.com"
  let password = "THIS_WILL_FAIL"
  let errorMsg = "Invalid Username or Password"

  auto.visit('/'+"signup")
  login(username, password)
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

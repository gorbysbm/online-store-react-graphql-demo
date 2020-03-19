/// <reference types="cypress" />
import * as auto from "../support/general_commands";


beforeEach(() => {
  auto.visit('/',
  )
})

it('allows the user to create a new account', () => {
  let username = "samsafyan@automation.com"
  let password = "test1234"
  auto.visit('/'+"signup")
  login(username, password)
  verifyLoggedIn()
})

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

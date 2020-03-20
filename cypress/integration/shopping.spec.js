/// <reference types="cypress" />
import * as auto from '../support/general_commands';
import { gloves, shoes } from '../constants/items';
import { generateRandomUser } from '../support/commands';

let expectedTotalItemsInCart

beforeEach(() => {
  cy.server();
  expectedTotalItemsInCart = 0
  auto.visit('/')
})

it('allows a newly registered user to add items to cart', () => {
  let itemsToBuy = [gloves, shoes]

  //Sign up user via the api to speed up tests; we are already verifying the login UI in a separate test
  generateRandomUser()
  gotoItemsPage()

  itemsToBuy.forEach( item => {
    addItemToCart(item)
  })
  verifyCartItemCounterinNav(expectedTotalItemsInCart)

  openCart(true)
  itemsToBuy.forEach( item => {
    verifyItemInCart(item)
  })
})


/************ Functions ************/

function gotoItemsPage() {
    auto.visit('/'+"items")
}
function addItemToCart(item){
  for (let i = 0; i < item.quantity; i++) {
    cy.server();
    cy.route("POST", "/graphql").as("graphql");
    auto.get(`[data-testid="${item.name}"] button`).contains("Cart").click()
    cy.waitForApiResponse("@graphql", "ADD_TO_CART_MUTATION")
    expectedTotalItemsInCart++
  }
}

function verifyCartItemCounterinNav(number){
  auto.get('[data-testid="navbar"] button[data-testid="toggleCart"] .count-enter-done')
    .invoke('text').then(parseFloat).should('be', number)
}

function openCart(waitForApi) {
  cy.server()
  cy.route("POST", "/graphql").as("graphql");
  auto.get('[data-testid="navbar"] button[data-testid="toggleCart"]').click()
  return waitForApi ? cy.waitForApiResponse("@graphql", "CURRENT_USER_QUERY") : ''
}

function verifyItemInCart(item){
  //verify title of item
  auto.get(`[data-testid="cart-item-details-${item.name}"] [data-testid="item-title"]`)
    .invoke('text').should('equal', item.name);
  //verify quantity and price of item
  auto.get(`[data-testid="cart-item-details-${item.name}"] [data-testid="item-price-quantity"]`)
    .invoke('text').should('equal', `${item.quantity} × ${item.price} : ${item.total}`);//2 × $7,897.89 : $15,795.78</p>
}


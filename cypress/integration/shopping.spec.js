/// <reference types="cypress" />
import * as auto from '../support/general_commands';
import { getIframeBody } from '../support/general_commands';
import { mensShoes, womensShoes } from '../constants/items';
import { generateRandomUser } from '../support/commands';

let expectedTotalItemsInCart = 0

beforeEach(() => {
  cy.server();
  auto.visit('/')
})

it('allows a user to add items to cart', () => {
  let itemsToBuy = [mensShoes, womensShoes]

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


it('allows the user to proceed to checkout after adding multiple items to their cart', () => {
  let expectedCartTotals = { price:"$13,603.70", items : "17"}

  //An example of using fixtures to instantly fill up our cart with items
  //greatly reducing testcase execution time
  cy.stubGraphQL('addToCartOperation.json')
  gotoItemsPage()
  addItemToCart(mensShoes, false)
  openCart()
  verifyCartContents(expectedCartTotals)
  clickCheckout()
  verifyStripeCheckout(expectedCartTotals)
})

/************ Functions ************/
function verifyCartContents(expectedCartTotals) {
  auto.verifyElementHasText('[data-testid="total-price"]',expectedCartTotals.price)
}

function verifyStripeCheckout(expectedCartTotals) {
  const {price, items} = expectedCartTotals
  let iframeStripe = 'iframe[name="stripe_checkout_app"]'
  getIframeBody(iframeStripe).find('button[type="submit"] .Button-content > span').should('have.text', `Pay ${price}`)
  getIframeBody(iframeStripe).find('.Header-purchaseDescription').should('have.text', `Order of ${items} items!`)
}

function clickCheckout(){
  auto.click('[data-testid="checkout-button"]')
}

function gotoItemsPage() {
    auto.visit('/'+"items")
}
function addItemToCart(item, waitForApi = true){
  if (waitForApi){
    for (let i = 0; i < item.quantity; i++) {
      cy.server();
      cy.route("POST", "/graphql").as("graphql");
      auto.get(`[data-testid="${item.name}"] button`).contains("Cart").click()
      cy.waitForApiResponse("@graphql", "ADD_TO_CART_MUTATION").then( res => {
        expectedTotalItemsInCart++
      })
    }
  } else {
    for (let i = 0; i < item.quantity; i++) {
      auto.get(`[data-testid="${item.name}"] button`).contains("Cart").click()
      expectedTotalItemsInCart++
    }
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


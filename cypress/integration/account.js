/// <reference types="cypress" />

beforeEach(() => {
  cy.visit('/',
  )
})

it('allows the user to create a new account', () => {
  cy.get('.todo-list li').its('length').then((size) => {
    cy.get('.new-todo').type('new todo{enter}')
    cy.get('.todo-list li')
        .should('have.length', size+1)
        .contains('new todo')
  });
})


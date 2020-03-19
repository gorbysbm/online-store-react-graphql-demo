/// <reference types="cypress" />

beforeEach(() => {
  cy.visit('/',
  )
})

it('adds an item 1', () => {
  cy.get('.todo-list li').its('length').then((size) => {
    cy.get('.new-todo').type('new todo{enter}')
    cy.get('.todo-list li')
        .should('have.length', size+1)
        .contains('new todo')
  });
})

it('adds an item 2', () => {
  cy.get('.todo-list li').its('length').then((size) => {
    cy.get('.new-todo').type('new todo{enter}')
    cy.get('.todo-list li')
        .should('have.length', size+1)
        .contains('new todo')
  });


})

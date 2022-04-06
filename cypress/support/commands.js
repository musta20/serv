// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
const userData = {
  custmer: {
      username: "536576138",
      phone: "920110384",
      password: "Aa123456",
  },
  provider: {
      username: "admin",
      password: "admin",
  }
}

Cypress.Commands.add('getBySel', (selector, ...args) => {
    return cy.get(`[data-test=${selector}]`, ...args)
  })
  
  Cypress.Commands.add('getBySelLike', (selector, ...args) => {
    return cy.get(`[data-test*=${selector}]`, ...args)
  })

  Cypress.Commands.add('logInUser', () => {
    cy.getBySel('cy-login-btn').click()
    cy.location("pathname").should("eq", "/login");
    cy.getBySel('cy-login-username').type(0 + userData.custmer.username)
    cy.getBySel('cy-login-password').type(userData.custmer.password)
    cy.getBySel('cy-login-submit').click()  })



    Cypress.Commands.add('logInAdmin', () => {
      cy.getBySel('cy-login-btn').click()
      cy.location("pathname").should("eq", "/login");
      cy.getBySel('cy-login-username').type(userData.provider.username)
      cy.getBySel('cy-login-password').type(userData.provider.password)
      cy.getBySel('cy-login-submit').click()  })
  



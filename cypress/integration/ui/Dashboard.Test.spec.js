const backendUrl = `${Cypress.env("backendUrl")}`;
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


describe("user can register and login ", () => {
    beforeEach(() => {

        cy.visit('/')
    })

    it('order a services', () => {

        cy.logInAdmin()

        cy.location("pathname").should("eq", "/Dashboard");
        cy.getBySel('cy-info').click()
        cy.getBySel('cy-userPage').should("exist");
        cy.getBySel('cy-username').clear()
        cy.getBySel('cy-phone').clear()
        cy.getBySel('cy-des').clear()


        cy.getBySel('cy-username').type('safafa')

        cy.getBySel('cy-phone').type('536576111')
        cy.getBySel('cy-des').type('des')

        cy.getBySel('cy-user-update').click()
        cy.getBySel('cy-alert').should("exist").should('contain', 'حدث خطاء الرجاء المحاولة مرة اخرى');




    })




    it('user can delete order', () => {
        cy.logInAdmin()

        cy.getBySel('cy-order').click()

        cy.getBySel('cy-orders-page').should('be.visible')

        cy.getBySel('cy-orders-page').find('div').eq(0).then(item => {

            item.find('#open-order').click()
        })

        cy.getBySel('cy-prosses-order').should('be.visible');

      //  cy.getBySel('cy-delete-order').click();
    })







    it.only('user can add and delete files ', () => {
        cy.logInAdmin()

        cy.getBySel('cy-files').click()

        cy.getBySel('cy-files-page').should('be.visible')

        cy.getBySel('cy-open-fileselector').then(div => {
            div.find('div').eq(0).find('#cy-thefile').trigger('mouseover')
            div.find('div').eq(0).find('#cy-delete-the-file').click()
            cy.getBySel('cy-file-manger-alert').should('be.visible');
            //   cy.getBySel('cy-close-filemanger').click().click();

        })
    })

 




})
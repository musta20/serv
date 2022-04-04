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

        cy.logInUser()

        cy.location("pathname").should("eq", "/profile");
        cy.getBySel('cy-info').click()
        cy.getBySel('cy-userPage').should("exist");
        cy.getBySel('cy-username').clear()
        cy.getBySel('cy-name').clear()


        cy.getBySel('cy-name').type('safafa')

        cy.getBySel('cy-username').type('536576111')

        cy.getBySel('cy-user-update').click()
        cy.getBySel('cy-alert').should("exist").should('contain', 'تم تحديث البيانات');




    })

    it('check user info error', () => {

        cy.logInUser()

        cy.getBySel('cy-info').click()
        cy.getBySel('cy-userPage').should("exist");

        cy.getBySel('cy-username').clear()
        cy.getBySel('cy-name').clear()


        cy.getBySel('cy-name').type('sfa')

        cy.getBySel('cy-username').type('536576111')

        cy.getBySel('cy-user-update').click()
        cy.getBySel('cy-name-feedback').should("be.visible")
            .should('contain', ' يجب ان لا يقل عنوان النص عن 3 حرف ');

        cy.getBySel('cy-username').clear()
        cy.getBySel('cy-name').clear()


        cy.getBySel('cy-name').type('safsaf')

        cy.getBySel('cy-username').type('1234')

        cy.getBySel('cy-user-update').click()
        cy.getBySel('cy-username-feedback').should("be.visible")
            .should('contain', 'يجب ان لا يقل عنوان النص عن 3 حرف');

    })







    it('user can delete order', () => {
        cy.logInUser()

        cy.getBySel('cy-order').click()

        cy.getBySel('cy-orders-page').should('be.visible')

        cy.getBySel('cy-orders-page').find('div').eq(0).then(item => {

            item.find('#cy-cancle-order').click()
        })

        cy.getBySel('cy-delete-order-model').should('be.visible');

        cy.getBySel('cy-delete-order').click();
    })




    it('user can updateorder order', () => {
        cy.logInUser()

        cy.getBySel('cy-order').click()

        cy.getBySel('cy-orders-page').should('be.visible')

        cy.getBySel('cy-orders-page').find('div').eq(0).then(item => {

            item.find('#cy-update-order').click()
        })

        cy.getBySel('cy-update-order-page').should('be.visible');
        cy.getBySel('update-order-data').click()
        cy.getBySel('cy-order-update-alert').should('be.visible').should('contain', 'تم إضاف اليانات')

    })



    it('user can add and delete files ', () => {
        cy.logInUser()

        cy.getBySel('cy-files').click()

        cy.getBySel('cy-files-page').should('be.visible')

        cy.getBySel('cy-open-fileselector').then(div => {
            div.find('div').eq(0).find('#cy-thefile').trigger('mouseover')
            div.find('div').eq(0).find('#cy-delete-the-file').click()
            cy.getBySel('cy-file-manger-alert').should('be.visible');
            //   cy.getBySel('cy-close-filemanger').click().click();

        })
    })

    it.only('should checl floo pepo;e', () => {
        cy.logInUser();

        cy.getBySel('cy-follow').click()
        cy.getBySel('cy-followPage').should('be.visible');

        cy.getBySel('cy-followPage').find('div').eq(0).then(item => {
            item.find('#cy-go-serv-page').click()
            cy.getBySel('cy-admin-page').should('be.visible')
        })


    })




})
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
describe("user can order service and login ", () => {

    beforeEach(() => {


        cy.visit('/')
    })

    it('order a services', () => {

        cy.getBySel('cy-login-btn').click()
        //  cy.location("pathname").should("eq", "/login");
        cy.getBySel('cy-login-username').type(0 + userData.custmer.username)
        cy.getBySel('cy-login-password').type(userData.custmer.password)
        cy.getBySel('cy-login-submit').click()
        cy.getBySel('cy-gohome').click()

        cy.getBySel('cy-Service').find('.col').eq(1).find('#cy-openserv').click()



        cy.getBySel('cy-services').should("exist");


        cy.getBySel('cy-order-page').click()
        cy.getBySel('cy-post-order').click()
        cy.getBySel('cy-alert-order').should('be.visible').find('span').and('contain', 'الرجاء تعبئة وصف الطلب')

        cy.getBySel('cy-order-des').type('مثال على عنوان الطلب')
        cy.getBySel('cy-post-order').click()
        cy.getBySel('cy-alert-order').should('be.visible')




        cy.getBySel('cy-file-order').then(($div) => {

            if ($div.length) {
                $div.find('.col-sm-10').each(($el, i) => {
                    const alert = cy.wrap(i);


                    alert.find("label").find('span').its('length').then(iit => {

                        if (iit == 2) {

                            alert.get('[data-bs-toggle="modal"]').eq($el).click();

                            cy.getBySel('cy-open-fileselector').then(div => {
                                div.find('div').eq(0).find('#cy-thefile').click();

                                cy.getBySel('cy-close-filemanger').click().click();

                            })

                            //  cy.get('#cy-close-model').click();


                        }



                    })








                })


            }

            cy.getBySel('cy-post-order').click()
        })

    })

})
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

    it("redirect unauthntecated user from prootected pages to the login page", () => {

        cy.visit('/profile');
        cy.location("pathname").should("equal", "/login");


        cy.visit('/Dashboard');
        cy.location("pathname").should("equal", "/login");

        cy.visit('/admin/4/request');
        cy.location("pathname").should("equal", "/login");

    })


    it("shuld redirect to profile page id the user is reguler custmer and to dash pord if the user is provider", () => {

        cy.getBySel('cy-login-btn').click()
        cy.location("pathname").should("eq", "/login");
        cy.getBySel('cy-login-username').type(userData.custmer.username)
        cy.getBySel('cy-login-password').type(userData.custmer.password)
        cy.getBySel('cy-login-submit').click()


        cy.location("pathname").should("eq", "/profile");
        cy.getBySel('cy-profile').should("exist");

        cy.getBySel('cy-Dashboard').should("not.exist");
        cy.getBySel('cy-global-nav').should("not.exist");
        cy.getBySel('cy-global-footer').should("not.exist");



        cy.visit('/Logout')
        cy.getBySel('cy-login-btn').click()
        cy.location("pathname").should("eq", "/login");
        cy.getBySel('cy-login-username').type(userData.provider.username)
        cy.getBySel('cy-login-password').type(userData.provider.password)
        cy.getBySel('cy-login-submit').click()
        cy.location("pathname").should("eq", "/Dashboard");

        cy.getBySel('cy-Dashboard').should("exist");

        cy.getBySel('cy-profile').should("not.exist");
        cy.getBySel('cy-global-nav').should("not.exist");
        cy.getBySel('cy-global-footer').should("not.exist");



    })


    it('shold register user info', () => {

        cy.visit('/Register')
        cy.getBySel('cy-register-username').type(userData.custmer.username)
        cy.getBySel('cy-register-phone').type(userData.custmer.username)
        cy.getBySel('cy-register-password').type(userData.custmer.password)
        cy.getBySel('cy-register-repassword').type(userData.custmer.password)
        cy.getBySel('cy-register-submit').click()

        cy.location("pathname").should("eq", "/profile");

    })



    it('test the login err', () => {
        cy.visit("/login")
        cy.getBySel('cy-login-submit').click()


        cy.getBySel('cy-login-username').should('have.class', 'is-invalid')
        cy.getBySel('cy-login-password').should('have.class', 'is-invalid')
        cy.getBySel('cy-login-alert').should('be.visible').find('span').and('contain', 'الرجاء تعبئة  البيانات')

        cy.getBySel('cy-login-username').type(userData.provider.username)
        cy.getBySel('cy-login-password').should('have.class', 'is-invalid')
        cy.getBySel('cy-login-username').should('not.have.class', 'is-invalid')


        cy.getBySel('cy-login-alert').should('be.visible').find('span').and('contain', 'الرجاء تعبئة  البيانات')

        cy.getBySel('cy-login-username').clear()
        cy.getBySel('cy-login-password').type(userData.provider.password)
        cy.getBySel('cy-login-username').should('have.class', 'is-invalid')
        cy.getBySel('cy-login-password').should('not.have.class', 'is-invalid')


        cy.getBySel('cy-login-alert').should('be.visible').find('span').and('contain', 'الرجاء تعبئة  البيانات')


        cy.getBySel('cy-login-username').type("$$$")
        cy.getBySel('cy-login-password').type("$$$")
        cy.getBySel('cy-login-submit').click()
        cy.getBySel('cy-login-alert').should('be.visible').find('span').and('contain', 'اسم المستخدم او كلمة المرور غير صحيحة')



    })


    it.only('test the registration err', () => {
        cy.visit('/Register')
        cy.getBySel('cy-register-submit').click()
        cy.getBySel('cy-register-username').should('have.class', 'is-invalid')
        cy.getBySel('cy-register-phone').should('have.class', 'is-invalid')
        cy.getBySel('cy-register-password').should('have.class', 'is-invalid')
        cy.getBySel('cy-register-repassword').should('have.class', 'is-invalid')
        cy.getBySel('cy-Register-alert').should('be.visible').find('span').and('contain', 'الرجاء تعبئة الحقول')



        //testing username input 

        cy.getBySel('cy-register-username').type(userData.custmer.username)
        cy.getBySel('cy-register-submit').click()
        cy.getBySel('cy-register-phone').should('have.class', 'is-invalid')
        cy.getBySel('cy-register-password').should('have.class', 'is-invalid')
        cy.getBySel('cy-register-repassword').should('have.class', 'is-invalid')

        cy.getBySel('cy-register-username').clear()
        //testing phone input 
        cy.getBySel('cy-register-phone').type(userData.custmer.username)
        cy.getBySel('cy-register-submit').click()
        cy.getBySel('cy-register-username').should('have.class', 'is-invalid')
        cy.getBySel('cy-register-password').should('have.class', 'is-invalid')
        cy.getBySel('cy-register-repassword').should('have.class', 'is-invalid')
        cy.getBySel('cy-Register-alert').should('be.visible').find('span').and('contain', 'الرجاء تعبئة الحقول')

        cy.getBySel('cy-register-phone').clear()

        //testing username input 

        cy.getBySel('cy-register-submit').click()
        cy.getBySel('cy-register-password').type(userData.custmer.password)

        cy.getBySel('cy-register-username').should('have.class', 'is-invalid')
        cy.getBySel('cy-register-phone').should('have.class', 'is-invalid')
        cy.getBySel('cy-register-repassword').should('have.class', 'is-invalid')
        cy.getBySel('cy-Register-alert').should('be.visible').find('span').and('contain', 'الرجاء تعبئة الحقول')

        cy.getBySel('cy-register-password').clear()


        //testing username input 
        cy.getBySel('cy-register-repassword').type(userData.custmer.password)

        cy.getBySel('cy-register-submit').click()
        cy.getBySel('cy-register-username').should('have.class', 'is-invalid')

        cy.getBySel('cy-register-phone').should('have.class', 'is-invalid')
        cy.getBySel('cy-register-password').should('have.class', 'is-invalid')

        cy.getBySel('cy-Register-alert').should('be.visible').find('span').and('contain', 'الرجاء تعبئة الحقول')

        cy.getBySel('cy-register-repassword').clear()



        cy.getBySel('cy-register-username').type('EeE')
        cy.getBySel('cy-register-phone').type(userData.custmer.phone)
        cy.getBySel('cy-register-password').type(userData.custmer.password)
        cy.getBySel('cy-register-repassword').type(userData.custmer.password)

        cy.getBySel('cy-register-submit').click()
        cy.getBySel('cy-register-username').should('have.class', 'is-invalid')

        cy.getBySel('cy-Register-alert').should('be.visible').find('span').and('contain', 'يجب ان لا يقل عنوان النص عن 3 حرف')

        cy.getBySel('cy-register-username').clear()





        cy.getBySel('cy-register-phone').clear()

        cy.getBySel('cy-register-phone').type('$$$')
        cy.getBySel('cy-register-username').type(userData.custmer.phone)
        cy.getBySel('cy-register-password').type(userData.custmer.password)
        cy.getBySel('cy-register-repassword').type(userData.custmer.password)

        cy.getBySel('cy-register-submit').click()

        cy.getBySel('cy-Register-alert').should('be.visible').find('span').and('contain', 'الرجاء تعبئة الحقول')



        cy.getBySel('cy-register-phone').type('201103')

        cy.getBySel('cy-register-submit').click()

        cy.getBySel('cy-Register-alert').should('be.visible').find('span').and('contain',  'يجب ان لا يزيد الاسم النص عن 9 حرف')
      

        cy.getBySel('cy-register-phone').clear()

        cy.getBySel('cy-register-phone').type(userData.custmer.username)

        cy.getBySel('cy-register-submit').click()

        cy.getBySel('cy-Register-alert').should('be.visible').find('span').and('contain',  'رقم الجوال مستخدم')


        cy.getBySel('cy-register-repassword').type("$$$")

        cy.getBySel('cy-register-submit').click()

        cy.getBySel('cy-Register-alert').should('be.visible').find('span').and('contain',  'اعادة كلمة المرور غير مطابق')

//

    })







})

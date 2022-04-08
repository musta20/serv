
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router'

import fetcher from '../../model/fetcher';
import Head from 'next/head';
import Link from 'next/link';

export default function profile(postData) {
    const [cookies, setCookie, removeCookie] = useCookies(['Jwt']);
    const router = useRouter()

    const [UserName, setUserName] = useState('');
    const [Name, setName] = useState('');
    const [PassWord, setPassWord] = useState('');
    const [rePassWord, setrePassWord] = useState('');
    const [isLoding, setIsLoding] = useState(false);
    const [filederr, setFiledsErrors] = useState(
        {
            username: '',
            name: '',
            password: '',
            repassword: ''
        })

    const [errors, setErros] = useState('');


    useEffect(() => {

        if (typeof document !== undefined) {
            require('bootstrap/dist/js/bootstrap')
        }


        if (cookies.Jwt) {
            router.push('/')

        }
    }, [])

    const Register = async (event) => {

        event.preventDefault()

        let cc = { ...filederr }
        for (const i in cc) {
            cc[i] = ""
        }

        if (!Name) cc.name = "اسم المستخدم مطلوب"
        if (!UserName) cc.username = "رقم الجوال مطلوب "
        if (!PassWord) cc.password = "كلمة المرور مطلوبه "
        if (!rePassWord) cc.repassword = "إعادة كلمة المرور مطلوبه"

        console.log(cc)
        setFiledsErrors(cc)


        if (!UserName || !Name || !PassWord || !rePassWord) return setErros('الرجاء تعبئة الحقول')


        if (PassWord !== rePassWord) {
            setrePassWord('');
            setErros('اعادة كلمة المرور غير مطابق');
            cc.repassword = 'اعادة كلمة المرور غير مطابق'
            setFiledsErrors(cc)
            return;
        }

        fetcher({
            url: '/api/Register', method: "POST",
            data: {
                username: UserName,
                name: Name,
                password: PassWord,
                email: UserName + "@gmail.com",
                user_type: 3
            }
        })
            .then(({ data }) => {
                setIsLoding(false)
                setCookie('Jwt', data.Jwt, { path: '/' });
                setCookie('UserData', data.UserData, { path: '/' });
                router.push('/profile')

            })
            .catch(err => {

                setIsLoding(false)

                const laaresevid = Object.entries(err.response.data).map(item => item[1][0])
                let thedataretrv = err.response.data
                for (const property in thedataretrv) {
                    cc[property] = thedataretrv[property].toString();

                }

                setFiledsErrors(cc);

                setErros(laaresevid.toString())
            })



    }




    return (
        <>
            <Head>
                <meta charSet="utf-8"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
                <meta name="description" content=""></meta>
                <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors"></meta>
                <meta name="generator" content="Hugo 0.84.0"></meta>

                <title>إنشاء حساب</title>

            </Head>
            <div className="bg-light">
     
                <div className="container">
                    <main>

              



                        <div className="py-5 ">

                 <span className='text-black d-flex justify-content-between'>
                    <Link href='/login'>
                        <div role='button'  >
                               هل لديك حساب  ؟         
                        <button className='mx-2 btn-sm btn btn-outline-success'> سجل الدخول </button></div>

                    </Link>

                    <Link href='/'>
              <h5 role='button' className='mx-2 introText text-dark '>خدماتي</h5>

              </Link>
                </span>
                            <h2 className='text-center'>إنشاء حساب</h2>

                            <form onSubmit={Register} className="needs-validation form-signin" noValidate>
                                <div className="row  g-3">
                                    <div className='alert-box '>
                                        <div
                                            data-test='cy-Register-alert'
                                            className={`alert alert-danger alert-dismissible fade ${!errors ? "" : 'show'} `}
                                            role="alert">
                                            <span>
                                                {errors}
                                            </span>

                                            <button type="button"
                                                className="btn-close"
                                                onClick={() => setErros(null)}
                                                aria-label="قريب"></button>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="name" className="form-label">اسم المستخدم <span className="text-muted">(اختياري)</span></label>
                                        <input
                                            onChange={event => setName(event.target.value)}
                                            className={`form-control ${filederr.name ? 'is-invalid' : ''}`}
                                            data-test='cy-register-username'

                                            value={Name}
                                            type="text"
                                            id="name"
                                            placeholder="اسم المستخدم">
                                        </input>
                                        <div className="invalid-feedback">
                                            {filederr.name}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="username" className="form-label">رقم الجوال</label>
                                        <div className="input-group has-validation">
                                            <input

                                                value={UserName}
                                                data-test='cy-register-phone'

                                                type="number"
                                                className={`form-control ${filederr.username ? 'is-invalid' : ''}`}
                                                id="username"
                                                onChange={event => event.target.value.length >= 10 ? '' : setUserName(event.target.value)}
                                                placeholder="5xxxxxxxx"
                                                maxLength="9"

                                                required>
                                            </input>
                                            <div className='border p-2'>+966</div>

                                            <div className="invalid-feedback">
                                                {filederr.username}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="password" className="form-label">كلمة المرور</label>
                                        <input
                                            onChange={event => setPassWord(event.target.value)}
                                            value={PassWord}
                                            data-test='cy-register-password'

                                            type="password"
                                            className={`form-control ${filederr.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            placeholder="كلمة المرور" required>
                                        </input>
                                        <div className="invalid-feedback">
                                            {filederr.password}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="repassword" className="form-label">اعد  كتابة كلمة المرور</label>
                                        <input
                                            onChange={event => setrePassWord(event.target.value)}
                                            value={rePassWord}
                                            data-test='cy-register-repassword'

                                            type="password"
                                            className={`form-control ${filederr.repassword ? 'is-invalid' : ''}`}
                                            id="repassword"
                                            placeholder="كلمة المرور" required>
                                        </input>
                                        <div className="invalid-feedback">
                                            {filederr.repassword}
                                        </div>
                                    </div>
                                    <hr className="my-4"></hr>

                                    <button
                                        disabled={isLoding}
                                        data-test='cy-register-submit'

                                        className="w-100 btn btn-sm  btn-outline-success" type="submit">

                                        {isLoding ?
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            :
                                            " تسجيل "
                                        }
                                    </button>

                                </div>
                            </form>
                        </div>

                    </main>
                    <footer className=" text-muted text-center text-small">
                        <p className="mb-1">
                            
                        <p className="mb-1">Kadamate  2021 © </p>

                        </p>
                  
                    </footer>
                </div>

            </div>
        </>)
}


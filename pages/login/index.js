import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import fetcher from "../../model/fetcher";
import { useAuth } from '../../model/hooks//auth';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';



export default function Login(params) {
  const [loadPageData, setloadPageData] = useState(true);
  const [cookies] = useCookies(['Jwt']);
  const router = useRouter()

  const { setSession, reRoute } = useAuth({ onlyAdmin: null, setloadPageData: setloadPageData })


  const [username, setUserName] = useState('');

  const [password, setPassword] = useState('');

  const [isLoding, setIsLoding] = useState(false);

  const [errors, setErros] = useState(null);




  const LoginUser = async (event) => {


    event.preventDefault();

    if (!username || !password) return setErros('الرجاء تعبئة  البيانات')


    srcf();
    setIsLoding(true)
    await fetcher(
      {
        url: '/api/Login',
        method: 'POST',
        data: { username, password }
      })
      .then(async ({ data }) => {

        setIsLoding(false)
        await setSession(data)
        // setCookie('Jwt', data.Jwt, { path: '/' });
        // setCookie('UserData', data.UserData, { path: '/' });
        //  if()
        reRoute(data.UserData)
        //  router.push('/profile')
      })
      .catch(err => {
        setIsLoding(false)
       // console.log(err)
        setErros(err.response.data)
        // setErros(Object.values(err.response.data).flat())

      })


  }

  useEffect(() => {
    if (typeof document !== undefined) {
      require('bootstrap/dist/js/bootstrap')
    }

  }, [])

  if (loadPageData && cookies.Jwt) {
    return <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }



  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <meta name="description" content=""></meta>
        <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors"></meta>
        <meta name="generator" content="Hugo 0.84.0"></meta>
        <title>نسجيل الدخول</title>
      </Head>
      <div className='container'>
        <main>
          <div className='py-5' >
            <span className='text-black d-flex justify-content-between'>
          
              <Link href='/Register'>
                <div role='button'  >
                  ليس لديك حساب  ؟
                  <button className='mx-2 btn-sm btn btn-outline-success'> إنضم </button></div>

              </Link>
              
              <Link href='/'>
              <h5 role='button' className='mx-2 introText text-dark '>خدماتي</h5>

              </Link>
           
            </span>

            <div className="text-center  body-signin">

              <main className="form-signin">
                <form onSubmit={LoginUser}   >
                  <h1 className="h3 mb-3 fw-normal">تسجيل الدخول</h1>

                  <div className='alert-box'>
                    <div data-test='cy-login-alert'
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


                  <div className="form-floating">
                    <input

                      onChange={(event) => setUserName(event.target.value)}
                      data-test="cy-login-username"
                      value={username}
                      name='username'
                      className={`form-control ${errors && !username ? 'is-invalid' : ''}`}
                      id="floatingInput"
                      placeholder="name@example.com"></input>

                    <label htmlFor="floatingInput">رقم الجوال</label>
                  </div>
                  <div className="form-floating">
                    <input

                      onChange={(event) => setPassword(event.target.value)}
                      data-test="cy-login-password"

                      value={password}
                      name='password'
                      type="password"
                      className={`form-control ${errors && !password ? 'is-invalid' : ''}`}
                      id="floatingPassword" placeholder="Password"></input>
                    <label htmlFor="floatingPassword">كلمة المرور</label>
                  </div>

                  <div className="checkbox mb-3">
                    <label>
                      <input type="checkbox" value="remember-me"></input>
                      {' '}

                      تذكرني
                    </label>
                  </div>
                  <button
                    disabled={isLoding}
                    data-test='cy-login-submit'
                    className="w-100 btn btn-lg btn-outline-success bg-opacity-50" type="submit">
                    {isLoding ?
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      :
                      " تسجيل الدخول"
                    }
                  </button>
                  <p className="mt-5 mb-3 text-muted">
                  <p className="mb-1">Kadamate  2021 © </p>

                  
                  </p>
                </form>
              </main>

            </div>
          </div>
        </main>
      </div>
    </>
  )
}


var srcf = async () => await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`);


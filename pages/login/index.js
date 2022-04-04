import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import fetcher from "../../model/fetcher";
import { useAuth } from '../../model/auth';
import { useCookies } from 'react-cookie';



export default function Login(params) {
  const [loadPageData, setloadPageData] = useState(false);
  const [cookies] = useCookies(['Jwt']);

  const { setSession  , reRoute } = useAuth({ ProtectedPage: false, onlyAdmin: null, setloadPageData: setloadPageData })


  const [username, setusername] = useState('');

  const [password, setPassword] = useState('');

  const [isLoding, setisLoding] = useState(false);

  const [errors, setErros] = useState(null);


 

  const LoginUser = async (event) => {


    event.preventDefault();

    if (!username || !password) return setErros('الرجاء تعبئة  البيانات')


    srcf();
    setisLoding(true)
    await fetcher(
      {
        url: '/api/Login',
        method: 'POST',
        data: { username, password }
      })
      .then( async({data}) => {
        console.log(data)
        setisLoding(false)
       await setSession(data)
       // setCookie('Jwt', data.Jwt, { path: '/' });
       // setCookie('UserData', data.UserData, { path: '/' });
      //  if()
      console.log(cookies.Jwt)

         reRoute(data)
      })
      .catch(err => {
        setisLoding(false)
          console.log(err)
       setErros(err.response.data)
    // setErros(Object.values(err.response.data).flat())

      })


  }

  useEffect(() => {
    if (typeof document !== undefined) {
      require('bootstrap/dist/js/bootstrap')
    }

  }, [])

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

      <div className="text-center mt-5 body-signin">


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

                onChange={(event) => setusername(event.target.value)}
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
              className="w-100 btn btn-lg btn-primary" type="submit">
              {isLoding ?
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                :
                " تسجيل الدخول"
              }
            </button>
            <p className="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
          </form>
        </main>

      </div>
    </>
  )
}


var srcf = async () => await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie');

var getuserdata = async () => await axios.get('http://127.0.0.1:8000/api/user').then(res => console.log(res.data))


import { useEffect, useState } from 'react';
import Link from 'next/link'
import fetcher from '../model/fetcher';
import useSWR from 'swr';


export default function Nav({ UserData, Jwt }) {

  const [name, setname] = useState('')
  const [logOut, setlogOut] = useState('')
  const notfy = loadInput(Jwt);
  useEffect(() => {

    if (UserData) {
      setlogOut(
        <Link
          href="/Logout"  >
          <span role="button"
            className="text-white fs-5 btn btn-sm btn-outline-success border-0">تسجيل خروج</span>
        </Link>
      )

      if (UserData.user_type == 2) {
        setname(<Link href='/Dashboard'>
          <span
            data-test='cy-gocp'
            className='btn text-white btn-sm btn-outline-success border-0'
            role="button">
            {UserData.name}
          </span>

        </Link>)
      }
      else {
        setname(
          <Link href='/profile'>
            <span
              data-test='cy-gocp'
              className='btn text-white btn-sm btn-outline-success border-0'

              role="button">
              {UserData.name}
            </span>
          </Link>)

      }

    } else {
      setlogOut(
        ''
      )
      setname(<><Link href='/login'>
        <span data-test='cy-login-btn' className='  btn btn-sm btn-outline-success text-white' role="button">
          تسجيل الدخول
        </span>
      </Link><Link href='/Register'>
          <span data-test='cy-login-btn' className='ms-1 btn btn-sm btn-outline-success text-white' role="button">
            إنشاء حساب        
            </span>
        </Link></>)
    }

  }, [])



  return (

    <>
      <div data-test='cy-global-nav' className="collapse bg-success text-light  bg-success bg-opacity-50" id="navbarHeader">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-md-7 py-4">
              <h4 className="text-white">حول</h4>
              <p className="">
                <h5>
                  خدماتي - منصة إلكترونية تقدم للجمهور خدمة انجاز المعاملات الإلكترونية الحكومية وغير الحكومية بواسطة مكاتب معتمدة وموثوقة .
                </h5>
              </p>
            </div>
            <div className="col-sm-4 offset-md-1 py-4">

              <ul className="list-unstyled ">

                <li>
                  <Link href="/categories">
                    <div
                      role="button"
                      className="text-white fs-5  btn btn-sm btn-outline-success border-0 m" >
                      التصنيفات
                    </div>
                  </Link>
                </li>

                <li>
                  <Link href="/Register">
                    <div
                      role="button"
                      className="text-white fs-5 btn btn-sm btn-outline-success border-0" >
                      إنضم إلينا كمقدم خدمة                  </div>
                  </Link>
                </li>
                <li>
                  <Link href="/Register">
                    <div
                      role="button"
                      className="text-white fs-5 btn btn-sm btn-outline-success border-0" >
                      إستكشق اكثر الخدمات طلبا
                       </div>
                  </Link>
                </li>
                <li>
                  {logOut}

                </li>

              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar navbar-dark  shadow-sm  bg-success text-dark bg-opacity-50">



        <div className="container text-muted">

          <div className='d-flex'>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="تبديل التنقل">
              <span className="navbar-toggler-icon"></span>

            </button>

            <h5 className='mx-2 introText text-light '>خدماتي</h5>

          </div>


          <strong className='position-relative text-light'>
            {notfy ? <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {notfy}
              <span class="visually-hidden">unread messages</span>
            </span> : ''
            }
            {name}

          </strong>

        </div>
      </div>
    </>

  );
}

const loadInput = (Jwt) => {
  if (!Jwt) return 0;
  const { data, error } = useSWR({ url: '/api/getNotfy', method: 'GET', data: { Jwt: Jwt } }, fetcher);

  return data;

}
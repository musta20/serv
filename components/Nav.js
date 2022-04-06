
import { useEffect, useState } from 'react';
import Link from 'next/link'
import fetcher from '../model/fetcher';
import useSWR from 'swr';


export default function Nav({ UserData, Jwt }) {

  const [name, setname] = useState('')
  const notfy = loadInput(Jwt);
  useEffect(() => {

    if (UserData) {
      if (UserData.user_type == 2) {
        setname(<Link href='/Dashboard'>
          <span
            data-test='cy-gocp'
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
              role="button">
              {UserData.name}
            </span>
          </Link>)

      }

    } else {

      setname(<><Link  href='/login'>
        <span data-test='cy-login-btn' className='  btn btn-sm btn-outline-success text-white' role="button">
          تسجيل الدخول
        </span>
      </Link><Link href='/Register'>
        <span data-test='cy-login-btn' className='ms-1 btn btn-sm btn-outline-success text-white' role="button">
إنشاء حساب        </span>
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
              <p className="text-muted">أضف بعض المعلومات حول الألبوم، المؤلف، أو أي سياق خلفية آخر. اجعلها بضع جمل حتى يتمكن الزوار من التقاط بعض التلميحات المفيدة. ثم اربطها ببعض مواقع التواصل الاجتماعي أو معلومات الاتصال.</p>
            </div>
            <div className="col-sm-4 offset-md-1 py-4">
              <h4 className="text-white">تواصل معي</h4>
              <ul className="list-unstyled">
                <li><Link href="/profile">
                  <div
                    role="button"
                    className="text-white" >
                    لوحة التحكم
                  </div>
                </Link></li>
                <li>
                  <Link
                    href="/Logout"
                  >
                    <span role="button"
                      className="text-white">تسجيل خروج</span>


                  </Link>

                </li>
                <li><a href="#" className="text-white">راسلني على البريد الإلكتروني</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar navbar-dark  shadow-sm  bg-success text-dark bg-opacity-50">
        <div className="container text-muted">



            <strong className='position-relative text-light'>
              {notfy ? <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notfy}
                <span class="visually-hidden">unread messages</span>
              </span> : ''
              }
              {name}

            </strong>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="تبديل التنقل">
            <span className="navbar-toggler-icon"></span>
          </button>
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

import { useEffect, useState } from 'react';
import InfoUser from './pages/userInfo';
import Order from './pages/order';
import Follow from "./pages/follow";
import { useAuth } from '../../model/auth';
import FilesManger from '../../components/FilesManger';

import Msg from "./pages/msg";
import MessageBox from '../../components/MessageBox';
import { ProfileContext } from './pages/context';
import Link from 'next/link';


export default function profile(postData) {
  const [loadPageData, setloadPageData] = useState(false);

  useAuth({ ProtectedPage: true, onlyAdmin: false, setloadPageData: setloadPageData })

  const [thispage, setthispage] = useState('order');

  const [mOrderId, setmOrderId] = useState(0);

  const [mReqId, setReqId] = useState(0);



  const openMsgPage = (ReqId, OrderId) => {
    setReqId(ReqId);
    setmOrderId(OrderId);
    setthispage('MessageBox');
  }

  useEffect(() => {

    if (typeof document !== undefined) {

      require('bootstrap/dist/js/bootstrap')

    }

  }, [])


  const Currentpage = () => {

    switch (thispage) {

      case 'Info':

        return <InfoUser></InfoUser>

      case 'order':

        return <ProfileContext.Provider
        value={{openMsgPage}}
        >
        <Order ></Order>

        </ProfileContext.Provider>

      case 'request':

        return <FilesManger selection={true}></FilesManger>

      case 'follow':

        return <Follow></Follow>

      case 'Msg':

        return <Msg OrderId={mOrderId} ReqId={mReqId}></Msg>
      case 'MessageBox':

        return <MessageBox OrderId={mOrderId} ></MessageBox>

      default:
        break;
    }
  }






  if (!loadPageData) return <div>loadin</div>

  return (
    <div data-test='cy-profile'>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">لوحة التحكم </a>
        <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="عرض/إخفاء لوحة التنقل">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-nav">
          <div className="nav-item text-nowrap">
    <Link  href="/">
    <div data-test='cy-gohome' className="nav-link px-3">الشاشة الرئيسية</div>

    </Link>
          </div>
        </div>

        <div className="navbar-nav">
          <div className="nav-item text-nowrap">
            <a className="nav-link px-3" href="/Logout">تسجيل الخروج</a>
          </div>

        </div>
      </header>

      <div className="container-fluid">
        <div className="row">
          <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="position-sticky pt-3">
              <ul className="nav flex-column hoverEffect">
                <li className="nav-item">
                  <a className="nav-link"
                  data-test='cy-info'
                    onClick={() => setthispage('Info')}

                    href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                      height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"
                      aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>                    البيانات الشخصية
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link"
                  data-test='cy-order'
                    onClick={() => setthispage('order')}
                    href="#">
                    <svg xmlns="http://www.w3.org/2000/svg"
                      width="24" height="24" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-file" aria-hidden="true">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z">
                      </path><polyline points="13 2 13 9 20 9"></polyline></svg>                    الطلبات
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                  className="nav-link"
                  data-test='cy-files'
                   onClick={() => setthispage('request')} href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                    الملفات
                  </a>
                </li>
                <li className="nav-item">
                  <a
                   className="nav-link" 
                   data-test='cy-follow'
                   onClick={() => setthispage('follow')} href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-bar-chart-2" aria-hidden="true">
                      <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4">
                      </line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    المكاتب المفضلة
                  </a>
                </li>
              </ul>

            </div>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">


            <div className="my-4 w-100" id="myChart" width="900" height="380">
              <Currentpage ></Currentpage>
            </div>


          </main>
        </div>
      </div>


    </div>
  )



}



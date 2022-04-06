
import { useEffect, useState } from 'react';
import InfoUser from './pages/userInfo';
import Order from './pages/order';
import Addiserv from './pages/Addiserv';
import UpdateAddiserv from './pages/updateAddiserv ';

import FilesManger from '../../components/FilesManger';
import Services from './pages/services';
import { useAuth } from '../../model/hooks//auth';
import Link from 'next/link';
import Msg from './pages/MsgOrder';
import { DashboardContext } from './pages/context'


export default function profile(postData) {
  const [loadPageData, setloadPageData] = useState(true);
  const [mainPage, setMainPage] = useState('order');
  const [serviceId, setserviceId] = useState(0);

  const [mOrderId, setmOrderId] = useState(0);
  const [mReqId, setReqId] = useState(0);


  const openMsgPage = (ReqId, OrderId) => {
    setReqId(ReqId)
    setmOrderId(OrderId);
    setMainPage('Msg')
  }

  useAuth({ onlyAdmin: true, setloadPageData: setloadPageData })


  useEffect(() => {

    if (typeof document !== undefined) {

      require('bootstrap/dist/js/bootstrap')

    }
  }, [mainPage])

  const updateService = (i) => {
    setserviceId(i)
    setMainPage('updateService')
  }

  const Currentpage = () => {
    useEffect(() => { }, [mainPage])

    switch (mainPage) {
      case 'Info':

        return <InfoUser  ></InfoUser>

      case 'updateService':

        return <DashboardContext.Provider value={{ setMainPage }} >
          <UpdateAddiserv serviceId={serviceId}></UpdateAddiserv>

        </DashboardContext.Provider>
      case 'order':

        return <DashboardContext.Provider value={{ openMsgPage }} >
          <Order ></Order>
        </DashboardContext.Provider>


      case 'Serv':

        return <div>
          <span onClick={() => setMainPage('Addiserv')}

            className='btn btn-sm btn-outline-secondary'>إضافة خدمة</span>

          <hr></hr>

          <Services updateService={updateService} ></Services>  </div>

      case 'Addiserv':

        return <Addiserv ></Addiserv>

      case 'Msg':

        return <DashboardContext.Provider value={{ setMainPage }} >
          <Msg OrderId={mOrderId} ReqId={mReqId}></Msg>

        </DashboardContext.Provider>

      case 'FilesManger':

        return <FilesManger selection={true} ></FilesManger>

      default:
        return <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        break;
    }
  }


  if (loadPageData) {
    return <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }


  return (
    <div data-test='cy-Dashboard'>

      <header className="navbar navbar-dark  sticky-top bg-success bg-opacity-50 flex-md-nowrap p-0 shadow">
        <div role="button"
          className="navbar-brand col-md-3 col-lg-2 me-0 px-3 " >
          لوحة التحكم
        </div>
        <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="عرض/إخفاء لوحة التنقل">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-nav">
          <div className="nav-item text-nowrap">
            <Link href="/">

              <div
                role="button"

                className="nav-link px-3 ">الشاشة الرئيسية</div>

            </Link>
          </div>
        </div>

        <div className="navbar-nav">
          <div className="nav-item text-nowrap">
            <Link href="/Logout">
              <div role="button"
                className="nav-link px-3 " >تسجيل الخروج</div>
            </Link>
          </div>

        </div>
      </header>

      <div className="container-fluid">
        <div className="row">
          <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="position-sticky pt-3 ">
              <ul className="nav flex-column hoverEffect">
                <li className="nav-item">
                  <a className="nav-link"
                    data-test='cy-info'
                    onClick={() => setMainPage('Info')}

                    href="#">
                    <span data-feather="users"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24"
                      height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"
                      aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    البيانات الشخصية
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link"
                    data-test='cy-order'
                    onClick={() => setMainPage('order')}
                    href="#">
                    <span data-feather="file"></span>
                    <svg xmlns="http://www.w3.org/2000/svg"
                      width="24" height="24" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-file" aria-hidden="true">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z">
                      </path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    الطلبات
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link"
                    onClick={() => setMainPage('FilesManger')}
                    data-test='cy-files'

                    href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>

                    الملفات
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link"
                    onClick={() => setMainPage('Serv')}
                    href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="feather feather-bar-chart-2" aria-hidden="true">
                      <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4">
                      </line><line x1="6" y1="20" x2="6" y2="14"></line></svg>

                    الخدمات
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


import { useContext, useEffect, useState } from "react";
import fetcher from "../../../model/fetcher";
import useSWR from 'swr';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router'
import { ProfileContext } from "../../../context/Profilecontext";

import Axios from 'axios'
import FileDownload from 'js-file-download';
import { useAuth } from '../../../model/hooks/auth';


export default function order() {
  const [delteitem, setdelteitem] = useState(0)
  const [PendingOrder, setPendingOrder] = useState([])
  const [cookies] = useCookies(['Jwt']);
  const router = useRouter()
  const { openMsgPage } = useContext(ProfileContext)

  const [loadPageData, setloadPageData] = useState(true);
  useAuth({onlyAdmin: false, setloadPageData: setloadPageData })

  const { pre, isLoding } = getRequest({ Jwt: cookies.Jwt });

  useEffect(() => {

    if (pre) setPendingOrder(pre)


  }, [pre])

  const UpdateOrder = (order) => {
    router.push(`/${order.combany.username}/${order.service.id}/request/${order.id}`)

  }

  const deleteOrder = (id) => {

    fetcher({ url: "/api/Request", method: "DELETE", data: { id: id, Jwt: cookies.Jwt } }).then(e => {

      if (e[0] == 'delete') {
        let prePendingOrder = [...PendingOrder]
        let prepre = prePendingOrder.filter(item => item.id !== id)
        setPendingOrder(prepre);
      }


    });
  }


  const Download = (id, name) => {
    //console.log(id)
    //console.log(name)
    Axios({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/downloadImge/${id}`,
      method: 'GET',
      responseType: 'blob', // Important
      headers: { "Authorization": "Bearer " + cookies.Jwt },


    }).then((response) => {

      FileDownload(response.data, name);

      //    setAlertMesssage([true, 'جاري تحميل الملف'])
      document.documentElement.scrollTop = 0;

    }).catch(err => {
      //console.log(err)
      //  setAlertMesssage([false, 'حدث خطاء الرجاء المحاولة لاحقا'])
      document.documentElement.scrollTop = 0;
    });

  }

  const RequstCard = ({ order, setdelteitem, UpdateOrder }) => {


    if (!order) return <div></div>;

    return <div    
   // data-test='cy-orders' 
    className="card m-3">

      <div className="card-header d-flex justify-content-between">
        <div >{order.id}#</div>

        <div>الخدمة: {order.service.Title}</div>

        <div >مقدم الخدمة :{order.combany.name}</div>

        <div>
          تاريخ الطلب :
          <ShowDate time={order.created_at}></ShowDate>
        </div>
      </div>

      <div className="card-body">

        <div className=" d-flex justify-content-between">
          <p className="card-text">تفاصيل إضافية : {order.Request_des}</p>

          {!order.AlertMesssage ?
            <button
              onClick={() => openMsgPage(order.id)}
              type="button" class="btn btn-sm  btn-outline-success position-relative">
              رسائل
              {order.msg ?
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {order.msg}
                  <span class="visually-hidden">unread messages</span>
                </span>
                : ""}
            </button>

            : ''}

        </div>
        {order.done_msg ?

          <div>
            <button
              className="btn m-2  btn-outline-success btn-sm"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapseExample${order.id}`}
              aria-expanded="false" aria-controls="collapseExample">
              مرفقات
            </button>
            <div className="collapse" id={`collapseExample${order.id}`}>
              <div >
                <p>
                  {order.done_msg}
                </p>
                {order.done_img ?
                  <p>
                    <button onClick={() => Download(order.done_imge.id, order.done_imge.File_name)} className="btn  btn-outline-success btn-sm " >تحميل</button>

                  </p> : ""}
              </div>

            </div>

          </div> : ''}

      </div>

      
      {order.idDone !== 0 ? '' :
        <div className="card-footer text-muted">
          <button
          id='cy-update-order'
          onClick={() => UpdateOrder(order)} className="btn btn-info">تعديل الطلب</button>
          <button 
          onClick={() => setdelteitem(order.id)}
          id="cy-cancle-order"

           data-bs-toggle="modal"
            data-bs-target="#staticBackdropLive" 
            className="btn btn-danger m-1">الغاء الطلب</button>

        </div>
      }
    </div>

  }

 
  if (isLoding || loadPageData) {
    return <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }

  return (<> <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 className="h2">الطلبات</h1>

  </div>
    <div className="bd-example">
      <div className="accordion" id="accordionExample">


        <div className="accordion-item">
          <h4 className="accordion-header" id="headingTwo">

            <button
              className="accordion-button accordion-green collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo">
              طلبات تمت معالجتها
            </button>
          </h4>
          <div id="collapseTwo" className="accordion-collapse collapse " aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              {!showOreders(PendingOrder, 1) ? <p>لا يوجد طلبات</p> : showOreders(PendingOrder, 1).reverse().map(order =>
                <RequstCard key={order.id} order={order} ></RequstCard>
              )}
            </div>
          </div>
        </div>


        <div className="accordion-item">
          <h4 className="accordion-header" id="headingOne">
            <button
              className="accordion-button accordion-blue"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne">
              طلبات تحت المعاجة
            </button>
          </h4>

          <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div 
            data-test='cy-orders-page'
            className="accordion-body">
              {!showOreders(PendingOrder, 0) ? <p>لا يوجد طلبات</p> : showOreders(PendingOrder, 0).reverse().map(order =>
                <RequstCard
                  key={order.id}
                  UpdateOrder={UpdateOrder}
                  setdelteitem={setdelteitem}
                  order={order} ></RequstCard>
              )}
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h4 className="accordion-header " id="headingThree">
            <button className="accordion-button collapsed accordion-yallow"
              type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              طلبات ملغية
            </button>
          </h4>
          <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              {!showOreders(PendingOrder, 2) ? <p>لا يوجد طلبات</p> : showOreders(PendingOrder, 2).reverse().map(order =>
                <RequstCard key={order.id} order={order} ></RequstCard>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
    <Model id={delteitem} deleteOrder={deleteOrder}></Model>

  </>)
}

const ShowDate = ({ time }) => {

  const t = time.split(/[- T:]/);

  var final = new Date(Date.UTC(t[0], t[1], t[2], 0, 0, 0))
  var month = final.getUTCMonth(); //months from 1-12
  var day = final.getUTCDate();
  var year = final.getUTCFullYear();

  return year + "/" + month + "/" + day;

}


const Model = ({ id, deleteOrder, order }) => {
  return <div className="modal fade"
  data-test='cy-delete-order-model'
   id="staticBackdropLive" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLiveLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="staticBackdropLiveLabel">عنوان الصندوق العائم</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
        </div>
        <div className="modal-body">
          <p> هل انت متأكد من الغاء الطلب رقم {id}  </p>
        </div>
        <div className="modal-footer">
          <button type="button"
          className="btn btn-secondary"
            data-bs-dismiss="modal">إغلاق</button>

          <button onClick={() => { deleteOrder(id) }}
            data-test='cy-delete-order'

            data-bs-dismiss="modal" type="button"
            className="btn  btn-outline-success">حذف</button>
        </div>
      </div>
    </div>
  </div>
}

const showOreders = (data, ordertype) => {

  if (!data) return false
  let arr = data.filter(item => item.isDone === ordertype);
  if (arr.length == 0) return false
  return arr

}

const getRequest = (props) => {
  useSWR({
    url: '/api/isViewedRequests',
    method: 'GET',
    data: props
  }, fetcher)

  const { data, error } = useSWR({ url: '/api/Request', method: 'GET', data: props }, fetcher);

  return {
    pre: data,
    isLoding: !data && !error,
    isErorr: error
  }

}
import { useContext, useState } from "react";
import fetcher from "../../../model/fetcher";
import useSWR from 'swr';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { DashboardContext } from "./context";


export default function order() {
  const { openMsgPage } = useContext(DashboardContext);

  const [delteitem, setdelteitem] = useState(0);
  const [PendingOrder, setPendingOrder] = useState([]);
  const [cookies] = useCookies(['Jwt']);
  const router = useRouter();

  const { data } = getRequest(cookies.Jwt);



  const UpdateOrder = (order) => {
    router.push(`/Dashboard/request/${order.id}`)

  }

  const deleteOrder = (order) => {

    fetcher({ url: "/api/Request", method: "DELETE", data: { id: order.id, Jwt: cookies.Jwt } }).then(e => {

      if (e[0] == 'delete') {

        setPendingOrder(PendingOrder.filter(item => item.id != id))

      }


    });
  }


  return (<>
    <div className="bd-example">
      <nav>
        <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
          <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home"
            type="button" role="tab" aria-controls="nav-home" aria-selected="true">طلبات بنتظار المعالجة</button>
          <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile"
            type="button" role="tab" aria-controls="nav-profile" aria-selected="false">طلبات تمت معالجتها</button>
        </div>
      </nav>
      <div className="tab-content" id="nav-tabContent">
        <div className="tab-pane fade active show" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
          {!showOreders(data,0) ? <p>لا يوجد طلبات</p> : showOreders(data,0)
          .reverse()
          .map(order =>
              <RequstCard key={order.id} UpdateOrder={UpdateOrder} 
              openMsgPage={openMsgPage}
              setdelteitem={setdelteitem}
                order={order} ></RequstCard>
            )}
        </div>
        <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
          <div className="accordion-body">
          {!showOreders(data,1) ? <p>لا يوجد طلبات</p> : showOreders(data,1)
                    .reverse()

            .map(order =>
              <RequstCard key={order.id} order={order} ></RequstCard>
            )}
          </div>
        </div>
        <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
        
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

const RequstCard = ({ order, setdelteitem ,openMsgPage}) => {

  return <div className="card">
    <div className="card-header d-flex justify-content-between">
      <div >{order.id}#</div>

      <div>الخدمة: {order.service.Title}</div>


      <div>
        تاريخ الطلب :
        <ShowDate time={order.created_at}></ShowDate>
      </div>
    </div>
    <div className="card-body">
      <p className="card-text">تفاصيل إضافية : {order.Request_des}</p>
    </div>

    {order.isDone !== 0 ? '' :
      <div className="card-footer text-muted">
        <button 
      //  onClick={() => UpdateOrder(order)}
      onClick={()=>openMsgPage(order.service.id ,order.id)}

         className="btn btn-info btn-sm">معالجة الطلب</button>
        
      </div>
    }
  </div>

}


const Model = ({ id, deleteOrder, order }) => {
  return <div className="modal fade" id="staticBackdropLive" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLiveLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="staticBackdropLiveLabel">عنوان الصندوق العائم</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
        </div>
        <div className="modal-body">
          <p>{id}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary"
            data-bs-dismiss="modal">إغلاق</button>

          <button onClick={() => { deleteOrder(order) }}
            data-bs-dismiss="modal" type="button"
            className="btn btn-primary">حذف</button>
        </div>
      </div>
    </div>
  </div>
}

const showOreders = (data,ordertype) => {
  if(!data) return false
  let arr=  data.filter(item => item.isDone === ordertype);
  if(arr.length == 0 ) return false
  return arr


}

const getRequest = (jwt) => {
  const { data, error } = useSWR({ url: '/api/Request', method: 'GET', data: { Jwt: jwt } }, fetcher);
  console.log(data)
  return {
    data: data,
    isLoding: !data && !error,
    isErorr: error
  }

}

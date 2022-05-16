

import fetcher from "../../../model/fetcher";
import { useCookies } from 'react-cookie';
import { useAuth } from "../../../model/hooks/auth"

import Image from 'next/image'



import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

import Model from "../../../components/Model";
import Axios from 'axios'
import FileDownload from 'js-file-download';
import MessageBox from "../../../components/MessageBox";
import { DashboardContext } from "../../../context/DashboardContext"

export default function Msg({ ReqId, OrderId }) {


  const { setMainPage } = useContext(DashboardContext);

  const [isLoding, setIsLoding] = useState(true);
  const [AlertMesssage, setAlertMesssage] = useState([null, ""])
  const [RequestDes, setRequestDes] = useState('');

  const [endMessage, setEnDMessage] = useState('');
  const [endimg, setEndimg] = useState('');

  const [cookies] = useCookies(['Jwt']);
  
  const [loadPageData, setloadPageData] = useState(true);


  useAuth({onlyAdmin: true, setloadPageData: setloadPageData })

  const { data } = RequirementUploader(ReqId)
  const { orid } = OrderData(OrderId, cookies.Jwt)
  const { orimg } = OrderImgeData(OrderId, cookies.Jwt)
  const { files } = getFiles(OrderId, cookies.Jwt);



  const ShowImge = ({ m_type, Messages }) => {

    if (!m_type) return Messages

    const { data, error } = useSWR({ url: '/api/showImge', method: 'SHOW', data: { id: Messages } }, fetcher)

    if (!data) return <div></div>;

    return <Image src={data} width={200} height={170}></Image>;

  }



  useEffect(() => {

    
    const updateForm = []

    data == undefined || orimg == undefined ? null : data.forEach((item, i) => {

      const imgot = orimg.find(im => im.input == item.id)

      updateForm[i] = { input: item.id, value: imgot.img_id, name: item.Title_upload }
    });

    //setFormFiles(updateForm)
   // setmessage(message)


    orid == undefined ? null : setRequestDes(orid.Request_des)

  }, [data, orid, orimg,files])

  const uploadFileMessage = async (event) => {

    const photoFormData = new FormData();

    photoFormData.append("file", event.target.files[0]);
    photoFormData.append("req", OrderId);

    await fetcher({
      url: '/api/FileUpload', method: "POST_FILE", data: {
        body: photoFormData,
        Jwt: cookies.Jwt
        // ,config:config
      }

    }).then(ret => {
    //  console.log(ret.file.id)
      setEndimg(ret.file.id)
    })

  }

  const PostRequest = (OrderId, event, setIsLoding) => {

    setIsLoding(true)
    if (event.target.hasAttribute('data-bs-dismiss')) return


    fetcher({
      url: '/api/completeTask', method: 'PUT', data: {
        id: OrderId,
        done_msg: endMessage,
        done_img: endimg
      }
    }).then(e => {


      //   setTimeout(() => {

      event.target.setAttribute("data-bs-dismiss", "modal");


      event.target.click()
      //   }, 5000);
      setIsLoding(false);

      setAlertMesssage([true, 'تم  اكمال الطلب ']);

      document.documentElement.scrollTop = 0
      setTimeout(() => {
        setMainPage('order')
      }, 1000);


    }).catch(e => {
      //console.log(e)
      event.target.setAttribute("data-bs-dismiss", "modal");


      event.target.click()
      setIsLoding(false);

      setAlertMesssage([false, 'حدث خطاء الرجاء المحاولة لاحقا'])
      document.documentElement.scrollTop = 0
    })



  }

  const Download = (id, name) => {
    Axios({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getRequestImge/${id}`,
      method: 'GET',
      responseType: 'blob', // Important
      headers: { "Authorization": "Bearer " + cookies.Jwt },


    }).then((response) => {

      FileDownload(response.data, name);

      setAlertMesssage([true, 'جاري تحميل الملف'])
      document.documentElement.scrollTop = 0;

    }).catch(err => {
      //console.log(err)
      setAlertMesssage([false, 'حدث خطاء الرجاء المحاولة لاحقا'])
      document.documentElement.scrollTop = 0;
    });


  }

  const DeleteRequest = (OrderId, event, setIsLoding) => {


    setIsLoding(true)
    if (event.target.hasAttribute('data-bs-dismiss')) return


    fetcher({
      url: '/api/Request', method: 'DELETE', data: {
        id: OrderId}
    }).then(e => {


      //   setTimeout(() => {

      event.target.setAttribute("data-bs-dismiss", "modal");


      event.target.click()
      //   }, 5000);
      setIsLoding(false);

      setAlertMesssage([true, 'تم  اكمال الطلب ']);

      document.documentElement.scrollTop = 0

      setTimeout(() => {
        setMainPage('order')
      }, 1000);



    }).catch(e => {
      //console.log(e)
      event.target.setAttribute("data-bs-dismiss", "modal");


      event.target.click()
      setIsLoding(false);

      setAlertMesssage([false, 'حدث خطاء الرجاء المحاولة لاحقا'])
      document.documentElement.scrollTop = 0
    })







  }
  if (loadPageData) {
    return <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }


  return (
    <div 
    data-test='cy-prosses-order'
    className=" d-md-flex flex-md-equal my-md-3 ps-md-3">
      <div
        className="bg-light me-md-3 pt-3 px-3  w-100  pt-md-5 px-md-5 text-start text-dark overflow-hidden"
      >
        {AlertMesssage[0] == null ? '' :
          <div className={`alert ${AlertMesssage[0] ? 'alert-success' : 'alert-danger'}  alert-dismissible fade show`} role="alert">
            {AlertMesssage[1]}

            <button type="button" className="btn-close"
              onClick={() => setAlertMesssage([null, ''])}
              aria-label="قريب"></button>
          </div>}
        <div className="my-3 p-3">

          {!RequestDes ? '' : <> <strong>تفاصيل الطلب: </strong><br></br>
            <div className="mw-50">{RequestDes}</div></>}
          <br></br>
          <h4 className="mb-3 p-2">الملفات المرفة :</h4>

          <div className="needs-validation" noValidate>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {!files ? '' : files.map(img =>
                <div key={img.id} className=" py-2 select">
                  <Image
                    src={img.imge}
                    width={200}
                    height={170}

                  ></Image>
                  <div>
                    <button onClick={(e) => Download(img.id, img.File_name)} className="btn btn-sm btn-secondary">تحميل</button>

                  </div>
                </div>
              )}
            </div>
            <hr className="my-4">
            </hr>
            <div className="">
              <button
                data-bs-toggle="modal"
                data-bs-target="#completeTask"

                className="m-2 w-30 btn  btn-outline-success" type="submit">
                تسليم الطلب
              </button>

              <button

                data-bs-toggle="modal"
                data-bs-target="#deleteTask"

                
                className="w-30  btn btn-danger "
                type="submit">إلغاء الطلب</button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-light  w-100 me-md-2 pt-2 px-2 pt-md-2 px-md-2 text-start text-dark overflow-hidden"
      >
        <MessageBox 
        OrderId={OrderId}>
        </MessageBox>
          
      </div>
      <Model DeleteServ={PostRequest} id={OrderId}
      ModelId={'completeTask'}
        msg={<>
          <textarea
            onChange={e => setEnDMessage(e.target.value)}
            value={endMessage}
            placeholder="ملاحظة" className=" form-control " rows={3}></textarea>
          <label className="">إرسال ملف:</label>
          <div className="">
            {endimg ? <><ShowImge m_type={endimg} Messages={endimg}  ></ShowImge>
              <p>
                <button className="btn btn-sm btn-info" onClick={e => setEndimg(0)}>حذف</button>

              </p>
            </> :
              <>
                <input
                  disabled={false}
                  onChange={event => uploadFileMessage(event)}
                  type="file" className=" form-control " ></input>
              </>
            }
          </div>

        </>}

      ></Model>

<Model DeleteServ={DeleteRequest} id={OrderId}
      ModelId={'deleteTask'}
        msg={<>
        هل انت نتاكد من حذف الطلب
        </>}

      ></Model>
    </div>
  )
}


function RequirementUploader(id) {

  const { data, error } = useSWR({ url: '/api/RequirmenUploader', method: 'SHOW', data: { id } }, fetcher);


  return {
    data: data,
    isLoding: !data && !error,
    errors: error
  }
}

const OrderData = (id, jwt) => {
  const { data, error } = useSWR({ url: '/api/Request', method: 'SHOW', data: { id: id, Jwt: jwt } }, fetcher);
  // const data = await fetcher({ url: '/api/Request', method: 'SHOW', data:{id:id,Jwt:jwt}});
  return {
    orid: data
  }
}

const OrderImgeData = (id, jwt) => {
  const { data, error } = useSWR({ url: '/api/imgetorequest', method: 'SHOW', data: { id: id, Jwt: jwt } }, fetcher);
  // const data = await fetcher({ url: '/api/imgetorequest', method: 'SHOW', data:{id:id,Jwt:jwt}});
  return {
    orimg: data

  }
}

const getFiles = (id, Jwt) => {
  const { data, error } = useSWR({ url: '/api/GetFilsForReq', method: 'SHOW', data: { id: id, Jwt: Jwt } }, fetcher);
  //console.log(data)
  return {
    files: data,
    isLoding: !data && !error,
    isErorr: error
  }

}


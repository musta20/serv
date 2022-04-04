
import { useAuth } from "../../../model/auth";
import FilesManger from "../../../components/FilesManger"

import fetcher from "../../../model/fetcher";
import { useCookies } from 'react-cookie';
import Image from 'next/image'

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import MessageBox from "../../../components/MessageBox";

export default function Msg({ReqId,OrderId}) {

  const [Files, setFile] = useState({});
  const [AllImgesfiles, setAllImgesfiles] = useState([]);
  const [FormFiles, setFormFiles] = useState([]);
  const [currentFile, setcurrentFile] = useState(0);
  const [allmessage, setmessage] = useState([]);
  const [currentmessage, setmessagecurrent] = useState([]);
  const [pross, setpross] = useState(0);
  const [loadPageData, setloadPageData] = useState(false);

  const [RequestDes, setRequestDes] = useState('');
  const [cookies] = useCookies(['Jwt']);


  useAuth({ 
     ProtectedPage: true,
     onlyAdmin: false, 
     setloadPageData: setloadPageData 
    })


  const { data } = RequirementUploader({id:ReqId ,Jwt : cookies.Jwt})
  const { orid } = OrderData({id:OrderId ,Jwt : cookies.Jwt})
  const { orimg } = OrderImgeData({id:OrderId ,Jwt : cookies.Jwt})
  const { message } = getMessages({id:OrderId ,Jwt : cookies.Jwt})
  const chatBox = useRef(null);

  const handelimgeselection = (id) => {

    if (currentFile !== 0 && id !== 0) {

      setFile({ input: currentFile, value: id })

    }
  }
  const ShowImge = ({ m_type, Messages }) => {

    if (!m_type) return Messages

    const { data, error } = useSWR({ url: '/api/showImge', method: 'SHOW', data: { id: Messages } }, fetcher)

    if (!data) return <div></div>;

    return <Image src={data} width={200} height={170}></Image>;

  }

  useEffect(() => {

    if (typeof document !== undefined) {
      require('bootstrap/dist/js/bootstrap')
    }
    const updateForm = []

    data == undefined || orimg == undefined ? null : data.forEach((item, i) => {
      const imgot = orimg.find(im => im.input == item.id)
      
     if(imgot) updateForm[i] = { input: item.id, value: imgot.img_id, name: item.Title_upload ,is_required:item.is_required }
    });

    setFormFiles(updateForm)
    setmessage(message)
    //chatBox.current.scrollTop = chatBox.current.scrollHeight

    orid == undefined ? null : setRequestDes(orid.Request_des)

 

  }, [data, orid, orimg, message])

  const closeMdeol = () => {
    const updatFile = FormFiles.findIndex(item => item.input == Files.input)

    const newupdateForm = [...FormFiles]

    newupdateForm[updatFile].value = Files.value

    setFormFiles(newupdateForm)



  }

  const uploadFile = async (event, inputid) => {

    const photoFormData = new FormData();

    photoFormData.append("file", event.target.files[0]);

    //srcf()

    const config = {
      onUploadProgress: function (progressEvent) {
        setpross(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      }
    }

    await fetcher({
      url: '/api/FileUpload', method: "POST_FILE", data: {
        body: photoFormData,
        Jwt: cookies.Jwt
        // ,config:config
      }

    }).then(ret => {

      files.push(ret.file)
      const updatFile = FormFiles.findIndex(item => item.input == inputid)

      const newupdateForm = [...FormFiles]

      newupdateForm[updatFile].value = ret.file.id

      setFormFiles(newupdateForm)


    });

  }

  const handelOpenModel = (e) => {
    e.preventDefault();
    setcurrentFile(e.target.id);
  }

  const removeImge = (e, indexFilw) => {
    e.preventDefault()
    const updatFile = FormFiles.indexOf(indexFilw)

    const newupdateForm = [...FormFiles]

    newupdateForm[updatFile].value = 0

    setFormFiles(newupdateForm)
  }

  function getMessages(props) {

    const { data, error } = useSWR({ url: '/api/Messages', method: 'SHOW', data:props }, fetcher);

    useSWR({ 
      url: '/api/isViewed',
       method: 'PUT',
        data:props },fetcher)


        

    return {
      message: data,
      isLoding: !data && !error,
      errors: error
    }
  }

  const { files } = getFiles({Jwt:cookies.Jwt});

  const PostRequest = (event) => {

    event.preventDefault();

    fetcher({
      url: '/api/Request', method: 'PUT', data: {
        combany_id: ReqId,
        id: OrderId,
        Request_des: RequestDes,
        Jwt: cookies.Jwt,
        Service_id: ReqId,
        FormFiles: FormFiles,

      }
    }).then(e => {


      setisLoding(false)
      setISdONE([true, `تم إضاف اليانات`])
      document.documentElement.scrollTop = 0



    }).catch(e=>{

      setisLoding(false)
      setISdONE([false, `حدث خطاء الرجاء المحاولة لاخقا`])
      document.documentElement.scrollTop = 0
    });



  }

  const SendMessages = () => {
    console.log(' orid orid orid orid orid ')
  //  console.log(orid)
    fetcher({
      url: '/api/Messages', method: 'POST', data: {
        req_id: OrderId,
        User_id: 0,
        isDone: 0,
        m_type: 0,

        Jwt: cookies.Jwt,
         Messages: currentmessage,
          Sender_id: cookies.UserData.id
      }
    })
      .then(mesg => {
        const laamesge = [...allmessage]
        laamesge.push(mesg)
        setmessage(laamesge)


      })

  }

  return (
    <>
    <div
    data-test='cy-msg'
    className=" w-100 d-md-flex flex-md-equal my-md-3 ps-md-3">

      <div className="bg-light me-md-3 pt-3 px-3  w-100  pt-md-5 px-md-5 text-start text-dark overflow-hidden">
      <MessageBox OrderId={OrderId}></MessageBox>
      <div 
      className="bg-light me-md-3 pt-3 px-3  w-100  pt-md-5 px-md-5 text-start text-dark overflow-hidden"
    
    >
    {!RequestDes ? '' : <> <strong>تفاصيل الطلب: </strong><br></br> {RequestDes}</>}

        <h4 className="mb-3 p-2">الملفات المرفة</h4>
        <form onSubmit={(event) => PostRequest(event)} className="needs-validation" noValidate>
          <div className="row g-3 ">


            {!data ? '' : data.map((item, i) =>
              <div key={i} className="col-sm-10 border w-75 p-2">
                                                  <span> {item.is_required ? <span className="text-danger"> * الزامي </span> : ''}</span>

                <label className="form-label" htmlFor="customFile">{item.Title_upload}</label>

                <div className=" ">
                  <InputType
                    inputid={item.id}
                    FormFiles={FormFiles[FormFiles.findIndex(ef => ef.input == item.id)]}
                    uploadFile={uploadFile}
                    allimges={files}
                    removeImge={removeImge}
                    i={i} ></InputType>
                  <button
                    id={item.id}
                    onClick={(e) => handelOpenModel(e)}

                    data-bs-toggle="modal" data-bs-target="#exampleModalCenteredScrollable"
                    className="mt-2 btn btn-primary">إضافة ملف محفوظ</button>
                </div>
                <div className="">


                </div>

              </div>

            )}

          </div>


          <div className="row gy-3">

          </div>

          <hr className="my-4">
          </hr>
          <div className=" d-flex justify-content-center">
            <button className="w-50 btn btn-primary btn-lg" type="submit">حفظ التعديلات</button>

          </div>
        </form>

      </div>
      
     

         
       
          </div>

    
    </div>

    <div className="modal fade" id="exampleModalCenteredScrollable" tabIndex="-1" aria-labelledby="exampleModalCenteredScrollableTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalCenteredScrollableTitle">عنوان الصندوق العائم</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
          </div>
          <div className="modal-body">
            <FilesManger
              files={files}
              selection={false}
              returnSelected={handelimgeselection}
            ></FilesManger>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
            <button type="button" onClick={() => closeMdeol()} data-bs-dismiss="modal" className="btn btn-primary">أضف الملف</button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}


function RequirementUploader(props) {

  const { data, error } = useSWR({ url: '/api/RequirmenUploader', method: 'SHOW', data: props }, fetcher);


  return {
    data: data,
    isLoding: !data && !error,
    errors: error
  }
}

const OrderData = (props) => {
  const { data, error } = useSWR({ url: '/api/Request', method: 'SHOW', data: props }, fetcher);

  return {
    orid: data
  }
}

const OrderImgeData = (props) => {
  const { data, error } = useSWR({ url: '/api/imgetorequest', method: 'SHOW', data: props}, fetcher);
  // const data = await fetcher({ url: '/api/imgetorequest', method: 'SHOW', data:{id:id,Jwt:jwt}});
  return {
    orimg: data

  }
}

const getFiles = ({Jwt}) => {
  const { data, error } = useSWR({ url: '/api/FileUpload', method: 'GET', data: { Jwt } }, fetcher);
  //console.log(data)
  return {
    files: data,
    isLoding: !data && !error,
    isErorr: error
  }

}

const InputType = ({ inputid, FormFiles, uploadFile, removeImge, allimges, i }) => {
  if (FormFiles !== undefined) {
    if (FormFiles.value !== 0) {
      const { imge } = allimges[allimges.findIndex(item => item.id == FormFiles.value)]

      return <div ><Image
        src={imge}
        width={200}
        height={170}
      ></Image>
        <br></br>
        <button

          onClick={(e) => removeImge(e, FormFiles)}

          className=" btn btn-danger">حذف الصورة</button>
      </div>
    }
  }

  return <input
    disabled={false}
    onChange={event => uploadFile(event, inputid)}
    type="file" className=" form-control w-75" id={`${i}customFile`}></input>
}



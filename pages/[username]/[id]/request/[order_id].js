
import Layout from "../../../../components/Layout";
import FilesManger from "../../../../components/FilesManger";
import fetcher from "../../../../model/fetcher";
import { useCookies } from 'react-cookie';
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useAuth } from "../../../../model/auth";

import { useEffect, useState } from 'react';
import useSWR from 'swr';

export default function requestpage(props) {

  const [Files, setFile] = useState({});
  const [FormFiles, setFormFiles] = useState([]);
  const [currentFile, setcurrentFile] = useState(0);
  const [RequestDes, setRequestDes] = useState('');
  const [cookies] = useCookies(['Jwt']);
  const [loadPageData, setloadPageData] = useState(false);
  const [isDone, setISdONE] = useState([null, ""])
  const [isLoding, setisLoding] = useState(false);

  const router = useRouter()

  useAuth({ ProtectedPage: true, onlyAdmin: false, setloadPageData: setloadPageData })

  const { data } = RequirementUploader(router.query.id,cookies.Jwt)
  const { orid } = OrderData(router.query.order_id,cookies.Jwt)
  const { orimg } = OrderImgeData(router.query.order_id,cookies.Jwt)

  const handelimgeselection = (id) => {

    if (currentFile !== 0 && id !== 0) {

      setFile({ input: currentFile, value: id })

    }
  }

  useEffect(() => {
    if (typeof document !== undefined) {
      require('bootstrap/dist/js/bootstrap')
    }
    console.log(router.query)


    const updateForm = []
   // console.log(data)
    console.log(orimg)

    data == undefined || orimg == undefined ? null : data.forEach((item, i) => {
      
      const imgot = orimg.find(im => im.input == item.id)
      
     // console.log(orimg)
      
      console.log(item)
      
      updateForm[i] = { 

        input: item.id, 

        value: imgot.img_id, 

        name: item.Title_upload ,

        is_required:item.is_required }

    });

    setFormFiles(updateForm)


    orid == undefined ? null : setRequestDes(orid.Request_des)

  }, [data,orid,orimg])



  const closeMdeol = () => {

    console.log(FormFiles)

    const updatFile = FormFiles.findIndex(item => item.input == Files.input)

    const newupdateForm = [...FormFiles]

    newupdateForm[updatFile].value = Files.value

    setFormFiles(newupdateForm)



  }

  const uploadFile = async (event, inputid) => {

    const photoFormData = new FormData();

    photoFormData.append("file", event.target.files[0]);

    //srcf()


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

    e.preventDefault();

    const updatFile = FormFiles.indexOf(indexFilw)

    const newupdateForm = [...FormFiles]

    newupdateForm[updatFile].value = 0

    setFormFiles(newupdateForm)
  }

  const { files } = getFiles(cookies.Jwt);
  const { serv } = getServices(router.query.id)

  const PostRequest = (event) => {

    event.preventDefault();

    setisLoding(true);

    if (!RequestDes && !serv.is_des_req) 
    {
      setisLoding(false)

      setISdONE([false, `الرجاء ارفاق hgfdhkhj hg'f,f td hg,wt`])
      document.documentElement.scrollTop = 0   
      return
    }
    try {

      FormFiles.forEach(item => {
        if (!item.value && item.is_required) {
          setisLoding(false)

          setISdONE([false, `الرجاء ارفاق ${item.name}`])
          document.documentElement.scrollTop = 0

          throw 'upliad err'
        }

      })
    } 
    catch (e) {
      return
    }




    fetcher({
      url: '/api/Request', method: 'PUT', data: {
        combany_id: router.query.id,
        id: router.query.order_id,
        Request_des: RequestDes,
        Jwt: cookies.Jwt,
        Service_id: router.query.id,
        FormFiles: FormFiles,

      }
    }).then(e => {

      setisLoding(false)
      setISdONE([true, `تم إضاف اليانات`])
      document.documentElement.scrollTop = 0
      setTimeout(() => {
        router.push('/profile')
      }, 1000);



    }).catch(err => {
      setisLoding(false)
      setISdONE([false, `حدث خطاء الرجاء المحاولة لاخقا`])
      document.documentElement.scrollTop = 0

    });


  }


  return (<Layout>
    <div data-test='cy-update-order-page' className="container bg-light">

      <div className="py-5 text-center">

        {isDone[0] == null ? '' :
      <div className={`alert ${isDone[0] ? 'alert-success' : 'alert-danger'}  alert-dismissible fade show`} role="alert">
       <span
       data-test='cy-order-update-alert'
       >

       {isDone[1]}


       </span>

        <button type="button" className="btn-close"
         onClick={()=>setISdONE([null,''])}
         aria-label="قريب"></button>
      </div>}      </div>

      <div className="col-md-7 col-lg-8">
        <h4 className="mb-3">تعبئة الطلب</h4>
        <p><h6>متطلبات الحدمة</h6></p>
              <p>
                {!serv ? '' : serv.	Requirement }
              </p>
        <form onSubmit={(event) => PostRequest(event)} className="needs-validation" noValidate>
          <div className="row g-3 ">
            <div className="col-sm-10">
              <label htmlFor="firstName" className="form-label">تفاصيل إضافية (إختياري)</label>
              <textarea rows="5"
                onChange={event => setRequestDes(event.target.value)}
                value={RequestDes}
                name='Requestdes' type="textarea" className="form-control" id="firstName"
                placeholder="" required>
              </textarea>
              <div className="invalid-feedback">
                يرجى إدخال اسم أول صحيح.
              </div>

            </div>

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
                    i={i} >

                  </InputType>
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
            <button 
            data-test='update-order-data'
            className="w-50 btn btn-primary btn-lg" type="submit">حفظ التعديلات</button>

          </div>
        </form>

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
  </Layout>
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
  
  const { data, error } = useSWR({ url: '/api/Request', method: 'SHOW', data: { id:id ,Jwt:jwt } }, fetcher);
  // const data = await fetcher({ url: '/api/Request', method: 'SHOW', data:{id:id,Jwt:jwt}});
  return {
    orid: data
  }
}

const OrderImgeData = (id, jwt) => {
  const { data, error } = useSWR({ url: '/api/imgetorequest', method: 'SHOW', data: { id:id ,Jwt:jwt } }, fetcher);
  // const data = await fetcher({ url: '/api/imgetorequest', method: 'SHOW', data:{id:id,Jwt:jwt}});
 console.log('OrderImgeData OrderImgeData OrderImgeData OrderImgeData')
 console.log(data)
  return {
    orimg: data

  }
}

function getServices(id) {

  const { data, error } = useSWR({ url: '/api/services', method: 'SHOW', data: { id } }, fetcher);


  return {
    serv: data,
    isLoding: !data && !error,
    errors: error
  }
}

const getFiles = (jwt) => {
  const { data, error } = useSWR({ url: '/api/FileUpload', method: 'GET', data: { Jwt: jwt } }, fetcher);
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



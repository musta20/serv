
import Layout from "../../../../components/Layout";
import fetcher from "../../../../model/fetcher";
import { useCookies } from 'react-cookie';
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useAuth } from "../../../../model/hooks//auth";
import FilesManger from '../../../../components/FilesManger';



export default function orderPage(props) {

  const [Files, setFile] = useState({});
  const [FormFiles, setFormFiles] = useState([]);
  const [currentFile, setcurrentFile] = useState(0);
  const [RequestDes, setRequestDes] = useState('');
  const [cookies] = useCookies(['Jwt']);
  const router = useRouter();
  const [loadPageData, setloadPageData] = useState(true);

  const [isLoding, setIsLoding] = useState(false);
  const [AlertMesssage, setAlertMesssage] = useState([null, ""])

  useAuth({ onlyAdmin: false, setloadPageData: setloadPageData })

  const { data } = RequirementUploader(router.query.id)
  const { serv } = getServices(router.query.id)

  const handelimgeselection = (id) => {
   // console.log(id)

    if (currentFile !== 0 && id !== 0) {


      
      setFile({ input: currentFile, value: id })

    }
  }

  useEffect(() => {

    if (typeof document !== undefined) {
      require('bootstrap/dist/js/bootstrap')
    }
    const updateForm = []

    data == undefined ? null : data.forEach((item, i) => {
      updateForm[i] = { input: item.id, value: 0, name: item.Title_upload, is_required: item.is_required }
    });

    setFormFiles(updateForm)

  }, [data])


  const closeMdeol = () => {

    const updatFile = FormFiles.findIndex(item => item.input == Files.input)
  
    const newupdateForm = [...FormFiles]

    newupdateForm[updatFile].value = Files.value

    setFormFiles(newupdateForm)

  }

  const uploadFile = async (event, inputid) => {

    const photoFormData = new FormData();

    photoFormData.append("file", event.target.files[0]);

    console.log('OROPSE THE photoFormData')
    console.log(event.target.files[0])
    console.log(photoFormData)

    await fetcher({
      url: '/api/FileUpload', method: "POST_FILE", data: {
        body: photoFormData,
        Jwt: cookies.Jwt
      }

    }).then(ret => {

      files.push(ret.file)
    //  console.log(FormFiles)
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

  const { files } = getFiles(cookies.Jwt);

  const PostRequest = (event) => {

    setIsLoding(true)
    event.preventDefault();

    if (!RequestDes && !serv.is_des_req) {
      setIsLoding(false)

      setAlertMesssage([false, `الرجاء تعبئة وصف الطلب`])
      document.documentElement.scrollTop = 0
      return
    }


    try {

      FormFiles.forEach(item => {
        if (!item.value && item.is_required) {
          setIsLoding(false)

          setAlertMesssage([false, `الرجاء ارفاق ${item.name}`])
          document.documentElement.scrollTop = 0

          throw 'upliad err'
        }

      })
    }

    catch (e) {

      return
    }

    fetcher({
      url: '/api/Request', method: 'POST', data: {
        combany_id: router.query.username,
        Request_des: RequestDes,
        Jwt: cookies.Jwt,
        Service_id: router.query.id,
        FormFiles: FormFiles,

      }
    }).then(e => {

      setIsLoding(false)
      setAlertMesssage([true, `تم إضاف اليانات`])
      document.documentElement.scrollTop = 0
      setTimeout(() => {
        router.push('/profile')
      }, 1000);


    }).catch(err => {
      setIsLoding(false)
      setAlertMesssage([false, `حدث خطاء الرجاء المحاولة لاخقا`])
      document.documentElement.scrollTop = 0

    });

  }


  if (loadPageData) {
    return <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }




  return (<Layout>
    <div className="container bg-light">
      <div className="py-5 text-center">
        <h2>نموذج طلب الخدمة</h2>

        {AlertMesssage[0] == null ? '' :
          <div data-test='cy-alert-order' className={`alert ${AlertMesssage[0] ? 'alert-success' : 'alert-danger'}  alert-dismissible fade show`} role="alert">
            <span >
              {AlertMesssage[1]}

            </span>

            <button type="button" className="btn-close"
              onClick={() => setAlertMesssage([null, ''])}
              aria-label="قريب"></button>
          </div>}
      </div>

      <div className="col-md-7 col-lg-8">
        <h4 className="mb-3">تعبئة الطلب</h4>
        <form onSubmit={(event) => PostRequest(event)} className="needs-validation" noValidate>
          <div className="row g-3 ">
            <div className="col-sm-10">
              <p><h6>متطلبات الحدمة</h6></p>
              <p>
                {!serv ? '' : serv.Requirement}
              </p>
              <label htmlFor="firstName" className="form-label">تفاصيل إضافية (إختياري)</label>
              <textarea rows="5"
                data-test="cy-order-des"
                onChange={event => setRequestDes(event.target.value)}
                value={RequestDes}
                name='Requestdes' type="textarea" className="form-control" id="firstName"
                placeholder="" required>
              </textarea>
              <div className="invalid-feedback">
                يرجى إدخال اسم أول صحيح.
              </div>

            </div>


            <div data-test='cy-file-order'>
              {!data ? '' : data.map((item, i) =>
                <div key={i} className="col-sm-10 border w-75 p-2">

                  <label className="form-label" htmlFor="customFile">
                    <span> {item.is_required ? <span
                      id='cy-order-require'
                      className="text-danger"> * الزامي </span> : ''}</span>

                    {item.Title_upload}

                  </label>

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

                      data-bs-toggle="modal" 
                      data-bs-target="#exampleModalCenteredScrollable"
                      className="mt-2 btn  btn-outline-success">إضافة ملف محفوظ</button>
                  </div>
                  <div className="">


                  </div>

                </div>

              )}
            </div>



            
          </div>


          <div className="row gy-3">

          </div>

          <hr className="my-4">
          </hr>
          <div className=" d-flex justify-content-center">
            <button
              disabled={isLoding}
              data-test='cy-post-order'

              className="w-50 btn  btn-outline-success btn-lg" type="submit">
              {isLoding ?
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                :
                " تقديم الطلب "
              }

            </button>

          </div>
        </form>

      </div>
    </div>
    <div className="modal fade"
      id="exampleModalCenteredScrollable" tabIndex="-1" aria-labelledby="exampleModalCenteredScrollableTitle" aria-hidden="true">
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
            <button type="button"
             id='cy-close-model'
             className="btn btn-secondary" 
            data-bs-dismiss="modal">إغلاق</button>
            <button
             data-test='cy-close-filemanger'
              onClick={() => closeMdeol()}
               data-bs-dismiss="modal"
                className="btn  btn-outline-success">أضف الملف</button>
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

function getServices(id) {

  const { data, error } = useSWR({ url: '/api/services', method: 'SHOW', data: { id } }, fetcher);

 // console.log(data)
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
        id='cy-thecurrentimge'
        width={200}
        height={170}
      ></Image>
        <br></br>
        <button

          onClick={(e) => removeImge(e, FormFiles)}
          id="cy-delete-file"

          className=" btn btn-danger">حذف الصورة</button>
      </div>
    }
  }

  return <input
    id="cy-upload-file"
    disabled={false}
    onChange={event => uploadFile(event, inputid)}
    type="file" className=" form-control w-75"

  ></input>
}

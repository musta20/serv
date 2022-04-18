
import { useCookies } from "react-cookie";
import fetcher from "../model/fetcher";
import Image from 'next/image'
import { useState, useEffect } from "react";
import useSWR from "swr";
import Axios from 'axios'
import FileDownload from 'js-file-download';



export default function FilesManger({ selection, returnSelected }) {

  const [cookies] = useCookies(['Jwt']);

  const [select, setSelected] = useState(0);

  const [AlertMesssage, setAlertMesssage] = useState([null, ""])

  const [allimges, setallimgesFile] = useState([])

  const { files, isLoding } = getFiles(cookies.Jwt)


  useEffect(() => {

    setallimgesFile(files)

  }, [files])


  const displayClass = (id) => {


    if (selection) return 'col select'

    if (id == select) return 'col selected'

    return 'col select'

  }

  const handelSelection = (id) => {
    if (returnSelected) returnSelected(id)
    setSelected(id)

  }

  const deleteimge = (id) => {

    fetcher({
      url: '/api/UploadedFile',
      method: 'DELETE',
      data: { id: id, Jwt: cookies.Jwt }
    })
      .then(e => {


        let arry = [...allimges]
        let newarry = arry.filter(i => i.id !== id)

        setallimgesFile(newarry)
        setAlertMesssage([true, e])
        document.documentElement.scrollTop = 0;


      })
      .catch(e => {
        console.log(e)
        setAlertMesssage([false, e.response.data])
        document.documentElement.scrollTop = 0;
      })

  }



  const Download = (id, name) => {
    Axios({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/downloadImge/${id}`,
      method: 'GET',
      responseType: 'blob', // Important
      headers: { "Authorization": "Bearer " + cookies.Jwt },


    }).then((response) => {

      FileDownload(response.data, name);

      setAlertMesssage([true, 'جاري تحميل الملف'])
      document.documentElement.scrollTop = 0;

    }).catch(err => {
      console.log(err)
      setAlertMesssage([false, 'حدث خطاء الرجاء المحاولة لاحقا'])
      document.documentElement.scrollTop = 0;
    });

  }


  const UploadFile = async (event) => {

    const photoFormData = new FormData();

    photoFormData.append("file", event.target.files[0]);



    await fetcher({
      url: '/api/FileUpload', method: "POST_FILE", data: {
        body: photoFormData,
        Jwt: cookies.Jwt
      }

    }).then(ret => {
      setAlertMesssage([true, 'نم تحميل الملف'])
      document.documentElement.scrollTop = 0;


    }).catch(err => {
      console.log(err.response)
      try {
        setAlertMesssage([false, Object.values(err.response.data.errors).flat()])

      }
      catch (e) {
        setAlertMesssage([false, "حدث خطاء الرجاء المحاولة لاحقا"])

      }

      document.documentElement.scrollTop = 0;

    })
  }


  if (isLoding) {
    return <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }

  return (<>
    <div

    data-test='cy-files-page'
    
    className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">

      <div>

        {AlertMesssage[0] == null ? '' :
          <div className={`alert ${AlertMesssage[0] ? 'alert-success' : 'alert-danger'}  alert-dismissible fade show`} role="alert">
           <span
           data-test='cy-file-manger-alert'
           >

           {AlertMesssage[1]}


           </span>

            <button type="button" className="btn-close"
              onClick={() => setAlertMesssage([null, ""])}

              aria-label="قريب"></button>
          </div>}

        {selection ? <h1 className="h2 ">الملفات</h1> : ''}

      </div>



    </div>
    {selection ? <>
      <label>إضافة ملف</label>
      <input type="file"
        onChange={(event) => UploadFile(event)}
        className=" form-control w-75" id={`customFile`}></input>
      <br></br></> : ''}

    <div>

      <div data-test='cy-open-fileselector' className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
        {!allimges ? '' : allimges.map(serv =>
          <div key={serv.id} className={displayClass(serv.id)}>
            <Image
              src={serv.imge}
              width={500}
              id='cy-thefile'
              height={400}
              onClick={() => handelSelection(serv.id)}
              blurDataURL={serv.imge}
              placeholder="blur"
            ></Image>

            {selection ? <div className="hidebtn" >
              <button 
              id='cy-delete-the-file'
              
              onClick={() => deleteimge(serv.id)} className="border btn btn-sm btn-danger m-1" >حذف</button>
              <button onClick={() => Download(serv.id, serv.File_name)} className="border btn btn-sm btn-secondary">تحميل</button>
            </div> : ''}
          </div>
        )}

      </div>
    </div></>)
}

const getFiles = (jwt) => {
  const { data, error } = useSWR({ url: '/api/FileUpload', method: 'GET', data: { Jwt: jwt } }, fetcher);
  return {
    files: data,
    // isLoding:true,
    isLoding: !data && !error,
    isErorr: error
  }

}


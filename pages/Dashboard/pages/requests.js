
import { useCookies } from "react-cookie";
import fetcher from "../../../model/fetcher";
import Image from 'next/image'
import { useState, useEffect } from "react";
import useSWR from "swr";
import Axios from "axios";
import FileDownload from 'js-file-download';


export default function request() {

  const [cookies] = useCookies(['Jwt']);

  const [select, setSelected] = useState(0);

  const [isDone, setISdONE] = useState([null, ""])

  const [allimges, setallimgesFile] = useState([])

  const { files, isLoding } = getFiles(cookies.Jwt)

  useEffect(() => {

    setallimgesFile(files)

  }, [select, files,allimges])


  const deleteimge = (id) => {

    fetcher({
      url: '/api/UploadedFile',
      method: 'DELETE',
      data: { id: id, Jwt: cookies.Jwt }
    })
      .then(e => {
        let arry = [...files]
        arry.filter(i => i.id != id)

        let lend  = files.indexOf(item =>item.id ==id) 

        files.splice(lend, 1); 

        setallimgesFile([...arry])
        setISdONE([true, e])
        document.documentElement.scrollTop = 0;
      })
      .catch(e => {

        setISdONE([false, e.response.data])
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


  const daownLoad = (id,name)=>{
    Axios({
      url: `http://127.0.0.1:8000/api/downloadImge/${id}`,
      method: 'GET',
      responseType: 'blob', // Important
      headers: { "Authorization": "Bearer " + cookies.Jwt},
    
      
    }).then((response) => {
    
        FileDownload(response.data, name);

        setISdONE([true, 'جاري تحميل الملف'])
        document.documentElement.scrollTop = 0;
    
    }).catch(err=>{
        console.log(err)
      setISdONE([false, 'حدث خطاء الرجاء المحاولة لاحقا'])
      document.documentElement.scrollTop = 0;
    });
    

  }


  const UploadFile = async (event) => {

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

    });
  }



  return (<>



    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">

      <div>

        {isDone[0] == null ? '' :
          <div className={`alert ${isDone[0] ? 'alert-success' : 'alert-danger'}  alert-dismissible fade show`} role="alert">
            {isDone[1]}

            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="قريب"></button>
          </div>}

       <h1 className="h2 ">الملفات</h1> 
      </div>



    </div>
      <label>إضافة ملف</label>
      <input type="file"
        onChange={(event) => UploadFile(event)}
        className=" form-control w-75" id={`customFile`}></input>
      <br></br>

    <div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {!allimges ? '' : allimges.map(serv =>
          <div key={serv.id} className="col select">
            <Image
              src={serv.imge}
              width={500}
              height={400}
              onClick={() => setSelected(serv.id)}
              blurDataURL={serv.imge}
              placeholder="blur"
            ></Image>

           <div className="hidebtn" >
              <button onClick={() => deleteimge(serv.id)} className="border btn btn-sm btn-danger m-1" >حذف</button>
              <button onClick={() => daownLoad(serv.id,serv.File_name)} className="border btn btn-sm btn-secondary">تحميل</button>
            </div> 
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


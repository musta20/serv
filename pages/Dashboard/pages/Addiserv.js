import { useState, useEffect } from "react"
import { useCookies } from "react-cookie";
import fetcher from "../../../model/fetcher";
import { useAuth } from "../../../model/hooks/auth"


import axios from "axios";
import Image from 'next/image'
import useSWR from "swr";
import FilesManger from "../../../components/FilesManger";


export default function serv() {
  const [cookies] = useCookies(['Jwt']);
  const [requpl, setrequpl] = useState([]);
  const [reqval, setreqval] = useState('');
  const [currentImge, setcurrentImge] = useState(0)
  const [selectfile, setselectfile] = useState(0)
  const [allimgFile, setallimgFile] = useState([])
  const [selectedCat, setselectedCat] = useState(0)
  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Requirement, setRequirement] = useState('');
  const [LastMainCat, setMainCat] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const [AlertMesssage, setAlertMesssage] = useState([null, ""]);

  const [filedsErrors, setfiledsErrors] = useState({
    Title: '',
    Description: "",
    Requirement: "",
    selectedCat: ""
  })

  const [loadPageData, setloadPageData] = useState(true);


  useAuth({onlyAdmin: true, setloadPageData: setloadPageData })

  const { cat } = LoadCat();

  const catTreeBulider = (KidsMainCat, MainCat, Adress) => {

    KidsMainCat.forEach((element, i) => {

      if (IsFather(element)) {

        const Kids = getCatChilderen(element)

        eval(Adress + "[" + i + "]").Kids = Kids

        catTreeBulider(Kids, MainCat, Adress + "[" + i + "].Kids")

      }

      if (MainCat.length == i + 1) {
        setMainCat([...MainCat])
        //   setended(true)

      }

    });



  }

  const getCatChilderen = (MainCat) => {

    let getCatChilderen = cat.map(item => { if (item.Parent_Categories == MainCat.id) { return item } });
    return getCatChilderen.filter(i => i !== undefined)


  }

  const IsFather = (item) => {
    if (cat.find(cat => cat.Parent_Categories == item.id)) return true
    return false


  }

  const { files } = getFiles(cookies.Jwt);

  useEffect(() => {

    let MainCat = !cat ? [] : cat.filter(element => element.Parent_Categories == 0);

    let Adress = [...MainCat]

    catTreeBulider(Adress, MainCat, "MainCat");


    setallimgFile(files)

  }, [cat, files])


  const SaveServ = (e) => {
    setIsLoding(true)
    e.preventDefault();

    let filedsErrors = { ...filedsErrors };

    for (const cc in filedsErrors) {
      filedsErrors[cc] = ""
    }

    if (!Title) filedsErrors.Title = "  العنوان مطلوب  "
    if (!Description) filedsErrors.Description = "  الوصف مطلوب  "
    if (!Requirement) filedsErrors.Requirement = "  متطلبات الخدمة مطلوب  "
    if (!selectedCat) filedsErrors.selectedCat = "  يجب عايك تختيار تصنيف  "

    setfiledsErrors(filedsErrors);

    if (!Title || !Description || !Requirement || !selectedCat) return

    fetcher({
      url: "/api/services", method: 'POST', data: {
        Jwt: cookies.Jwt,
        Title: Title,
        Description: Description,
        Requirement: Requirement,

        requpl: requpl,
        img_id: currentImge,
        cat_id: selectedCat
      }
    })
      .then(data => {
        setIsLoding(false)
        setAlertMesssage([true, 'تم إصافة البيانات '])
        document.documentElement.scrollTop = 0;
  
        
      })
      .catch(err => {

        let thedataretrv = err.response.data

        if (typeof thedataretrv === 'object' && thedataretrv !== null) {
          for (const property in thedataretrv) {

            filedsErrors[property] = thedataretrv[property].toString();

          }

          setfiledsErrors({ ...filedsErrors });
        }



        setIsLoding(false)

        setAlertMesssage([false, 'حدث خطاء الرجاء المحاولة مرة اخرى'])

        document.documentElement.scrollTop = 0

      })

  }

  const requirmentupload = (e) => {
    e.preventDefault()
    if (!reqval) return

    let newarr = [...requpl];
    newarr.push([reqval, false]);

    setrequpl(newarr)
    setreqval('')
  }

  const remirem = (v, e) => {
    v.preventDefault()

    let newarr = [...requpl];

    let ddv = newarr.filter(item => item[0] !== e[0])
    setrequpl(ddv)

  }

  const setrequired = (e) => {

    let newarr = [...requpl];

    let ddv = newarr.find(item => item[0] == e[0])
    //console.log(ddv)
    let indexval = newarr.indexOf(ddv);
//console.log(newarr[indexval])
    newarr[indexval][1] ? newarr[indexval][1] = false : newarr[indexval][1]= true;

    setrequpl(newarr)

  }

  const handelimgeselection = (id) => {
    setselectfile(id)

  }

  const closeMdeol = () => {
    setcurrentImge(selectfile)


  }

  const handelOpenModel = (e) => {
    e.preventDefault();
  }

  const uploadFile = async (event) => {

    let photoFormData = new FormData();

    photoFormData.append("file", event.target.files[0]);

    axios({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/FileUpload`,
      method: "post",
      data: photoFormData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        "Authorization": "Bearer " + cookies.Jwt,
        "Content-Type": "multipart/form-data"
      }
    }).then(ret => {
      let newupdateForm = [...allimgFile]
      console.log(ret)

      newupdateForm.push(ret.data.file)

      setallimgFile(newupdateForm)

      setcurrentImge(ret.data.file.id)
    })
      .catch(ret => {


      })


  }

  const removeImge = (e) => {
    e.preventDefault()

    setcurrentImge(0)
  }

  if (loadPageData) {
    return <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }


  return <>
    <div className="col-md-7 col-lg-8">
      <h4 className="mb-3">
        بيانات الخدمة المقدمة    </h4>
      {AlertMesssage[0] == null ? '' :
        <div className={`alert ${AlertMesssage[0] ? 'alert-success' : 'alert-danger'}  alert-dismissible fade show`} role="alert">
          {AlertMesssage[1]}

          <button type="button" className="btn-close"
            onClick={() => setAlertMesssage([null, ''])}
            aria-label="قريب"></button>
        </div>}
      <form onSubmit={(e) => SaveServ(e)}

        className="needs-validation" noValidate>
        <div className="row g-3">


          <div className="col-12">
            <label htmlFor="email" className="form-label ">اسم الخدمة</label>
            <input type="email"
              onChange={(e) => setTitle(e.target.value)}

              className={` text-start form-control ${filedsErrors.Title ? 'is-invalid' : ''}`}

              id="email"
              placeholder="اسم الخدمة">
            </input>

            <div className="invalid-feedback">
              {filedsErrors.Title}
            </div>

          </div>

          <div className="col-12">
            <label htmlFor="address" className="form-label">تفاصيل الخدمة</label>
            <textarea rows="5"
              onChange={(e) => setDescription(e.target.value)}
              className={`text-start form-control ${filedsErrors.Description ? 'is-invalid' : ''}`}

              id="address" placeholder="تفاصيل الخدمة" >
            </textarea>
            <div className="invalid-feedback">
              {filedsErrors.Description}
            </div>
          </div>

          <div className="col-12">
            <label htmlFor="address" className="form-label">متطلبات الخدمة</label>
            <textarea rows="5"
              onChange={(e) => setRequirement(e.target.value)}
              className={`form-control text-start ${filedsErrors.Requirement ? 'is-invalid' : ''}`}

              id="address" placeholder="متطلبات الخدمة" required>
            </textarea>
            <div className="invalid-feedback">
              {filedsErrors.Requirement}
            </div>
          </div>
          <div className="col-12 ">

            <label htmlFor="address" className="form-label">الملفات المطلوب ارفاقها</label>

            <div className="input-group">

              <input type="email"
                onChange={e => setreqval(e.target.value)}
                value={reqval}
                className="form-control text-start" id="address" placeholder="متطلبات الخدمة" required>
              </input>
              <button
                onClick={(e) => requirmentupload(e)}
                className="input-group-text" >إضافة</button>
            </div>
            {!requpl ? '' : requpl.map((req, i) => <div  key={i} className="input-group w-50 m-1 p-1">
              <span className="   input-group-text form-control d-flex justify-content-between" >
                {req}
                <IsReaquired req={req} setrequired={setrequired} i={i}></IsReaquired>
              </span><button onClick={(e) => remirem(e, req)}
                  className='btn btn-sm btn-outline-secondary input-group-text'
                >حذف</button>
            </div>
            )}



            <div htmlFor="cat" className="col-12 ">
              <label className="form-label mt-2">اختر تصنيف الخدمة : </label>

              <aside id="cat"

                className={`bd-aside  overflow-auto CatBox sticky-xl-top text-muted align-self-start mb-3 mb-xl-5 px-2 ${filedsErrors.selectedCat ? 'is-invalid' : ''}`}

              >

                <ShowUl ul={LastMainCat} setselectedCat={setselectedCat}></ShowUl>

              </aside>
              <div className="invalid-feedback">
                {filedsErrors.selectedCat}
              </div>
            </div>


            <div className="col-12">
              <label htmlFor="address2w" className="form-label">صورة الخلفية         </label>
              <InputType
                img_id={currentImge}
                uploadFile={uploadFile}
                allimges={allimgFile}
                removeImge={removeImge}
              ></InputType>
              <button

                onClick={(e) => handelOpenModel(e)}

                data-bs-toggle="modal" data-bs-target="#exampleModalCenteredScrollable"
                className="mt-2 btn  btn-outline-success">إضافة ملف محفوظ</button>
            </div>


          </div>



        </div>

        <br></br>

        <button
          disabled={isLoding}

          className="w-100 btn  btn-outline-success btn-lg" type="submit">
          {isLoding ?
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            :
            " حفظ التعديلات"
          }

        </button>
      </form>
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
              files={allimgFile}
              //selection={false}
              returnSelected={handelimgeselection}
            ></FilesManger>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
            <button type="button" onClick={() => closeMdeol()} data-bs-dismiss="modal" className="btn  btn-outline-success">أضف الملف</button>
          </div>
        </div>
      </div>
    </div>
  </>
}

const InputType = ({ img_id, uploadFile, removeImge, allimges }) => {

  //useEffect(()=>{},[img_id,allimges])

  if (allimges !== undefined) {
    if (img_id) {
      const imgeData = allimges[allimges.findIndex(item => item.id == img_id)]


      if (!imgeData) return (<div>loading</div>);

      return <div ><Image
        src={imgeData.imge}
        width={200}
        height={170}
      ></Image>
        <br></br>
        <button

          onClick={(e) => removeImge(e)}

          className=" btn btn-danger">حذف الصورة</button>
      </div>
    }
  }

  return <input
    disabled={false}
    onChange={event => uploadFile(event)}
    type="file"
    className='form-control w-75'

    id={`customFile`}></input>

}

const getFiles = (jwt) => {
  const { data, error } = useSWR({ url: '/api/FileUpload', method: 'GET', data: { Jwt: jwt } }, fetcher);
  return {
    files: data,
    isLoding: !data && !error,
    isErorr: error
  }

}

const LoadCat = () => {

  const { data, error } = useSWR({ url: "/api/Categories", method: "GET", data: {} }, fetcher);


  return {
    cat: data
  }

}

const ShowUl = ({ ul, setselectedCat }) => {

  return <><ul
    className="list-group m-1 p-1"

  >

    {!ul ? "" : ul.map(element => <li key={element.id} className="list-group-item  ">

      {!element.Kids ?
        <div className="m-1 p-1 d-flex justify-content-between"
        >{element.Categories_Title}
          <input
            className="form-check-input float-left "
            type="radio"
            name="flexRadioDefault"
            id={`flexRadioDefault1${element.id}`}
            value={element.id}

            onChange={(event) => setselectedCat(event.target.value)}

          >
          </input>

        </div> :

        <>

          <div className="m-1 p-1 d-flex justify-content-between"
          >
            <button
              className="btn d-inline-flex align-items-center collapsed"
              type="button"

              data-bs-toggle="collapse"
              data-bs-target={`#demo${element.id}`}

              aria-expanded="false"
              aria-controls={`demo${element.id}`}

            >{element.Categories_Title}</button>
            <input className="form-check-input float-left "
              type="radio"
              name="flexRadioDefault"
              id={`flexRadioDefault1${element.id}`}
              onChange={(event) => setselectedCat(event.target.value)}
              value={element.id}

            >
            </input>
          </div>

          <div className="collapse " id={`demo${element.id}`} >
            <ShowUl ul={element.Kids} setselectedCat={setselectedCat}></ShowUl>

          </div>
        </>
      }

    </li>)
    }
  </ul>



  </>
}

const IsReaquired = ({setrequired , req , i})=>{
  return                <div className="form-check ">
  <input className="form-check-input"
  onChange={(e)=>setrequired(req)}
  type="checkbox" 
  checked={req[1] ? true : false}

  value="" id={`flexCheckDefault${i}`}></input>
  <label className="form-check-label" htmlFor={`flexCheckDefault${i}`}>
    إلزامي
  </label>
</div>
}
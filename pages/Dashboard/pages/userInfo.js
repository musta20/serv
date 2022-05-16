import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import Image from 'next/image'
import useSWR from "swr"
import fetcher from "../../../model/fetcher"
import FilesManger from "../../../components/FilesManger"
import { useAuth } from "../../../model/hooks/auth"




export default function infoUser() {

  const [name, setname] = useState('')
  const [phone, setphone] = useState('')
  const [des, setdes] = useState('')
  const [password, setpassword] = useState('')
  const [repassword, setrepassword] = useState('')
  const [currentImge, setcurrentImge] = useState(0)
  const [selectfile, setselectfile] = useState(0)
  const [allimgFile, setallimgFile] = useState([])
  const [AlertMesssage, setAlertMesssage] = useState([null, ""])
  const [isLoding, setIsLoding] = useState(false)
  const [loadPageData, setloadPageData] = useState(true);


  const [filederr, setFiledsErrors] = useState(
    {
      name: '',
      phone: '',
      des: '',
      password: '',
      img_id: ''
    })

  const updateUserInfo = async (e) => {

    e.preventDefault()

    let filedsErrors = { ...filederr }

    for (const i in filedsErrors) {
      filedsErrors[i] = ""
    }

    if (!name) filedsErrors.name = "اسم المستخدم مطلوب"
    if (!phone) filedsErrors.phone = "رقم الجوال مطلوب "
    if (!des) filedsErrors.des = "التعريف مطلوب  "

    if (password && password !== repassword) cc.password = ' تاكيد كلمة المرور غير مطابق'

    setFiledsErrors(filedsErrors)

    if (!name || !phone || !des || (password && password !== repassword)) return



    await fetcher({
      url: '/api/user', method: "PUT", data: {
        id: 1,
        Jwt: cookies.Jwt,
        name: name,
        des: des,
        phone: phone,
        img_id: currentImge,
      }
    })
      .then(res => {
        setIsLoding(false)
        setAlertMesssage([true, 'تم تحديث البيانات '])
        document.documentElement.scrollTop = 0

      })
      .catch(err => {


        let thedataretrv = err.response.data

        if (typeof thedataretrv === 'object' && thedataretrv !== null) {
          for (const property in thedataretrv) {

            filedsErrors[property] = thedataretrv[property].toString();

          }

          setFiledsErrors({ ...filedsErrors });
        }



        setIsLoding(false)

        setAlertMesssage([false, 'حدث خطاء الرجاء المحاولة مرة اخرى'])

        document.documentElement.scrollTop = 0;

      })


  }

  const getMyInfo = (jwt) => {
    const { data, error } = useSWR({ url: '/api/user', method: 'GET', data: { Jwt: jwt } }, fetcher);
    return {
      user: data,
      isLoding: !data && !error,
      isErorr: error
    }

  }

  const [cookies] = useCookies(['Jwt']);

  const handelimgeselection = (id) => {
    //console.log(id)
    // if (currentImge !== 0 && id !== 0) {

    setselectfile(id)
    //setFile({ input: currentFile, value: id })

    //  }
  }

  const closeMdeol = () => {
    setcurrentImge(selectfile)
    //const updatFile = FormFiles.findIndex(item => item.input == Files.input)

    // const newupdateForm = [...FormFiles]

    //newupdateForm[updatFile].value = Files.value

    //setFormFiles(newupdateForm)



  }

  const handelOpenModel = (e) => {
    e.preventDefault();
  }





  useAuth({onlyAdmin: true, setloadPageData: setloadPageData })

  const { files } = getFiles(cookies.Jwt);

  const { user, isInfoLoding } = getMyInfo(cookies.Jwt);

  useEffect(() => {
    //console.log(AlertMesssage)
    if (user) {
      setname(user.name)
      setphone(user.phone)
      setdes(user.des)

      setcurrentImge(user.img_id)
      setallimgFile(files)
    }
  }, [files, user])

  const uploadFile = async (event) => {

    const photoFormData = new FormData();

    photoFormData.append("file", event.target.files[0]);

    const config = {
      onUploadProgress: function (progressEvent) {
        setpross(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      }
    }

    await fetcher({
      url: '/api/FileUpload', method: "POST_FILE", data: {
        body: photoFormData,
        Jwt: cookies.Jwt
      }

    }).then(ret => {

      let newupdateForm = [...allimgFile]
      newupdateForm.push(ret.file)

      setallimgFile(newupdateForm)
      user.img_id = ret.file.id
      setcurrentImge(ret.file.id)

    });

  }

  const removeImge = (e) => {
    e.preventDefault()
    setcurrentImge(0)
  }


  if (loadPageData || isInfoLoding) {
    return <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }



  return <div
    data-test='cy-userPage'
    className="col-md-7 col-lg-8">
    <h4 className="mb-3">
      البيانات الشخصية
    </h4>

    {AlertMesssage[0] == null ? '' :
      <div className={`alert ${AlertMesssage[0] ? 'alert-success' : 'alert-danger'} 
       alert-dismissible fade show`} role="alert">
        <span data-test='cy-alert'>
          {AlertMesssage[1]}


        </span>

        <button type="button" className="btn-close"
          onClick={() => setAlertMesssage([null, ""])}
          aria-label="قريب"></button></div>
    }

    <form onSubmit={(e) => updateUserInfo(e)}

      className="needs-validation" noValidate>
      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="email" className="form-label ">الاسم<span className="text-muted">(اختياري)</span></label>
          <input
            type="text"
            data-test='cy-username'
            onChange={(e) => setname(e.target.value)}
            value={name}
            className={`form-control text-start ${filederr.name ? 'is-invalid' : ''}`}
            id="email"
            placeholder="الاسم">
          </input>
          <div className="invalid-feedback">
            {filederr.name}
          </div>
        </div>
        <div className="col-12">
          <label htmlFor="address" className="form-label">حول</label>
          <textarea
            type="textarea"
            onChange={(e) => setdes(e.target.value)}
            value={des}
            data-test='cy-des'

            rows={5}
            className={`form-control ${filederr.des ? 'is-invalid' : ''}`}

            id="address"
            placeholder="التعريف" required>
          </textarea>

          <div className="invalid-feedback">
            {filederr.des}
          </div>
        </div>

        <div className="col-12">
          <label htmlFor="address" className="form-label">رقم الجوال</label>

          <div className="input-group has-validation">

            <input

              onChange={event => event.target.value.length >= 10 ? '' : setphone(event.target.value)}
              value={phone}
              data-test='cy-phone'


              maxLength="9"
              type="number"
              className={`form-control ${filederr.phone ? 'is-invalid' : ''}`}
              id="username" placeholder="5xxxxxxxx" required>


            </input>
            <div className='border p-2'>+966</div>

            <div className="invalid-feedback">
              {filederr.phone}
            </div>

          </div>
        </div>

        <div className="col-12">
          <label htmlFor="address2w" className="form-label">كلمة المرور
          </label>
          <input type="password"
            onChange={(e) => setpassword(e.target.value)}
            value={password}
            className={`form-control ${filederr.password ? 'is-invalid' : ''}`}
            id="address2w" placeholder="كلمة المرور">
          </input>



        </div>
        <div className="col-12">
          <label htmlFor="address23" className="form-label">اعد كتابة كلمة المرور          </label>
          <input
            onChange={(e) => setrepassword(e.target.value)}
            value={repassword}

            type="password" className="form-control" id="address23" placeholder="كلمة المرور">
          </input>
          <div className="invalid-feedback">
            {filederr.password}
          </div>
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
          className="mt-2 btn btn-sm  btn-outline-success">إضافة ملف محفوظ</button>
      </div>

      <br></br>
      <button
        disabled={isLoding}

        data-test='cy-user-update'

        className="w-75 btn btn-lg  btn-outline-success"

        type="submit">
        {isLoding ?
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          :
          "  حفظ التعديلات "
        }
      </button>
    </form>
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
              returnSelected={handelimgeselection}
            ></FilesManger>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
            <button type="button"
              onClick={() => closeMdeol()} data-bs-dismiss="modal" className="btn  btn-outline-success">أضف الملف</button>
          </div>
        </div>
      </div>
    </div>
  </div>

}

const getFiles = (jwt) => {
  const { data, error } = useSWR({ url: '/api/FileUpload', method: 'GET', data: { Jwt: jwt } }, fetcher);

  return {
    files: data,
    isInfoLoding: !data && !error,
    isErorr: error
  }

}

const InputType = ({ img_id, uploadFile, removeImge, allimges }) => {
  //console.log(allimges)
 // console.log(img_id)
  if (allimges !== undefined) {
    if (img_id) {
      const { imge } = allimges[allimges.findIndex(item => item.id == img_id)]

      return <div ><Image
        src={imge}
        //  selection={false}
        width={200}
        height={170}
      ></Image>
        <br></br>
        <button

          onClick={(e) => removeImge(e)}

          className=" btn btn-sm btn-danger">حذف الصورة</button>
      </div>
    }
  }

  return <input
    disabled={false}
    onChange={event => uploadFile(event)}
    type="file" className=" form-control w-75" id={`customFile`}></input>
}
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import useSWR from "swr"
import fetcher from "../../../model/fetcher"

export default function infoUser() {

  const [name, setname] = useState()
  const [username, setusername] = useState('')
  const [password, setpassword] = useState('')
  const [repassword, setrepassword] = useState('')
  const [cookies] = useCookies(['Jwt']);
  const [isLoding, setisLoding] = useState(false)
  const [isDone, setISdONE] = useState([null, ""])

  const [filederr, setfilederr] = useState(
    {
      name: '',
      username: '',
      password: '',
    })


  const { user, isInfoLoding } = getMyInfo(cookies.Jwt);




  const updateUserInfo = (e) => {
    e.preventDefault()
    setisLoding(true)

    let cc = { ...filederr }

    for (const i in cc) {
      cc[i] = ""
    }

    if (!name) cc.name = "اسم المستخدم مطلوب"
    if (!username) cc.username = "رقم الجوال مطلوب "

    if (password && password !== repassword) cc.password = ' تاكيد كلمة المرور غير مطابق'

    setfilederr(cc)

    if (!name || !username || (password && password !== repassword)) return

    fetcher({
      url: "/api/user", method: "PUT", data: {
        id: 1,
        name: name,
        Jwt: cookies.Jwt,

        username: username,
        password: password,
      }
    })
      .then(res => {

        setisLoding(false)

        setISdONE([true, 'تم تحديث البيانات'])
        document.documentElement.scrollTop = 0

      })
      .catch(err => {

        let thedataretrv = err.response.data
        for (const property in thedataretrv) {
          cc[property] = thedataretrv[property].toString();
        }

        setfilederr({ ...cc });

        setisLoding(false)

      })




  }


useEffect(()=>{
  if (user) {
    setusername(user.username);
    setname(user.name)
  }
},[user,isDone])

  if (isInfoLoding) {
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
    {isDone[0] == null ? '' :
      <div 
      
      className={`alert ${isDone[0] ? 'alert-success' : 'alert-danger'}  alert-dismissible fade show`} role="alert">
       <span data-test='cy-alert'>
                 {isDone[1]}
       </span>

        <button type="button" className="btn-close" onClick={()=>setISdONE([null, ""])} aria-label="قريب"></button>
      </div>}

    <form onSubmit={updateUserInfo}

      className="needs-validation" noValidate>
      <div className="row g-3">


        <div className="col-12">
          <label htmlFor="email" className="form-label ">الاسم<span className="text-muted">(اختياري)</span></label>
          <input type="email"
          data-test='cy-name'
            onChange={(e) => setname(e.target.value)}
            value={name}

            className={`form-control text-start ${filederr.name ? 'is-invalid' : ''}`}

            id="email" placeholder="الاسم">
          </input>
          <div data-test='cy-name-feedback' className="invalid-feedback">
            {filederr.name}
          </div>
        </div>

        <div className="col-12">
          <label htmlFor="address" className="form-label">رقم الجوال</label>
          <input type="text"
            onChange={(e) => setusername(e.target.value)}
            value={username}
            data-test='cy-username'
            className={`form-control text-start ${filederr.username ? 'is-invalid' : ''}`}

            id="address" placeholder=" رقم الجوال " required>
          </input>

          <div
          data-test='cy-username-feedback'
          className="invalid-feedback">
            {filederr.username}
          </div>
        </div>

        <div className="col-12">
          <label htmlFor="address2w" className="form-label">كلمة المرور
          </label>
          <input type="password"
          data-test='cy-password'
            onChange={(e) => setpassword(e.target.value)}
            value={password}
            className="form-control" id="address2w" placeholder="كلمة المرور">
          </input>
        </div>
        <div className="col-12">
          <label htmlFor="address23" className="form-label">اعد كتابة كلمة المرور          </label>
          <input
          data-test='cy-repassword'
            onChange={(e) => setrepassword(e.target.value)}
            value={repassword}
            type="password" className="form-control" id="address23" placeholder="كلمة المرور">
          </input>
        </div>
      </div>
      <br></br>

      <button className="w-100 btn btn-primary btn-lg"
        disabled={isLoding}
        data-test='cy-user-update'
        type="submit">
        {isLoding ?
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          :
          "  حفظ التعديلات " 
          }
      </button>
    </form>
  </div>

}

const getMyInfo = (jwt) => {
  const { data, error } = useSWR({ url: '/api/user', method: 'GET', data: { Jwt: jwt } }, fetcher);

  return {
    user: data,
    isInfoLoding: !data && !error,
    isErorr: error
  }

}
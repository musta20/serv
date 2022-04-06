import LoadImgeFile from "./LoadImgeFile"
import Link from 'next/link'

export default function ServiceCard({ Services }) {


  return <div key={Services.id} className="col">
    <div className="card shadow-sm">

      {!Services.img_id ? <svg className="bd-placeholder-img card-img-top" width="80%" height="150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: صورة مصغرة" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">صورة مصغرة</text></svg>
        : <LoadImgeFile id={Services.img_id}></LoadImgeFile>}
      <div className="card-body">
        <p className="card-text">
          <strong >

            {Services.Title}

          </strong>
          <br></br>
          {Services.Description}
        </p>
        <div className="d-flex justify-content-between align-items-center">
          <div className="btn-group">
            <Link  href={`/${Services.user.username}/${Services.id}`}    >
              <div id="cy-openserv"  className="btn btn-sm btn-outline-success bg-opacity-50 " >

                عرض الخدمة
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>

}
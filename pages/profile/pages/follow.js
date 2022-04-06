import useSWR from "swr";
import fetcher from "../../../model/fetcher";
import { useCookies } from 'react-cookie';
import LoadImgeFile from '../../../components/LoadImgeFile';
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../../model/hooks//auth";

export default function request() {
  const [cookies] = useCookies(['Jwt']);
  const [loadPageData, setloadPageData] = useState(true);
  useAuth({onlyAdmin: false, setloadPageData: setloadPageData })

  
  const { follows } = getFollows(cookies.Jwt);

  if (loadPageData) {
    return <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }


  return (
    <div
    data-test='cy-followPage'
    className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
      {!follows ? '' : follows.map(serv =>
        <div key={serv.id} className="col">
          <div className="card shadow-sm">
            {!serv.img_id ? <svg className="bd-placeholder-img card-img-top" width="80%" height="150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: صورة مصغرة" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">صورة مصغرة</text></svg>
              : <LoadImgeFile id={serv.img_id}></LoadImgeFile>}
            <div className="card-body">
              <p className="card-text">
                {serv.name}<br></br>
                {serv.username}
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <div className="btn-group">
                  <Link href={`/${serv.username}`}>
                  <button
                  id='cy-go-serv-page'
                   type="button" className="btn btn-sm btn-outline-secondary"
                  >
                                       عرض الخدمة

                  </button>
                    </Link>
                </div>
              </div>
            </div>


          </div>

        </div>
      )}
    </div>

  )
}

const getFollows = (Jwt) => {
  const { data, error } = useSWR({ url: '/api/Follow', method: "GET", data: { Jwt: Jwt } }, fetcher);

  return { 
    follows: data ,
    isLoading: !data && !error,
    error:error
  };

}
import { useCookies } from 'react-cookie';
import React, { useEffect, useState } from "react";
import useSWR from 'swr';
import fetcher from '../../../model/fetcher';

import ServiceCard from "../../../components/serviceCard";
import Model from '../../../components/Model';



export default function serv({ upServ }) {


  const [cookies] = useCookies(['Jwt']);
  const [selectDlete, setselectDlete] = useState(0);
  const { services, isLoding } = getServices(cookies.Jwt);
  const [allservices, setallservices] = useState([]);

  useEffect(() => {
    setallservices(services);
  }, [services])

  function getServices(id) {

    const { data, error } = useSWR({
      url: '/api/getMycompany',
      method: 'GET', data: { Jwt: id }
    }, fetcher);


    // const page= !data || !{data} ? [] : data.data
    return {
      services: data,
      isLoding: !data && !error,
      isErorr: error
    }

  }


  const deleteServ = (id, event, setloadin) => {
    setloadin(true)   
    if(event.target.hasAttribute('data-bs-dismiss')) return

    fetcher({ url: "/api/services", method: "DELETE", data: { id: id, Jwt: cookies.Jwt } }).then(e => {

      if (e == 'deleted') {
        let neff = [...allservices]
        let ddfdsdf = neff.filter(item => item.id != id)
        setallservices(ddfdsdf)

        event.target.setAttribute("data-bs-dismiss", "modal");


        event.target.click()
        setloadin(false);
      }
    })




  }

  if (isLoding) {
    return <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
      {!allservices || allservices.length == 0 ? 'لا يوجد لديك خدمات' :
        allservices.map(serv =>
          <div key={serv.id}>
            <ServiceCard Services={serv} ></ServiceCard>
            <div className="btn-group w-100 bg-light">

              <button
                onClick={() => upServ(serv.id)}
                type="button" className="btn  btn-sm btn-outline-secondary">تعديل</button>

              <a onClick={() => setselectDlete(serv.id)}
                data-bs-toggle="modal"
                data-bs-target="#staticBackdropLive"
                type="button" className="btn btn-sm btn-outline-secondary">حذف</a>

            </div>
          </div>

        )}
      <Model id={selectDlete} msg={'هل انت متاكد من حذف العنصر'} DeleteServ={deleteServ}></Model>
    </div>

  )
}




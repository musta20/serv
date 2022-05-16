import useSWR from "swr";
import fetcher from "../model/fetcher";
import Layout from "../components/Layout";
import ServiceCard from "../components/serviceCard";

import { useEffect , useState } from "react";

export default function Home({ postData }) {

  const [keyWord,setKeyWord] = useState('');
  const [searchReslut,setsearchReslut] = useState([]);
  const [nodata,setnodata] = useState(true);

  const { services, isLoding, isErorr } = getServices();

  useEffect(() => {
    if (typeof document !== undefined) {
      require('bootstrap/dist/js/bootstrap')
    }

  }, [])

const search = (event)=>{
  event.preventDefault();
  fetcher({
  url:'/api/Search',
  method:'POST',
  data:{
    Search:keyWord
  }})
  .then((res)=>{
    if(!res.length)setnodata(false)
    setsearchReslut(res)
  })
}

const shoResult = ()=>{

 if (searchReslut.length) return searchReslut.map(serv => 
    <ServiceCard key={serv.id} Services={serv} >
    </ServiceCard>) ;

if(!nodata) return "no data"

    if(services ) return services.map(serv => 
    <ServiceCard key={serv.id} Services={serv} >
    </ServiceCard>)



}
  return (
    <Layout >

      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1  className="introText">ابحث في  مئات الخدمات الالكترونية المقدمة</h1>


              <form onSubmit={(event)=>search(event)} className="mt-2 d-flex input-group">
                <button className="btn btn-outline-success fa fa-search btn" type="submit"></button>

                <input 
                className="form-control me-2"
                onChange={event=>setKeyWord(event.target.value)}
                
                type="search" placeholder="اسم الخدمة الالكترونية التي ترغب في انجازها" aria-label="Search"></input>
              </form>
          </div>
        </div>
      </section>

      <div className="album py-5 bg-light">
        <div className="container">

          <div data-test='cy-Service' className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
           

           { shoResult()}

          </div>
        </div>
      </div>


    </Layout>
  )
}




function getServices() {
  const { data, error } = useSWR({ url: '/api/services', method: 'GET', data: {} }, fetcher);
 // console.log(data)
  const page = !data || !{ data } ? [] : data.data
  return {
    services: page,
    isLoding: !page && !error,
    isErorr: error
  }

}



export async function getStaticProps({ params }) {
  // const postData = getPostData(params.id)
  return {
    props: {
      postData: "dd"
    }
  }
}

/*

export async function getStaticProps({ params }) {
  const postData = getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}

*/

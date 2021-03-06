
import userModle from '../../model/userModle';
import Layout from "../../components/Layout";
import useSWR from "swr";
import { useEffect, useState } from 'react';
import Image from 'next/image'
import ServiceCard from '../../components/serviceCard';
import { useRouter } from 'next/router'

import fetcher from "../../model/fetcher";
import { useCookies } from 'react-cookie';

const Index = ({ username, name, id, img_id, des }) => {


  useEffect(() => {

    if (typeof document !== undefined) {
      require('bootstrap/dist/js/bootstrap')
    }


  }, [])

  if(!username)
  {
    return <Layout >
    <div className="album py-5 bg-light">
    <div className="container py-5">

      <div className="py-5 d-flex justify-content-center text-center text-algin-center text-success">
        <h1><storage >404<br></br>الصفحة غير موجودة</storage></h1>

      </div>
    </div>
  </div>
  </Layout>
  }

  const [isFollow, setIsFollow] = useState(null);

  const [cookies] = useCookies(['Jwt']);

  const { services } = getServices(id);

  const { isuserFollow } = CheckisFollow(id, cookies.Jwt);

  const router = useRouter()


  useEffect(() => {

    if (typeof document !== undefined) {
      require('bootstrap/dist/js/bootstrap')
    }

    setIsFollow(isuserFollow)

  }, [isuserFollow])

  const FollowUser = (id) => {

    if (!cookies.Jwt) return router.push('/login');

    fetcher({ url: '/api/Follow', method: "POST", data: { id: id, Jwt: cookies.Jwt } })

      .then(res => {

        setIsFollow(res)

      })
      .catch(res => {

      })
  }



  return (
    <Layout >

      <div
        data-test='cy-admin-page'
        className="pb-5 mb-4 text-white bg-dark">
        <div id="iwrapper">

          <div className="col-md-6 px-0 px-2 icontent">
            <div className="display-6 fst-italic">{name}</div>

            <p className="lead my-3">
              {des}
            </p>
            <p className="lead my-3">
              {username}
            </p>
            <p><button onClick={() => FollowUser(id)} className={`btn btn-sm  ${isFollow ? " btn-success" : "btn-info"}`}>{isFollow ? 'متابع' : 'تابع'}</button></p>
          </div>

          <div className="ibackground">

            <LoadImgeFile id={img_id}></LoadImgeFile>
          </div>
        </div>
      </div>

      <div className="album py-5 bg-light">
        <div className="container">

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {!services ? '' : services.map(serv => <ServiceCard key={serv.id} Services={serv} ></ServiceCard>)}


          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
let props ={}
try {
  const data = await userModle.User.findOne({ where: { username: params.username, user_type: 2 } })
   props = {
    username: data.dataValues.username,
    name: data.dataValues.name,
    id: data.dataValues.id,
    img_id: data.dataValues.img_id,
    des: data.dataValues.des,
  }
  
} catch (error) {

  return {
    props:{}
  }
  
}


  return {
    props
  }

}

function getServices(id) {
  const { data, error } = useSWR({ url: '/api/showServicesBycompany', method: 'SHOW', data: { id } }, fetcher);
  return {
    services: data,
    isLoding: !data && !error,
    isErorr: error
  }

}

const CheckisFollow = (id, Jwt) => {
  console.log(Jwt)
  const { data, error } = useSWR({ url: '/api/Follow', method: 'SHOW', data: { id: id, Jwt: Jwt } }, fetcher);
  return {
    isuserFollow: data,
    isLoding: !data && !error,
    isErorr: error
  }

}

export async function getStaticPaths() {

  
  const data = await userModle.User.findAll({ where: { user_type: 2 } })
  var path = []
  data.map(u => {
    path.push({
      params: {
        username: u.dataValues.username,
      }
    })
  })

  const paths = path

  return {
    paths,
    fallback: true // false or 'blocking'
  };
}


const LoadImgeFile = ({ id }) => {


  return <>{!id ? '' : <Image
    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/showPublicImge/${id}`}
    width={2000}
    height={400}

  ></Image>}</>;

}


export default Index;
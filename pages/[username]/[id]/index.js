

import servicesModle from '../../../model/Modleservice';
import CatsModle from "../../../model/catModle ";
import Link from 'next/link'


import userModle from '../../../model/userModle';
import Layout from "../../../components/Layout";
import fetcher from "../../../model/fetcher";
import { useEffect } from 'react';


import useSWR from 'swr';

export default function service({id,thrparent,Description,Requirement,username,Title}) {

  useEffect(() => {
    if (typeof document !== undefined) {
      require('bootstrap/dist/js/bootstrap')
    }

  }, [])
  if(!Description)
  {
    return    <Layout >
    <div className="album py-5 bg-light">
    <div className="container py-5">

      <div className="py-5 d-flex justify-content-center text-center text-algin-center text-success">
        <h1><storage >404<br></br>الصفحة غير موجودة</storage></h1>

      </div>
    </div>
  </div>
  </Layout>
  }
  //const { services, isLoding, isErorr } = getRating(id);

 // const router = useRouter();



  return (
    <Layout>

      <div data-test='cy-services' className=" d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
        <div className="bg-light me-md-3 pt-3 px-3 pt-md-5 px-md-2 text-start text-dark overflow-hidden">
          <div className="my-3 p-3">
            <div className='pb-3'>
              {!thrparent ? "" : thrparent.reverse().map((cat, i) => <span key={cat.id} >{cat.Categories_Title}{thrparent.length - 1 !== i ? ' > ' : ""}</span>)}
            </div>

            <h2 className="display-5 d-flex">{Title}</h2>
            <p className="">{Description}{Description}{Description}{Description}</p>

            <p>
        <Link
            href={`/${username}`}

          >
            <div data-test='cy-order-page' className='btn btn-outline-success bg-opacity-50 my-2'>

              {username}
            </div>

          </Link>
        </p>
          </div>
        </div>
        <div className="bg-light me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-start text-dark overflow-hidden">
          <div className="">
            <h2 className="d-flex">متطلبات الخدمة</h2>
            <p className="">{Requirement}</p>

          </div>

          <Link
            href={{
              pathname: '/[username]/[id]/request',
              query: { username: username, id: id },
            }}

          >
            <div data-test='cy-order-page' className='btn btn-outline-success bg-opacity-50 my-2'>

              طلب الخدمة
            </div>

          </Link>

        </div>

      </div>


    </Layout>
  )
}

export async function getStaticProps({ params }) {
 let data,user,thrparent;
  try {
    
  
   user = await userModle.User.findOne({ where: { username: params.username } });
   data = await servicesModle.Services.findOne({ where: { id: params.id, user_id: user.dataValues.id } })
  const catdata = await CatsModle.Cats.findAll();
  const cat = catdata.map(item => {
    return {
      id: item.dataValues.id,

      Categories_Title: item.dataValues.Categories_Title,

      Parent_Categories: item.dataValues.Parent_Categories,

    }

  })

  const getCatParent = (MainCat, allparent) => {
    let parent = cat.find(item => MainCat.Parent_Categories == item.id)
    allparent.push(parent)
    if (parent.Parent_Categories !== 0) getCatParent(parent, allparent)
    return allparent

  }
  
  const thecatofthesservices = cat.find(cat => cat.id == data.dataValues.cat_id);
   thrparent = [thecatofthesservices]
  if (thecatofthesservices.Parent_Categories !== 0) {
    thrparent = getCatParent(thecatofthesservices, []);
  }
}
  catch (error) {
    return {
      props: {}}
  }
  return {
    props: {
      id: data.dataValues.id,
      Title: data.dataValues.Title,
      Description: data.dataValues.Description,
      Requirement: data.dataValues.Requirement,
      username: user.dataValues.username,
      thrparent: thrparent

    }
  }

}

function getRating(id) {
  const { data, error } = useSWR({ url: '/api/Rating', method: 'SHOW', id: id }, fetcher);

  return {
    services: data,
    isLoding: !data && !error,
    isErorr: error
  }

}

function RateTheService(params) {
  fetcher(fetcher({ url: '/api/Rating', method: 'POST', id: id }))
}

function getTheServiceRating(star) {
  fetcher({ url: '/api/Rating', method: 'SHOW', id: id });

  return {
    services: data,
    isLoding: !data && !error,
    isErorr: error
  }

}

export async function getStaticPaths(props) {
  const data = await servicesModle.Services.findAll();


  let paths = [];
  data.map((u, i) => {
  //  console.log(u)
    return {
      params: {

        id: u.dataValues.id
      }
    }
  }

  )

  return {
    paths,
    fallback: true // false or 'blocking'
  };
}


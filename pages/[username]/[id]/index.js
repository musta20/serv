

import servicesModle from '../../../model/Modleservice';
import CatsModle from "../../../model/catModle ";
import Link from 'next/link'


import userModle from '../../../model/userModle';
import Layout from "../../../components/Layout";
import fetcher from "../../../model/fetcher";
import { useEffect } from 'react';


import useSWR from 'swr';
import { useRouter } from 'next/router';

export default function service(postData) {
  const { services, isLoding, isErorr } = getRating(postData.id);

  const router = useRouter();

  useEffect(() => {
    if (typeof document !== undefined) {
      require('bootstrap/dist/js/bootstrap')
    }

  }, [])

  return (
    <Layout>

      <div data-test='cy-services' className=" d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
        <div className="bg-light me-md-3 pt-3 px-3 pt-md-5 px-md-2 text-start text-dark overflow-hidden">
          <div className="my-3 p-3">
            <div className='pb-3'>
              {!postData.thrparent ? "" : postData.thrparent.reverse().map((cat, i) => <span key={cat.id} >{cat.Categories_Title}{postData.thrparent.length - 1 !== i ? ' > ' : ""}</span>)}
            </div>

            <h2 className="display-5 d-flex">{postData.Title}</h2>
            <p className="">{postData.Description}{postData.Description}{postData.Description}{postData.Description}</p>


          </div>
        </div>
        <div className="bg-light me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-start text-dark overflow-hidden">
          <div className="">
            <h2 className="d-flex">متطلبات الخدمة</h2>
            <p className="">{postData.Requirement}</p>

          </div>

          <Link
            href={{
              pathname: '/[username]/[id]/request',
              query: { username: postData.username, id: postData.id },
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

  const user = await userModle.User.findOne({ where: { username: params.username } });

  const data = await servicesModle.Services.findOne({ where: { id: params.id, user_id: user.dataValues.id } })


  const catdata = await CatsModle.Cats.findAll();


  const cat = catdata.map(item => {
    return {
      id: item.dataValues.id,

      Categories_Title: item.dataValues.Categories_Title,

      Parent_Categories: item.dataValues.Parent_Categories,

    }

  })

  const getCatParent = (MainCat, allparent) => {

    console.log(MainCat)

    let parent = cat.find(item => MainCat.Parent_Categories == item.id)
    allparent.push(parent)
    if (parent.Parent_Categories !== 0) getCatParent(parent, allparent)
    return allparent

  }
  
  const thecatofthesservices = cat.find(cat => cat.id == data.dataValues.cat_id);

  console.log(thecatofthesservices)
  let thrparent = [thecatofthesservices]
  if (thecatofthesservices.Parent_Categories !== 0) {
    thrparent = getCatParent(thecatofthesservices, []);
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
    console.log(u)
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


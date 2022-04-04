
import Footer from './Footer'
import Head from 'next/head'
import { useCookies } from 'react-cookie';

import Nav from './Nav'
import useSWR from 'swr';
import fetcher from '../model/fetcher';

export default function Layout( props ) {
  const [cookies, setCookie, removeCookie] = useCookies(['Jwt']);
  


  return (
    <>
      <Head>
    <meta charSet="utf-8"></meta>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    <meta name="description" content=""></meta>
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors"></meta>
    <meta name="generator" content="Hugo 0.84.0"></meta>
    <title>مثال الألبوم · Bootstrap v5.0</title>


      </Head>
      <header>
        <Nav Jwt={cookies.Jwt} UserData={cookies.UserData} />
      </header>
      <main>
        {props.children}
      </main>
      <Footer></Footer>

    </>
  )
}

function getUserData(Jwt) {
  const {  data  , error } = useSWR({url:'/api/user',method:'GET',data:{Jwt}},fetcher);
  return {
      services:  data ,
      isLoding: !data && !error ,
      isErorr :  error
  }

}


import Head from 'next/head'


export default function Layout( props ) {
  

  
  return (
    <>
      <Head>
      <meta charSet="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <meta name="description" content=""></meta>
        <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors"></meta>
        <meta name="generator" content="Hugo 0.84.0"></meta>
        <title>نسجيل الدخول</title>


      </Head>
      <header>
      </header>
      <main>
        {props.children}
      </main>

    </>
  )
}


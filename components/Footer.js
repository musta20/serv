export default function Footer() {
  return (

    <footer data-test='cy-global-footer' className="text-muted py-5 bg-success text-dark bg-opacity-75">
      <div className="container text-light">

        <div className="float-end mb-1">
          <h5 className='mx-2 introText text-light '>خدماتي</h5>
          <p className="mb-1">Kadamate  2021 © </p>


        </div>
        <div className="row ">
          <div className="col">
          <div><p className="fs-6 m-1 btn btn-sm btn-outline-success border-0 text-light"> سياسة الخصوصية</p></div> 
          <div><p className="fs-6 m-1 btn btn-sm btn-outline-success border-0 text-light">  شروط الاستخدام</p></div> 
          <div><p className="fs-6 m-1 btn btn-sm btn-outline-success border-0 text-light"> إتصل بنا </p></div> 
          </div> 


          <div className="col">
          <div><p className="fs-6 m-1 btn btn-sm btn-outline-success border-0 text-light"> شروط الانضمام كمقدم خدمة</p></div> 
          <div><p className="fs-6 m-1 btn btn-sm btn-outline-success border-0 text-light">سياسة احتساب العمولة</p></div> 
          <div><p className="fs-6 m-1 btn btn-sm btn-outline-success border-0 text-light">  شركائنا </p></div> 
          </div> 

       
</div>
        </div>
    </footer>


  )
}



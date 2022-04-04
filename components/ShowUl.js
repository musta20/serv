
  import Link from 'next/link'

  const ShowUl = ({ ul , id}) => {

        return <><ul className="list-group m-1 p-1">

            {!ul ? "" : ul.map(element => <li key={element.id} className="list-group-item  ">

                {!element.Kids ? <div style={{cursor: 'pointer'}} className="m-1 p-1 "
                >
                    {id == element.id ? <u><strong>
                        <Link href={`/categories/${element.id}`}>
                            <div className=" ">
                            {element.Categories_Title}
                            </div>
                        </Link>

                    </strong></u> :
                   <Link href={`/categories/${element.id}`}>
                   <div className=" ">
                   {element.Categories_Title}
                   </div>
               </Link>                    }
                </div> :

                    <>

                        <button
                            className="btn d-inline-flex align-items-center collapsed "
                            type="button"

                            data-bs-toggle="collapse"
                            data-bs-target={`#demo${element.id}`}

                            aria-expanded="false"
                            aria-controls={`demo${element.id}`}

                        > {id == element.id ? <u><strong>
               <Link href={`/categories/${element.id}`}>
                   <div className=" ">
                   {element.Categories_Title}
                   </div>
               </Link> 

                        </strong></u> :
               <Link href={`/categories/${element.id}`}>
               <div className=" ">
               {element.Categories_Title}
               </div>
           </Link>                             
                            }</button>

                        <div className="collapse show" id={`demo${element.id}`} >
                            <ShowUl ul={element.Kids} id={id} ></ShowUl>

                        </div>
                    </>
                }

            </li>)
            }
        </ul>



        </>
    }
    export default ShowUl;
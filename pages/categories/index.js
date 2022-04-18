import { useEffect, useState } from "react";
import Layout from "../../components/Layout"
import CatsModle from "../../model/catModle ";
import ShowUl from "../../components/ShowUl";



export default function Categorie({cat}) {


    const [LastMainCat, setMainCat] = useState([])

    const catTreeBulider = (KidsMainCat, MainCat, Adress) => {

        KidsMainCat.forEach((element, i) => {

            if (IsFather(element)) {

                const Kids = getCatChilderen(element)

                eval(Adress + "[" + i + "]").Kids = Kids

                catTreeBulider(Kids, MainCat, Adress + "[" + i + "].Kids")

            }
            
            if (MainCat.length == i + 1) {
                setMainCat(MainCat)
              //  setended(true)

            }

        });



    }

    const getCatChilderen = (MainCat) => {

        let ff = cat.map(item => { if (item.Parent_Categories == MainCat.id) { return item } });
        return ff.filter(i => i !== undefined)


    }

    const IsFather = (item) => {
        if (cat.find(cat => cat.Parent_Categories == item.id)) return true
        return false


    }

    useEffect(() => {
        
        if (typeof document !== undefined) {
            require('bootstrap/dist/js/bootstrap')   
          }

        let MainCat = !cat ? [] : cat.filter(element => element.Parent_Categories == 0);
        let Adress = [...MainCat]
        catTreeBulider(Adress, MainCat, "MainCat");
  

        console.log(LastMainCat)

    }, [cat])


    return (<Layout>

        <div className="album py-5 bg-light">
            <div className="container w-50 bg-light">
            <aside className="bd-aside sticky-xl-top text-muted align-self-start mb-3 mb-xl-5 px-2">

                <ShowUl ul={LastMainCat}></ShowUl>
</aside>
            </div>
        </div>
    </Layout>)

}

export async function getStaticProps() {

  const data = await CatsModle.Cats.findAll();


  const cat = data.map(item=>{
      return {
        id: item.dataValues.id,

        Categories_Title: item.dataValues.Categories_Title,

        Parent_Categories: item.dataValues.Parent_Categories,
    
      }

  })

  

   
  

  return {
    props:{cat}
  }

}



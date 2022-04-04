import { useEffect } from "react";
import useSWR from "swr";
import Layout from "../../components/Layout"
import CatsModle from "../../model/catModle ";
import fetcher from "../../model/fetcher";
import ServiceCard from "../../components/serviceCard"
import ShowUl from "../../components/ShowUl";



export default function CCat({ MainCat, params, Cats }) {


    const { services, isLoding, isErorr } = getServices(Cats);


    useEffect(() => {

        if (typeof document !== undefined) {
            require('bootstrap/dist/js/bootstrap')
        }


        //  console.log(allkidid)

    }, [])


    return (<Layout>

        <div className="row w-100">
            <div className="col-md-4">
                <div className=" w-100 bg-light ">
                    <aside className="bd-aside sticky-xl-top text-muted align-self-start mb-3 mb-xl-5 px-2">

                        <ShowUl id={params.id} ul={MainCat}></ShowUl>
                    </aside>
                </div>

            </div>

            <div className="col-md-8 ">
                <div className="row pt-2 row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                    {!services ? '' : services.map(serv => <ServiceCard key={serv.id} Services={serv} ></ServiceCard>)}


                </div>
            </div>












        </div>
    </Layout>)

}

export async function getStaticProps({ params }) {

    const data = await CatsModle.Cats.findAll();

    const catTreeBulider = (KidsMainCat, MainCat, Adress) => {

        KidsMainCat.forEach((element, i) => {

            if (IsFather(element)) {

                const Kids = getCatChilderen(element)

                eval(Adress + "[" + i + "]").Kids = Kids

                catTreeBulider(Kids, MainCat, Adress + "[" + i + "].Kids")

            }

            if (MainCat.length == i + 1) {
                //   setMainCat(MainCat)
                //  setended(true)

            }

        });



    }

    const getCatChilderen = (MainCat) => {

        let ff = cat.map(item => { if (item.Parent_Categories == MainCat.id) { return item } });

        return ff.filter(i => i !== undefined)


    }

    const getCatParent = (MainCat, allparent) => {

        // console.log(MainCat)

        let parent = cat.find(item => MainCat.Parent_Categories == item.id)
        allparent.push(parent)
        if (parent.Parent_Categories !== 0) getCatParent(parent, allparent)
        return allparent

    }

    const getKidsServices = (MainCat, allparent) => {


        let kids = getCatChilderen(MainCat)


        kids.forEach(item => {
            allparent.push(item.id)

            if (IsFather(item)) {
                getKidsServices(item, allparent)
            }

        });

        return allparent

    }

    const IsFather = (item) => {
        if (cat.find(cat => cat.Parent_Categories == item.id)) return true
        return false


    }

    const cat = data.map(item => {
        return {
            id: item.dataValues.id,

            Categories_Title: item.dataValues.Categories_Title,

            Parent_Categories: item.dataValues.Parent_Categories,

        }

    })


    let MainCat = !cat ? [] : cat.filter(element => element.Parent_Categories == 0);

    let Adress = [...MainCat]

    catTreeBulider(Adress, MainCat, "MainCat");

    let parent = getCatParent({ Parent_Categories: params.id }, [])

    let Cats = getKidsServices({ id: params.id }, [])

    return {
        props: { MainCat, params, parent, Cats }
    }

}


export async function getStaticPaths() {

    const data = await CatsModle.Cats.findAll();
    const paths = data.map(item => {
        return {
            params: {
                id: "" + item.dataValues.id

            }
        }

    })


    return {
        paths,
        fallback: true // false or 'blocking'
    };
}

function getServices(Cats) {
    const { data, error } = useSWR({ url: '/api/showServicesByCat', method: 'POST', data: { Cats: Cats } }, fetcher);
    //  console.log(data)
    // const page= !data || !{data} ? [] : data.data
    return {
        services: data,
        isLoding: !data && !error,
        isErorr: error
    }

}
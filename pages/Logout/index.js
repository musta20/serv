import { useRouter } from 'next/router'
import { useEffect } from 'react';
import { useCookies } from "react-cookie";
import fetcher from "../../model/fetcher";


export default function logout() {
    const router = useRouter()

    const [cookies, setCookie, removeCookie] = useCookies(['Jwt']);


    useEffect(() => {
        remonvecookie()
        removeCookie('Jwt')
        removeCookie('UserData')
        router.push('/')
    }, [])

   

    return (

        <>
            <div>
            </div>
        </>

    );
}
const remonvecookie = async ()=> {await fetcher({url:'/api/logout',method:'POST',data:{}});}

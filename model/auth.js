
import { useRouter } from 'next/router'
import { useEffect } from 'react';
import { useCookies } from 'react-cookie'
import fetcher from './fetcher'


export const useAuth = ({ onlyAdmin, ProtectedPage, setloadPageData } = {}) => {

    const [cookies, setCookie, removeCookie] = useCookies(['Jwt']);
    
    //const [reRoute, setReRout] = useState(false);


    const router = useRouter()

    //  const ProtectedPage = () => {

    //      if (!cookies.Jwt || !cookies.UserData) {

    //          ReSetSession();
    //      }

    //  }

    const reRoute = ({UserData}={}) => {

        if(!UserData) UserData  = cookies.UserData;
        if(onlyAdmin == null) 
        {

            if (UserData.user_type !== 2) return router.push('/profile')

            router.push('/Dashboard')
            return

        }

        if (onlyAdmin && UserData.user_type !== 2) {

            router.push('/profile')
            return

        }

        if (!onlyAdmin && UserData.user_type == 2) {

            router.push('/Dashboard')
            return
        }


    }

    const ReSetSession = async () => {

        console.log('ReSetSession')

        await csrf()

        fetcher({ url: "/api/ReSetSession", method: "POST", data: {} })
            .then(({ data }) => {
                setSession(data)

                router.reload(window.location.pathname)

            })
            .catch(
                err => {
                   // console.log(router.query)
                    router.push('/login')

                }
            )
    }

    const setSession = (data) => {

        setCookie('Jwt', data.Jwt, { path: '/' });
        setCookie('UserData', data.UserData, { path: '/' });


    }

    const logOut = async () => {
        csrf()

        await fetcher({ url: '/api/logout', method: 'POST', data: { data: "s" } })
            .then(data => {
                removeCookie('Jwt')
                removeCookie('UserData')
                router.push('/')
            })
            .catch()


    }

    useEffect(() => {

        if (!cookies.Jwt || !cookies.UserData) {

            ReSetSession();
            return
        }

        reRoute();

        setloadPageData(true)


    }, [])

    var csrf = async () => await fetcher({ url: "/sanctum/csrf-cookie", method: "GET" })

    return { setSession, logOut ,reRoute}

}


import fetcher from '../model/fetcher';
import { useCookies } from 'react-cookie';
import Image from 'next/image'

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useAuth } from "../model/hooks//auth";

export default function MessageBox({ OrderId }) {
    const [FormFiles, setFormFiles] = useState([]);

    const [allmessage, setmessage] = useState([]);
    const [currentmessage, setmessagecurrent] = useState("");
    const [loadPageData, setloadPageData] = useState(false);

    const [cookies] = useCookies(['Jwt']);


    //   useAuth({
    //   ProtectedPage: true,
    //   onlyAdmin: false,
    //   setloadPageData: setloadPageData
    //})


    const { message } = getMessages({ id: OrderId, Jwt: cookies.Jwt })


    const ShowImge = ({ m_type, Messages }) => {

        if (!m_type) return Messages

        const { data, error } = useSWR({ url: '/api/showImge', method: 'SHOW', data: { id: Messages } }, fetcher)

        if (!data) return <div></div>;

        return <Image src={data} width={200} height={170}></Image>;

    }

    useEffect(() => {

        setmessage(message)
        //chatBox.current.scrollTop = chatBox.current.scrollHeight

    }, [message])

    const uploadFile = async (event, inputid) => {

        const photoFormData = new FormData();

        photoFormData.append("file", event.target.files[0]);

        //srcf()

        const config = {
            onUploadProgress: function (progressEvent) {
                setpross(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            }
        }

        await fetcher({
            url: '/api/FileUpload', method: "POST_FILE", data: {
                body: photoFormData,
                Jwt: cookies.Jwt
                // ,config:config
            }

        }).then(ret => {

            files.push(ret.file)
            const updatFile = FormFiles.findIndex(item => item.input == inputid)

            const newupdateForm = [...FormFiles]

            newupdateForm[updatFile].value = ret.file.id

            setFormFiles(newupdateForm)


        });

    }


    const SendMessages = () => {
        // console.log(' orid orid orid orid orid ')
        // console.log(OrderId)
        let letCurrentmessage = currentmessage
        setmessagecurrent("")
        fetcher({
            url: '/api/Messages', method: 'POST', data: {
                req_id: OrderId,
                Jwt: cookies.Jwt,
                Messages: letCurrentmessage,

            }
        })
            .then(mesg => {
                const laamesge = [...allmessage]
                laamesge.push(mesg)
                setmessage(laamesge)


            })

    }

    return (
        <>


            <div className="py-2 px-2 border border-3 overflow-auto ChatBox  ">
                {!allmessage ? '' : allmessage.map(m =>
                    <h5 key={m.id} className={`message p-2  border  border-2 rounded rounded-2 mw-50 ${m.Sender_id == cookies.UserData.id ? 'mend' : ""}`}>
                        <ShowImge m_type={m.m_type}
                            Messages={m.Messages}
                        ></ShowImge> </h5>)}


                <div className=" d-flex justify-content-center  ">

                </div>
            </div>

            <div className="input-group">

                <span className="input-group-text"
                    onClick={() => SendMessages()}
                    id="basic-addon1">

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor"
                        className="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
                    </svg>
                </span>
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder=""
                    value={currentmessage}
                    onChange={(event) => setmessagecurrent(event.target.value)}
                    aria-label="Input group example"
                    aria-describedby="basic-addon1">
                </input>

            </div>

          







        </>
    )
}


function RequirementUploader(props) {

    const { data, error } = useSWR({ url: '/api/RequirmenUploader', method: 'SHOW', data: props }, fetcher);


    return {
        data: data,
        isLoding: !data && !error,
        errors: error
    }
}

const getMessages = (props) => {
    console.log('getMessages')
    const { data, error } = useSWR({ url: '/api/Messages', method: 'SHOW', data: props }, fetcher);
    console.log(data)
    useSWR({
        url: '/api/isViewed',
        method: 'PUT',
        data: props
    }, fetcher)



    return {
        message: data,
        isLoding: !data && !error,
        errors: error
    }
}



import Axios from 'axios'

const fetcher = async ({ url, method, data }) => {

    var headers = {
        'X-Requested-With': 'XMLHttpRequest',
    }
    if (data !== undefined) {

        if (data.Jwt !== undefined) {
            console.log('data.jwt is undefined')

            headers = {
                ...headers,
                "Authorization": "Bearer " + data.Jwt
            }
          //  delete data.Jwt

        }

        if (data.headers !== undefined) {

            headers = {
                ...headers,
                'Content-Type': 'multipart/form-data'
            }

        }

    }
    if (method == 'POST_FILE') {
        headers = {
            "Authorization": "Bearer " + data.Jwt,

            "Content-Type": "multipart/form-data"
        }
    }

    const URL = 'http://127.0.0.1:8000';
    const axios = Axios.create({
        headers,
        withCredentials: true,
    })
    switch (method) {
        case 'GET':
            return axios.get(URL + url).then(res => res.data);
        case 'SHOW':
            return axios.get(URL + url + "/" + data.id).then(res => res.data);
        case 'POST':
            delete data.Jwt
            return axios.post(URL + url, data).then(res => res.data);
        case 'POST_FILE':
            return axios.post(URL + url, data.body).then(res => res.data);
        case 'LOGIN':
            return axios({
                url: URL + url,
                method: "post",
                body: data,
                headers: { 'X-Requested-With': 'XMLHttpRequest', "Content-Type": "multipart/form-data" }
            }).then(res => res.data);
        case 'PUT':
            console.log(data)
           const id = data.id
           delete data.Jwt
           delete data.id

            return axios.put(URL + url + "/" + id, data).then(res => res.data);
        case 'DELETE':
            return axios.delete(URL + url + "/" + data.id).then(res => res.data);
        default:
            break;
    }
}

export default fetcher;


//     
//      Loadin
//      
//      Error
//      
//      succss
//
//
//
//

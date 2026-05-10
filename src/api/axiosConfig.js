import axios from 'axios'

const api = axios.create({
    baseURI: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
})


export default api
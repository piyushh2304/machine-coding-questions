import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? "/api" : "http://localhost:5000/api")
})

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.token) {
        config.headers.authorization = `Bearer ${user.token}`
    }
    return config
})

api.interceptors.response.use((response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    })

export default api
import axios from "axios"

const url = import.meta.env.VITE_API_URL

// Function to get JWT token from localStorage
const getAuthToken = () => {
    return localStorage.getItem("jwtToken") // Ensure the token is stored after login
}

// Create Axios instance
const api = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 50000,
})

// Add JWT token to request headers
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("jwtToken")

        // Exclude signup requests from requiring JWT
        if (!config.url.includes("auth/signup/") && token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        console.error("API request error:", error)
        return Promise.reject(error)
    }
)

// Users
export const createUser = async (credentials) => api.post(`auth/signup/`, credentials)
export const loginUser = async (credentials) => api.post(`auth/login/`, credentials)
// export const updateUser = async (userId, user) => api.put(`api/users/${userId}/update/`, user)
// export const deleteUser = async (userId) => api.delete(`api/users/${userId}/delete/`)
// export const getUsers = async () => api.get(`api/users/list/`)


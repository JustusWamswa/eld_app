import axios from "axios"
import { jwtDecode } from "jwt-decode"

const url = import.meta.env.VITE_API_URL

// Function to get JWT token from localStorage
const getAuthTokens = () => {
    return {
        access: localStorage.getItem("access_token"),
        refresh: localStorage.getItem("refresh_token"),
    }
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

const axiosRefresh = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Refresh access token when expired
const refreshAccessToken = async () => {
    try {
        const tokens = getAuthTokens()
        console.log("Getting refresh token")
        const response = await axiosRefresh.post(`auth/token/refresh/`, {refresh: tokens.refresh})
        const newAccessToken = response.data.access
        localStorage.setItem("access_token", newAccessToken)
        return newAccessToken
    } catch (error) {
        console.error("Failed to refresh access token:", error)
        localStorage.clear() // Logout user
        window.location.href = "/login"
        return null
    }
}

// Add JWT token to request headers
api.interceptors.request.use(
    async (config) => {
        let tokens = getAuthTokens()
        if (tokens.access) {
            const decoded = jwtDecode(tokens.access);
            const now = Date.now() / 1000;
            if (decoded.exp < now) {
                tokens.access = await refreshAccessToken();
                console.log('heading to config')
            }
            console.log('before config')
            if (!config.url.includes("auth/")) {
                config.headers["Authorization"] = `Bearer ${tokens.access}`
            }
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
export const getUserStatus = async () => api.get(`api/user-status/`)
export const changeUserStatus = async (newStatus) => api.post(`api/user-status/`, newStatus)
// export const updateUser = async (userId, user) => api.put(`api/users/${userId}/update/`, user)
// export const deleteUser = async (userId) => api.delete(`api/users/${userId}/delete/`)
// export const getUsers = async () => api.get(`api/users/list/`)


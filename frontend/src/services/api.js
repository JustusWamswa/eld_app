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
        const response = await axiosRefresh.post(`auth/token/refresh/`, {refresh: tokens.refresh})
        const newAccessToken = response.data.access
        localStorage.setItem("access_token", newAccessToken)
        return newAccessToken
    } catch (error) {
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
            }
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

// User
export const createUser = async (credentials) => api.post(`auth/signup/`, credentials)
export const loginUser = async (credentials) => api.post(`auth/login/`, credentials)
export const getUserStatus = async () => api.get(`api/user-status/`)
export const changeUserStatus = async (newStatus) => api.post(`api/user-status/`, newStatus)

// Trip
export const createTrip = async (trip) => api.post(`api/trip/`, trip)
export const getTrip = async (id) => api.get(`api/trip/${id}/`)
export const getUserTrips = async () => api.get(`api/trip/mytrips/`) 
export const endTrip = async (trip) => api.post(`api/trip/end-trip/`, trip)

// Theme
export const getUserTheme = async () => api.get(`api/theme/`)
export const changeUserTheme = async (newTheme) => api.post(`api/theme/`, newTheme)

// LogEntry
export const createLog = async (log) => api.post(`api/log/`, log)
export const updateLog = async (endTime, logId) => api.patch(`api/log/${logId}/`, endTime)
export const createLogAndUpdateStatus = async (log) => api.post(`api/log-and-update-status/`, log);

// Compliance
export const generateComplianceLog = async (id) => api.get(`api/generate-compliance-log/${id}/`)

// Cycle hours
export const getCycleHoursUsed = async (id) => api.get(`api/on-duty-hours-8-days/`)







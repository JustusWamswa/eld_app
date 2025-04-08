import { useState, createContext, useContext, useEffect } from "react"
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import Layout from "./components/Layout"
import Home from "./pages/home"
import { Routes, Route, Navigate } from 'react-router'
import Login from "./pages/login"
import SignUp from "./pages/signUp"
import PageNotFound from "./pages/pageNotFound"
import { getTheme } from "./utils/utils"
import Trips from "./pages/trips"
import TripSetup from "./pages/tripSetup"
import { getCycleHoursUsed, getUserTheme } from "./services/api"
import { useTripStore } from "./stores/useTripStore"
import FullScreenLoader from "./components/FullScreenLoader"

const ThemeContext = createContext()
const AuthContext = createContext()

function App() {

  const [darkMode, setDarkMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { logEntries, setCycleHoursUsed } = useTripStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    setIsAuthenticated(!!token)
    getUserTheme()
      .then((res) => {
        setDarkMode(res.data.dark_mode)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    getCycleHoursUsed()
    .then((res) => {
      setCycleHoursUsed(res.data.total_on_duty_hours_last_8_days)
    })
    .catch((err) => {
      console.log(err)
    })

  }, [logEntries])

  if (loading) return <FullScreenLoader />

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        <ThemeProvider theme={getTheme(darkMode ? "dark" : "light")}>
          <CssBaseline />
          <Layout>
            <Routes>
              <Route path='/' element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
              <Route path='/trips' element={isAuthenticated ? <Trips /> : <Navigate to="/login" />} />
              <Route path='/trip/:id' element={isAuthenticated ? <TripSetup /> : <Navigate to="/login" />} />
              <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
              <Route path='/signup' element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />} />
              <Route path='*' element={<PageNotFound />} />
            </Routes>
          </Layout>
        </ThemeProvider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  )
}

export default App

// Hook to toggle dark mode
export function useThemeToggle() {
  return useContext(ThemeContext)
}

// Hook to use authentication state
export function useAuth() {
  return useContext(AuthContext)
}
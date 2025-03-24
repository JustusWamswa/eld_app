import { useState, createContext, useContext, useEffect } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { CssBaseline, IconButton } from "@mui/material"
import Layout from "./components/Layout"
import Home from "./pages/home"
import { Routes, Route, Navigate } from 'react-router'
import Login from "./pages/login"
import SignUp from "./pages/signUp"
import PageNotFound from "./pages/pageNotFound"

const ThemeContext = createContext()
const AuthContext = createContext()

function App() {

  const [darkMode, setDarkMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    setIsAuthenticated(!!token)
  }, [])

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: '#074173',
      },
      secondary: {
        main: '#1679AB',
      },
    },
  })

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>
            <Routes>
              <Route path='/' element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
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
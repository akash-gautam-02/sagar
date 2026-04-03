import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

// Pages
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import ScrollToTop from './components/utils/ScrollToTop'
import { AuthProvider } from './context/AuthContext.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './components/utils/ProtectedRoute.jsx'

function App() {
  return (
    <AuthProvider>
      <div className="w-full overflow-x-hidden min-h-screen flex flex-col">
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              
              {/* Auth Routes */}
              <Route path="login" element={<AuthPage />} />
              <Route path="register" element={<AuthPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  )
}

export default App

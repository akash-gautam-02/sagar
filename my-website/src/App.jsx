import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

// Pages
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import ScrollToTop from './components/utils/ScrollToTop'
import { AuthProvider } from './context/AuthContext.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Services from './pages/Services.jsx'
import Work from './pages/Work.jsx'
import Pricing from './pages/Pricing.jsx'
import Contact from './pages/Contact.jsx'
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
              
              {/* Main Pages */}
              <Route path="services" element={<Services />} />
              <Route path="work" element={<Work />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="contact" element={<Contact />} />
              
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

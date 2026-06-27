import { useState, Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Preloader from './components/Preloader'
import { HelmetProvider } from 'react-helmet-async'

import Landing from './pages/Landing'
import Menu from './pages/Menu'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
import 'react-toastify/dist/ReactToastify.css'

import { ToastProvider } from './context/ToastContext'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/menu",
    element: <Menu />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms",
    element: <TermsOfService />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      }
    ]
  }
])

const App = () => {
  const [initialLoad, setInitialLoad] = useState(true);

  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          {initialLoad && <Preloader onComplete={() => setInitialLoad(false)} />}
          <Suspense
            fallback={
              <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-amber-400 rounded-full animate-spin"></div>
              </div>
            }
          >
            <RouterProvider router={router} />
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
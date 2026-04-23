import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage      from './pages/HomePage.jsx'
import LoginPage     from './pages/LoginPage.jsx'
import RegisterPage  from './pages/RegisterPage.jsx'
import JobDetailPage from './pages/JobDetailPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import PostJobPage   from './pages/PostJobPage.jsx'
import Navbar        from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"         element={<HomePage />}     />
        <Route path="/login"    element={<LoginPage />}    />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />}/>

        {/* Protected — login required */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }/>

        {/* Protected — employers only */}
        <Route path="/post-job" element={
          <ProtectedRoute employerOnly>
            <PostJobPage />
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
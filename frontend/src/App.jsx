import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import PostJobPage from './pages/PostJobPage'
import JobDetailPage from './pages/JobDetailPage'

function App() {
  return (
    <>
      <Navbar /> {/* ✅ Now Navbar is safely inside the Router context from main.jsx */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
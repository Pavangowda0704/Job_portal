import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ employerOnly }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ color: '#666', padding: '40px', textAlign: 'center' }}>
      Loading...
    </div>
  )

  if (!user) return <Navigate to="/login" />

  if (employerOnly && user.role !== 'employer') {
    return <Navigate to="/" />
  }

  return <Outlet />  // ← was "children", must be Outlet for nested routes
}

export default ProtectedRoute
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ children, employerOnly }) {
  const { user, loading } = useAuth()

  // Still checking login status — show nothing
  if (loading) return (
    <div style={{ color: '#666', padding: '40px', textAlign: 'center' }}>
      Loading...
    </div>
  )

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" />

  // Employer-only route but user is jobseeker
  if (employerOnly && user.role !== 'employer') {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
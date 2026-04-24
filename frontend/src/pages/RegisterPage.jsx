import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/index.js'
import { useAuth } from '../context/AuthContext.jsx' //

function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth() // ✅ Correct: Hook called at the top level

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'jobseeker',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await registerUser(formData)
      
      // ✅ Use the login function from context to update state
      login(data.token, data.user) 
      
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBox}>J</div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join the Jobframe community</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>I am a:</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              style={styles.input}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.footerLink}>Login</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B0C0E', padding: '20px' },
  card: { background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '420px' },
  header: { textAlign: 'center', marginBottom: '28px' },
  logoBox: { width: '40px', height: '40px', background: '#FF5C35', borderRadius: '8px', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, margin: '0 auto 12px' },
  title: { fontSize: '20px', color: '#E8E6E1', marginBottom: '6px' },
  subtitle: { fontSize: '13px', color: '#555' },
  error: { background: '#2d0f0f', color: '#ff6b6b', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' },
  input: { width: '100%', background: '#141414', border: '1px solid #222', color: '#E8E6E1', padding: '10px', borderRadius: '8px', outline: 'none' },
  btn: { width: '100%', background: '#FF5C35', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', border: 'none', marginTop: '10px' },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#555' },
  footerLink: { color: '#FF5C35', textDecoration: 'none', fontWeight: 600 }
}

export default RegisterPage
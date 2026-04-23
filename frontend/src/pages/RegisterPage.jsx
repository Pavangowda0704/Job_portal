import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/index.js'

function RegisterPage() {
  const navigate = useNavigate()

  // Form state — stores what user types
  const [formData, setFormData] = useState({
    name:     '',
    email:    '',
    password: '',
    role:     'jobseeker',
    company:  '',
  })

  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  // Update formData when user types in any field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault()         // stop page from reloading
    setError('')
    setLoading(true)

    try {
      const { data } = await registerUser(formData)

      // Save token and user to localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user',  JSON.stringify(data.user))

      // Redirect to home
      navigate('/')
      window.location.reload() // refresh navbar

    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoBox}>J</div>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Join thousands of job seekers & employers</p>
        </div>

        {/* Error message */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="rahul@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Password */}
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

          {/* Role */}
          <div style={styles.field}>
            <label style={styles.label}>I am a...</label>
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

          {/* Company — only show if employer */}
          {formData.role === 'employer' && (
            <div style={styles.field}>
              <label style={styles.label}>Company Name</label>
              <input
                name="company"
                type="text"
                placeholder="Stratum Labs"
                value={formData.company}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={styles.btn}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        {/* Link to login */}
        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.footerLink}>Sign in</Link>
        </p>

      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 1rem',
    background: '#0B0C0E',
  },
  card: {
    background: '#0f0f0f',
    border: '1px solid #1a1a1a',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoBox: {
    width: '40px',
    height: '40px',
    background: '#FF5C35',
    borderRadius: '8px',
    display: 'grid',
    placeItems: 'center',
    color: '#fff',
    fontWeight: 800,
    fontSize: '18px',
    margin: '0 auto 12px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#E8E6E1',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#555',
  },
  error: {
    background: '#2d0f0f',
    border: '1px solid #5c1a1a',
    color: '#ff6b6b',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#888',
    marginBottom: '6px',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    background: '#141414',
    border: '1px solid #222',
    color: '#E8E6E1',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  btn: {
    width: '100%',
    background: '#FF5C35',
    border: 'none',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '8px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '13px',
    color: '#555',
  },
  footerLink: {
    color: '#FF5C35',
    textDecoration: 'none',
    fontWeight: 600,
  },
}
// Add this import at the top
import { useAuth } from '../context/AuthContext.jsx'

// Inside the component add:
const { login } = useAuth()

// Replace the handleSubmit try block with:
const { data } = await registerUser(formData)
login(data.token, data.user)   // ← use context login
navigate('/')
export default RegisterPage
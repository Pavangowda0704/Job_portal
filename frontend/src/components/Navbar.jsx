import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Navbar() {
  const navigate       = useNavigate()
  const { user, logout } = useAuth()   // ← from context

  const handleLogout = () => {
    logout()           // clears token + user from context
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <div style={styles.logoBox}>J</div>
        <span>Jobframe</span>
      </Link>

      <div style={styles.links}>
        <Link to="/"        style={styles.link}>Browse</Link>
        {user?.role === 'employer' && (
          <Link to="/post-job" style={styles.link}>Post a Job</Link>
        )}
      </div>

      <div style={styles.auth}>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>
              👋 {user.name}
            </Link>
            <button onClick={handleLogout} style={styles.btnOutline}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    style={styles.btnOutline}>Sign in</Link>
            <Link to="/register" style={styles.btnFill}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    height: '60px',
    borderBottom: '1px solid #1a1a1a',
    background: '#0B0C0E',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: '#E8E6E1',
    fontWeight: 800,
    fontSize: '17px',
  },
  logoBox: {
    width: '28px',
    height: '28px',
    background: '#FF5C35',
    borderRadius: '6px',
    display: 'grid',
    placeItems: 'center',
    color: '#fff',
    fontWeight: 800,
  },
  links: { display: 'flex', gap: '28px' },
  link:  { color: '#888', textDecoration: 'none', fontSize: '13px' },
  auth:  { display: 'flex', gap: '10px', alignItems: 'center' },
  btnOutline: {
    background: 'none',
    border: '1px solid #2a2a2a',
    color: '#aaa',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  btnFill: {
    background: '#FF5C35',
    border: 'none',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 600,
  },
}

export default Navbar
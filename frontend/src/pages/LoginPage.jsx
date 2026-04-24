import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Verify this path
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  // ✅ CORRECT: Hooks must be at the top level of the component body
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ Use the login function extracted from the hook above
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login</h2>
        
        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={styles.text}>
          Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' },
  form: { background: '#0f0f0f', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid #1a1a1a' },
  title: { color: '#E8E6E1', marginBottom: '20px', textAlign: 'center' },
  input: { width: '100%', padding: '12px', margin: '10px 0', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px' },
  button: { width: '100%', padding: '12px', background: '#FF5C35', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' },
  error: { color: '#ff6b6b', fontSize: '14px', marginBottom: '10px', textAlign: 'center' },
  text: { color: '#888', marginTop: '15px', textAlign: 'center', fontSize: '14px' },
  link: { color: '#FF5C35', textDecoration: 'none' }
};

export default LoginPage;
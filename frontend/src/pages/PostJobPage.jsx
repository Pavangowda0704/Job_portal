import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createJob } from '../api/index.js'
import { useAuth } from '../context/AuthContext.jsx'

function PostJobPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    title:       '',
    company:     user?.company || '',
    location:    '',
    type:        'Full-time',
    salary:      '',
    description: '',
    tags:        '',
    featured:    false,
  })

  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '')

      const jobData = {
        ...formData,
        tags: tagsArray,
      }

      await createJob(jobData)

      // Success → go to home
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Post a New Job</h1>
          <p style={styles.subtitle}>
            Fill in the details below to post a job opening
          </p>
        </div>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Job Title */}
          <div style={styles.field}>
            <label style={styles.label}>Job Title *</label>
            <input
              name="title"
              type="text"
              placeholder="e.g. Senior React Developer"
              value={formData.title}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Company */}
          <div style={styles.field}>
            <label style={styles.label}>Company Name *</label>
            <input
              name="company"
              type="text"
              placeholder="e.g. Stratum Labs"
              value={formData.company}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Row: Location + Type */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Location *</label>
              <input
                name="location"
                type="text"
                placeholder="e.g. Bengaluru, IN"
                value={formData.location}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Job Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          {/* Salary */}
          <div style={styles.field}>
            <label style={styles.label}>Salary</label>
            <input
              name="salary"
              type="text"
              placeholder="e.g. ₹32-48 LPA"
              value={formData.salary}
              onChange={handleChange}
              style={styles.input}
            />
            <div style={styles.hint}>Leave blank if not disclosed</div>
          </div>

          {/* Description */}
          <div style={styles.field}>
            <label style={styles.label}>Job Description *</label>
            <textarea
              name="description"
              placeholder="Describe the role, responsibilities, requirements..."
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              style={{ ...styles.input, resize: 'vertical' }}
            />
          </div>

          {/* Tags */}
          <div style={styles.field}>
            <label style={styles.label}>Skills / Tags</label>
            <input
              name="tags"
              type="text"
              placeholder="e.g. React, Node.js, MongoDB"
              value={formData.tags}
              onChange={handleChange}
              style={styles.input}
            />
            <div style={styles.hint}>Separate with commas</div>
          </div>

          {/* Featured Checkbox */}
          <div style={styles.checkboxField}>
            <input
              name="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={handleChange}
              style={styles.checkbox}
              id="featured"
            />
            <label htmlFor="featured" style={styles.checkboxLabel}>
              Mark as featured job
            </label>
          </div>

          {/* Buttons */}
          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={styles.btnCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={styles.btnSubmit}
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}

const styles = {
  page: {
    background: '#0B0C0E',
    minHeight: '100vh',
    padding: '40px 2rem',
  },
  container: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#E8E6E1',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
  },
  error: {
    background: '#2d0f0f',
    border: '1px solid #5c1a1a',
    color: '#ff6b6b',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '13px',
  },
  form: {
    background: '#0f0f0f',
    border: '1px solid #1a1a1a',
    borderRadius: '12px',
    padding: '32px',
  },
  field: {
    marginBottom: '20px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    color: '#aaa',
    marginBottom: '8px',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    background: '#141414',
    border: '1px solid #222',
    color: '#E8E6E1',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  hint: {
    fontSize: '12px',
    color: '#555',
    marginTop: '6px',
  },
  checkboxField: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '13px',
    color: '#aaa',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  btnCancel: {
    background: 'none',
    border: '1px solid #2a2a2a',
    color: '#aaa',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSubmit: {
    background: '#FF5C35',
    border: 'none',
    color: '#fff',
    padding: '12px 32px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
  },
}

export default PostJobPage
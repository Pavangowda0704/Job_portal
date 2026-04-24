import { useState, useEffect } from 'react'
import { getAllJobs } from '../api/index.js'
import JobCard from '../components/JobCard.jsx'
import Loader from '../components/Loader.jsx'

function HomePage() {
  const [jobs,    setJobs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('All')

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const { data } = await getAllJobs()
      setJobs(data.jobs)
    } catch (err) {
      setError('Failed to load jobs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Filter jobs based on search and filter
  const filtered = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))

    const matchFilter =
      filter === 'All' ||
      job.type === filter ||
      (filter === 'Remote' && job.location.toLowerCase().includes('remote'))

    return matchSearch && matchFilter
  })

  const filters = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote']

  if (loading) return <Loader />

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.badge}>2,900+ open roles</div>
        <h1 style={styles.heading}>
          Find work that<br />
          <span style={{ color: '#FF5C35' }}>actually fits.</span>
        </h1>
        <p style={styles.subheading}>
          Curated tech jobs from companies that respect your time and talent.
        </p>

        {/* Search */}
        <div style={styles.searchBox}>
          <input
            placeholder="Role, skill, or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button style={styles.searchBtn}>Search</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.container}>
        {/* Filters */}
        <div style={styles.filterRow}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                background: filter === f ? '#FF5C35' : '#111',
                borderColor: filter === f ? '#FF5C35' : '#222',
                color: filter === f ? '#fff' : '#888',
                fontWeight: filter === f ? 600 : 400,
              }}
            >
              {f}
            </button>
          ))}
          <div style={styles.count}>{filtered.length} roles found</div>
        </div>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Jobs List */}
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <p>No jobs match your search.</p>
          </div>
        ) : (
          <div style={styles.jobList}>
            {filtered.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    background: '#0B0C0E',
    minHeight: '100vh',
  },
  hero: {
    background: 'linear-gradient(180deg, #111214 0%, #0B0C0E 100%)',
    padding: '56px 2rem 48px',
    textAlign: 'center',
    borderBottom: '1px solid #141414',
  },
  badge: {
    fontSize: '11px',
    letterSpacing: '3px',
    color: '#FF5C35',
    fontWeight: 600,
    marginBottom: '16px',
    textTransform: 'uppercase',
  },
  heading: {
    fontWeight: 800,
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    lineHeight: 1.1,
    letterSpacing: '-1.5px',
    marginBottom: '20px',
    color: '#E8E6E1',
  },
  subheading: {
    color: '#666',
    fontSize: '15px',
    marginBottom: '36px',
    maxWidth: '420px',
    margin: '0 auto 36px',
  },
  searchBox: {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    gap: '8px',
    background: '#141414',
    border: '1px solid #222',
    borderRadius: '10px',
    padding: '6px 6px 6px 16px',
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: '#E8E6E1',
    fontSize: '14px',
    padding: '8px 0',
    outline: 'none',
  },
  searchBtn: {
    background: '#FF5C35',
    border: 'none',
    color: '#fff',
    padding: '10px 22px',
    borderRadius: '7px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 2rem',
  },
  filterRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterBtn: {
    border: '1px solid',
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  count: {
    marginLeft: 'auto',
    fontSize: '12px',
    color: '#555',
  },
  error: {
    background: '#2d0f0f',
    border: '1px solid #5c1a1a',
    color: '#ff6b6b',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '13px',
  },
  empty: {
    textAlign: 'center',
    color: '#444',
    padding: '60px 0',
    fontSize: '14px',
  },
  jobList: {
    display: 'flex',
    flexDirection: 'column',
  },
}


export default HomePage
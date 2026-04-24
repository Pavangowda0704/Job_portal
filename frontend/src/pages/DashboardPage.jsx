import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyJobs, deleteJob } from '../api/index.js'
import { useNavigate } from 'react-router-dom'


function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyJobs()
  }, [])

  const fetchMyJobs = async () => {
    try {
      const { data } = await getMyJobs()
      setJobs(data.jobs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return
    try {
      await deleteJob(id)
      setJobs(jobs.filter(j => j._id !== id))
    } catch (err) {
      alert('Failed to delete job')
    }
  }

  if (loading) return <div style={{ padding: '40px', color: '#666' }}>Loading...</div>

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              {user?.role === 'employer' ? 'Employer Dashboard' : 'My Dashboard'}
            </h1>
            <p style={styles.subtitle}>
              {user?.role === 'employer' 
                ? `Manage your job postings • ${jobs.length} active jobs`
                : 'Your applications and saved jobs'}
            </p>
          </div>
          {user?.role === 'employer' && (
            <button onClick={() => navigate('/post-job')} style={styles.btnAdd}>
              + Post New Job
            </button>
          )}
        </div>

        {jobs.length === 0 ? (
          <div style={styles.empty}>
            <p>No jobs posted yet.</p>
            {user?.role === 'employer' && (
              <button onClick={() => navigate('/post-job')} style={styles.btnFill}>
                Post Your First Job
              </button>
            )}
          </div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.thTitle}>Job Title</div>
              <div style={styles.thApplicants}>Applicants</div>
              <div style={styles.thActions}>Actions</div>
            </div>
            {jobs.map(job => (
              <div key={job._id} style={styles.row}>
                <div style={styles.jobInfo}>
                  <div style={styles.jobTitle}>{job.title}</div>
                  <div style={styles.jobMeta}>
                    {job.company} · {job.location} · {job.type}
                  </div>
                </div>
                <div style={styles.applicants}>
                  {job.applicants?.length || 0}
                </div>
                <div style={styles.actions}>
                  <button onClick={() => navigate(`/jobs/${job._id}`)} style={styles.btnView}>
                    View
                  </button>
                  <button onClick={() => handleDelete(job._id)} style={styles.btnDelete}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

const styles = {
  page: { background: '#0B0C0E', minHeight: '100vh', padding: '40px 2rem' },
  container: { maxWidth: '1000px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: 800, color: '#E8E6E1', marginBottom: '6px' },
  subtitle: { fontSize: '14px', color: '#666' },
  btnAdd: { background: '#FF5C35', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '80px 20px', color: '#555' },
  btnFill: { marginTop: '20px', background: '#FF5C35', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  table: { background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1fr 120px 200px', padding: '16px 24px', background: '#141414', borderBottom: '1px solid #1a1a1a', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
  thTitle: {},
  thApplicants: { textAlign: 'center' },
  thActions: { textAlign: 'right' },
  row: { display: 'grid', gridTemplateColumns: '1fr 120px 200px', padding: '20px 24px', borderBottom: '1px solid #1a1a1a', alignItems: 'center' },
  jobInfo: {},
  jobTitle: { fontSize: '15px', fontWeight: 600, color: '#E8E6E1', marginBottom: '4px' },
  jobMeta: { fontSize: '12px', color: '#666' },
  applicants: { textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#aaa' },
  actions: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
  btnView: { background: 'none', border: '1px solid #2a2a2a', color: '#aaa', padding: '6px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  btnDelete: { background: 'none', border: '1px solid #5c1a1a', color: '#ff6b6b', padding: '6px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
}

export default DashboardPage
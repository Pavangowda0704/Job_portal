import { Link } from 'react-router-dom'

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job._id}`} style={s.card}>
      <div style={s.row}>
        <div style={s.avatar}>{job.company?.[0]}</div>
        <div style={s.main}>
          <div style={s.titleRow}>
            <span style={s.title}>{job.title}</span>
            {job.featured && <span style={s.featured}>Featured</span>}
            <span style={s.typePill}>{job.type}</span>
          </div>
          <div style={s.meta}>{job.company} · {job.location}</div>
          <div style={s.tags}>
            {job.tags?.slice(0, 4).map((tag, i) => (
              <span key={i} style={s.tag}>{tag}</span>
            ))}
          </div>
        </div>
        {job.salary && <div style={s.salary}>{job.salary}</div>}
      </div>
    </Link>
  )
}

const s = {
  card:     { display: 'block', textDecoration: 'none', background: '#0F172A', border: '0.5px solid #1E293B', borderRadius: '10px', padding: '16px 20px', marginBottom: '8px', transition: 'border-color 0.15s' },
  row:      { display: 'flex', alignItems: 'flex-start', gap: '14px' },
  avatar:   { width: '38px', height: '38px', borderRadius: '8px', background: '#1E3A5F', color: '#60A5FA', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  main:     { flex: 1, minWidth: 0 },
  titleRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' },
  title:    { fontSize: '14px', fontWeight: 600, color: '#F1F5F9' },
  featured: { fontSize: '10px', fontWeight: 600, color: '#F59E0B', background: '#451A03', border: '0.5px solid #78350F', padding: '2px 7px', borderRadius: '20px' },
  typePill: { fontSize: '10px', fontWeight: 500, color: '#60A5FA', background: '#1E3A5F', border: '0.5px solid #1D4ED8', padding: '2px 7px', borderRadius: '20px' },
  meta:     { fontSize: '12px', color: '#64748B', marginBottom: '10px' },
  tags:     { display: 'flex', gap: '5px', flexWrap: 'wrap' },
  tag:      { fontSize: '11px', color: '#475569', background: '#1E293B', border: '0.5px solid #334155', padding: '2px 8px', borderRadius: '4px' },
  salary:   { fontSize: '13px', fontWeight: 600, color: '#4ADE80', flexShrink: 0, paddingTop: '2px' },
}
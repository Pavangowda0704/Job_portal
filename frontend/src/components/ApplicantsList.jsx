import { useEffect, useState } from 'react';
import { getApplicants } from '../api';

function ApplicantsList({ jobId, onClose }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const { data } = await getApplicants(jobId);
        setList(data);
      } catch (err) {
        console.error("Failed to load applicants", err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [jobId]);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={{ color: '#E8E6E1' }}>Applicants for this Role</h3>
          <button onClick={onClose} style={styles.closeX}>✕</button>
        </div>

        {loading ? (
          <p style={{ color: '#666' }}>Loading candidates...</p>
        ) : (
          <div style={styles.listContainer}>
            {list.length > 0 ? (
              list.map(user => (
                <div key={user._id} style={styles.userCard}>
                  <div>
                    <p style={styles.userName}>{user.name}</p>
                    <p style={styles.userEmail}>{user.email}</p>
                  </div>
                  <a href={`mailto:${user.email}`} style={styles.contactBtn}>
                    Contact
                  </a>
                </div>
              ))
            ) : (
              <p style={{ color: '#666' }}>No one has applied yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.85)',
    display: 'grid', placeItems: 'center', zIndex: 1000
  },
  modal: {
    background: '#0f0f0f', padding: '30px',
    borderRadius: '12px', width: '90%', maxWidth: '500px',
    border: '1px solid #1a1a1a'
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '20px'
  },
  closeX: {
    background: 'none', border: 'none',
    color: '#888', cursor: 'pointer', fontSize: '20px'
  },
  listContainer: { maxHeight: '400px', overflowY: 'auto' },
  userCard: {
    padding: '15px 0', borderBottom: '1px solid #1a1a1a',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  userName: { color: '#E8E6E1', fontWeight: 600, marginBottom: '2px' },
  userEmail: { color: '#666', fontSize: '13px' },
  contactBtn: {
    background: '#FF5C35', color: '#fff',
    padding: '6px 14px', borderRadius: '6px',
    textDecoration: 'none', fontSize: '12px', fontWeight: 600
  }
};

export default ApplicantsList;
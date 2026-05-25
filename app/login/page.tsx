'use client'
export default function LoginPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px' }}>
      <h2 style={{ marginBottom: '30px', color: '#1e293b' }}>Sila Pilih Jenis Login</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '300px' }}>
        <a href="/admin" style={boxStyle}>
          <div style={{ fontSize: '30px' }}>👤</div>
          <div style={{ fontWeight: 'bold' }}>Admin Login</div>
          <small style={{ color: '#64748b' }}>Urus Homestay & Booking</small>
        </a>

        <button onClick={() => alert('Sistem Login Pengguna akan datang!')} style={boxStyle}>
          <div style={{ fontSize: '30px' }}>🏠</div>
          <div style={{ fontWeight: 'bold' }}>Pengguna Login</div>
          <small style={{ color: '#64748b' }}>Lihat Sejarah Booking</small>
        </button>
      </div>

      <a href="/" style={{ marginTop: '30px', color: '#64748b', textDecoration: 'none' }}>← Kembali ke Laman Utama</a>
    </div>
  )
}

const boxStyle = {
  backgroundColor: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0',
  textAlign: 'center' as 'center', textDecoration: 'none', color: '#1e293b', cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'block'
}

'use client'
export default function LoginPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px' }}>
      <h2 style={{ marginBottom: '10px', color: '#1e293b' }}>Selamat Datang</h2>
      <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '14px' }}>Sila pilih akses akaun anda</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '350px' }}>
        <a href="/admin" style={boxStyle}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>👤</div>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Admin Dashboard</div>
          <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Urus Rumah, Tempahan & Stats</div>
        </a>

        <button onClick={() => alert('Sistem Login Pengguna akan datang!')} style={boxStyle}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏠</div>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Pengguna Login</div>
          <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Lihat sejarah tempahan anda</div>
        </button>
      </div>

      <a href="/" style={{ marginTop: '40px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>← Kembali ke Laman Utama</a>
    </div>
  )
}

const boxStyle = {
  backgroundColor: '#fff', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0',
  textAlign: 'center' as 'center', textDecoration: 'none', color: '#1e293b', cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'block', transition: '0.2s'
}

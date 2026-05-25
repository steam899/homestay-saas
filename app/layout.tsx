export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
        <nav style={{ 
          backgroundColor: '#fff', padding: '15px 20px', display: 'flex', 
          justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100
        }}>
          <a href="/" style={{ fontWeight: '900', color: '#1e40af', fontSize: '18px', textDecoration: 'none' }}>
            HOMESTAY KU
          </a>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="/" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: '600' }}>Home</a>
            <a href="/login" style={{ 
              textDecoration: 'none', backgroundColor: '#1e40af', color: '#fff', 
              padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold' 
            }}>Login</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

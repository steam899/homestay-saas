export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <nav style={{ 
          backgroundColor: '#fff', padding: '12px 20px', display: 'flex', 
          justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100
        }}>
          <a href="/" style={{ fontWeight: '900', color: '#1e40af', fontSize: '18px', textDecoration: 'none', letterSpacing: '-0.5px' }}>
            HOMESTAY KU
          </a>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a href="/" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: '600' }}>Home</a>
            <a href="/login" style={{ 
              textDecoration: 'none', backgroundColor: '#1e40af', color: '#fff', 
              padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold',
              boxShadow: '0 4px 6px -1px rgba(30, 64, 175, 0.2)'
            }}>Login</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

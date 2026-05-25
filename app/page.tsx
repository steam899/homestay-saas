import { supabase } from '@/utils/supabase'

export const revalidate = 0

export default async function Home() {
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER / NAVIGATION */}
      <nav style={{ 
        backgroundColor: '#fff', 
        padding: '12px 20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ fontWeight: '900', color: '#1e40af', fontSize: '18px' }}>
          HOMESTAY KU
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Butang ke Admin */}
          <a href="/admin" style={{
            textDecoration: 'none',
            fontSize: '13px',
            color: '#475569',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            fontWeight: '600'
          }}>
            Admin
          </a>

          {/* Butang Login User (Simpan dulu fungsinya) */}
          <button style={{
            backgroundColor: '#1e40af',
            color: '#fff',
            fontSize: '13px',
            padding: '8px 12px',
            borderRadius: '10px',
            border: 'none',
            fontWeight: '600'
          }}>
            Login Gmail
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div style={{ padding: '30px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', color: '#1e293b', margin: 0 }}>Cari Penginapan Selesa</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '5px' }}>Tempah homestay terbaik di seluruh Malaysia</p>
      </div>

      {/* LISTING SECTION */}
      <main style={{ padding: '0 20px 50px 20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: '25px' }}>
          {properties?.map((item) => (
            <div key={item.id} style={{ 
              backgroundColor: '#fff', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              border: '1px solid #f1f5f9'
            }}>
              
              {/* Image */}
              <div style={{ height: '220px', width: '100%', backgroundColor: '#e2e8f0' }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>Tiada Gambar</div>
                )}
              </div>

              {/* Details */}
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '18px', color: '#1e293b', margin: '0 0 5px 0' }}>{item.name}</h2>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>📍 {item.location}</p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '15px'
                }}>
                  <div>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>RM{item.price_per_night}</span>
                    <small style={{ color: '#64748b' }}>/malam</small>
                  </div>
                  
                  <a href={`/book/${item.id}`} style={{ 
                    backgroundColor: '#2563eb', 
                    color: '#fff', 
                    padding: '12px 20px', 
                    borderRadius: '12px', 
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    Tempah
                  </a>
                </div>
              </div>
            </div>
          ))}

          {(!properties || properties.length === 0) && (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '50px' }}>Tiada homestay tersedia.</p>
          )}
        </div>
      </main>

      <footer style={{ textAlign: 'center', color: '#94a3b8', fontSize: '11px', padding: '20px' }}>
        © 2024 Homestay SaaS • All Rights Reserved
      </footer>
    </div>
  )
}

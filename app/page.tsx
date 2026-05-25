import { supabase } from '@/utils/supabase'

export const revalidate = 0 // Memastikan data sentiasa segar dari database

export default async function Home() {
  // Mengambil senarai homestay dari Supabase
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div style={{ 
      backgroundColor: '#f1f5f9', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      paddingBottom: '60px'
    }}>
      {/* Header / Navbar Simpel */}
      <header style={{ 
        backgroundColor: '#ffffff', 
        padding: '20px', 
        textAlign: 'center', 
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <h1 style={{ color: '#1e40af', fontSize: '24px', margin: 0, fontWeight: '800' }}>HOMESTAY KU 🏠</h1>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Tempahan mudah & pantas secara online</p>
      </header>

      {/* Main Content */}
      <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gap: '25px' }}>
          {properties?.map((item) => (
            <div key={item.id} style={{ 
              backgroundColor: '#fff', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
              border: '1px solid #ffffff'
            }}>
              
              {/* Gambar Homestay */}
              <div style={{ position: 'relative', height: '230px', width: '100%', backgroundColor: '#cbd5e1' }}>
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                    Gambar tidak tersedia
                  </div>
                )}
                <div style={{ 
                  position: 'absolute', 
                  bottom: '15px', 
                  right: '15px', 
                  backgroundColor: 'rgba(255,255,255,0.9)', 
                  padding: '5px 12px', 
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: '#1e40af'
                }}>
                  RM{item.price_per_night}/mlm
                </div>
              </div>

              {/* Info Homestay */}
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '20px', color: '#1e293b', margin: '0 0 8px 0', fontWeight: '700' }}>{item.name}</h2>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  📍 {item.location}
                </p>
                
                {/* Butang ke Borang Booking */}
                <a 
                  href={`/book/${item.id}`} 
                  style={{ 
                    display: 'block',
                    textAlign: 'center',
                    backgroundColor: '#2563eb', 
                    color: '#fff', 
                    padding: '16px', 
                    borderRadius: '16px', 
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                    transition: '0.2s'
                  }}
                >
                  Semak Tarikh & Tempah
                </a>
              </div>
            </div>
          ))}

          {/* Jika Database Kosong */}
          {(!properties || properties.length === 0) && (
            <div style={{ textAlign: 'center', padding: '100px 20px', color: '#94a3b8' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🍃</div>
              <p>Maaf, tiada homestay yang aktif buat masa ini.</p>
            </div>
          )}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', fontSize: '12px', letterSpacing: '1px' }}>
        POWERED BY HOMESTAY SAAS v2.0
      </footer>
    </div>
  )
}

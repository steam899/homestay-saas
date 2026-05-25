import { supabase } from '@/utils/supabase'

export const revalidate = 0 // Memastikan data sentiasa dikemaskini

export default async function Home() {
  // Mengambil data dari database
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div style={{ 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh', 
      fontFamily: 'sans-serif',
      paddingBottom: '50px'
    }}>
      {/* Header Area */}
      <header style={{ 
        backgroundColor: '#ffffff', 
        padding: '25px 20px', 
        textAlign: 'center', 
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '20px'
      }}>
        <h1 style={{ color: '#1e40af', fontSize: '28px', margin: 0 }}>Cari Homestay 🏠</h1>
        <p style={{ color: '#64748b', marginTop: '5px', fontSize: '14px' }}>Tempahan mudah terus ke WhatsApp owner</p>
      </header>

      {/* List Area */}
      <main style={{ padding: '0 15px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {properties?.map((item) => (
            <div key={item.id} style={{ 
              backgroundColor: '#fff', 
              borderRadius: '20px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              border: '1px solid #f1f5f9'
            }}>
              {/* Gambar Homestay */}
              <div style={{ backgroundColor: '#e2e8f0', height: '220px', width: '100%' }}>
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                    Tiada Gambar
                  </div>
                )}
              </div>

              {/* Info Homestay */}
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '20px', color: '#1e293b', margin: '0 0 5px 0' }}>{item.name}</h2>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                  📍 {item.location}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '15px'
                }}>
                  <div>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>RM{item.price_per_night}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}> /malam</span>
                  </div>
                  
                  <a 
                    href={`https://wa.me/60123456789?text=Salam, saya berminat nak booking ${encodeURIComponent(item.name)} di ${encodeURIComponent(item.location)}`}
                    style={{ 
                      backgroundColor: '#22c55e', 
                      color: '#fff', 
                      padding: '12px 18px', 
                      borderRadius: '12px', 
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 10px rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}

          {(!properties || properties.length === 0) && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
              <p>Belum ada homestay yang didaftarkan.</p>
            </div>
          )}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '12px' }}>
        © 2024 Homestay SaaS Pro • Built for Malaysia
      </footer>
    </div>
  )
}

import { supabase } from '@/utils/supabase'

export const revalidate = 0 // Supaya data sentiasa fresh

export default async function Home() {
  // Ambil data dari table properties
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#2563eb', fontSize: '28px' }}>Jom Booking!</h1>
        <p style={{ color: '#666' }}>Pilih homestay idaman anda di Malaysia.</p>
      </header>

      <div style={{ display: 'grid', gap: '20px' }}>
        {properties?.map((item) => (
          <div key={item.id} style={{ 
            border: '1px solid #eee', 
            borderRadius: '16px', 
            padding: '20px', 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            backgroundColor: '#fff'
          }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>{item.name}</h2>
            <p style={{ color: '#666', margin: '0 0 15px 0', fontSize: '14px' }}>📍 {item.location}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '18px' }}>
                RM{item.price_per_night} <span style={{ fontSize: '12px', color: '#999', fontWeight: 'normal' }}>/malam</span>
              </span>
              
              <a 
                href={`https://wa.me/60123456789?text=Saya%20nak%20book%20${encodeURIComponent(item.name)}`}
                style={{ 
                  backgroundColor: '#22c55e', 
                  color: 'white', 
                  padding: '10px 15px', 
                  borderRadius: '8px', 
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Booking WhatsApp
              </a>
            </div>
          </div>
        ))}

        {(!properties || properties.length === 0) && (
          <p style={{ textAlign: 'center', color: '#999' }}>Tiada homestay dijumpai.</p>
        )}
      </div>

      <footer style={{ marginTop: '50px', textAlign: 'center', fontSize: '12px', color: '#ccc' }}>
        Homestay SaaS v1.0
      </footer>
    </div>
  )
}

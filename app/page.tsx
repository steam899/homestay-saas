import { supabase } from '@/utils/supabase'

export const revalidate = 0

export default async function Home() {
  const { data: properties } = await supabase.from('properties').select('*').order('created_at', { ascending: false })

  return (
    <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <h1 style={{ margin: 0, color: '#1e293b' }}>Cari Homestay</h1>
        <p style={{ color: '#64748b' }}>Pilih penginapan terbaik untuk anda</p>
      </div>

      <div style={{ display: 'grid', gap: '25px' }}>
        {properties?.map((item) => (
          <div key={item.id} style={cardS}>
            <img src={item.image_url || 'https://via.placeholder.com/400x200'} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '20px' }}>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>{item.name}</h2>
              <p style={{ color: '#64748b', fontSize: '14px' }}>📍 {item.location}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <b style={{ color: '#2563eb', fontSize: '18px' }}>RM{item.price_per_night}/mlm</b>
                <a href={`/book/${item.id}`} style={bookBtn}>Tempah</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

const cardS = { backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }
const bookBtn = { backgroundColor: '#2563eb', color: '#fff', padding: '12px 20px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold' }

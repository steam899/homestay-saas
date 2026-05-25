import { supabase } from '@/utils/supabase'

export const revalidate = 0

export default async function Home() {
  const { data: properties } = await supabase.from('properties').select('*').order('created_at', { ascending: false })

  return (
    <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', padding: '30px 0' }}>
        <h1 style={{ margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: '800' }}>Cari Homestay 🏠</h1>
        <p style={{ color: '#64748b', marginTop: '5px' }}>Penginapan terbaik untuk percutian anda</p>
      </div>

      <div style={{ display: 'grid', gap: '25px' }}>
        {properties?.map((item) => (
          <div key={item.id} style={cardS}>
            <div style={{ position: 'relative', height: '220px', backgroundColor: '#e2e8f0' }}>
               <img src={item.image_url || 'https://via.placeholder.com/400x200'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               <div style={priceTag}>RM{item.price_per_night}/mlm</div>
            </div>
            <div style={{ padding: '20px' }}>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', fontWeight: '700' }}>{item.name}</h2>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>📍 {item.location}</p>
              <a href={`/book/${item.id}`} style={bookBtn}>Semak Tarikh & Tempah</a>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

const cardS = { backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }
const priceTag = { position: 'absolute' as 'absolute', bottom: '15px', right: '15px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '5px 12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', color: '#1e40af' }
const bookBtn = { display: 'block', textAlign: 'center' as 'center', backgroundColor: '#2563eb', color: '#fff', padding: '16px', borderRadius: '16px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }

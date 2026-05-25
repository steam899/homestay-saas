'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [activeTab, setActiveTab] = useState<'homestays' | 'bookings'>('bookings')
  const [properties, setProperties] = useState<any[]>([]); const [bookings, setBookings] = useState<any[]>([])
  
  // States untuk form
  const [name, setName] = useState(''); const [loc, setLoc] = useState(''); const [price, setPrice] = useState(''); const [img, setImg] = useState('')
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => { if (isLoggedIn) fetchData() }, [isLoggedIn])

  const fetchData = async () => {
    const { data: p } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
    const { data: b } = await supabase.from('bookings').select('*, properties(name)').order('check_in', { ascending: true })
    if (p) setProperties(p); if (b) setBookings(b)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) setIsLoggedIn(true)
    else alert('Password Salah!')
  }

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '350px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Dashboard 🔒</h3>
          <input type="password" placeholder="Password Admin" style={inputS} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button type="submit" style={btnS}>Masuk</button>
          <center><a href="/login" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none', display: 'block', marginTop: '15px' }}>← Balik</a></center>
        </form>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('bookings')} style={{ ...tabBtn, backgroundColor: activeTab === 'bookings' ? '#2563eb' : '#fff', color: activeTab === 'bookings' ? '#fff' : '#000' }}>Tempahan</button>
        <button onClick={() => setActiveTab('homestays')} style={{ ...tabBtn, backgroundColor: activeTab === 'homestays' ? '#2563eb' : '#fff', color: activeTab === 'homestays' ? '#fff' : '#000' }}>Homestay</button>
      </div>

      {activeTab === 'bookings' ? (
        <div>
          <h3>Senarai Booking</h3>
          {bookings.map(b => (
            <div key={b.id} style={listItem}>
              <b>{b.customer_name}</b> - {b.properties?.name} <br/>
              <small>{b.check_in} hingga {b.check_out}</small>
              <div style={{ color: '#2563eb', fontWeight: 'bold' }}>RM{b.total_price} - {b.payment_status}</div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3>Urus Homestay</h3>
          {properties.map(p => (
            <div key={p.id} style={listItem}>
              <b>{p.name}</b> <br/> RM{p.price_per_night}/mlm
              <button onClick={async () => { if(confirm('Hapus?')){ await supabase.from('properties').delete().eq('id', p.id); fetchData() } }} style={{ float: 'right', color: 'red', border: 'none', background: 'none' }}>Padam</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const inputS = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '10px', boxSizing: 'border-box' as 'border-box' }
const btnS = { width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' as 'bold' }
const tabBtn = { flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontWeight: 'bold' as 'bold' }
const listItem = { backgroundColor: '#fff', padding: '15px', borderRadius: '15px', marginBottom: '10px', border: '1px solid #e2e8f0' }

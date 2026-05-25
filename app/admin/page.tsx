'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [activeTab, setActiveTab] = useState<'homestays' | 'bookings'>('bookings')
  const [properties, setProperties] = useState<any[]>([]); const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Stats
  const today = new Date().toISOString().split('T')[0]
  const checkInsToday = bookings.filter(b => b.check_in === today).length
  const checkOutsToday = bookings.filter(b => b.check_out === today).length

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

  const updatePayment = async (id: string, status: string) => {
    await supabase.from('bookings').update({ payment_status: status }).eq('id', id)
    fetchData()
  }

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '350px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e40af' }}>Admin Dashboard 🔒</h3>
          <input type="password" placeholder="Password Admin" style={inputS} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button type="submit" style={btnS}>Masuk</button>
          <center><a href="/login" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none', display: 'block', marginTop: '20px' }}>← Balik</a></center>
        </form>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', paddingBottom: '100px' }}>
      {/* STATS */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <div style={{ flex: 1, backgroundColor: '#dcfce7', padding: '15px', borderRadius: '20px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#166534' }}>{checkInsToday}</div>
          <div style={{ fontSize: '11px', color: '#166534', fontWeight: 'bold' }}>Check-in Harini</div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#fee2e2', padding: '15px', borderRadius: '20px', textAlign: 'center', border: '1px solid #fecaca' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#991b1b' }}>{checkOutsToday}</div>
          <div style={{ fontSize: '11px', color: '#991b1b', fontWeight: 'bold' }}>Check-out Harini</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('bookings')} style={{ ...tabBtn, backgroundColor: activeTab === 'bookings' ? '#2563eb' : '#fff', color: activeTab === 'bookings' ? '#fff' : '#64748b' }}>Tempahan</button>
        <button onClick={() => setActiveTab('homestays')} style={{ ...tabBtn, backgroundColor: activeTab === 'homestays' ? '#2563eb' : '#fff', color: activeTab === 'homestays' ? '#fff' : '#64748b' }}>Urus Rumah</button>
      </div>

      {activeTab === 'bookings' ? (
        <div style={{ display: 'grid', gap: '15px' }}>
          {bookings.map(b => (
            <div key={b.id} style={cardS}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <b style={{ color: '#1e40af' }}>{b.properties?.name}</b>
                 <button onClick={() => { if(confirm('Padam?')) supabase.from('bookings').delete().eq('id', b.id).then(()=>fetchData()) }} style={{ border: 'none', background: 'none' }}>🗑️</button>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', margin: '5px 0' }}>{b.customer_name}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>📅 {b.check_in} - {b.check_out} <br/> 💰 RM{b.total_price}</div>
              <select style={{ marginTop: '10px', width: '100%', padding: '8px', borderRadius: '8px' }} value={b.payment_status} onChange={(e) => updatePayment(b.id, e.target.value)}>
                <option value="Belum Bayar">Belum Bayar</option>
                <option value="Deposit Paid">Deposit Paid</option>
                <option value="Full Payment">Full Payment</option>
              </select>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {properties.map(p => (
            <div key={p.id} style={{ ...cardS, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><b>{p.name}</b><br/><small>RM{p.price_per_night}/mlm</small></div>
              <button onClick={async () => { if(confirm('Hapus?')){ await supabase.from('properties').delete().eq('id', p.id); fetchData() } }} style={{ color: '#ef4444', border: 'none', background: 'none', fontWeight: 'bold' }}>Padam</button>
            </div>
          ))}
          <center><a href="/admin" style={{ marginTop: '20px', display: 'block', color: '#2563eb' }}>+ Tambah Baru</a></center>
        </div>
      )}
    </div>
  )
}

const inputS = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '15px', boxSizing: 'border-box' as 'border-box' }
const btnS = { width: '100%', padding: '14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' as 'bold' }
const tabBtn = { flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', fontWeight: 'bold' as 'bold', fontSize: '14px' }
const cardS = { backgroundColor: '#fff', padding: '15px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }

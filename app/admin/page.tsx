'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function AdminPro() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [activeTab, setActiveTab] = useState<'homestays' | 'bookings'>('bookings')
  const [properties, setProperties] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Stats
  const today = new Date().toISOString().split('T')[0]
  const checkInsToday = bookings.filter(b => b.check_in === today).length
  const checkOutsToday = bookings.filter(b => b.check_out === today).length

  useEffect(() => { if (isLoggedIn) fetchData() }, [isLoggedIn])

  const fetchData = async () => {
    const { data: p } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
    const { data: b } = await supabase.from('bookings').select('*, properties(name)').order('check_in', { ascending: true })
    if (p) setProperties(p)
    if (b) setBookings(b)
  }

  const updatePaymentStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ payment_status: status }).eq('id', id)
    fetchData()
  }

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '20px' }}>
        <form onSubmit={(e) => { e.preventDefault(); if(passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) setIsLoggedIn(true); else alert('Salah!') }} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center' }}>Admin Login 🔐</h2>
          <input type="password" placeholder="Password" style={inputS} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button style={btnS}>Masuk</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => setActiveTab('homestays')} style={{ ...tabBtn, borderBottom: activeTab === 'homestays' ? '3px solid #2563eb' : 'none' }}>🏠 Rumah</button>
        <button onClick={() => setActiveTab('bookings')} style={{ ...tabBtn, borderBottom: activeTab === 'bookings' ? '3px solid #2563eb' : 'none' }}>📅 Tempahan</button>
      </div>

      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        
        {/* STATS AREA */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, backgroundColor: '#dcfce7', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{checkInsToday}</span><br/><small>Check-in Harini</small>
          </div>
          <div style={{ flex: 1, backgroundColor: '#fee2e2', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{checkOutsToday}</span><br/><small>Check-out Harini</small>
          </div>
        </div>

        {activeTab === 'bookings' && (
          <div>
            <h3>Senarai Booking</h3>
            {bookings.map(b => (
              <div key={b.id} style={cardS}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b style={{ color: '#2563eb' }}>{b.properties?.name}</b>
                  <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '5px', backgroundColor: b.payment_status === 'Full Payment' ? '#dcfce7' : '#fef9c3' }}>
                    {b.payment_status}
                  </span>
                </div>
                <div style={{ fontSize: '13px', margin: '10px 0' }}>
                  👤 {b.customer_name}<br/>
                  📅 {b.check_in} ➡️ {b.check_out}<br/>
                  💰 Total: RM{b.total_price}
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <select 
                    style={{ fontSize: '11px', padding: '5px' }} 
                    onChange={(e) => updatePaymentStatus(b.id, e.target.value)}
                    value={b.payment_status}
                  >
                    <option value="Belum Bayar">Belum Bayar</option>
                    <option value="Deposit Paid">Deposit</option>
                    <option value="Full Payment">Full Paid</option>
                  </select>
                  <button onClick={() => { if(confirm('Hapus?')) supabase.from('bookings').delete().eq('id', b.id).then(()=>fetchData()) }} style={{ backgroundColor: 'none', border: 'none', color: 'red' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Kod untuk Homestays Tab boleh dikekalkan dari versi sebelum ini */}
      </div>
    </div>
  )
}

const inputS = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '10px', boxSizing: 'border-box' as 'border-box' }
const btnS = { width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' as 'bold' }
const tabBtn = { flex: 1, padding: '15px', border: 'none', background: 'none', fontWeight: 'bold' as 'bold' }
const cardS = { backgroundColor: '#fff', padding: '15px', borderRadius: '15px', marginBottom: '10px', border: '1px solid #e2e8f0' }

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function AdminProPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [activeTab, setActiveTab] = useState<'homestays' | 'bookings'>('bookings')
  const [loading, setLoading] = useState(false)

  // Data State
  const [properties, setProperties] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])

  // Form State (Homestay)
  const [name, setName] = useState('')
  const [loc, setLoc] = useState('')
  const [price, setPrice] = useState('')
  const [img, setImg] = useState('')
  const [editId, setEditId] = useState<string | null>(null)

  // Form State (Manual Booking)
  const [bPropId, setBPropId] = useState('')
  const [bName, setBName] = useState('')
  const [bPhone, setBPhone] = useState('')
  const [bIn, setBIn] = useState('')
  const [bOut, setBOut] = useState('')

  // Statistik
  const today = new Date().toISOString().split('T')[0]
  const checkInsToday = bookings.filter(b => b.check_in === today).length
  const checkOutsToday = bookings.filter(b => b.check_out === today).length

  useEffect(() => {
    if (isLoggedIn) fetchData()
  }, [isLoggedIn])

  const fetchData = async () => {
    const { data: p } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
    const { data: b } = await supabase.from('bookings').select('*, properties(name)').order('check_in', { ascending: true })
    if (p) setProperties(p)
    if (b) setBookings(b)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsLoggedIn(true)
    } else {
      alert('Password Salah!')
    }
  }

  // LOGIK HOMESTAY (TAMBAH / EDIT)
  const submitHomestay = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const payload = { name, location: loc, price_per_night: parseFloat(price), image_url: img }
    
    if (editId) {
      await supabase.from('properties').update(payload).eq('id', editId)
      alert('Data dikemaskini!')
    } else {
      await supabase.from('properties').insert([payload])
      alert('Homestay ditambah!')
    }
    
    setName(''); setLoc(''); setPrice(''); setImg(''); setEditId(null)
    setLoading(false); fetchData()
  }

  // LOGIK BOOKING (MANUAL)
  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const days = (new Date(bOut).getTime() - new Date(bIn).getTime()) / (1000 * 3600 * 24)
    const prop = properties.find(p => p.id === bPropId)
    const total = (days > 0 ? days : 1) * (prop?.price_per_night || 0)

    await supabase.from('bookings').insert([{
      property_id: bPropId, customer_name: bName, phone_number: bPhone, check_in: bIn, check_out: bOut, total_price: total
    }])
    
    setBName(''); setBPhone(''); setBIn(''); setBOut(''); setBPropId('')
    setLoading(false); fetchData(); alert('Booking direkod!')
  }

  const updatePayment = async (id: string, status: string) => {
    await supabase.from('bookings').update({ payment_status: status }).eq('id', id)
    fetchData()
  }

  const deleteItem = async (table: string, id: string) => {
    if (confirm('Padam data ini?')) {
      await supabase.from(table).delete().eq('id', id)
      fetchData()
    }
  }

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e40af' }}>Admin Login 🔐</h2>
          <input type="password" placeholder="Masukkan Password" style={inputS} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button type="submit" style={btnS}>Masuk Dashboard</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '100px' }}>
      
      {/* TABS HEADER */}
      <div style={{ display: 'flex', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => setActiveTab('bookings')} style={{ ...tabBtn, borderBottom: activeTab === 'bookings' ? '4px solid #2563eb' : 'none', color: activeTab === 'bookings' ? '#2563eb' : '#64748b' }}>📅 Urus Booking</button>
        <button onClick={() => setActiveTab('homestays')} style={{ ...tabBtn, borderBottom: activeTab === 'homestays' ? '4px solid #2563eb' : 'none', color: activeTab === 'homestays' ? '#2563eb' : '#64748b' }}>🏠 Urus Rumah</button>
      </div>

      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        
        {/* STATS SUMMARY */}
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

        {/* TAB: URUS BOOKING */}
        {activeTab === 'bookings' && (
          <div>
            <form onSubmit={submitBooking} style={cardS}>
              <h3 style={{ margin: '0 0 15px 0' }}>Rekod Booking Baru</h3>
              <select style={inputS} value={bPropId} onChange={(e) => setBPropId(e.target.value)} required>
                <option value="">-- Pilih Homestay --</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input placeholder="Nama Pelanggan" style={inputS} value={bName} onChange={(e) => setBName(e.target.value)} required />
              <input placeholder="No WhatsApp" style={inputS} value={bPhone} onChange={(e) => setBPhone(e.target.value)} required />
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}><label style={{ fontSize: '11px' }}>Check-in</label><input type="date" style={inputS} value={bIn} onChange={(e) => setBIn(e.target.value)} required /></div>
                <div style={{ flex: 1 }}><label style={{ fontSize: '11px' }}>Check-out</label><input type="date" style={inputS} value={bOut} onChange={(e) => setBOut(e.target.value)} required /></div>
              </div>
              <button disabled={loading} style={{ ...btnS, backgroundColor: '#059669' }}>Simpan Rekod Booking</button>
            </form>

            <h3 style={{ marginBottom: '15px' }}>Semua Rekod Tempahan</h3>
            {bookings.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8' }}>Tiada tempahan direkodkan.</p>}
            {bookings.map(b => (
              <div key={b.id} style={{ ...cardS, borderLeft: b.payment_status === 'Full Payment' ? '6px solid #22c55e' : '6px solid #facc15' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>{b.properties?.name}</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', margin: '2px 0' }}>{b.customer_name}</div>
                  </div>
                  <button onClick={() => deleteItem('bookings', b.id)} style={{ background: 'none', border: 'none', fontSize: '18px' }}>🗑️</button>
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', margin: '8px 0' }}>
                  📅 {b.check_in} ➡️ {b.check_out}<br/>
                  💰 Total: <b>RM{b.total_price}</b>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Status Bayaran:</label>
                  <select 
                    style={{ flex: 1, padding: '5px', borderRadius: '5px' }} 
                    value={b.payment_status} 
                    onChange={(e) => updatePayment(b.id, e.target.value)}
                  >
                    <option value="Belum Bayar">Belum Bayar</option>
                    <option value="Deposit Paid">Deposit Paid</option>
                    <option value="Full Payment">Full Payment</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: URUS HOMESTAY */}
        {activeTab === 'homestays' && (
          <div>
            <form onSubmit={submitHomestay} style={cardS}>
              <h3 style={{ margin: '0 0 15px 0' }}>{editId ? 'Kemaskini' : 'Tambah'} Homestay</h3>
              <input placeholder="Nama Rumah" style={inputS} value={name} onChange={(e) => setName(e.target.value)} required />
              <input placeholder="Lokasi (cth: Melaka)" style={inputS} value={loc} onChange={(e) => setLoc(e.target.value)} required />
              <input placeholder="Harga per Malam" type="number" style={inputS} value={price} onChange={(e) => setPrice(e.target.value)} required />
              <input placeholder="URL Link Gambar" style={inputS} value={img} onChange={(e) => setImg(e.target.value)} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button disabled={loading} style={{ ...btnS, flex: 2 }}>{editId ? 'Simpan Perubahan' : 'Tambah Rumah'}</button>
                {editId && <button onClick={() => { setEditId(null); setName(''); setLoc(''); setPrice(''); setImg('') }} style={{ ...btnS, backgroundColor: '#94a3b8', flex: 1 }}>Batal</button>}
              </div>
            </form>

            <h3 style={{ marginBottom: '15px' }}>Senarai Rumah Anda</h3>
            {properties.map(p => (
              <div key={p.id} style={listItem}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={p.image_url || 'https://via.placeholder.com/50'} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>RM{p.price_per_night}/mlm</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setEditId(p.id); setName(p.name); setLoc(p.location); setPrice(p.price_per_night.toString()); setImg(p.image_url || '') }} style={smallBtn}>Edit</button>
                  <button onClick={() => deleteItem('properties', p.id)} style={{ ...smallBtn, backgroundColor: '#ef4444' }}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => setIsLoggedIn(false)} style={{ marginTop: '50px', width: '100%', background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px' }}>Logout Dashboard</button>
      </div>
    </div>
  )
}

// STYLES
const tabBtn = { flex: 1, padding: '18px', border: 'none', background: 'none', fontWeight: 'bold' as 'bold', fontSize: '14px' }
const cardS = { backgroundColor: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }
const inputS = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' as 'border-box' }
const btnS = { width: '100%', padding: '14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' as 'bold', fontSize: '15px' }
const listItem = { backgroundColor: '#fff', padding: '12px 15px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', border: '1px solid #f1f5f9' }
const smallBtn = { padding: '8px 12px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' as 'bold' }

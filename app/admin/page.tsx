'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [activeTab, setActiveTab] = useState<'homestays' | 'bookings'>('homestays')
  
  // Data State
  const [properties, setProperties] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Form State (Homestay)
  const [name, setName] = useState(''); const [loc, setLoc] = useState('');
  const [price, setPrice] = useState(''); const [img, setImg] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  // Form State (Booking Manual)
  const [bPropId, setBPropId] = useState(''); const [bName, setBName] = useState('');
  const [bPhone, setBPhone] = useState(''); const [bIn, setBIn] = useState(''); const [bOut, setBOut] = useState('');

  useEffect(() => {
    if (isLoggedIn) { fetchData() }
  }, [isLoggedIn])

  const fetchData = async () => {
    const { data: p } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
    const { data: b } = await supabase.from('bookings').select('*, properties(name)').order('check_in', { ascending: true })
    if (p) setProperties(p)
    if (b) setBookings(b)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) setIsLoggedIn(true)
    else alert('Password Salah!')
  }

  // LOGIK HOMESTAY
  const submitHomestay = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const payload = { name, location: loc, price_per_night: parseFloat(price), image_url: img }
    if (editId) { await supabase.from('properties').update(payload).eq('id', editId) }
    else { await supabase.from('properties').insert([payload]) }
    setName(''); setLoc(''); setPrice(''); setImg(''); setEditId(null);
    setLoading(false); fetchData()
  }

  // LOGIK BOOKING
  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    await supabase.from('bookings').insert([{ 
      property_id: bPropId, customer_name: bName, phone_number: bPhone, check_in: bIn, check_out: bOut 
    }])
    setBName(''); setBPhone(''); setBIn(''); setBOut('');
    setLoading(false); fetchData(); alert('Booking berjaya direkod!')
  }

  const deleteItem = async (table: string, id: string) => {
    if (confirm('Confirm padam?')) {
      await supabase.from(table).delete().eq('id', id)
      fetchData()
    }
  }

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center' }}>Admin Login 🔐</h2>
          <input type="password" placeholder="Password" style={inputStyle} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button type="submit" style={btnStyle}>Masuk</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '100px' }}>
      {/* TABS NAVIGATION */}
      <div style={{ display: 'flex', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => setActiveTab('homestays')} style={{ ...tabBtn, borderBottom: activeTab === 'homestays' ? '3px solid #2563eb' : 'none' }}>🏠 Homestay</button>
        <button onClick={() => setActiveTab('bookings')} style={{ ...tabBtn, borderBottom: activeTab === 'bookings' ? '3px solid #2563eb' : 'none' }}>📅 Tempahan</button>
      </div>

      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        
        {/* TAB 1: URUS HOMESTAY */}
        {activeTab === 'homestays' && (
          <div>
            <form onSubmit={submitHomestay} style={cardStyle}>
              <h3>{editId ? 'Edit' : 'Tambah'} Homestay</h3>
              <input placeholder="Nama" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
              <input placeholder="Lokasi" style={inputStyle} value={loc} onChange={(e) => setLoc(e.target.value)} required />
              <input placeholder="Harga/Malam" type="number" style={inputStyle} value={price} onChange={(e) => setPrice(e.target.value)} required />
              <input placeholder="Link Gambar" style={inputStyle} value={img} onChange={(e) => setImg(e.target.value)} />
              <button disabled={loading} style={btnStyle}>{editId ? 'Update' : 'Simpan'}</button>
            </form>

            <div style={{ display: 'grid', gap: '10px' }}>
              {properties.map(p => (
                <div key={p.id} style={listItem}>
                  <div><b>{p.name}</b><br/><small>RM{p.price_per_night}</small></div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => {setEditId(p.id); setName(p.name); setLoc(p.location); setPrice(p.price_per_night.toString()); setImg(p.image_url)}} style={smallBtn}>Edit</button>
                    <button onClick={() => deleteItem('properties', p.id)} style={{ ...smallBtn, backgroundColor: '#ef4444' }}>Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: URUS BOOKING */}
        {activeTab === 'bookings' && (
          <div>
            <form onSubmit={submitBooking} style={cardStyle}>
              <h3>Rekod Booking Manual</h3>
              <select style={inputStyle} value={bPropId} onChange={(e) => setBPropId(e.target.value)} required>
                <option value="">-- Pilih Homestay --</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input placeholder="Nama Pelanggan" style={inputStyle} value={bName} onChange={(e) => setBName(e.target.value)} required />
              <input placeholder="No Phone" style={inputStyle} value={bPhone} onChange={(e) => setBPhone(e.target.value)} required />
              <div style={{ display: 'flex', gap: '5px' }}>
                <input type="date" style={inputStyle} value={bIn} onChange={(e) => setBIn(e.target.value)} required />
                <input type="date" style={inputStyle} value={bOut} onChange={(e) => setBOut(e.target.value)} required />
              </div>
              <button disabled={loading} style={btnStyle}>Simpan Booking</button>
            </form>

            <h3>Senarai Tempahan</h3>
            {bookings.map(b => (
              <div key={b.id} style={{ ...listItem, flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <b style={{ color: '#2563eb' }}>{b.properties?.name}</b>
                  <button onClick={() => deleteItem('bookings', b.id)} style={{ border: 'none', background: 'none', color: 'red' }}>🗑️</button>
                </div>
                <div style={{ fontSize: '14px', marginTop: '5px' }}>
                  👤 {b.customer_name} ({b.phone_number})<br/>
                  📅 {b.check_in} hingga {b.check_out}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

// STYLES
const tabBtn = { flex: 1, padding: '15px', border: 'none', background: 'none', fontWeight: 'bold' as 'bold', cursor: 'pointer' }
const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', boxSizing: 'border-box' as 'border-box' }
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' as 'bold' }
const listItem = { backgroundColor: '#fff', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', border: '1px solid #eee' }
const smallBtn = { padding: '6px 10px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px' }

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [editId, setEditId] = useState<string | null>(null) // Untuk tahu tengah edit atau tambah baru

  useEffect(() => {
    if (isLoggedIn) fetchProperties()
  }, [isLoggedIn])

  const fetchProperties = async () => {
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
    if (data) setProperties(data)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) setIsLoggedIn(true)
    else alert('Password Salah!')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = { name, location, price_per_night: parseFloat(price), image_url: imageUrl }

    if (editId) {
      // PROSES EDIT
      await supabase.from('properties').update(payload).eq('id', editId)
      alert('Berjaya dikemaskini!')
    } else {
      // PROSES TAMBAH BARU
      await supabase.from('properties').insert([payload])
      alert('Berjaya ditambah!')
    }

    setLoading(false)
    setEditId(null)
    setName(''); setLocation(''); setPrice(''); setImageUrl('')
    fetchProperties()
  }

  const handleEdit = (item: any) => {
    setEditId(item.id)
    setName(item.name)
    setLocation(item.location)
    setPrice(item.price_per_night.toString())
    setImageUrl(item.image_url || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Betul ke nak padam homestay ni?')) {
      await supabase.from('properties').delete().eq('id', id)
      fetchProperties()
    }
  }

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center' }}>Admin Login 🔐</h2>
          <input type="password" placeholder="Password" style={inputStyle} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button type="submit" style={{ ...btnStyle, width: '100%', marginTop: '15px' }}>Masuk</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>{editId ? '📝 Edit Homestay' : '➕ Tambah Homestay'}</h1>
        
        {/* FORM SECTION */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <input type="text" placeholder="Nama Homestay" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="text" placeholder="Lokasi" style={inputStyle} value={location} onChange={(e) => setLocation(e.target.value)} required />
          <input type="number" placeholder="Harga/Malam" style={inputStyle} value={price} onChange={(e) => setPrice(e.target.value)} required />
          <input type="text" placeholder="Link Gambar" style={inputStyle} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" disabled={loading} style={{ ...btnStyle, flex: 2 }}>
              {loading ? 'Sabar...' : editId ? 'Kemaskini Data' : 'Simpan Homestay'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setName(''); setLocation(''); setPrice(''); setImageUrl('') }} style={{ ...btnStyle, backgroundColor: '#64748b', flex: 1 }}>Batal</button>
            )}
          </div>
        </form>

        {/* LIST SECTION (Calendar/Manage) */}
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Urus Homestay Anda</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {properties.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{item.name}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>RM{item.price_per_night}/malam</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEdit(item)} style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>Padam</button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setIsLoggedIn(false)} style={{ marginTop: '40px', width: '100%', background: 'none', border: 'none', color: '#94a3b8' }}>Logout Admin</button>
      </div>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '10px', boxSizing: 'border-box' as 'border-box' }
const btnStyle = { backgroundColor: '#2563eb', color: '#fff', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold' as 'bold', cursor: 'pointer' }

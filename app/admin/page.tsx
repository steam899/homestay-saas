'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  
  // State untuk form
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  // Fungsi Login Ringkas
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Kita panggil password dari Env Variable (melalui API/System) 
    // Untuk MVP ini, kita buat check mudah:
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsLoggedIn(true)
    } else {
      alert('Password Salah!')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('properties')
      .insert([{ name, location, price_per_night: parseFloat(price), image_url: imageUrl }])

    setLoading(false)
    if (error) alert(error.message)
    else {
      alert('Homestay berjaya ditambah!')
      setName(''); setLocation(''); setPrice(''); setImageUrl('')
      router.push('/')
    }
  }

  // Paparan Login jika belum masuk
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Login 🔐</h2>
          <input 
            type="password" 
            placeholder="Masukkan Password Admin" 
            style={inputStyle} 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button type="submit" style={{ ...btnStyle, width: '100%', marginTop: '15px' }}>Masuk Dashboard</button>
        </form>
      </div>
    )
  }

  // Paparan Borang jika sudah Login
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', padding: '30px 20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '10px' }}>Dashboard Admin ⚙️</h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Selamat datang, Owner!</p>

        <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input type="text" placeholder="Nama Homestay" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="text" placeholder="Lokasi" style={inputStyle} value={location} onChange={(e) => setLocation(e.target.value)} required />
          <input type="number" placeholder="Harga / Malam (RM)" style={inputStyle} value={price} onChange={(e) => setPrice(e.target.value)} required />
          <input type="text" placeholder="URL Gambar (Link)" style={inputStyle} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Menyimpan...' : 'Tambah Homestay'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => setIsLoggedIn(false)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', boxSizing: 'border-box' as 'border-box' }
const btnStyle = { backgroundColor: '#2563eb', color: '#fff', padding: '15px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold' as 'bold', cursor: 'pointer' }

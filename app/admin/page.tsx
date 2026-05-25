'use client'
import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simpan data ke Supabase
    const { error } = await supabase
      .from('properties')
      .insert([
        { 
          name, 
          location, 
          price_per_night: parseFloat(price), 
          image_url: imageUrl 
        }
      ])

    setLoading(false)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Berjaya! Homestay anda telah ditambah.')
      // Reset form
      setName('')
      setLocation('')
      setPrice('')
      setImageUrl('')
      // Balik ke laman utama
      router.push('/')
    }
  }

  return (
    <div style={{ 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh', 
      fontFamily: 'sans-serif',
      padding: '30px 20px' 
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '10px' }}>Dashboard Admin ⚙️</h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Masukkan maklumat homestay baru anda di bawah.</p>

        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: '#fff', 
          padding: '25px', 
          borderRadius: '20px', 
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          
          <div>
            <label style={labelStyle}>Nama Homestay</label>
            <input 
              type="text" 
              placeholder="Contoh: Homestay Idaman Melaka" 
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Lokasi</label>
            <input 
              type="text" 
              placeholder="Contoh: Klebang, Melaka" 
              style={inputStyle}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Harga / Malam (RM)</label>
            <input 
              type="number" 
              placeholder="Contoh: 250" 
              style={inputStyle}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>URL Gambar (Link)</label>
            <input 
              type="text" 
              placeholder="Paste link gambar di sini" 
              style={inputStyle}
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '5px' }}>
              *Cari gambar di Google, 'Right Click' dan pilih 'Copy Image Address'.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              backgroundColor: '#2563eb', 
              color: '#fff', 
              padding: '15px', 
              borderRadius: '12px', 
              border: 'none', 
              fontSize: '16px', 
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: '0.2s'
            }}
          >
            {loading ? 'Sedang Menyimpan...' : 'Tambah Homestay Sekarang'}
          </button>

        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>
            ← Batal & Kembali ke Laman Utama
          </a>
        </div>

      </div>
    </div>
  )
}

// Style Helper
const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#475569',
  marginBottom: '8px'
}

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  fontSize: '16px',
  outline: 'none',
  boxSizing: 'border-box' as 'border-box'
}

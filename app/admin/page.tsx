'use client'
import { useState } from 'react'
import { supabase } from '@/utils/supabase'

export default function AdminPage() {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('properties')
      .insert([{ name, location, price_per_night: parseFloat(price) }])

    setLoading(false)
    if (error) alert(error.message)
    else {
      alert('Homestay berjaya ditambah!')
      setName(''); setLocation(''); setPrice('')
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Admin: Tambah Homestay</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nama Homestay</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
            required 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Lokasi</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
            required 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Harga / Malam (RM)</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            backgroundColor: '#2563eb', 
            color: 'white', 
            padding: '15px', 
            borderRadius: '10px', 
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          {loading ? 'Sabar, tengah simpan...' : 'Simpan Homestay'}
        </button>
      </form>

      <div style={{ marginTop: '30px' }}>
        <a href="/" style={{ color: '#666', textDecoration: 'none' }}>← Kembali ke Muka Depan</a>
      </div>
    </div>
  )
}

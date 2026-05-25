'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function CustomerBooking() {
  const { id } = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  useEffect(() => {
    const fetchProp = async () => {
      const { data } = await supabase.from('properties').select('*').eq('id', id).single()
      setProperty(data)
    }
    fetchProp()
  }, [id])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Kira total harga (simple logic)
    const days = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)
    const total = (days > 0 ? days : 1) * property.price_per_night

    const { error } = await supabase.from('bookings').insert([{
      property_id: id,
      customer_name: name,
      phone_number: phone,
      check_in: checkIn,
      check_out: checkOut,
      total_price: total,
      payment_status: 'Belum Bayar'
    }])

    if (error) {
      alert('Ralat: ' + error.message)
    } else {
      const msg = `Hi, saya ${name}. Saya baru saja isi borang booking untuk ${property.name}.\nTarikh: ${checkIn} - ${checkOut}.\nTotal: RM${total}`
      window.location.href = `https://wa.me/60123456789?text=${encodeURIComponent(msg)}`
    }
  }

  if (!property) return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#1e40af' }}>Tempahan {property.name}</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Sila isi butiran di bawah untuk menempah.</p>
        
        <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input placeholder="Nama Penuh" style={inputS} value={name} onChange={(e) => setName(e.target.value)} required />
          <input placeholder="No Phone (WhatsApp)" style={inputS} value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <div>
            <label style={{fontSize: '12px'}}>Check-in</label>
            <input type="date" style={inputS} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
          </div>
          <div>
            <label style={{fontSize: '12px'}}>Check-out</label>
            <input type="date" style={inputS} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
          </div>
          
          <button type="submit" style={{ ...btnS, backgroundColor: '#22c55e' }}>Confirm & WhatsApp Owner</button>
        </form>
      </div>
    </div>
  )
}

const inputS = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' as 'border-box' }
const btnS = { padding: '15px', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' as 'bold', fontSize: '16px' }

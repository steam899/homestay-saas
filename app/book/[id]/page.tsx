'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useParams } from 'next/navigation'

export default function BookPage() {
  const { id } = useParams(); const [prop, setProp] = useState<any>(null)
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [inD, setInD] = useState(''); const [outD, setOutD] = useState('')

  useEffect(() => {
    supabase.from('properties').select('*').eq('id', id).single().then(({ data }) => setProp(data))
  }, [id])

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    const days = (new Date(outD).getTime() - new Date(inD).getTime()) / (1000 * 3600 * 24)
    const total = (days > 0 ? days : 1) * prop.price_per_night
    
    const { error } = await supabase.from('bookings').insert([{ property_id: id, customer_name: name, phone_number: phone, check_in: inD, check_out: outD, total_price: total }])
    
    if (!error) {
      window.location.href = `https://wa.me/60123456789?text=Saya%20nak%20book%20${prop.name}%20tarikh%20${inD}%20hingga%20${outD}`
    }
  }

  if (!prop) return <p>Loading...</p>

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <a href="/" style={{ textDecoration: 'none', color: '#64748b' }}>← Kembali</a>
      <h2 style={{ marginTop: '20px' }}>Tempah {prop.name}</h2>
      <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input placeholder="Nama Penuh" style={inputS} value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="WhatsApp (601...)" style={inputS} value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type="date" style={inputS} value={inD} onChange={(e) => setInD(e.target.value)} required />
        <input type="date" style={inputS} value={outD} onChange={(e) => setOutD(e.target.value)} required />
        <button style={{ ...btnS, backgroundColor: '#22c55e' }}>Confirm & WhatsApp</button>
      </form>
    </div>
  )
}
const inputS = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' as 'border-box' }
const btnS = { width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' as 'bold' }

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function BookPage() {
  const { id } = useParams(); const router = useRouter()
  const [prop, setProp] = useState<any>(null)
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [inD, setInD] = useState(''); const [outD, setOutD] = useState('')

  useEffect(() => {
    supabase.from('properties').select('*').eq('id', id).single().then(({ data }) => setProp(data))
  }, [id])

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    const days = (new Date(outD).getTime() - new Date(inD).getTime()) / (1000 * 3600 * 24)
    const total = (days > 0 ? days : 1) * prop.price_per_night
    await supabase.from('bookings').insert([{ property_id: id, customer_name: name, phone_number: phone, check_in: inD, check_out: outD, total_price: total }])
    window.location.href = `https://wa.me/60123456789?text=Booking%20${prop.name}%20(${inD}%20to%20${outD})`
  }

  if (!prop) return <p style={{ textAlign: 'center', padding: '50px' }}>Loading...</p>

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <button onClick={() => router.back()} style={{ border: 'none', background: 'none', color: '#64748b', marginBottom: '20px', cursor: 'pointer' }}>← Kembali</button>
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Tempah {prop.name}</h2>
        <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input placeholder="Nama Penuh" style={inputS} value={name} onChange={(e) => setName(e.target.value)} required />
          <input placeholder="WhatsApp (cth: 60123456789)" style={inputS} value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <div style={{ display: 'flex', gap: '10px' }}>
             <div style={{ flex: 1 }}><label style={{ fontSize: '12px' }}>In</label><input type="date" style={inputS} value={inD} onChange={(e) => setInD(e.target.value)} required /></div>
             <div style={{ flex: 1 }}><label style={{ fontSize: '12px' }}>Out</label><input type="date" style={inputS} value={outD} onChange={(e) => setOutD(e.target.value)} required /></div>
          </div>
          <button style={{ ...btnS, backgroundColor: '#22c55e' }}>Confirm & WhatsApp</button>
        </form>
      </div>
    </div>
  )
}
const inputS = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', boxSizing: 'border-box' as 'border-box', fontSize: '16px' }
const btnS = { width: '100%', padding: '16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 'bold' as 'bold', fontSize: '16px' }

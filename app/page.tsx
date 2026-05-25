export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'sans-serif' 
    }}>
      <h1 style={{ color: '#2563eb' }}>Homestay Saas Live!</h1>
      <p>Tahniah! Sistem anda sudah mula berfungsi.</p>
      <button style={{ 
        padding: '10px 20px', 
        backgroundColor: '#2563eb', 
        color: 'white', 
        border: 'none', 
        borderRadius: '8px' 
      }}>
        Check Availability
      </button>
    </div>
  );
}

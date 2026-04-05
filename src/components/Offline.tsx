function Offline() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1>🔌 Modo Offline</h1>
      <p>Por favor verifique sua conexão.</p>
      <p>Algumas funcionalidades ainda estão disponiveis online!</p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Try Again
      </button>
    </div>
  );
}

export default Offline;
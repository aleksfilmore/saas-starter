export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1>404: Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <a href="/" style={{ 
        padding: '10px 20px', 
        backgroundColor: '#6366f1', 
        color: 'white', 
        textDecoration: 'none',
        borderRadius: '6px'
      }}>
        Go Home
      </a>
    </div>
  );
}
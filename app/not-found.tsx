export default function NotFound() {
  return (
    <html>
      <head>
        <title>404 - Page Not Found</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#0f0f23',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>404: Page Not Found</h1>
        <p style={{ margin: 0, color: '#9ca3af' }}>The page you are looking for doesn't exist.</p>
        <a 
          href="/" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6366f1', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Go Home
        </a>
      </body>
    </html>
  );
}
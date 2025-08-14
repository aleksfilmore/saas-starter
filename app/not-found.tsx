import React from 'react';

function NotFound() {
  return React.createElement('div', {
    style: { 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#0f0f23',
      color: '#ffffff'
    }
  }, [
    React.createElement('h1', { key: 'title', style: { fontSize: '2rem', margin: 0 } }, '404: Page Not Found'),
    React.createElement('p', { key: 'desc', style: { margin: 0, color: '#9ca3af' } }, 'The page you are looking for doesn\'t exist.'),
    React.createElement('a', { 
      key: 'link',
      href: '/', 
      style: { 
        padding: '10px 20px', 
        backgroundColor: '#6366f1', 
        color: 'white', 
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500'
      }
    }, 'Go Home')
  ]);
}

export default NotFound;
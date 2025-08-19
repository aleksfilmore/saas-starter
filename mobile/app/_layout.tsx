import React from 'react';

export default function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#080F20', 
      color: '#F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ color: '#8B5FE6', marginBottom: '1rem' }}>
          🚀 Healing Journey Mobile App
        </h1>
        <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
          React Native app is ready for development!
        </p>
        <div style={{ 
          backgroundColor: '#1F2937', 
          padding: '1.5rem', 
          borderRadius: '12px',
          border: '1px solid #374151'
        }}>
          <h2 style={{ color: '#00FF88', marginBottom: '1rem' }}>Next Steps:</h2>
          <ol style={{ textAlign: 'left', lineHeight: '1.6' }}>
            <li>Install mobile dependencies: <code>cd mobile && npm install</code></li>
            <li>Install Expo CLI: <code>npm install -g @expo/cli</code></li>
            <li>Start development: <code>expo start</code></li>
            <li>Scan QR code with Expo Go app</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

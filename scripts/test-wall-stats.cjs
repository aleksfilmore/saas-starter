#!/usr/bin/env node
// Simple test hitting /api/wall/stats assuming dev server running on localhost:3001
(async () => {
  try {
    const res = await fetch('http://localhost:3001/api/wall/stats');
    const json = await res.json();
    console.log('Status code:', res.status);
    console.log('Wall stats response:', json);
  } catch (e) {
    console.error('Request failed:', e.message);
    process.exit(1);
  }
})();

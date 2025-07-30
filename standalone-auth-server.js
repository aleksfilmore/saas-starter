// Standalone authentication server to bypass Next.js bundler issues
const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Simple in-memory storage
const users = new Map();

// Helper function to parse request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        // Handle both JSON and form data
        if (req.headers['content-type']?.includes('application/json')) {
          resolve(JSON.parse(body));
        } else {
          resolve(querystring.parse(body));
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

// CORS headers
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

const server = http.createServer(async (req, res) => {
  setCORSHeaders(res);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  console.log(`[${new Date().toISOString()}] ${req.method} ${path}`);

  try {
    if (path === '/api/test' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'working', 
        message: 'Standalone auth server is running',
        timestamp: new Date().toISOString()
      }));
      
    } else if (path === '/api/signup' && req.method === 'POST') {
      const data = await parseBody(req);
      const { email, password } = data;
      
      // Validation
      if (!email || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Email and password are required', success: false }));
        return;
      }
      
      if (password.length < 6) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Password must be at least 6 characters', success: false }));
        return;
      }
      
      // Check if user exists
      if (users.has(email.toLowerCase())) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User already exists', success: false }));
        return;
      }
      
      // Create user (in production, hash the password)
      users.set(email.toLowerCase(), {
        email: email.toLowerCase(),
        password: password, // In production: hash this
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      });
      
      console.log('User registered:', email);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: true, 
        message: 'User registered successfully',
        data: { email: email.toLowerCase() }
      }));
      
    } else if (path === '/api/login' && req.method === 'POST') {
      const data = await parseBody(req);
      const { email, password } = data;
      
      // Validation
      if (!email || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Email and password are required', success: false }));
        return;
      }
      
      // Find user
      const user = users.get(email.toLowerCase());
      if (!user || user.password !== password) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid email or password', success: false }));
        return;
      }
      
      console.log('User logged in:', email);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Login successful',
        data: { email: user.email, userId: user.id }
      }));
      
    } else if (path === '/api/users' && req.method === 'GET') {
      // Debug endpoint to see registered users
      const userList = Array.from(users.values()).map(u => ({
        id: u.id,
        email: u.email,
        createdAt: u.createdAt
      }));
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ users: userList, count: userList.length }));
      
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
    
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`🚀 Standalone auth server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/test    - Test endpoint');
  console.log('  POST /api/signup  - User registration');
  console.log('  POST /api/login   - User login');
  console.log('  GET  /api/users   - List users (debug)');
});

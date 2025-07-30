// Test creating a user to verify authentication is working
console.log('Starting authentication test...');

async function testSignup() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'TestPassword123!'
      })
    });

    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response body:', result);

    if (response.ok) {
      console.log('✅ Signup successful!');
    } else {
      console.log('❌ Signup failed');
    }
  } catch (error) {
    console.error('❌ Error testing signup:', error);
  }
}

testSignup();

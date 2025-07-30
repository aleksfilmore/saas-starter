const testSignup = async () => {
  try {
    // Test with a simple email that's unlikely to exist
    const testEmail = `test-${Date.now()}@example.com`;
    const response = await fetch('http://localhost:3000/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: testEmail,
        password: 'TestPassword123',
        acceptTerms: 'on',
        acceptPrivacy: 'on'
      }),
      redirect: 'manual' // Don't follow redirects
    });

    console.log('Signup response status:', response.status);
    console.log('Signup response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 302) {
      console.log('Redirect location:', response.headers.get('location'));
      console.log('Signup successful - redirected');
    } else {
      const text = await response.text();
      console.log('Response body:', text.substring(0, 500));
    }

  } catch (error) {
    console.error('Signup error:', error);
  }
};

testSignup();

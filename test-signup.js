const testSignup = async () => {
  try {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'TestPassword123');
    formData.append('acceptTerms', 'on');
    formData.append('acceptPrivacy', 'on');

    console.log('Attempting signup...');
    const response = await fetch('http://localhost:3000/sign-up', {
      method: 'POST',
      body: formData
    });

    console.log('Signup response status:', response.status);
    console.log('Signup response headers:', [...response.headers.entries()]);
    
    if (response.redirected) {
      console.log('Redirected to:', response.url);
    }

    const text = await response.text();
    console.log('Response body length:', text.length);
    console.log('Response body preview:', text.substring(0, 200));

  } catch (error) {
    console.error('Signup error:', error);
  }
};

testSignup();

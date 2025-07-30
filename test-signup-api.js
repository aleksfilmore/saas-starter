// Test signup API
const testSignup = async () => {
  try {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'Test123456');
    formData.append('acceptTerms', 'on');
    formData.append('acceptPrivacy', 'on');

    console.log('Testing signup API...');
    const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      body: formData
    });

    console.log('Status:', response.status);
    const result = await response.json();
    console.log('Result:', result);

  } catch (error) {
    console.error('Test error:', error);
  }
};

testSignup();

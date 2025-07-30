console.log('Checking for existing users and sessions...');

fetch('http://localhost:3000/api/test-user-id')
  .then(response => response.json())
  .then(data => {
    console.log('Test endpoint response:', JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('Error:', error);
  });

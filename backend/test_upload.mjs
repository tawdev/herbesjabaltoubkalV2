import { readFileSync } from 'fs';

async function test() {
  // Step 1: Login
  console.log('Step 1: Logging in...');
  const loginRes = await fetch('http://127.0.0.1:3001/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  
  console.log('Login status:', loginRes.status);
  if (!loginRes.ok) {
    const err = await loginRes.text();
    console.error('Login failed:', err);
    return;
  }

  const loginData = await loginRes.json();
  const token = loginData.access_token;
  console.log('Got token:', token ? `${token.substring(0, 20)}...` : 'NONE');

  // Step 2: Upload test image
  console.log('\nStep 2: Testing upload...');
  const formData = new FormData();
  // Use a blob to simulate a file
  const fakeImage = new Blob(['fake image content'], { type: 'image/jpeg' });
  formData.append('file', fakeImage, 'test.jpg');

  const uploadRes = await fetch('http://127.0.0.1:3001/uploads/blog', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  console.log('Upload status:', uploadRes.status);
  const uploadData = await uploadRes.text();
  console.log('Upload response:', uploadData);
}

test().catch(console.error);

async function test() {
  try {
    // 1. Login
    console.log('Logging in...');
    // Try /auth/login first since we suspect no global prefix
    const loginRes = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ahmed@voix.com',
        password: 'ahmed68459845'
      })
    });
    
    if (!loginRes.ok) {
        throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.accessToken;
    console.log('Got token:', token.substring(0, 20) + '...');

    // 2. Trigger Snapshot
    console.log('Triggering snapshot...');
    const snapRes = await fetch('http://localhost:3000/admin/dataset/snapshot', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ name: 'debug_script_snapshot' })
    });

    if (!snapRes.ok) {
        const text = await snapRes.text();
        console.log(`Snapshot failed with status ${snapRes.status}`);
        console.log(`Response body: ${text}`);
        throw new Error(`Snapshot failed`);
    }

    const snapData = await snapRes.json();
    console.log('Snapshot created:', snapData);
  } catch (error) {
    console.error('Test Script Error:', error);
  }
}

test();


async function probe() {
  const paths = [
    '/',
    '/api',
    '/health',
    '/api/health',
    '/auth/login',
    '/api/auth/login',
    '/admin/dataset/snapshot',
    '/api/admin/dataset/snapshot'
  ];

  for (const p of paths) {
    try {
      const res = await fetch(`http://localhost:3000${p}`, { method: 'GET' }); // Login will be 404/405/401
      console.log(`${p} -> ${res.status}`);
    } catch (e) {
      console.log(`${p} -> Error: ${e.message}`);
    }
  }
}

probe();

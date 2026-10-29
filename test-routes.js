const http = require('http');

const routes = [
  '/',
  '/how-it-works',
  '/technology',
  '/technology/stress',
  '/technology/chf',
  '/technology/baseline',
  '/research',
  '/team',
  '/login',
  '/register',
  '/farmer/dashboard',
  '/farmer/farms',
  '/farmer/farms/farm-plot-204',
  '/farmer/disease',
  '/farmer/optimization',
  '/farmer/alerts',
  '/farmer/insurance',
  '/farmer/insurance/apply',
  '/farmer/payments',
  '/insurer/dashboard',
  '/insurer/risk-map',
  '/insurer/claims',
  '/insurer/claims/claim-clm-084',
  '/insurer/policies',
  '/insurer/payouts',
  '/insurer/audit',
  '/operations/iot',
  '/intelligence/map',
  '/intelligence/weather',
  '/admin/overview',
  '/admin/ai-models',
  '/admin/exceptions',
  '/api/farms',
  '/api/farms/farm-plot-204',
  '/api/farms/farm-plot-204/chf',
  '/api/farms/farm-plot-204/satellite',
  '/api/farms/farm-plot-204/weather',
  '/api/farms/farm-plot-204/sensors',
  '/api/farms/farm-plot-204/alerts',
  '/api/farms/farm-plot-204/interventions',
  '/api/claims',
  '/api/claims/claim-clm-084',
  '/api/payouts',
  '/api/insurance-units',
  '/api/insurance-units/iu-nadia-01/risk',
  '/api/iot/devices',
  '/api/iot/tick',
  '/api/auth/me',
];

function login(role) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ role, identifier: 'admin@agrisure.in' });
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      }
    }, (res) => {
      const cookieHeader = res.headers['set-cookie'];
      const cookie = cookieHeader ? cookieHeader[0].split(';')[0] : '';
      resolve(cookie);
    });
    req.on('error', () => resolve(''));
    req.write(data);
    req.end();
  });
}

function checkRoute(route, cookie = '') {
  return new Promise((resolve) => {
    const headers = {};
    if (cookie) headers['Cookie'] = cookie;

    http.get({
      hostname: 'localhost',
      port: 3000,
      path: route,
      headers
    }, (res) => {
      resolve({ route, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ route, status: 'ERROR', error: err.message });
    });
  });
}

async function run() {
  console.log('Testing AgriSure Intelligence Routes with Session Authentication...\n');
  
  // Obtain admin JWT session cookie so all routes (farmer, insurer, admin) are accessible
  const sessionCookie = await login('ADMIN');
  console.log('Logged in as ADMIN. Session cookie acquired.\n');

  let passed = 0;
  for (const r of routes) {
    const result = await checkRoute(r, sessionCookie);
    const ok = result.status === 200;
    if (ok) passed++;
    console.log(`${ok ? '✓' : '✗'} ${result.route.padEnd(45)} -> Status ${result.status}`);
  }
  console.log(`\nResults: ${passed} / ${routes.length} routes responded with 200 OK.`);
}

run();

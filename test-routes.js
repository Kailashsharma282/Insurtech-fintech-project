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
  '/farmer/dashboard',
  '/farmer/farms',
  '/farmer/farms/farm-plot-204',
  '/farmer/disease',
  '/farmer/optimization',
  '/farmer/alerts',
  '/farmer/insurance',
  '/farmer/payments',
  '/insurer/dashboard',
  '/insurer/risk-map',
  '/insurer/claims',
  '/insurer/claims/claim-clm-084',
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
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${route}`, (res) => {
      resolve({ route, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ route, status: 'ERROR', error: err.message });
    });
  });
}

async function run() {
  console.log('Testing all AgriSure Intelligence routes on http://localhost:3000...\n');
  let passed = 0;
  for (const r of routes) {
    const result = await checkRoute(r);
    const ok = result.status === 200;
    if (ok) passed++;
    console.log(`${ok ? '✓' : '✗'} ${result.route.padEnd(45)} -> Status ${result.status}`);
  }
  console.log(`\nResults: ${passed} / ${routes.length} routes responded with 200 OK.`);
}

run();

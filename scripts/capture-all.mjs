import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve('screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGES = [
  ['01_home', 'http://localhost:3000/'],
  ['02_farmer_dashboard', 'http://localhost:3000/farmer/dashboard'],
  ['03_farmer_validation', 'http://localhost:3000/farmer/insurance-validation'],
  ['04_farmer_disease', 'http://localhost:3000/farmer/disease'],
  ['05_farmer_farms', 'http://localhost:3000/farmer/farms'],
  ['06_farmer_farm_detail', 'http://localhost:3000/farmer/farms/farm-plot-204'],
  ['07_farmer_insurance', 'http://localhost:3000/farmer/insurance'],
  ['08_farmer_optimization', 'http://localhost:3000/farmer/optimization'],
  ['09_technology_chf', 'http://localhost:3000/technology/chf'],
  ['10_insurer_dashboard', 'http://localhost:3000/insurer/dashboard'],
  ['11_insurer_claims', 'http://localhost:3000/insurer/claims'],
  ['12_insurer_claim_detail', 'http://localhost:3000/insurer/claims/claim-clm-084'],
  ['13_insurer_payouts', 'http://localhost:3000/insurer/payouts'],
  ['14_intelligence_weather', 'http://localhost:3000/intelligence/weather'],
  ['15_operations_iot', 'http://localhost:3000/operations/iot'],
  ['16_admin_overview', 'http://localhost:3000/admin/overview'],
  ['17_team', 'http://localhost:3000/team'],
];

async function captureAll() {
  const proc = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9222',
    'about:blank'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const tabsRes = await fetch('http://localhost:9222/json');
    const tabs = await tabsRes.json();
    const wsUrl = tabs[0]?.webSocketDebuggerUrl;
    if (!wsUrl) throw new Error('No WebSocket debugger URL found');

    const ws = new WebSocket(wsUrl);
    await new Promise(resolve => ws.onopen = resolve);

    let id = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const curId = id++;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === curId) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Page.enable');

    for (const [name, url] of PAGES) {
      // 1. Laptop view (1280x800)
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1280,
        height: 800,
        deviceScaleFactor: 1,
        mobile: false
      });
      await send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 1200));
      const shotLaptop = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUT_DIR, `${name}_laptop.png`), Buffer.from(shotLaptop.data, 'base64'));

      // 2. Mobile view (390x844)
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
      });
      await send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 1200));
      const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUT_DIR, `${name}_mobile.png`), Buffer.from(shotMobile.data, 'base64'));

      console.log(`[CAPTURED] ${name} (Laptop & Mobile)`);
    }

    ws.close();
    console.log('ALL 34 SCREENSHOTS SUCCESSFULLY CAPTURED VIA TRUE CDP DEVICE EMULATION.');
  } finally {
    proc.kill();
  }
}

captureAll();


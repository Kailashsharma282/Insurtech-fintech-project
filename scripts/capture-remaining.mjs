import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve('screenshots');

const REMAINING_PAGES = [
  ['02_farmer_dashboard', 'http://localhost:3000/farmer/dashboard'],
  ['04_farmer_disease', 'http://localhost:3000/farmer/disease'],
  ['06_farmer_farm_detail', 'http://localhost:3000/farmer/farms/farm-plot-204'],
  ['08_farmer_optimization', 'http://localhost:3000/farmer/optimization'],
  ['10_insurer_dashboard', 'http://localhost:3000/insurer/dashboard'],
  ['11_insurer_claims', 'http://localhost:3000/insurer/claims'],
  ['13_insurer_payouts', 'http://localhost:3000/insurer/payouts'],
  ['15_operations_iot', 'http://localhost:3000/operations/iot'],
  ['16_admin_overview', 'http://localhost:3000/admin/overview'],
];

async function captureOne(url, outLaptop, outMobile, port) {
  return new Promise((resolve) => {
    const proc = spawn(CHROME, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--remote-debugging-port=${port}`,
      url
    ]);

    const timer = setTimeout(() => {
      try { proc.kill(); } catch (e) {}
      resolve(false);
    }, 10000);

    (async () => {
      try {
        await new Promise(r => setTimeout(r, 1500));
        const res = await fetch(`http://localhost:${port}/json`);
        const tabs = await res.json();
        const tab = tabs.find(t => t.url.includes('localhost:3000')) || tabs[0];
        if (!tab?.webSocketDebuggerUrl) throw new Error('No ws url');

        const ws = new WebSocket(tab.webSocketDebuggerUrl);
        await new Promise(r => ws.onopen = r);

        let curId = 1;
        const send = (method, params = {}) => new Promise(res => {
          const id = curId++;
          const onMsg = (e) => {
            const data = JSON.parse(e.data);
            if (data.id === id) {
              ws.removeEventListener('message', onMsg);
              res(data.result);
            }
          };
          ws.addEventListener('message', onMsg);
          ws.send(JSON.stringify({ id, method, params }));
        });

        // 1. Laptop (1280x800)
        await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
        await new Promise(r => setTimeout(r, 500));
        const shotLap = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(outLaptop, Buffer.from(shotLap.data, 'base64'));

        // 2. Mobile (390x844)
        await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
        await new Promise(r => setTimeout(r, 500));
        const shotMob = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(outMobile, Buffer.from(shotMob.data, 'base64'));

        ws.close();
        clearTimeout(timer);
        try { proc.kill(); } catch (e) {}
        resolve(true);
      } catch (err) {
        clearTimeout(timer);
        try { proc.kill(); } catch (e) {}
        resolve(false);
      }
    })();
  });
}

async function run() {
  let port = 9300;
  for (const [name, url] of REMAINING_PAGES) {
    port++;
    const lapPath = path.join(OUT_DIR, `${name}_laptop.png`);
    const mobPath = path.join(OUT_DIR, `${name}_mobile.png`);
    const ok = await captureOne(url, lapPath, mobPath, port);
    console.log(`[STATUS] ${name}: ${ok ? 'SUCCESS' : 'FAILED'}`);
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('REMAINING COMPLETE');
}

run();

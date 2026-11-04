import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve('screenshots/audit_final');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const TARGETS = [
  { name: 'insurer_claims', url: 'http://localhost:3000/insurer/claims' },
  { name: 'insurer_payouts', url: 'http://localhost:3000/insurer/payouts' },
  { name: 'technology_chf', url: 'http://localhost:3000/technology/chf' },
  { name: 'farmer_dashboard', url: 'http://localhost:3000/farmer/dashboard' },
  { name: 'admin_overview', url: 'http://localhost:3000/admin/overview' },
  { name: 'cadastral_map', url: 'http://localhost:3000/insurer/risk-map' },
];

async function captureTarget(t, port) {
  return new Promise((resolve) => {
    const proc = spawn(CHROME, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--remote-debugging-port=${port}`,
      t.url,
    ]);

    const timer = setTimeout(() => {
      try { proc.kill(); } catch (e) {}
      resolve(false);
    }, 22000);

    (async () => {
      try {
        await new Promise(r => setTimeout(r, 2500));
        const res = await fetch(`http://localhost:${port}/json`);
        const tabs = await res.json();
        const tab = tabs.find(tab => tab.url.includes('localhost:3000')) || tabs[0];
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

        // 1. Laptop Light Mode (1280x850)
        await send('Emulation.setDeviceMetricsOverride', {
          width: 1280,
          height: 850,
          deviceScaleFactor: 1,
          mobile: false,
        });
        await new Promise(r => setTimeout(r, 600));
        let shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(OUT_DIR, `${t.name}_laptop_light.png`), Buffer.from(shot.data, 'base64'));

        // 2. Laptop Dark Mode (1280x850)
        await send('Runtime.evaluate', {
          expression: 'document.documentElement.classList.add("dark"); document.documentElement.setAttribute("data-theme", "dark");',
        });
        await new Promise(r => setTimeout(r, 400));
        shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(OUT_DIR, `${t.name}_laptop_dark.png`), Buffer.from(shot.data, 'base64'));

        // 3. Mobile Dark Mode (390x844)
        await send('Emulation.setDeviceMetricsOverride', {
          width: 390,
          height: 844,
          deviceScaleFactor: 2,
          mobile: true,
        });
        await new Promise(r => setTimeout(r, 500));
        shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(OUT_DIR, `${t.name}_mobile_dark.png`), Buffer.from(shot.data, 'base64'));

        // 4. Mobile Light Mode (390x844)
        await send('Runtime.evaluate', {
          expression: 'document.documentElement.classList.remove("dark"); document.documentElement.setAttribute("data-theme", "light");',
        });
        await new Promise(r => setTimeout(r, 400));
        shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(OUT_DIR, `${t.name}_mobile_light.png`), Buffer.from(shot.data, 'base64'));

        console.log(`✓ Captured ${t.name} (Laptop Light/Dark + Mobile Light/Dark)`);
        ws.close();
        proc.kill();
        clearTimeout(timer);
        resolve(true);
      } catch (err) {
        console.error(`Error capturing ${t.name}:`, err.message);
        try { proc.kill(); } catch (e) {}
        clearTimeout(timer);
        resolve(false);
      }
    })();
  });
}

async function main() {
  console.log('Starting comprehensive UI Audit captures...');
  let port = 9320;
  for (const t of TARGETS) {
    await captureTarget(t, port++);
    await new Promise(r => setTimeout(r, 600));
  }
  console.log('All audit captures completed. Files stored in:', OUT_DIR);
}

main();

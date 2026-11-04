import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve('screenshots/full_inspection');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGES = [
  { name: '01_farmer_dashboard', url: 'http://localhost:3000/farmer/dashboard', role: 'FARMER' },
  { name: '02_farmer_farms', url: 'http://localhost:3000/farmer/farms', role: 'FARMER' },
  { name: '03_farmer_disease', url: 'http://localhost:3000/farmer/disease', role: 'FARMER' },
  { name: '04_farmer_insurance', url: 'http://localhost:3000/farmer/insurance', role: 'FARMER' },
  { name: '05_farmer_validation', url: 'http://localhost:3000/farmer/insurance-validation', role: 'FARMER' },
  { name: '06_farmer_payments', url: 'http://localhost:3000/farmer/payments', role: 'FARMER' },
  { name: '07_intelligence_map', url: 'http://localhost:3000/intelligence/map', role: 'FARMER' },
  { name: '08_intelligence_weather', url: 'http://localhost:3000/intelligence/weather', role: 'FARMER' },
  { name: '09_insurer_dashboard', url: 'http://localhost:3000/insurer/dashboard', role: 'INSURER' },
  { name: '10_insurer_claims', url: 'http://localhost:3000/insurer/claims', role: 'INSURER' },
  { name: '11_insurer_policies', url: 'http://localhost:3000/insurer/policies', role: 'INSURER' },
  { name: '12_insurer_payouts', url: 'http://localhost:3000/insurer/payouts', role: 'INSURER' },
  { name: '13_admin_overview', url: 'http://localhost:3000/admin/overview', role: 'ADMIN' },
  { name: '14_admin_iot', url: 'http://localhost:3000/operations/iot', role: 'ADMIN' },
  { name: '15_technology_chf', url: 'http://localhost:3000/technology/chf', role: 'FARMER' },
];

async function captureOne(p, port) {
  return new Promise((resolve) => {
    const proc = spawn(CHROME, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--remote-debugging-port=${port}`,
      p.url,
    ]);

    const timer = setTimeout(() => {
      try { proc.kill(); } catch (e) {}
      resolve({ name: p.name, success: false });
    }, 25000);

    (async () => {
      try {
        await new Promise(r => setTimeout(r, 2000));
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

        // Set Laptop viewport 1280x900
        await send('Emulation.setDeviceMetricsOverride', {
          width: 1280,
          height: 900,
          deviceScaleFactor: 1,
          mobile: false,
        });

        // Set Persona Role
        await send('Runtime.evaluate', {
          expression: `
            localStorage.setItem('agrisure_user_role', '${p.role}');
          `,
        });

        // 1. LIGHT MODE
        await send('Runtime.evaluate', {
          expression: `
            localStorage.setItem('agrisure_theme', 'light');
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
          `,
        });
        await new Promise(r => setTimeout(r, 600));

        const lightOverflow = await send('Runtime.evaluate', {
          expression: `({
            docScroll: document.documentElement.scrollWidth,
            docClient: document.documentElement.clientWidth,
            hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
          })`,
          returnByValue: true
        });

        let shotLight = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(OUT_DIR, `${p.name}_light.png`), Buffer.from(shotLight.data, 'base64'));

        // 2. DARK MODE
        await send('Runtime.evaluate', {
          expression: `
            localStorage.setItem('agrisure_theme', 'dark');
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
          `,
        });
        await new Promise(r => setTimeout(r, 600));

        let shotDark = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(OUT_DIR, `${p.name}_dark.png`), Buffer.from(shotDark.data, 'base64'));

        console.log(`[OK] ${p.name} | Overflow: ${lightOverflow?.result?.value?.hasOverflow ? 'YES (BAD)' : 'NO (PERFECT)'}`);
        ws.close();
        proc.kill();
        clearTimeout(timer);
        resolve({ name: p.name, success: true, overflow: lightOverflow?.result?.value?.hasOverflow });
      } catch (err) {
        console.error(`[ERR] ${p.name}:`, err.message);
        try { proc.kill(); } catch (e) {}
        clearTimeout(timer);
        resolve({ name: p.name, success: false });
      }
    })();
  });
}

async function runAudit() {
  console.log('=== STARTING RE-AUDIT OF ALL PAGES (LIGHT + DARK) ===');
  let port = 9600;
  for (const page of PAGES) {
    await captureOne(page, port++);
    await new Promise(r => setTimeout(r, 400));
  }
  console.log('=== AUDIT COMPLETE ===');
}

runAudit();

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve('screenshots/audit_final');

async function captureFixedInsurance() {
  const port = 9420;
  const proc = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    'http://localhost:3000/farmer/insurance',
  ]);

  await new Promise(r => setTimeout(r, 2500));
  const res = await fetch(`http://localhost:${port}/json`);
  const tabs = await res.json();
  const tab = tabs.find(tab => tab.url.includes('localhost:3000')) || tabs[0];

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

  // 1. Laptop Light Mode
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await new Promise(r => setTimeout(r, 800));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT_DIR, 'farmer_insurance_fixed_light.png'), Buffer.from(shot.data, 'base64'));

  // 2. Laptop Dark Mode
  await send('Runtime.evaluate', {
    expression: 'document.documentElement.classList.add("dark"); document.documentElement.setAttribute("data-theme", "dark");',
  });
  await new Promise(r => setTimeout(r, 500));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT_DIR, 'farmer_insurance_fixed_dark.png'), Buffer.from(shot.data, 'base64'));

  console.log('✓ Captured farmer_insurance_fixed_light.png and _dark.png');
  ws.close();
  proc.kill();
}

captureFixedInsurance();

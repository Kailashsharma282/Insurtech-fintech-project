import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve('screenshots/audit_final');

async function captureMapWithSearch() {
  const port = 9390;
  const proc = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    'http://localhost:3000/intelligence/map',
  ]);

  await new Promise(r => setTimeout(r, 3000));
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

  // Set laptop view
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await new Promise(r => setTimeout(r, 1000));

  // Type in the search input
  await send('Runtime.evaluate', {
    expression: `
      const input = document.querySelector('input[type="text"]');
      if (input) {
        input.focus();
        input.value = 'Ghatal';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    `,
  });

  await new Promise(r => setTimeout(r, 1500));

  // Capture screenshot of map with search dropdown
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT_DIR, 'pan_india_search_map.png'), Buffer.from(shot.data, 'base64'));

  console.log('✓ Captured pan_india_search_map.png');
  ws.close();
  proc.kill();
}

captureMapWithSearch();

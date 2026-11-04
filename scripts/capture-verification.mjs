import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve('screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const TARGETS = [
  ['map', 'http://localhost:3000/intelligence/map'],
  ['photo_disease', 'http://localhost:3000/farmer/disease'],
  ['tech_chf', 'http://localhost:3000/technology/chf'],
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
    }, 14000);

    (async () => {
      try {
        await new Promise(r => setTimeout(r, 2200));
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

        // 1. Laptop view (1280x850)
        await send('Emulation.setDeviceMetricsOverride', {
          width: 1280,
          height: 850,
          deviceScaleFactor: 1,
          mobile: false
        });
        await new Promise(r => setTimeout(r, 1000));
        const lapShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(outLaptop, Buffer.from(lapShot.data, 'base64'));

        // 2. Mobile view (390x844)
        await send('Emulation.setDeviceMetricsOverride', {
          width: 390,
          height: 844,
          deviceScaleFactor: 2,
          mobile: true
        });
        await new Promise(r => setTimeout(r, 1000));
        const mobShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(outMobile, Buffer.from(mobShot.data, 'base64'));

        ws.close();
        clearTimeout(timer);
        try { proc.kill(); } catch (e) {}
        resolve(true);
      } catch (err) {
        console.error('Capture error on port', port, err.message);
        clearTimeout(timer);
        try { proc.kill(); } catch (e) {}
        resolve(false);
      }
    })();
  });
}

async function main() {
  console.log('Capturing verification screenshots...');
  let port = 9500;
  for (const [name, url] of TARGETS) {
    const outLaptop = path.join(OUT_DIR, `verify_${name}_laptop.png`);
    const outMobile = path.join(OUT_DIR, `verify_${name}_mobile.png`);
    process.stdout.write(`Capturing ${name}... `);
    const ok = await captureOne(url, outLaptop, outMobile, port++);
    console.log(ok ? 'OK' : 'FAILED');
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('Done capturing screenshots!');
}

main();


import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve('screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

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
    }, 15000);

    (async () => {
      try {
        await new Promise(r => setTimeout(r, 2500));
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

        // 1. Laptop view
        await send('Emulation.setDeviceMetricsOverride', {
          width: 1280,
          height: 900,
          deviceScaleFactor: 1,
          mobile: false
        });
        await new Promise(r => setTimeout(r, 1500));
        const lapShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(outLaptop, Buffer.from(lapShot.data, 'base64'));

        // 2. Mobile view
        await send('Emulation.setDeviceMetricsOverride', {
          width: 375,
          height: 812,
          deviceScaleFactor: 2,
          mobile: true
        });
        await new Promise(r => setTimeout(r, 1500));
        const mobShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(outMobile, Buffer.from(mobShot.data, 'base64'));

        ws.close();
        clearTimeout(timer);
        proc.kill();
        resolve(true);
      } catch (err) {
        clearTimeout(timer);
        try { proc.kill(); } catch (e) {}
        console.error('Capture error on ' + url, err);
        resolve(false);
      }
    })();
  });
}

async function main() {
  console.log('Capturing updated photo disease analyzer screenshots...');
  await captureOne(
    'http://localhost:3000/farmer/disease', 
    path.join(OUT_DIR, 'verify_photo_disease_v2_laptop.png'), 
    path.join(OUT_DIR, 'verify_photo_disease_v2_mobile.png'), 
    9335
  );
  console.log('Capture complete!');
}

main();


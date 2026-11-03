import { spawn } from 'child_process';
import fs from 'fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  const proc = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9222',
    'http://localhost:3000/'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2500));
    const tabsRes = await fetch('http://localhost:9222/json');
    const tabs = await tabsRes.json();
    const pageTab = tabs.find(t => t.url.includes('localhost:3000')) || tabs[0];
    const wsUrl = pageTab.webSocketDebuggerUrl;

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

    // Set genuine mobile metrics (iPhone 14 / standard 390x844)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await new Promise(r => setTimeout(r, 1000));

    const check = await send('Runtime.evaluate', {
      expression: '({ innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth })',
      returnByValue: true
    });
    console.log('Mobile Metrics check:', check.result.value);

    // Capture screenshot
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 0,
        y: 0,
        width: 390,
        height: 844,
        scale: 1
      }
    });

    fs.writeFileSync('screenshots/01_home_mobile_true.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshots/01_home_mobile_true.png');

    ws.close();
  } finally {
    proc.kill();
  }
}

capture();


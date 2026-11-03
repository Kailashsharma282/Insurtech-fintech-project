import { spawn } from 'child_process';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const proc = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9222',
    '--window-size=390,844',
    'http://localhost:3000/'
  ]);

  try {
    // Wait for Chrome to fully launch and load
    await new Promise(r => setTimeout(r, 3000));
    const tabsRes = await fetch('http://localhost:9222/json');
    const tabs = await tabsRes.json();
    console.log('Available tabs:', tabs.map(t => ({ url: t.url, title: t.title })));
    
    // Pick the tab that is http://localhost:3000/
    const pageTab = tabs.find(t => t.url.includes('localhost:3000')) || tabs[0];
    const wsUrl = pageTab.webSocketDebuggerUrl;
    console.log('Connecting to:', wsUrl);

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

    // Evaluate script in the page context
    const script = `
      (() => {
        const docW = document.documentElement.scrollWidth;
        const bodyW = document.body.scrollWidth;
        const winW = window.innerWidth;
        const culprits = [];

        for (const el of document.querySelectorAll('*')) {
          const rect = el.getBoundingClientRect();
          if (rect.right > winW + 2) {
            culprits.push({
              tag: el.tagName,
              id: el.id,
              class: (el.className || '').toString().slice(0, 80),
              rectRight: Math.round(rect.right),
              rectWidth: Math.round(rect.width),
              scrollWidth: el.scrollWidth,
              text: el.innerText ? el.innerText.trim().slice(0, 30).replace(/\\n/g, ' ') : ''
            });
          }
        }
        return { winW, docW, bodyW, culpritsCount: culprits.length, culprits: culprits.slice(0, 20) };
      })()
    `;

    const res = await send('Runtime.evaluate', { expression: script, returnByValue: true });
    console.log('DOM Evaluation Result:\n', JSON.stringify(res.result.value, null, 2));

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    proc.kill();
  }
}

main();


import { spawn } from 'child_process';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkUrl(url) {
  const proc = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9222',
    '--window-size=390,844',
    url
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const tabsRes = await fetch('http://localhost:9222/json');
    const tabs = await tabsRes.json();
    const wsUrl = tabs[0]?.webSocketDebuggerUrl;
    if (!wsUrl) {
      console.log('No ws url');
      return;
    }

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

    const script = `
      (() => {
        const overflows = [];
        const winW = window.innerWidth;
        const docW = document.documentElement.scrollWidth;
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.right > winW + 1 || el.scrollWidth > winW + 1) {
            overflows.push({
              tag: el.tagName,
              id: el.id,
              className: (el.className || '').toString().slice(0, 100),
              rectRight: Math.round(rect.right),
              scrollWidth: el.scrollWidth,
              text: el.innerText ? el.innerText.slice(0, 50).replace(/\\n/g, ' ') : ''
            });
          }
        }
        return { winW, docW, overflows: overflows.slice(0, 15) };
      })()
    `;

    const res = await send('Runtime.evaluate', { expression: script, returnByValue: true });
    console.log(`--- URL: ${url} ---`);
    console.log(`window.innerWidth: ${res.result.value.winW}, doc.scrollWidth: ${res.result.value.docW}`);
    console.log('Overflow elements:', JSON.stringify(res.result.value.overflows, null, 2));

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
  }
}

const target = process.argv[2] || 'http://localhost:3000/';
checkUrl(target);


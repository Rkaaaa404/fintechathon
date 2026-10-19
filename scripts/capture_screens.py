import asyncio
import json
import base64
import urllib.request
import websockets

async def capture_route(route, filename):
    res = urllib.request.urlopen('http://localhost:9222/json').read()
    tabs = json.loads(res)
    target = next(t for t in tabs if t.get('id') == 'D487A45FF4255F5828E86C41316A07D7')
    ws_url = target['webSocketDebuggerUrl']
    
    async with websockets.connect(ws_url) as ws:
        js_code = f"sessionStorage.setItem('aegispath_entered', 'true'); window.location.href = 'http://localhost:3000/?route={route}';"
        eval_msg = {'id': 50, 'method': 'Runtime.evaluate', 'params': {'expression': js_code}}
        await ws.send(json.dumps(eval_msg))
        await asyncio.sleep(2.5)
        
        snap_msg = {'id': 200, 'method': 'Page.captureScreenshot', 'params': {'format': 'png'}}
        await ws.send(json.dumps(snap_msg))
        while True:
            resp = json.loads(await ws.recv())
            if resp.get('id') == 200:
                data = resp['result']['data']
                with open(filename, 'wb') as f:
                    f.write(base64.b64decode(data))
                print('Captured', filename)
                break

async def main():
    for r, f in [
        ('/chat', 'snap_chat.png'),
        ('/planner', 'snap_planner.png'),
        ('/rates', 'snap_rates.png'),
        ('/payees', 'snap_payees.png')
    ]:
        await capture_route(r, f)

if __name__ == '__main__':
    asyncio.run(main())

"""Roda um script JS numa pagina do site com Chrome headless (precisa de Chrome e `pip install websockets`).
Uso: python tests/browser_runner.py URL WIDTH HEIGHT OUT_PNG [JS_FILE] [mobile]
O site deve estar servido (python -m http.server 5291). No script, `d` e window.vistaDesktop.
Abre o Chrome headless, carrega URL, rola ate #trajetoria, roda JS_FILE (async, retorna valor) e salva screenshot.
Varias etapas: JS_FILE pode conter blocos separados por a linha '//---shot NOME' que tiram screenshots intermediarios."""
import asyncio, json, subprocess, sys, base64, time, urllib.request, os, re
import websockets

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9333

async def main(url, w, h, out, js_file=None, mobile=False):
    prof = os.path.join(os.environ["TEMP"], "cdp-prof-%d" % int(time.time()))
    proc = subprocess.Popen([CHROME, "--headless=new", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars", "--remote-debugging-port=%d" % PORT,
                             "--user-data-dir=" + prof, "--no-first-run", "--window-size=%d,%d" % (w, h), "about:blank"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        ws_url = None
        for _ in range(50):
            try:
                tabs = json.load(urllib.request.urlopen("http://127.0.0.1:%d/json" % PORT))
                ws_url = [t for t in tabs if t["type"] == "page"][0]["webSocketDebuggerUrl"]
                break
            except Exception:
                time.sleep(0.2)
        async with websockets.connect(ws_url, max_size=64 * 1024 * 1024) as ws:
            mid = [0]
            logs = []
            async def call(method, params=None):
                mid[0] += 1
                i = mid[0]
                await ws.send(json.dumps({"id": i, "method": method, "params": params or {}}))
                while True:
                    msg = json.loads(await ws.recv())
                    if msg.get("id") == i:
                        return msg
                    if msg.get("method") == "Runtime.exceptionThrown":
                        logs.append("EXC: " + json.dumps(msg["params"]["exceptionDetails"].get("exception", {}).get("description", ""))[:300])
                    if msg.get("method") == "Runtime.consoleAPICalled" and msg["params"]["type"] in ("error", "warning"):
                        logs.append(msg["params"]["type"] + ": " + " ".join(str(a.get("value", a.get("description", ""))) for a in msg["params"]["args"])[:300])
            await call("Runtime.enable")
            await call("Page.enable")
            await call("Emulation.setDeviceMetricsOverride", {"width": w, "height": h, "deviceScaleFactor": 1, "mobile": mobile})
            await call("Page.navigate", {"url": url})
            await asyncio.sleep(3.5)
            async def ev(expr):
                r = await call("Runtime.evaluate", {"expression": expr, "awaitPromise": True, "returnByValue": True})
                res = r.get("result", {})
                if "exceptionDetails" in res:
                    return "EXC " + json.dumps(res["exceptionDetails"].get("exception", {}).get("description", ""))[:400]
                return res.get("result", {}).get("value")
            async def shot(path):
                r = await call("Page.captureScreenshot", {"format": "png"})
                open(path, "wb").write(base64.b64decode(r["result"]["data"]))
            await ev("document.getElementById('trajetoria').scrollIntoView({behavior:'instant'})")
            await asyncio.sleep(0.6)
            parts = [("", out)]
            if js_file:
                code = open(js_file, encoding="utf-8").read()
                chunks = re.split(r"^//---shot (\S+)\s*$", code, flags=re.M)
                # chunks: [code0, name1, code1, name2, code2...]
                val = await ev("(async()=>{const d=window.vistaDesktop;" + chunks[0] + "})()") if chunks[0].strip() else None
                if val is not None:
                    print("RESULT:", val)
                for k in range(1, len(chunks), 2):
                    await asyncio.sleep(0.5)
                    base, ext = os.path.splitext(out)
                    await shot("%s-%s%s" % (base, chunks[k], ext))
                    if k + 1 < len(chunks) and chunks[k + 1].strip():
                        val = await ev("(async()=>{const d=window.vistaDesktop;" + chunks[k + 1] + "})()")
                        if val is not None:
                            print("RESULT[%s]:" % chunks[k], val)
            else:
                await shot(out)
            if logs:
                print("LOGS:", logs)
    finally:
        proc.kill()

if __name__ == "__main__":
    a = sys.argv
    asyncio.run(main(a[1], int(a[2]), int(a[3]), a[4], a[5] if len(a) > 5 else None, len(a) > 6 and a[6] == "mobile"))

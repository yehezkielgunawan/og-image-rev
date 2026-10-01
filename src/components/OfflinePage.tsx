import { raw } from "hono/html";

export function OfflinePage({ logo }: { logo: string }) {
  return <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0f172a" />
      <meta name="robots" content="noindex" />
      <title>You’re offline — Yehez Image Studio</title>
      <style>{`*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0f172a;color:#f7f3ec;font-family:system-ui,sans-serif;padding:32px}main{max-width:480px}svg{width:88px;height:88px}small{display:block;margin-top:32px;letter-spacing:.12em;text-transform:uppercase;color:#ef806c}h1{font-size:clamp(36px,8vw,56px);letter-spacing:-.04em;margin:16px 0}p{line-height:1.7;color:#cbd5e1}a{display:inline-block;margin-top:20px;padding:14px 24px;background:#ef806c;color:#0f172a;text-decoration:none;font-weight:700;border-radius:8px}a:focus-visible{outline:3px solid #f7f3ec;outline-offset:5px}`}</style>
    </head>
    <body><main>
      {raw(logo)}
      <small>Yehez / image studio</small>
      <h1>You’re offline.</h1>
      <p>Connect to the internet to create and download images. Your studio will be ready when you’re back online.</p>
      <a href="/">Try again <span aria-hidden="true">→</span></a>
    </main></body>
  </html>;
}

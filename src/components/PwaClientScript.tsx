import { raw } from "hono/html";

export function PwaClientScript() {
  return <script>{raw(`
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((error) => console.error("Unable to register the studio service worker", error));
  });
}
`)}</script>;
}

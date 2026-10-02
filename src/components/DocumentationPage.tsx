import type { Child } from "hono/jsx";
import { SITE_ORIGIN } from "../config";
import { OG_DEFAULTS, OG_FIELD_LIMITS, IMAGE_FETCH_LIMITS } from "../og/config";
import { OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from "../og/render";
import { CARD_DEFAULTS, CARD_FIELD_LIMITS, CARD_MAX_BODY_BYTES, CARD_MAX_MESSAGE_LINES, CARD_OCCASIONS, CARD_SIZES, CARD_TEMPLATES, CARD_THEMES } from "../cards/config";

function CodeExample({ label, children }: { label: string; children: string }) {
  return <figure class="docs-code"><figcaption>{label}</figcaption><pre tabIndex={0} aria-label={label}><code>{children}</code></pre></figure>;
}

function ReferenceTable({ caption, headings, rows }: { caption: string; headings: string[]; rows: Child[][] }) {
  return <div class="docs-table-scroll" tabIndex={0} role="region" aria-label={caption}>
    <table><caption>{caption}</caption><thead><tr>{headings.map((heading) => <th scope="col">{heading}</th>)}</tr></thead>
      <tbody>{rows.map((row) => <tr>{row.map((cell, index) => index === 0 ? <th scope="row">{cell}</th> : <td>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

export function DocumentationPage() {
  const origin = SITE_ORIGIN;
  const ogUrl = `${origin}/og?${new URLSearchParams({ title: "A story worth sharing", description: "Notes from my corner of the web", siteName: "example.com" })}`;
  const sampleCard = { ...CARD_DEFAULTS, recipient: "Alex", message: "Wishing you a wonderful year ahead!", sender: "Sam" };
  const cardJson = JSON.stringify(sampleCard, null, 2);
  const base = JSON.stringify(origin);
  const sections = [["web-app", "Use the web app"], ["og-api", "Open Graph API"], ["cards-api", "Greeting card API"], ["browser", "Browser integration"], ["errors", "Responses & errors"]];
  const ogNotes: Record<keyof typeof OG_DEFAULTS, string> = {
    title: "Main heading", description: "Supporting description", siteName: "Website or brand name",
    social: "Social handle or contact", cta: "Call-to-action text; omitted by default", image: "Public HTTPS avatar or logo URL",
  };

  return <main class="docs-shell">
    <header class="docs-hero">
      <p class="docs-eyebrow">YEHEZ IMAGE STUDIO / FIELD GUIDE</p>
      <h1>Make an image.<br /><em>Build it into anything.</em></h1>
      <p class="docs-lead">Create in the studio, or generate PNGs from your own website. Two public APIs, ready to use. No account or API key required.</p>
      <p>Official website and API base: <a href={`${origin}/`}>{origin}</a>. All examples below use this public domain. For local development or your own deployment, replace the base URL.</p>
      <div class="docs-endpoints"><a href="#og-api"><span>GET</span> /og <span aria-hidden="true">↗</span></a><a href="#cards-api"><span>POST</span> /cards/render <span aria-hidden="true">↗</span></a></div>
    </header>
    <div class="docs-layout">
      <aside class="docs-sidebar"><nav aria-label="Documentation sections"><p class="docs-eyebrow">IN THIS GUIDE</p>{sections.map(([id, label], index) => <a href={`#${id}`}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a>)}</nav><p>API base URL<br /><code>{origin}</code></p></aside>
      <div class="docs-content">
        <section id="web-app" class="docs-section">
          <p class="docs-section-number">01 / THE STUDIO</p><h2>Start with the web app</h2><p>No code needed. Both editors show a preview and let you download a finished PNG.</p>
          <div class="docs-guides">
            <article><h3>Open Graph images</h3><ol><li>Open the <a href="/">OG generator</a> and enter your title, description, site name, and social handle.</li><li>Add call-to-action text and a public HTTPS avatar or logo URL. Quick presets offer a starting point.</li><li>Check the live preview. Use <strong>Copy URL</strong> to reuse the image on your website, <strong>View Full Image</strong> to open it, or <strong>Download Image</strong> to save it.</li></ol><p>Fixed format: {OG_IMAGE_WIDTH} × {OG_IMAGE_HEIGHT} pixels.</p></article>
            <article><h3>Greeting cards</h3><ol><li>Open the <a href="/cards">greeting-card studio</a> and pick an occasion for a suggested heading and message.</li><li>Choose a template, color palette, and square or portrait format.</li><li>Personalize the heading and message. Names are optional. Check the preview, then select <strong>Download PNG</strong>.</li></ol><p>The occasion supplies suggestions in the editor. API callers provide their own heading and message.</p></article>
          </div>
        </section>

        <section id="og-api" class="docs-section">
          <p class="docs-section-number">02 / OPEN GRAPH</p><h2>A shareable image URL</h2>
          <p class="docs-method"><span>GET</span><code>/og</code></p><p>Send URL query parameters. The response is an <code>image/png</code> at {OG_IMAGE_WIDTH} × {OG_IMAGE_HEIGHT} pixels. All parameters are optional; omitted or blank values use the defaults below.</p>
          <ReferenceTable caption="OG query parameters" headings={["Parameter", "Purpose / default", "Max characters"]} rows={Object.entries(OG_DEFAULTS).map(([field, value]) => [<code>{field}</code>, <>{ogNotes[field as keyof typeof OG_DEFAULTS]}<small>Default: <code>{value || "(empty)"}</code></small></>, OG_FIELD_LIMITS[field as keyof typeof OG_FIELD_LIMITS]])} />
          <p>The image URL must use HTTPS and cannot point to a private or local host. Avatars support AVIF, JPEG, PNG, and WebP, up to {IMAGE_FETCH_LIMITS.maxBytes / (1024 * 1024)} MB. If fetching fails or the image is unsupported, the generator renders without the avatar.</p>
          <CodeExample label="cURL · save a PNG">{`curl --fail-with-body --get "${origin}/og" \\
  --data-urlencode "title=A story worth sharing" \\
  --data-urlencode "description=Notes from my corner of the web" \\
  --data-urlencode "siteName=example.com" \\
  --output og-image.png`}</CodeExample>
          <CodeExample label="JavaScript · build a correctly encoded URL">{`const studio = ${base};
const params = new URLSearchParams({
  title: "A story worth sharing",
  description: "Notes from my corner of the web",
  siteName: "example.com",
});
const imageUrl = studio + "/og?" + params.toString();
// Use imageUrl as an image source or fetch it as a Blob.`}</CodeExample>
          <CodeExample label="HTML · display an image or set social metadata">{`<!-- Display on your page -->
<img src="${ogUrl.replaceAll("&", "&amp;")}" width="1200" height="630"
     alt="A story worth sharing" />

<!-- Place in your page's <head>; use an absolute URL -->
<meta property="og:image" content="${ogUrl.replaceAll("&", "&amp;")}" />
<meta name="twitter:card" content="summary_large_image" />`}</CodeExample>
          <p>For dynamic pages, set the metadata in your server-rendered HTML so social crawlers can read it. Successful OG responses are publicly cacheable for one hour, with stale-while-revalidate for one day.</p>
        </section>

        <section id="cards-api" class="docs-section">
          <p class="docs-section-number">03 / GREETING CARDS</p><h2>A personal note, as a PNG</h2><p class="docs-method"><span>POST</span><code>/cards/render</code></p>
          <p>Send a JSON object with <code>Content-Type: application/json</code>. Include all eight fields. There are no API defaults: <code>recipient</code> and <code>sender</code> can be empty strings, but cannot be omitted.</p>
          <ReferenceTable caption="Greeting-card JSON fields" headings={["Field", "Accepted values / requirement"]} rows={[
            [<code>occasion</code>, Object.keys(CARD_OCCASIONS).join(" · ")],
            [<code>template</code>, Object.keys(CARD_TEMPLATES).join(" · ")],
            [<code>theme</code>, Object.entries(CARD_THEMES).map(([id, label]) => `${id} (${label})`).join(" · ")],
            [<code>size</code>, Object.entries(CARD_SIZES).map(([id, size]) => `${id}: ${size.width} × ${size.height}`).join(" · ")],
            ...Object.entries(CARD_FIELD_LIMITS).map(([field, limit]) => [<code>{field}</code>, `${field === "recipient" || field === "sender" ? "May be empty" : "Non-empty text"}; up to ${limit} characters`]),
          ]} />
          <p>Messages allow up to {CARD_MAX_MESSAGE_LINES} lines. Requests are limited to {CARD_MAX_BODY_BYTES / 1024} KB. Text is trimmed; message line breaks are preserved. Other text fields are normalized to a single line. Cards use <code>Cache-Control: no-store</code>.</p>
          <CodeExample label="JSON · a complete card request">{cardJson}</CodeExample>
          <CodeExample label="cURL · render and save a greeting card">{`curl --fail-with-body "${origin}/cards/render" \\
  -H "Content-Type: application/json" \\
  --data-binary @- \\
  --output greeting-card.png <<'JSON'
${cardJson}
JSON`}</CodeExample>
          <div class="docs-note"><strong>Need a greeting card in an image tag or social preview?</strong><p>This endpoint requires POST, so its URL cannot be used directly as <code>src</code> or <code>og:image</code>. Generate the PNG, upload it to your own public storage, and use that hosted URL. For an in-page preview, use a Blob URL as shown below.</p></div>
        </section>

        <section id="browser" class="docs-section">
          <p class="docs-section-number">04 / INTEGRATION</p><h2>Call from your own website</h2>
          <p>Both APIs allow cross-origin requests from any website. No cookies or authentication headers are needed; use the default fetch credentials setting. JSON POST requests trigger an OPTIONS preflight, handled automatically by the API and the browser. Do not use <code>mode: "no-cors"</code>: it makes the response unreadable.</p>
          <CodeExample label="Browser JavaScript · fetch a card and handle API errors">{`const studio = ${base};
const card = ${cardJson};

async function renderCard() {
  const response = await fetch(studio + "/cards/render", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card),
  });
  if (!response.ok) {
    const problem = await response.json();
    throw new Error(problem.error || "Unable to generate card");
  }
  return response.blob();
}`}</CodeExample>
          <CodeExample label="Browser JavaScript · display the PNG">{`// Run after the page contains <img id="card-preview" alt="Greeting card">.
// Reuse renderCard() from the previous example.
async function showCard() {
  const blob = await renderCard();
  const image = document.getElementById("card-preview");
  const url = URL.createObjectURL(blob);
  image.onload = image.onerror = () => URL.revokeObjectURL(url);
  image.src = url;
}
showCard().catch((error) => console.error(error.message));`}</CodeExample>
          <CodeExample label="Browser JavaScript · download the PNG">{`// Reuse renderCard(). Connect this function to your download button.
async function downloadCard() {
  const blob = await renderCard();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "greeting-card.png";
  document.body.append(link);
  link.click();
  link.remove();
  // Give the browser time to begin the download before freeing the URL.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.getElementById("download-card").addEventListener("click", () => {
  downloadCard().catch((error) => console.error(error.message));
});`}</CodeExample>
          <p>To fetch an OG image instead, use <code>fetch(imageUrl)</code> with the URL built above, check <code>response.ok</code>, then read <code>response.blob()</code>. The same display and download pattern applies. These APIs also work with server-side HTTP clients.</p>
        </section>

        <section id="errors" class="docs-section">
          <p class="docs-section-number">05 / RESPONSES</p><h2>Know what comes back</h2>
          <ReferenceTable caption="API status codes" headings={["Status", "Meaning", "Endpoints"]} rows={[
            ["200", "PNG image bytes, Content-Type: image/png", "Both"],
            ["204", "Successful OPTIONS preflight; no body", "Both"],
            ["400", "Invalid parameters, malformed JSON, or invalid card fields", "Both"],
            ["413", `Request exceeds ${CARD_MAX_BODY_BYTES / 1024} KB`, "Cards"],
            ["415", "Content-Type must be application/json", "Cards"],
            ["500", "Image rendering failed", "Both"],
          ]} />
          <p>Errors return JSON with an <code>error</code> message. Card field validation errors also identify the <code>field</code>. CORS headers are included on error responses so your website can read them.</p>
          <CodeExample label="JSON · example field validation error">{JSON.stringify({ error: "Choose a valid template", field: "template" }, null, 2)}</CodeExample>
          <p>Check the HTTP status before treating a response as image data. Correct validation errors before retrying. If rendering fails, let the user retry.</p>
        </section>
        <footer class="docs-footer"><p>Ready to make something?</p><a href="/">Open Graph generator ↗</a><a href="/cards">Greeting-card studio ↗</a></footer>
      </div>
    </div>
  </main>;
}

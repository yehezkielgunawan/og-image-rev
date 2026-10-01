import { CARD_DEFAULTS, CARD_FIELD_LIMITS, CARD_MAX_MESSAGE_LINES, CARD_OCCASIONS, CARD_SIZES, CARD_TEMPLATES, CARD_THEMES } from "../cards/config";

export function GreetingCardGenerator() {
  return (
    <main class="card-studio">
      <header class="card-intro">
        <p class="card-eyebrow">A NOTE WORTH KEEPING</p>
        <h1>A little card.<br /><em>A lot of meaning.</em></h1>
        <p>For the big days, the small kindnesses, and the people who matter.</p>
      </header>
      <div class="card-workspace">
        <form id="card-form" class="card-editor" aria-label="Personalize your greeting card" novalidate>
          <fieldset class="card-step">
            <legend><span>01</span> Pick the moment</legend>
            <label for="card-occasion">Occasion</label>
            <select id="card-occasion" name="occasion">
              {Object.entries(CARD_OCCASIONS).map(([id, occasion]) => <option value={id} selected={id === CARD_DEFAULTS.occasion}>{occasion.label}</option>)}
            </select>
            <p class="card-hint">Start with a suggestion. Make it your own.</p>
          </fieldset>
          <fieldset class="card-step">
            <legend><span>02</span> Set the mood</legend>
            <div class="card-design-samples" aria-hidden="true">
              <div class="card-design-sample sample-minimal"><span>A little<br />hello.</span><small>Minimal</small></div>
              <div class="card-design-sample sample-celebratory"><span>Oh,<br />happy day!</span><small>Celebratory</small></div>
              <div class="card-design-sample sample-elegant"><span>For<br />you.</span><small>Elegant</small></div>
            </div>
            <div class="card-field-pair">
              <div><label for="card-template">Template</label><select id="card-template" name="template">
                {Object.entries(CARD_TEMPLATES).map(([id, template]) => <option value={id} selected={id === CARD_DEFAULTS.template}>{template.label}</option>)}
              </select></div>
              <div><label for="card-theme">Color palette</label><select id="card-theme" name="theme">
                {Object.entries(CARD_THEMES).map(([id, label]) => <option value={id} selected={id === CARD_DEFAULTS.theme}>{label}</option>)}
              </select></div>
            </div>
            <label for="card-size">Card format</label><select id="card-size" name="size">
              {Object.entries(CARD_SIZES).map(([id, size]) => <option value={id} selected={id === CARD_DEFAULTS.size}>{size.label} · {size.width} × {size.height}</option>)}
            </select>
          </fieldset>
          <fieldset class="card-step">
            <legend><span>03</span> Find your words</legend>
            <div class="card-label-row"><label for="card-heading">Heading <span aria-hidden="true">*</span></label><span id="card-heading-count" class="card-count">{CARD_DEFAULTS.heading.length} / {CARD_FIELD_LIMITS.heading}</span></div>
            <input id="card-heading" name="heading" type="text" value={CARD_DEFAULTS.heading} maxlength={CARD_FIELD_LIMITS.heading} required aria-describedby="card-error" />
            <div class="card-label-row"><label for="card-recipient">To <small>(optional)</small></label><span id="card-recipient-count" class="card-count">0 / {CARD_FIELD_LIMITS.recipient}</span></div>
            <input id="card-recipient" name="recipient" type="text" value="" placeholder="Someone special" maxlength={CARD_FIELD_LIMITS.recipient} aria-describedby="card-error" />
            <div class="card-label-row"><label for="card-message">Your message <span aria-hidden="true">*</span></label><span id="card-message-count" class="card-count">{CARD_DEFAULTS.message.length} / {CARD_FIELD_LIMITS.message}</span></div>
            <textarea id="card-message" name="message" rows={5} maxlength={CARD_FIELD_LIMITS.message} required aria-describedby="card-message-help card-error">{CARD_DEFAULTS.message}</textarea>
            <p id="card-message-help" class="card-hint">Up to {CARD_FIELD_LIMITS.message} characters and {CARD_MAX_MESSAGE_LINES} lines. A few heartfelt words go a long way.</p>
            <div class="card-label-row"><label for="card-sender">From <small>(optional)</small></label><span id="card-sender-count" class="card-count">0 / {CARD_FIELD_LIMITS.sender}</span></div>
            <input id="card-sender" name="sender" type="text" value="" placeholder="Your name" maxlength={CARD_FIELD_LIMITS.sender} aria-describedby="card-error" />
          </fieldset>
          <div class="card-editor-actions"><button type="button" id="card-reset">Start fresh</button><button type="submit">Update preview <span aria-hidden="true">↗</span></button></div>
        </form>
        <aside class="card-preview-panel" aria-label="Greeting card preview">
          <div class="card-preview-heading"><h2>Your card</h2><span id="card-status" role="status" aria-live="polite">Preparing your preview…</span></div>
          <div class="card-preview-stage">
            <div id="card-empty" class="card-empty"><span aria-hidden="true">✉</span><p>A little something, just for them.<br />Your preview will appear here.</p></div>
            <img id="card-preview" alt="Your personalized greeting card" width="1080" height="1080" hidden />
          </div>
          <p id="card-error" class="card-error" role="alert" hidden></p>
          <div class="card-export"><p id="card-dimensions">1080 × 1080 px · PNG</p><button id="card-download" type="button" disabled>Download PNG <span aria-hidden="true">↓</span></button></div>
          <p class="card-preview-note">Made to send. Lovely to keep.<br />Download your card and share it wherever you like.</p>
          <noscript><p class="card-error">Enable JavaScript to preview and download your greeting card.</p></noscript>
        </aside>
      </div>
      <footer class="card-footer"><span>Small gestures. Lasting impressions.</span><span>Greeting Card Studio · by Yehez</span></footer>
    </main>
  );
}

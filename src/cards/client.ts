import { CARD_DEFAULTS, CARD_FIELD_LIMITS, CARD_MAX_MESSAGE_LINES, CARD_OCCASIONS, CARD_SIZES } from "./config";

// An inline browser script, matching the existing Hono client-script convention.
export const cardClientScript = `
(function () {
  const defaults = ${JSON.stringify(CARD_DEFAULTS)};
  const limits = ${JSON.stringify(CARD_FIELD_LIMITS)};
  const occasions = ${JSON.stringify(CARD_OCCASIONS)};
  const sizes = ${JSON.stringify(CARD_SIZES)};
  const maxLines = ${CARD_MAX_MESSAGE_LINES};
  const fields = Object.keys(defaults);
  const element = (id) => document.getElementById('card-' + id);
  const form = element('form');
  if (!form) return;
  const preview = element('preview');
  const download = element('download');
  const status = element('status');
  const error = element('error');
  let timer;
  let controller;
  let revision = 0;
  let currentUrl = '';
  let currentInput;
  let previousOccasion = element('occasion').value;
  const liveUrls = new Set();

  function release(url) {
    if (liveUrls.delete(url)) URL.revokeObjectURL(url);
  }

  function showError(message, field) {
    error.textContent = message;
    error.hidden = false;
    status.textContent = currentUrl ? 'Previous preview shown' : 'Preview unavailable';
    if (field && element(field)) element(field).setAttribute('aria-invalid', 'true');
    form.setAttribute('aria-busy', 'false');
    download.disabled = true;
  }

  async function render(input, version) {
    const requestController = new AbortController();
    controller = requestController;
    let candidate;
    try {
      const response = await fetch('/cards/render', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input), signal: requestController.signal,
      });
      if (version !== revision) return;
      if (!response.ok) {
        const failure = await response.json().catch(() => ({}));
        if (version === revision) showError(failure.error || 'Unable to render card. Please try again.', failure.field);
        return;
      }
      if (!(response.headers.get('content-type') || '').startsWith('image/png')) throw new Error('Unexpected response');
      const blob = await response.blob();
      if (version !== revision) return;
      candidate = URL.createObjectURL(blob);
      liveUrls.add(candidate);
      const image = new Image();
      image.src = candidate;
      await image.decode();
      if (version !== revision) { release(candidate); return; }
      const old = currentUrl;
      currentUrl = candidate;
      currentInput = input;
      preview.src = candidate;
      preview.hidden = false;
      preview.alt = input.heading + (input.recipient ? ' — for ' + input.recipient : '');
      element('empty').hidden = true;
      release(old);
      const size = sizes[input.size];
      element('dimensions').textContent = size.width + ' × ' + size.height + ' px · PNG';
      preview.setAttribute('width', String(size.width));
      preview.setAttribute('height', String(size.height));
      status.textContent = 'Ready to send';
      error.hidden = true;
      form.setAttribute('aria-busy', 'false');
      download.disabled = false;
    } catch (failure) {
      if (candidate) release(candidate);
      if (version === revision && !requestController.signal.aborted) {
        showError('We could not update your card. Check your connection and try again.');
      }
    }
  }

  function queuePreview(delay) {
    const version = ++revision;
    clearTimeout(timer);
    if (controller) controller.abort();
    download.disabled = true;
    error.hidden = true;
    fields.forEach(field => element(field).removeAttribute('aria-invalid'));
    const input = Object.fromEntries(fields.map(field => [field, element(field).value.trim()]));
    for (const [field, limit] of Object.entries(limits)) {
      element(field + '-count').textContent = element(field).value.length + ' / ' + limit;
      if ((field === 'heading' || field === 'message') && !input[field]) {
        showError('Please enter a ' + field, field); return;
      }
      if (input[field].length > limit) { showError(field + ' must be ' + limit + ' characters or fewer', field); return; }
    }
    if (input.message.replace(/\\r\\n?/g, '\\n').split('\\n').length > maxLines) {
      showError('Use ' + maxLines + ' lines or fewer so your message stays readable', 'message'); return;
    }
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Updating your card…';
    timer = setTimeout(() => { void render(input, version); }, delay);
  }

  form.addEventListener('submit', event => { event.preventDefault(); queuePreview(0); });
  form.addEventListener('input', () => queuePreview(400));
  form.addEventListener('change', event => {
    // Text is already handled on input; a blur-triggered change must not interrupt a download click.
    if (!['occasion', 'template', 'theme', 'size'].some(field => event.target === element(field))) return;
    if (event.target === element('occasion')) {
      const old = occasions[previousOccasion];
      const next = occasions[element('occasion').value];
      for (const field of ['heading', 'message']) {
        if (element(field).value.trim() === old[field]) element(field).value = next[field];
      }
      previousOccasion = element('occasion').value;
    }
    queuePreview(0);
  });
  element('reset').addEventListener('click', () => {
    fields.forEach(field => { element(field).value = defaults[field]; });
    previousOccasion = defaults.occasion;
    queuePreview(0);
  });
  download.addEventListener('click', () => {
    if (download.disabled || !currentUrl || !currentInput) return;
    const link = document.createElement('a');
    link.href = currentUrl;
    link.download = 'greeting-' + currentInput.occasion + '-' + currentInput.size + '.png';
    link.click();
  });
  window.addEventListener('pagehide', () => {
    ++revision;
    clearTimeout(timer);
    if (controller) controller.abort();
    Array.from(liveUrls).forEach(release);
    currentUrl = '';
    download.disabled = true;
    preview.removeAttribute('src');
  });
  window.addEventListener('pageshow', event => { if (event.persisted) queuePreview(0); });
  queuePreview(0);
})();
`;

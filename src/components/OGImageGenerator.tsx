export function OGImageGenerator() {
  const defaultValues = {
    title: "Title",
    description: "Description",
    siteName: "yehezgun.com",
    social: "Twitter: @yehezgun",
    image:
      "https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png",
  };

  return (
    <div class="og-generator">
      <div class="generator-header">
        <h1>OG Image Generator</h1>
        <p>Create beautiful Open Graph images for your website</p>
      </div>

      <div class="generator-layout">
        <div class="form-section">
          <div class="form-container">
            <div class="form-field">
              <label for="title" class="form-label">
                Title
                <span class="required">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={defaultValues.title}
                placeholder="Enter your title"
                class="form-input"
                maxLength={100}
              />
              <p class="form-description">The main heading for your OG image</p>
              <div class="character-count">5/100</div>
            </div>

            <div class="form-field">
              <label for="description" class="form-label">
                Description
              </label>
              <textarea
                id="description"
                value={defaultValues.description}
                placeholder="Enter a description"
                class="form-textarea"
                maxLength={200}
                rows={3}
              />
              <p class="form-description">A brief description or subtitle</p>
              <div class="character-count">11/200</div>
            </div>

            <div class="form-field">
              <label for="siteName" class="form-label">
                Site Name
              </label>
              <input
                id="siteName"
                type="text"
                value={defaultValues.siteName}
                placeholder="Your website name"
                class="form-input"
                maxLength={50}
              />
              <p class="form-description">Your brand or website name</p>
              <div class="character-count">12/50</div>
            </div>

            <div class="form-field">
              <label for="social" class="form-label">
                Social Handle
              </label>
              <input
                id="social"
                type="text"
                value={defaultValues.social}
                placeholder="Twitter: @username"
                class="form-input"
                maxLength={50}
              />
              <p class="form-description">
                Your social media handle or contact
              </p>
              <div class="character-count">18/50</div>
            </div>

            <div class="form-field">
              <label for="image" class="form-label">
                Avatar/Logo URL
              </label>
              <input
                id="image"
                type="url"
                value={defaultValues.image}
                placeholder="https://example.com/avatar.png"
                class="form-input"
              />
              <p class="form-description">
                URL to your avatar, logo, or profile image
              </p>
            </div>
          </div>

          <div class="form-actions">
            <div class="preset-buttons">
              <h4>Quick Presets</h4>
              <div class="preset-grid">
                <button class="preset-button">Default</button>
                <button class="preset-button">Blog Post</button>
                <button class="preset-button">Product Launch</button>
                <button class="preset-button">Event</button>
              </div>
            </div>

            <div class="action-buttons">
              <button class="reset-button">Reset to Default</button>
              <button class="export-button">Export Config</button>
              <button class="import-button">Import Config</button>
            </div>
          </div>
        </div>

        <div class="preview-section">
          <div class="preview-container">
            <div class="preview-header">
              <h3>OG Image Preview</h3>
              <div class="loading-spinner" style="display: none;">
                Loading...
              </div>
            </div>

            <div class="preview-wrapper">
              <div class="preview-image-container">
                <img
                  src="/og?title=Title&description=Description&siteName=yehezgun.com&social=Twitter: @yehezgun&image=https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png"
                  alt="OG Image Preview"
                  class="preview-image"
                />
              </div>
            </div>

            <div class="preview-actions">
              <div class="url-display">
                <input
                  type="text"
                  value="/og?title=Title&description=Description&siteName=yehezgun.com&social=Twitter: @yehezgun"
                  readonly
                  class="url-input"
                />
                <button class="copy-button">Copy URL</button>
              </div>
              <div class="action-buttons">
                <button class="open-button">Open in New Tab</button>
                <a href="#" download="og-image.png" class="download-button">
                  Download Image
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="generator-footer">
        <div class="tips">
          <h4>Tips for better OG images:</h4>
          <ul>
            <li>Keep titles under 60 characters for best display</li>
            <li>Use high-contrast colors for better readability</li>
            <li>Test your image on different social platforms</li>
            <li>Recommended size is 1200×630 pixels</li>
          </ul>
        </div>

        <div class="technical-info">
          <h4>Technical Details:</h4>
          <ul>
            <li>Image format: PNG</li>
            <li>Dimensions: 1200×630 pixels</li>
            <li>Aspect ratio: 1.91:1</li>
            <li>Font: Plus Jakarta Sans</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

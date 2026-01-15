import { raw } from "hono/html";

// Presets data for quick form filling
const presets = {
  Default: {
    title: "Welcome to My Site",
    description: "This is a sample description for the OG image",
    siteName: "yehezgun.com",
    social: "Twitter: @yehezgun",
    image:
      "https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png",
  },
  "Blog Post": {
    title: "Understanding Modern Web Development",
    description: "A comprehensive guide to building web applications",
    siteName: "Tech Blog",
    social: "Follow us @techblog",
    image:
      "https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png",
  },
  "Product Launch": {
    title: "Introducing Our New Product",
    description: "Revolutionary features that will change how you work",
    siteName: "ProductCorp",
    social: "LinkedIn: /company/productcorp",
    image:
      "https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png",
  },
  Event: {
    title: "Web Development Conference 2024",
    description: "Join us for three days of learning and innovation",
    siteName: "DevConf 2024",
    social: "Register at devconf.com",
    image:
      "https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png",
  },
};

// Field IDs that should be included in the OG URL
const FORM_FIELD_IDS = ["title", "description", "siteName", "social", "image"];

export function ClientScript() {
  // Using raw() to inject inline script - this is the Hono way to embed scripts in JSX
  return (
    <script>
      {raw(`
(function() {
  const FORM_FIELD_IDS = ${JSON.stringify(FORM_FIELD_IDS)};
  const presets = ${JSON.stringify(presets)};

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  function getFormInputs() {
    return FORM_FIELD_IDS
      .map(id => document.getElementById(id))
      .filter(Boolean);
  }

  function buildOgUrl() {
    const params = new URLSearchParams();
    
    for (const id of FORM_FIELD_IDS) {
      const input = document.getElementById(id);
      if (input && input.value.trim()) {
        params.set(id, input.value.trim());
      }
    }
    
    return '/og?' + params.toString();
  }

  function updatePreview() {
    const ogPath = buildOgUrl();
    const fullUrl = window.location.origin + ogPath;
    const cacheBustUrl = ogPath + '&t=' + Date.now();

    // Update loading state
    const loadingDiv = document.querySelector('.loading-spinner');
    if (loadingDiv) loadingDiv.style.display = 'block';

    // Update preview image
    const img = document.querySelector('.preview-image');
    if (img) {
      img.src = cacheBustUrl;
      img.onload = () => {
        if (loadingDiv) loadingDiv.style.display = 'none';
      };
      img.onerror = () => {
        if (loadingDiv) loadingDiv.style.display = 'none';
      };
    }

    // Update URL display
    const urlInput = document.querySelector('.url-input');
    if (urlInput) urlInput.value = fullUrl;

    // Update open button
    const openButton = document.querySelector('.open-button');
    if (openButton) {
      openButton.href = fullUrl;
      openButton.rel = 'noopener';
    }

    // Update download button
    const downloadButton = document.querySelector('.download-button');
    if (downloadButton) {
      downloadButton.href = cacheBustUrl;
    }
  }

  function applyPreset(presetData) {
    if (!presetData) return;
    
    for (const [key, value] of Object.entries(presetData)) {
      const input = document.getElementById(key);
      if (input) input.value = value;
    }
    updatePreview();
  }

  function init() {
    const form = document.querySelector('.og-generator');
    if (!form) return;

    // Set up input listeners with debounce
    const debouncedUpdate = debounce(updatePreview, 400);
    getFormInputs().forEach(input => {
      input.addEventListener('input', debouncedUpdate);
    });

    // Copy button handler
    const copyButton = document.querySelector('.copy-button');
    if (copyButton) {
      copyButton.addEventListener('click', async () => {
        const urlInput = document.querySelector('.url-input');
        if (!urlInput) return;
        
        try {
          await navigator.clipboard.writeText(urlInput.value);
          const originalText = copyButton.textContent;
          copyButton.textContent = 'Copied!';
          copyButton.classList.add('copied');
          setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });
    }

    // Preset buttons handler
    document.querySelectorAll('.preset-button').forEach(button => {
      button.addEventListener('click', () => {
        const presetName = button.textContent.trim();
        applyPreset(presets[presetName]);
      });
    });

    // Reset button handler
    const resetButton = document.querySelector('.reset-button');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (!confirm('Reset all fields to default?')) return;
        applyPreset(presets['Default']);
      });
    }

    // Character count updates
    getFormInputs().forEach(input => {
      const field = input.closest('.form-field');
      const counter = field?.querySelector('.character-count');
      if (counter && input.maxLength > 0) {
        const updateCount = () => {
          counter.textContent = input.value.length + '/' + input.maxLength;
        };
        input.addEventListener('input', updateCount);
        updateCount();
      }
    });

    // Initial preview
    updatePreview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`)}
    </script>
  );
}

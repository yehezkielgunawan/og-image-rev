// Client-side script served as /app.js
// Encapsulated in an IIFE to avoid leaking globals
export const appScript = `
(function () {
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function init() {
    const form = document.querySelector('.og-generator');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    const debouncedUpdate = debounce(updatePreview, 500);

    inputs.forEach((input) => {
      input.addEventListener('input', debouncedUpdate);
    });

    function updatePreview() {
      const formData = new FormData();
      inputs.forEach((input) => {
        if (input.value.trim()) {
          formData.set(input.id, input.value.trim());
        }
      });

      const params = new URLSearchParams(formData);
      const previewUrl = '/og?' + params.toString() + '&t=' + Date.now();
      const fullUrl = window.location.origin + '/og?' + params.toString();

      const loadingDiv = document.querySelector('.loading-spinner');
      if (loadingDiv) loadingDiv.style.display = 'block';

      const img = document.querySelector('.preview-image');
      if (img) {
        img.src = previewUrl;
        img.onload = () => {
          if (loadingDiv) loadingDiv.style.display = 'none';
        };
      }

      const urlInput = document.querySelector('.url-input');
      if (urlInput) {
        urlInput.value = fullUrl;
      }

      const openButton = document.querySelector('.open-button');
      if (openButton) {
        openButton.setAttribute('href', fullUrl);
        openButton.setAttribute('rel', 'noopener');
      }
    }

    // Copy to clipboard
    const copyButton = document.querySelector('.copy-button');
    if (copyButton) {
      copyButton.addEventListener('click', async () => {
        const urlInput = document.querySelector('.url-input');
        if (urlInput) {
          try {
            await navigator.clipboard.writeText(urlInput.value);
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
              copyButton.textContent = 'Copy URL';
            }, 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        }
      });
    }

    // Preset buttons
    const presets = {
      Default: {
        title: 'Welcome to My Site',
        description: 'This is a sample description for the OG image',
        siteName: 'yehezgun.com',
        social: 'Twitter: @yehezgun',
        image:
          'https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png',
      },
      'Blog Post': {
        title: 'Understanding Modern Web Development',
        description: 'A comprehensive guide to building web applications',
        siteName: 'Tech Blog',
        social: 'Follow us @techblog',
        image:
          'https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png',
      },
      'Product Launch': {
        title: 'Introducing Our New Product',
        description: 'Revolutionary features that will change how you work',
        siteName: 'ProductCorp',
        social: 'LinkedIn: /company/productcorp',
        image:
          'https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png',
      },
      Event: {
        title: 'Web Development Conference 2024',
        description: 'Join us for three days of learning and innovation',
        siteName: 'DevConf 2024',
        social: 'Register at devconf.com',
        image:
          'https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png',
      },
    };

    document.querySelectorAll('.preset-button').forEach((button) => {
      button.addEventListener('click', () => {
        const presetData = presets[button.textContent.trim()];
        if (presetData) {
          Object.keys(presetData).forEach((key) => {
            const input = document.getElementById(key);
            if (input) {
              input.value = presetData[key];
            }
          });
          updatePreview();
        }
      });
    });

    // Reset button
    const resetButton = document.querySelector('.reset-button');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (confirm('Reset all fields?')) {
          const defaultData = {
            title: 'Title',
            description: 'Description',
            siteName: 'yehezgun.com',
            social: 'Twitter: @yehezgun',
            image:
              'https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png',
          };
          Object.keys(defaultData).forEach((key) => {
            const input = document.getElementById(key);
            if (input) input.value = defaultData[key];
          });
          updatePreview();
        }
      });
    }

    updatePreview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;

export default appScript;

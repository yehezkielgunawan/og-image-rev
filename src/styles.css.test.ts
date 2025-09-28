import { describe, it, expect } from 'vitest';
import { cssStyles } from './styles.css.js';

describe('cssStyles', () => {
  it('exports a non-empty CSS string', () => {
    expect(typeof cssStyles).toBe('string');
    expect(cssStyles.length).toBeGreaterThan(100);
  });

  it('contains key sections and selectors', () => {
    expect(cssStyles).toContain('.og-generator');
    expect(cssStyles).toContain('.form-section');
    expect(cssStyles).toContain('.preview-section');
    expect(cssStyles).toContain('@media (max-width: 768px)');
  });
});

// CSS as a template string for clean import
export const cssStyles = `
/* Reset and Base Styles */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
        sans-serif;
    line-height: 1.6;
    color: #1f2937;
    background-color: #f9fafb;
    min-height: 100vh;
}

/* Main Generator Layout */
.og-generator {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
}

.generator-header {
    text-align: center;
    margin-bottom: 3rem;
}

.generator-header h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
}

.generator-header p {
    font-size: 1.25rem;
    color: #6b7280;
}

.generator-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
}

/* Form Section */
.form-section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow:
        0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
    border: 1px solid #e5e7eb;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

/* Form Fields */
.form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    font-weight: 600;
    font-size: 0.875rem;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.required {
    color: #ef4444;
}

.form-input,
.form-textarea {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.form-textarea {
    resize: vertical;
    min-height: 5rem;
}

.form-description {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
}

.character-count {
    font-size: 0.75rem;
    color: #9ca3af;
    text-align: right;
    margin-top: 0.25rem;
}

/* Preset Buttons */
.preset-buttons {
    margin-bottom: 1.5rem;
}

.preset-buttons h4 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #374151;
}

.preset-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
}

.preset-button {
    padding: 0.75rem 1rem;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}

.preset-button:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
}

/* Action Buttons */
.form-actions {
    border-top: 1px solid #e5e7eb;
    padding-top: 1.5rem;
}

.action-buttons {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.reset-button,
.export-button,
.import-button {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid;
}

.reset-button {
    background: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
}

.reset-button:hover {
    background: #fee2e2;
    border-color: #fca5a5;
}

.export-button {
    background: #eff6ff;
    border-color: #dbeafe;
    color: #2563eb;
}

.export-button:hover {
    background: #dbeafe;
    border-color: #93c5fd;
}

.import-button {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #16a34a;
}

.import-button:hover {
    background: #dcfce7;
    border-color: #86efac;
}

/* Preview Section */
.preview-section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow:
        0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
    border: 1px solid #e5e7eb;
}

.preview-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.preview-header h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
}

.loading-spinner {
    font-size: 0.875rem;
    color: #3b82f6;
    font-weight: 500;
}

.preview-wrapper {
    position: relative;
    background: #f9fafb;
    border: 2px dashed #d1d5db;
    border-radius: 0.75rem;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-image-container {
    position: relative;
    width: 100%;
    height: auto;
}

.preview-image {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    transition: opacity 0.3s;
}

.preview-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.url-display {
    display: flex;
    gap: 0.5rem;
}

.url-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: #f9fafb;
}

.copy-button {
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
}

.copy-button:hover {
    background: #2563eb;
}

.open-button,
.download-button {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    text-align: center;
    display: inline-block;
}

.open-button {
    background: #059669;
    color: white;
    border: none;
}

.open-button:hover {
    background: #047857;
}

.download-button {
    background: #7c3aed;
    color: white;
    border: none;
}

.download-button:hover {
    background: #6d28d9;
}

/* Footer */
.generator-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-top: 3rem;
    padding-top: 3rem;
    border-top: 1px solid #e5e7eb;
}

.tips,
.technical-info {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow:
        0 1px 3px 0 rgb(0 0 0 / 0.1),
        0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.tips h4,
.technical-info h4 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #111827;
}

.tips ul,
.technical-info ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.tips li,
.technical-info li {
    position: relative;
    padding-left: 1.5rem;
    color: #4b5563;
    font-size: 0.875rem;
}

.tips li::before,
.technical-info li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #3b82f6;
    font-weight: bold;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .generator-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .preview-section {
        order: -1;
    }

    .generator-footer {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .preset-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .og-generator {
        padding: 1rem;
    }

    .generator-header h1 {
        font-size: 2rem;
    }

    .generator-header p {
        font-size: 1rem;
    }

    .form-section,
    .preview-section {
        padding: 1.5rem;
    }

    .action-buttons {
        flex-direction: column;
    }

    .action-buttons button,
    .action-buttons a {
        width: 100%;
    }

    .url-display {
        flex-direction: column;
    }

    .copy-button {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .og-generator {
        padding: 0.5rem;
    }

    .generator-header h1 {
        font-size: 1.5rem;
    }

    .form-section,
    .preview-section,
    .tips,
    .technical-info {
        padding: 1rem;
    }

    .preset-grid {
        grid-template-columns: 1fr;
    }
}

/* Loading and Animation States */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.loading-spinner::after {
    content: " ⟳";
    animation: spin 1s linear infinite;
}

/* Focus and Accessibility */
button:focus,
input:focus,
textarea:focus,
a:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

/* Print Styles */
@media print {
    .generator-footer,
    .form-actions,
    .preview-actions {
        display: none;
    }
}
`;

export default cssStyles;

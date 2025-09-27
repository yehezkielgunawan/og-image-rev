import { FC } from 'hono/jsx'

interface PreviewPanelProps {
  imageUrl: string
  isLoading?: boolean
  className?: string
}

export const PreviewPanel: FC<PreviewPanelProps> = ({
  imageUrl,
  isLoading = false,
  className = ''
}) => {
  return (
    <div class={`preview-panel ${className}`}>
      <h3 class="preview-title">Preview</h3>
      <div class="preview-container">
        {isLoading && (
          <div class="preview-loading">
            <div class="loading-spinner"></div>
            <p>Generating preview...</p>
          </div>
        )}
        <img
          id="preview-image"
          src={imageUrl}
          alt="OG Image Preview"
          class={`preview-image ${isLoading ? 'loading' : ''}`}
          loading="lazy"
        />
      </div>
      <div class="preview-info">
        <p class="preview-dimensions">1200 × 630 pixels</p>
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="preview-link"
          id="preview-link"
        >
          Open full size
        </a>
      </div>
    </div>
  )
}

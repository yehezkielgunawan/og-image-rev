import { FC } from "hono/jsx";
import { FormField } from "./FormField";
import { PreviewPanel } from "./PreviewPanel";

interface OGImageEditorProps {
  initialValues?: {
    title?: string;
    description?: string;
    siteName?: string;
    social?: string;
    image?: string;
  };
  origin?: string;
}

export const OGImageEditor: FC<OGImageEditorProps> = ({
  initialValues = {},
  origin = "",
}) => {
  const defaultValues = {
    title: initialValues.title || "Your Amazing Title Here",
    description:
      initialValues.description ||
      "This is a compelling description that will appear on your OG image.",
    siteName: initialValues.siteName || "yehezgun.com",
    social: initialValues.social || "Twitter: @yehezgun",
    image:
      initialValues.image ||
      "https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png",
  };

  // Generate initial preview URL
  const generatePreviewUrl = (values: typeof defaultValues) => {
    const params = new URLSearchParams({
      title: values.title,
      description: values.description,
      siteName: values.siteName,
      social: values.social,
      image: values.image,
    });
    return `/og?${params.toString()}`;
  };

  const initialPreviewUrl = generatePreviewUrl(defaultValues);

  return (
    <div class="og-editor">
      <header class="editor-header">
        <h1>OG Image Generator</h1>
        <p class="editor-subtitle">
          Customize your Open Graph image parameters and see the results in
          real-time
        </p>
      </header>

      <div class="editor-container">
        <div class="editor-form-section">
          <h2>Customize Your Image</h2>
          <form id="og-form" class="og-form">
            <FormField
              label="Title"
              name="title"
              value={defaultValues.title}
              placeholder="Enter your title"
              required
            />

            <FormField
              label="Description"
              name="description"
              value={defaultValues.description}
              placeholder="Enter a description"
            />

            <FormField
              label="Site Name"
              name="siteName"
              value={defaultValues.siteName}
              placeholder="Your website name"
            />

            <FormField
              label="Social Handle"
              name="social"
              value={defaultValues.social}
              placeholder="e.g., Twitter: @username"
            />

            <FormField
              label="Profile Image URL"
              name="image"
              value={defaultValues.image}
              placeholder="https://example.com/image.jpg"
              type="url"
            />

            <div class="form-actions">
              <button type="button" id="reset-btn" class="btn-secondary">
                Reset to Defaults
              </button>
              <button type="button" id="copy-url-btn" class="btn-primary">
                Copy Image URL
              </button>
            </div>
          </form>
        </div>

        <div class="editor-preview-section">
          <PreviewPanel imageUrl={initialPreviewUrl} isLoading={false} />

          <div class="usage-example">
            <h4>Usage Example</h4>
            <div class="code-block">
              <pre id="usage-code">
                {`<meta property="og:image" content="${origin}${initialPreviewUrl}" />
<meta name="twitter:image" content="${origin}${initialPreviewUrl}" />`}
              </pre>
              <button type="button" id="copy-code-btn" class="copy-btn">
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

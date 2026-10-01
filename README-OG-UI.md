# Image Studio UI

A responsive web interface for generating Open Graph images and greeting cards using Hono, JSX, and WASM-powered rendering. Shared navigation connects the OG editor at `/` and Greeting Card Studio at `/cards`.

## Greeting Card Studio

1. Visit `http://localhost:8787/cards`.
2. Choose Birthday, Thank You, Congratulations, or Just Because.
3. Select a Minimal, Celebratory, or Elegant template, one of three color palettes, and square or portrait output.
4. Personalize your heading and message. Recipient and sender names are optional.
5. Wait for “Ready to send”, then click **Download PNG**.

The preview updates after 400 ms of typing, or immediately when a design selection changes. Occasion changes preserve personalized wording; template, palette, and format changes preserve all text. **Start fresh** restores the birthday defaults and clears optional names.

The editor supports 80-character headings, 400-character messages with up to 12 explicit lines, and 60-character names. Invalid fields show an error. Downloads stay disabled until the latest preview has successfully loaded. An unsuccessful update keeps the previous card visible.

Output is PNG: square **1080×1080** or portrait **1080×1350**. The downloaded file matches the preview. Cards are not persisted or assigned recipient-facing share links.

### Greeting-card implementation

- `src/cards/config.ts`: shared presets, palettes, formats, and limits.
- `src/cards/params.ts`: server-side card validation.
- `src/cards/templates/`: three Takumi node layouts and shared adaptive typography.
- `src/cards/render.ts` and `src/cards/routes.ts`: `POST /cards/render`.
- `src/cards/client.ts`: debouncing, request ordering, image decoding, download, and blob cleanup.
- `src/cards/styles.ts`: scoped greeting-card and navigation styles.
- `src/components/GreetingCardGenerator.tsx`: server-rendered editor.
- `src/components/GreetingCardClientScript.tsx`: inline browser enhancement.
- `src/components/GeneratorNavigation.tsx`: shared navigation.

Run `pnpm test:run`, `pnpm test:workers`, `pnpm typecheck`, and `pnpm typecheck:workers` to verify the feature. See [README.md](README.md#post-cardsrender) for the JSON API contract.

## Open Graph features

### 🎨 Interactive UI
- **Real-time Preview**: See your OG image update as you type with 400ms debouncing
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Clean Interface**: Minimalist design focusing on usability

### 🛠️ Customization Options
- **Title**: Main heading for your OG image (up to 100 characters)
- **Description**: Subtitle or description text (up to 200 characters)  
- **Site Name**: Your brand or website name (up to 50 characters)
- **Social Handle**: Social media contact or handle (up to 50 characters)
- **Avatar/Logo URL**: Custom image URL for profile picture or logo

### ⚡ Quick Actions
- **Preset Templates**: 4 pre-configured templates (Default, Blog Post, Product Launch, Event)
- **Copy URL**: One-click copying of generated image URL
- **Download Image**: Direct download of PNG image
- **Open in New Tab**: View full-size image in browser
- **Reset Form**: Quick reset to default values

### 🔧 Export/Import
- **Export Config**: Save your settings as JSON file
- **Import Config**: Load previously saved configurations
- **URL Generation**: Automatic URL generation for sharing

## Technical Specifications

- **Image Format**: PNG
- **Dimensions**: 1200×630 pixels (optimal for social media)
- **Aspect Ratio**: 1.91:1 (Twitter/Facebook standard)
- **Font**: Plus Jakarta Sans (Variable weight)
- **Performance**: WASM-powered rendering for fast generation

## Usage

### Starting the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Deploy to Cloudflare Workers
npm run deploy
```

### Using the Interface

1. **Open your browser** to `http://localhost:8787` (or your deployed URL)

2. **Fill in the form fields**:
   - Enter your desired title, description, site name, and social handle
   - Paste a URL to your avatar/logo image
   - Watch the preview update automatically

3. **Use presets** for quick setup:
   - Click any preset button to load predefined values
   - Customize further as needed

4. **Generate and use**:
   - Copy the generated URL for use in meta tags
   - Download the PNG directly
   - Open in new tab to view full size

### URL Parameters

The OG image endpoint accepts these query parameters:

```
/og?title=Your Title&description=Your Description&siteName=Your Site&social=@handle&image=https://example.com/avatar.png
```

Parameters:
- `title`: Main heading text
- `description`: Subtitle/description text  
- `siteName`: Brand or website name
- `social`: Social media handle or contact
- `image`: URL to avatar/logo image

### HTML Meta Tags

Use the generated URL in your HTML meta tags:

```html
<meta property="og:image" content="https://your-domain.com/og?title=Page Title&description=Page Description" />
<meta property="twitter:image" content="https://your-domain.com/og?title=Page Title&description=Page Description" />
```

## Architecture

### Frontend
- **Hono.js**: Web framework with JSX support
- **Server-Side Rendering**: Initial HTML rendered on server
- **Client-Side Enhancement**: JavaScript for interactivity
- **Vanilla CSS**: No framework dependencies
- **Responsive Grid**: CSS Grid and Flexbox layout

### Backend
- **Cloudflare Workers**: Edge computing platform
- **WASM Rendering**: Takumi-rs for image generation
- **Font Loading**: Plus Jakarta Sans variable font
- **Image Processing**: Base64 data URI conversion for external images

### Key Components

```
src/
├── index.tsx              # Main application entry
├── components/
│   └── OGImageGenerator.tsx # Main UI component
└── assets/
    └── fonts/             # Font files
```

## Customization

### Styling
The CSS is inlined in the main component. Key design tokens:

```css
/* Colors */
--bg-primary: #0f172a;     /* Dark background */
--fg-primary: #f8fafc;     /* Light text */
--fg-secondary: #cbd5e1;   /* Secondary text */

/* Typography */
--font-family: Plus Jakarta Sans
--title-size: 72px
--description-size: 36px
```

### Adding New Presets
Modify the presets object in the client-side script:

```javascript
const presets = {
  'Your Preset': {
    title: 'Your Title',
    description: 'Your Description',
    siteName: 'Your Site',
    social: 'Your Handle',
    image: 'Your Image URL'
  }
}
```

### Layout Modifications
The image layout is controlled in the `/og` route. Key elements:

- Canvas size: 1200×630px
- Padding: 64px
- Avatar size: 200px (in 260px container)
- Typography: Responsive text sizing

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript Required**: For interactive features
- **CSS Grid Support**: Required for responsive layout
- **Clipboard API**: For copy-to-clipboard functionality

## Performance

- **Debounced Updates**: 500ms delay prevents excessive requests
- **Image Caching**: Browser caching for generated images
- **WASM Rendering**: Fast server-side image generation
- **CDN Delivery**: Cloudflare edge caching

## Tips for Better OG Images

### Content Guidelines
- **Title Length**: Keep under 60 characters for best display
- **High Contrast**: Use contrasting colors for readability
- **Clear Typography**: Ensure text is legible at small sizes
- **Brand Consistency**: Match your site's visual identity

### Image Guidelines  
- **Avatar Quality**: Use high-resolution images (400×400px minimum)
- **File Format**: PNG or JPG for best compatibility
- **Loading Speed**: Optimize image file sizes
- **Fallback**: Provide fallback images for reliability

### Testing
- **Multiple Platforms**: Test on Twitter, Facebook, LinkedIn
- **Mobile Preview**: Check how images appear on mobile
- **Validation Tools**: Use social media debugging tools
- **Load Testing**: Verify images load consistently

## Deployment

### Cloudflare Workers
The application is optimized for Cloudflare Workers:

```bash
# Configure wrangler
npm run cf-typegen

# Deploy
npm run deploy
```

### Environment Variables
No special configuration needed for basic usage. For custom setups:

```bash
# Optional: Custom domain
wrangler whoami
wrangler deploy --minify
```

## Troubleshooting

### Common Issues

**Preview not updating:**
- Check browser console for JavaScript errors
- Verify all form fields have valid values
- Try refreshing the page

**Images not loading:**
- Verify image URLs are publicly accessible
- Check for CORS restrictions
- Ensure images are in supported formats (PNG, JPG)

**Slow performance:**
- Check network connection
- Verify Cloudflare Workers deployment
- Clear browser cache

### Debug Mode
Enable debug logging by opening browser console:

```javascript
// Check form values
console.log('Form data:', new FormData(document.querySelector('form')))

// Monitor preview updates
window.addEventListener('load', () => console.log('App loaded'))
```

## Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Make changes and test locally
5. Deploy to staging: `npm run deploy`

### Code Style
- Use TypeScript for type safety
- Follow Hono.js conventions
- Keep components modular
- Comment complex logic
- Test on multiple browsers

## License

This project is part of the OG Image Generator system. Refer to the main project license for usage terms.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the Hono.js documentation
3. Check Cloudflare Workers documentation
4. Open an issue in the project repository

---

**Built with ❤️ using Hono.js, JSX, and Cloudflare Workers**

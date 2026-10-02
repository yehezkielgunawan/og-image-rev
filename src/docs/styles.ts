export const docsStyles = `
.docs-page { background: #f6f4ee; color: #243b36; }
.docs-shell { max-width: 1280px; margin: 0 auto; padding: 64px 40px 48px; }
.docs-hero { padding-bottom: 48px; border-bottom: 1px solid #c8d1c8; }
.docs-eyebrow, .docs-section-number { font-family: monospace; font-size: 11px; letter-spacing: .13em; font-weight: 600; }
.docs-hero h1 { font-family: Georgia, "Times New Roman", serif; font-size: clamp(40px, 5.8vw, 76px); font-weight: 400; line-height: 1.08; letter-spacing: -.045em; margin: 24px 0; }
.docs-hero h1 em { color: #517365; }
.docs-lead { max-width: 610px; font-size: 18px; line-height: 1.75; color: #52625b; }
.docs-endpoints { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
.docs-endpoints a { display: flex; align-items: center; gap: 18px; padding: 12px 18px; border: 1px solid #abbfb0; text-decoration: none; color: #243b36; font-family: monospace; font-size: 14px; }
.docs-endpoints a:hover { background: #e5ebe1; }
.docs-endpoints a span:first-child, .docs-method span { font: 700 11px monospace; letter-spacing: .06em; color: #3d6650; background: #e4ebdc; padding: 5px 8px; }
.docs-layout { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 64px; padding-top: 48px; }
.docs-sidebar { align-self: start; position: sticky; top: 24px; }
.docs-sidebar nav { display: flex; flex-direction: column; gap: 8px; }
.docs-sidebar nav > p { margin-bottom: 14px; }
.docs-sidebar nav a { display: flex; gap: 12px; color: #374d42; text-decoration: none; font-size: 13px; padding: 8px 0; }
.docs-sidebar nav a span { font-family: monospace; color: #6e8476; }
.docs-sidebar nav a:hover { text-decoration: underline; text-underline-offset: 4px; }
.docs-sidebar > p { margin-top: 28px; border-top: 1px solid #c8d1c8; padding-top: 20px; color: #5c6e62; font-size: 12px; }
.docs-sidebar > p code { display: block; margin-top: 8px; overflow-wrap: anywhere; background: transparent; padding: 0; }
.docs-content { min-width: 0; }
.docs-section { scroll-margin-top: 24px; margin-bottom: 56px; padding-bottom: 48px; border-bottom: 1px solid #c8d1c8; }
.docs-section-number { color: #67816c; margin-bottom: 14px; }
.docs-section h2 { font-family: Georgia, "Times New Roman", serif; font-size: clamp(28px, 3vw, 38px); line-height: 1.2; font-weight: 400; letter-spacing: -.025em; margin-bottom: 20px; }
.docs-section h3 { font-family: Georgia, "Times New Roman", serif; font-size: 23px; font-weight: 400; margin-bottom: 16px; }
.docs-section p:not(.docs-section-number) { font-size: 15px; line-height: 1.8; margin-bottom: 18px; }
.docs-content a { color: #285c46; text-underline-offset: 3px; }
.docs-shell code { font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: .87em; background: #e8ebdf; padding: 2px 4px; border-radius: 2px; overflow-wrap: anywhere; }
.docs-guides { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 28px; }
.docs-guides article { border-top: 2px solid #799782; padding-top: 20px; }
.docs-guides ol { padding-left: 20px; font-size: 14px; line-height: 1.8; margin-bottom: 18px; }
.docs-guides li { padding-left: 4px; margin-bottom: 12px; }
.docs-guides li::marker { color: #62816d; font-family: monospace; }
.docs-method { display: flex; align-items: center; gap: 12px; }
.docs-method code { background: none; font-size: 17px; }
.docs-code { margin: 24px 0; border: 1px solid #294b3e; background: #193b30; color: #edf0df; }
.docs-code figcaption { background: #244639; padding: 10px 18px; border-bottom: 1px solid #3a5747; font-family: monospace; font-size: 11px; color: #bfceb7; letter-spacing: .02em; }
.docs-code pre { margin: 0; padding: 22px; overflow-x: auto; line-height: 1.8; font-size: 13px; tab-size: 2; }
.docs-code pre code { background: transparent; padding: 0; color: inherit; font-size: inherit; overflow-wrap: normal; }
.docs-table-scroll { overflow-x: auto; margin: 24px 0; }
.docs-table-scroll table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
.docs-table-scroll caption { text-align: left; font-family: monospace; font-size: 11px; color: #526e5d; padding-bottom: 12px; }
.docs-table-scroll th, .docs-table-scroll td { border-bottom: 1px solid #d1d8c9; padding: 12px 14px; vertical-align: top; min-width: 90px; }
.docs-table-scroll thead th { background: #e5eadc; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #445e4a; }
.docs-table-scroll tbody th { font-weight: 500; }
.docs-table-scroll small { display: block; margin-top: 5px; color: #5f7262; overflow-wrap: anywhere; }
.docs-note { border-left: 3px solid #799782; background: #e9edde; padding: 20px 24px; margin-top: 28px; font-size: 14px; }
.docs-note p { margin: 8px 0 0 !important; }
.docs-footer { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; font-size: 13px; }
.docs-footer p { font-family: Georgia, serif; font-size: 22px; margin-right: auto; }
.docs-page :focus-visible { outline: 2px solid #3e7658; outline-offset: 4px; }
.docs-code pre:focus-visible { outline-color: #c8d9a7; outline-offset: -4px; }
@media (max-width: 900px) {
  .docs-shell { padding: 40px 24px; }
  .docs-layout { grid-template-columns: 1fr; gap: 36px; }
  .docs-sidebar { position: static; }
  .docs-sidebar nav { flex-direction: row; flex-wrap: wrap; gap: 8px 20px; }
  .docs-sidebar nav > p { flex-basis: 100%; margin-bottom: 0; }
  .docs-sidebar > p { margin-top: 16px; padding-top: 12px; }
}
@media (max-width: 560px) {
  .docs-shell { padding: 32px 18px; }
  .docs-hero { padding-bottom: 32px; }
  .docs-lead { font-size: 16px; }
  .docs-guides { grid-template-columns: 1fr; }
  .docs-code pre { padding: 16px; font-size: 12px; }
  .docs-section { margin-bottom: 40px; padding-bottom: 32px; }
  .docs-table-scroll th, .docs-table-scroll td { padding: 10px; }
  .docs-page .studio-nav { flex-wrap: wrap; gap: 12px; }
  .docs-page .studio-nav-links { flex-wrap: wrap; }
}
`;

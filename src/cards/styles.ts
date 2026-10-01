export const cardStyles = `
.studio-nav {
  max-width: 1400px; margin: 0 auto; padding: 22px 32px;
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  border-bottom: 1px solid #e1ddd4; color: #393c32;
}
.studio-brand { font-weight: 750; text-decoration: none; color: inherit; letter-spacing: -.02em; }
.studio-brand span { font-weight: 400; color: #757668; }
.studio-nav-links { display: flex; gap: 6px; }
.studio-nav-links a { padding: 8px 14px; text-decoration: none; color: #686b60; font-size: 14px; border-radius: 6px; }
.studio-nav-links a[aria-current="page"] { background: #eae6dc; color: #383d32; font-weight: 650; }
.studio-nav a:focus-visible { outline: 2px solid #853c40; outline-offset: 4px; }
.card-page { background: #f7f3ec; color: #35392f; color-scheme: light; }
.card-studio { max-width: 1280px; margin: 0 auto; padding: 52px 32px 24px; }
.card-intro { margin-bottom: 44px; }
.card-eyebrow { color: #853c40; font-size: 11px; font-weight: 700; letter-spacing: .2em; margin-bottom: 18px; }
.card-intro h1 { font-family: Georgia, "Times New Roman", serif; font-size: clamp(42px, 5vw, 68px); font-weight: 400; line-height: 1.06; letter-spacing: -.045em; margin-bottom: 20px; }
.card-intro h1 em { font-weight: 400; color: #853c40; }
.card-intro > p:last-child { font-size: 15px; color: #707263; max-width: 480px; }
.card-workspace { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 40px; align-items: start; }
.card-editor { background: #fffdf8; border: 1px solid #e2ded4; border-radius: 10px; padding: 28px; }
.card-step { border: 0; border-bottom: 1px solid #e9e5dc; padding: 0 0 26px; margin: 0 0 26px; min-width: 0; }
.card-step:last-of-type { border-bottom: 0; padding-bottom: 0; margin-bottom: 20px; }
.card-step legend { padding: 0; margin-bottom: 18px; font-weight: 650; font-size: 15px; }
.card-step legend > span { color: #a59f91; font-size: 11px; font-weight: 500; margin-right: 10px; }
.card-step label { display: block; margin: 14px 0 7px; color: #45493d; font-size: 12px; font-weight: 650; }
.card-step label small { color: #858476; font-weight: 400; }
.card-step input, .card-step textarea, .card-step select { width: 100%; border: 1px solid #dedbd1; background: #fffdf8; border-radius: 5px; color: #35392f; padding: 11px 12px; font: inherit; font-size: 14px; line-height: 1.5; }
.card-step select { cursor: pointer; padding-right: 24px; }
.card-step textarea { resize: vertical; min-height: 130px; }
.card-step input::placeholder { color: #97978a; }
.card-step input:focus, .card-step textarea:focus, .card-step select:focus { outline: 2px solid #ba8073; outline-offset: 2px; }
.card-step [aria-invalid="true"] { border-color: #a43333; }
.card-label-row { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
.card-count { font-size: 10px; color: #8d8d7f; white-space: nowrap; font-variant-numeric: tabular-nums; }
.card-hint { font-size: 11px; color: #808172; margin-top: 7px; line-height: 1.6; }
.card-field-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.card-design-samples { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.card-design-sample { position: relative; height: 120px; padding: 16px 12px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
.card-design-sample > span { font-family: Georgia, "Times New Roman", serif; font-size: 23px; line-height: 1.08; }
.card-design-sample small { font-size: 9px; letter-spacing: .07em; }
.sample-minimal { color: #682b36; background: #fff0df; border-left: 3px solid #bb4c59; }
.sample-celebratory { color: #203f5b; background: #eaf1f7; text-align: center; }
.sample-celebratory::before, .sample-celebratory::after { content: ''; position: absolute; border-radius: 50%; background: #d69077; width: 9px; height: 9px; top: 10px; left: 10px; }
.sample-celebratory::after { top: auto; left: auto; bottom: 28px; right: 9px; background: #416e9b; }
.sample-elegant { color: #fff3e5; background: #682b36; text-align: center; outline: 1px solid #d7bd86; outline-offset: -7px; }
.card-editor-actions { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.card-editor-actions button { padding: 8px 0; background: transparent; border: 0; color: #853c40; font: inherit; font-size: 12px; cursor: pointer; }
.card-editor-actions button:first-child { color: #7d7e6e; }
.card-editor-actions button:hover { text-decoration: underline; }
.card-editor-actions button:focus-visible, .card-export button:focus-visible { outline: 2px solid #853c40; outline-offset: 4px; }
.card-preview-panel { position: sticky; top: 24px; min-width: 0; }
.card-preview-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; margin-bottom: 16px; }
.card-preview-heading h2 { font-size: 15px; font-weight: 650; }
.card-preview-heading #card-status { font-size: 11px; color: #747869; text-align: right; }
.card-preview-stage { background: #eae4d9; background-image: radial-gradient(#cfc7b6 .7px, transparent .7px); background-size: 12px 12px; border: 1px solid #ded8cc; border-radius: 8px; padding: 36px; min-height: 340px; display: flex; align-items: center; justify-content: center; }
.card-preview-stage img { display: block; width: 100%; height: auto; box-shadow: 0 16px 32px #37332524, 0 2px 4px #37332516; }
.card-preview-stage [hidden], .card-preview-panel [hidden] { display: none; }
.card-empty { text-align: center; color: #83806f; font-size: 13px; }
.card-empty > span { display: block; font-size: 40px; color: #aaa28e; margin-bottom: 15px; }
.card-export { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 22px; }
.card-export p { font-size: 11px; color: #787a6c; font-variant-numeric: tabular-nums; }
.card-export button { background: #853c40; border: 1px solid #853c40; color: #fffaf4; border-radius: 5px; padding: 13px 18px; font: inherit; font-size: 12px; cursor: pointer; transition: background .15s; }
.card-export button > span { margin-left: 18px; }
.card-export button:hover:not(:disabled) { background: #6d3034; }
.card-export button:disabled { opacity: .45; cursor: not-allowed; }
.card-preview-note { font-family: Georgia, "Times New Roman", serif; font-style: italic; font-size: 13px; color: #898777; line-height: 1.8; margin-top: 24px; text-align: center; }
.card-error { background: #f9e8e1; color: #8d3034; border-left: 2px solid #a63c42; padding: 12px; font-size: 12px; margin-top: 16px; }
.card-footer { display: flex; justify-content: space-between; gap: 20px; border-top: 1px solid #e1ddd4; margin-top: 48px; padding-top: 20px; color: #8b8b7c; font-size: 11px; }
@media (max-width: 900px) {
  .card-workspace { gap: 24px; }
  .card-editor { padding: 20px; }
  .card-preview-stage { padding: 22px; }
  .card-design-sample > span { font-size: 19px; }
}
@media (max-width: 700px) {
  .studio-nav { padding: 16px 20px; flex-wrap: wrap; }
  .studio-brand span { display: none; }
  .studio-nav-links a { padding: 7px 9px; font-size: 12px; }
  .card-studio { padding: 32px 20px 20px; }
  .card-intro { margin-bottom: 28px; }
  .card-workspace { grid-template-columns: minmax(0, 1fr); }
  .card-preview-panel { position: static; }
  .card-design-sample > span { font-size: 23px; }
  .card-step input, .card-step textarea, .card-step select { font-size: 16px; }
  .card-footer { flex-direction: column; gap: 4px; }
}
@media (max-width: 420px) {
  .card-field-pair { grid-template-columns: 1fr; gap: 0; }
}
`;

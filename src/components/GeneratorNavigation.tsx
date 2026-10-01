export function GeneratorNavigation({ active }: { active: "og" | "cards" }) {
  return (
    <nav class="studio-nav" aria-label="Image generators">
      <a class="studio-brand" href="/"><img src="/icon.svg" alt="" width="36" height="36" />Yehez<span> / image studio</span></a>
      <div class="studio-nav-links">
        <a href="/" aria-current={active === "og" ? "page" : undefined}>Open Graph</a>
        <a href="/cards" aria-current={active === "cards" ? "page" : undefined}>Greeting Cards</a>
      </div>
    </nav>
  );
}

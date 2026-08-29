import { SITE_LINKS } from "../site-config";

export function QuickLinks({ onPrivacy }: { onPrivacy: () => void }) {
  return (
    <nav className="footerbar" aria-label="Enlaces rápidos">
      <a href={SITE_LINKS.mainWebsite} target="_top">Página del doctor</a>
      <a href={SITE_LINKS.whatsapp} target="_blank" rel="noreferrer">WhatsApp · 477 123 53 88</a>
      <a href={SITE_LINKS.maps} target="_blank" rel="noreferrer">Ubicación</a>
      <a href={SITE_LINKS.instagram} target="_blank" rel="noreferrer">Instagram</a>
      <a href="/doctor">Área del doctor</a>
      <button onClick={onPrivacy}>Privacidad</button>
    </nav>
  );
}

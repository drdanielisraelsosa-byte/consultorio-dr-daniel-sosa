import { SITE_LINKS } from "../site-config";

export function CreativeEducation() {
  return (
    <section className="creative-section" aria-labelledby="creative-title">
      <img src="/logo-round.jpg" alt="Identidad del Dr. Daniel Sosa" />
      <div>
        <span>ESPACIO CREATIVO Y EDUCATIVO</span>
        <h2 id="creative-title">Medicina en formato audiovisual</h2>
        <p>Contenido claro para aprender sobre salud, comprender el cuerpo y tomar mejores decisiones de autocuidado.</p>
        <a href={SITE_LINKS.instagram} target="_blank" rel="noreferrer">Explorar contenido en Instagram</a>
      </div>
    </section>
  );
}

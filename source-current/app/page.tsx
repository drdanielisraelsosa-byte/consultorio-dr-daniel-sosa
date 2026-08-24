"use client";

import { useEffect, useRef, useState } from "react";
import { CAREER_CITIES, PageId, SITE } from "./site-data";

const MAIN_NAV: { id: PageId; label: string }[] = [
  { id: "inicio", label: "Inicio" },
  { id: "consulta", label: "Consulta" },
  { id: "ubicacion", label: "Ubicación" },
  { id: "contacto", label: "Contacto" },
  { id: "costos", label: "Servicios y costos" },
];

const PAGE_LABEL: Record<PageId, string> = {
  inicio: "Inicio",
  consulta: "Consulta",
  ubicacion: "Ubicación",
  contacto: "Contacto y urgencias",
  costos: "Servicios y costos",
  perfil: "El médico",
  trayectoria: "Trayectoria",
};

const PAGE_GRAPH: Record<PageId, { left?: PageId; right?: PageId }> = {
  inicio: { left: "consulta", right: "perfil" },
  consulta: { left: "ubicacion", right: "inicio" },
  ubicacion: { left: "contacto", right: "consulta" },
  contacto: { left: "costos", right: "ubicacion" },
  costos: { right: "contacto" },
  perfil: { left: "inicio", right: "trayectoria" },
  trayectoria: { left: "perfil" },
};

const CLINICAL_CITIES = CAREER_CITIES.filter((city) => city.kind === "Hospitalaria");
const EXTRACURRICULAR_CITIES = CAREER_CITIES.filter((city) => city.kind === "Extracurricular");

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "arrow-left") return <svg {...props}><path d="M19 12H5m6-6-6 6 6 6" /></svg>;
  if (name === "arrow-right") return <svg {...props}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
  if (name === "calendar") return <svg {...props}><path d="M6 3v3m12-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" /><path d="m8 15 2.2 2.2L16 11" /></svg>;
  if (name === "whatsapp") return <svg {...props}><path d="M20 11.6a8 8 0 0 1-11.7 7.1L4 20l1.3-4.1A8 8 0 1 1 20 11.6Z" /><path d="M8.2 8c.6 3.1 2.2 4.7 5.2 5.9l1.3-1.3 2 .9c0 1.7-1 2.4-2.4 2.4-4.4-.5-6.9-3-7.7-7.2.1-1.3.8-2 1.9-2.2l.9 2-1.2 1.1" /></svg>;
  if (name === "instagram") return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.7" r=".8" fill="currentColor" stroke="none" /></svg>;
  if (name === "pin") return <svg {...props}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
  if (name === "clock") return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>;
  if (name === "check") return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></svg>;
  if (name === "cross") return <svg {...props}><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z" /></svg>;
  if (name === "phone") return <svg {...props}><path d="M7.5 3.5 10 8 8.3 9.7a14 14 0 0 0 6 6L16 14l4.5 2.5c-.3 2.5-1.8 4-4.2 4C9.2 19.6 4.4 14.8 3.5 7.7c0-2.4 1.5-3.9 4-4.2Z" /></svg>;
  if (name === "close") return <svg {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  return <svg {...props}><circle cx="12" cy="12" r="9" /></svg>;
}

function ExternalAction({ href, icon, children, tone = "gold", compact = false }: { href: string; icon: string; children: React.ReactNode; tone?: "gold" | "glass" | "whatsapp"; compact?: boolean }) {
  return <a className={`external-action ${tone} ${compact ? "compact" : ""}`} href={href} target="_blank" rel="noreferrer"><Icon name={icon} size={compact ? 17 : 20} /><span>{children}</span>{!compact && <Icon name="arrow-right" size={16} />}</a>;
}

function ContactAction({ href, icon, kicker, label, tone }: { href: string; icon: string; kicker: string; label: string; tone: "whatsapp" | "instagram" }) {
  return <a className={`contact-action ${tone}`} href={href} target="_blank" rel="noreferrer"><span className="contact-action-icon"><Icon name={icon} size={19} /></span><span><small>{kicker}</small><b>{label}</b></span><Icon name="arrow-right" size={16} /></a>;
}

function Screen({ id, page, className = "", children }: { id: PageId; page: PageId; className?: string; children: React.ReactNode }) {
  return <section className={`screen ${className} ${page === id ? "active" : ""}`} data-page={id} aria-hidden={page !== id}><div className="screen-content">{children}</div></section>;
}

export default function Home() {
  const [page, setPage] = useState<PageId>("inicio");
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const wheelLocked = useRef(false);

  const go = (next?: PageId) => {
    if (!next || next === page) return;
    setPage(next);
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-page="${next}"]`)?.scrollTo({ top: 0 }));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "PageDown") go(PAGE_GRAPH[page].left);
      if (event.key === "ArrowRight" || event.key === "PageUp") go(PAGE_GRAPH[page].right);
      if (event.key === "Home") go("inicio");
      if (event.key === "Escape") setPhotoIndex(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [page]);

  const onWheel = (event: React.WheelEvent<HTMLElement>) => {
    if (Math.abs(event.deltaY) < 34 || wheelLocked.current) return;
    const scrollZone = (event.target as HTMLElement).closest<HTMLElement>("[data-scroll-zone]");
    if (scrollZone) {
      const canMoveDown = scrollZone.scrollTop + scrollZone.clientHeight < scrollZone.scrollHeight - 2;
      const canMoveUp = scrollZone.scrollTop > 2;
      if ((event.deltaY > 0 && canMoveDown) || (event.deltaY < 0 && canMoveUp)) return;
    }
    const next = event.deltaY > 0 ? PAGE_GRAPH[page].left : PAGE_GRAPH[page].right;
    if (!next) return;
    wheelLocked.current = true;
    go(next);
    window.setTimeout(() => { wheelLocked.current = false; }, 720);
  };

  const leftPage = PAGE_GRAPH[page].left;
  const rightPage = PAGE_GRAPH[page].right;

  return <main className={`site-shell page-${page}`} onWheel={onWheel} onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={(event) => {
    if (!touchStart.current) return;
    const dx = event.changedTouches[0].clientX - touchStart.current.x;
    const dy = event.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 58 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
    go(dx < 0 ? PAGE_GRAPH[page].left : PAGE_GRAPH[page].right);
  }}>
    <header className="site-header">
      <button className="brand" onClick={() => go("inicio")} aria-label="Ir al inicio"><img src={SITE.doctor.logo} alt="Emblema del Dr. Daniel Sosa" /><span><strong>{SITE.doctor.shortName}</strong><small>{SITE.doctor.title} · Céd. {SITE.doctor.license}</small></span></button>
      <nav aria-label="Secciones principales">{MAIN_NAV.map((item) => <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => go(item.id)} aria-current={page === item.id ? "page" : undefined}>{item.label}</button>)}</nav>
      <div className="header-actions"><ExternalAction href={SITE.links.calendar} icon="calendar" compact>Agenda</ExternalAction><ExternalAction href={SITE.links.whatsapp} icon="whatsapp" tone="whatsapp" compact>WhatsApp</ExternalAction></div>
    </header>

    <div className="stage">
      <div className="ambient" aria-hidden="true"><i /><i /><i /></div>
      <aside className="physician-portrait" aria-label="Retrato profesional del Dr. Daniel Sosa"><img src={SITE.doctor.portrait} alt="Dr. Daniel Israel Sosa De Santiago con bata blanca" /><div className="portrait-shade" /><div className="portrait-signature"><span>Atención médica privada</span><strong>León · Guanajuato</strong></div></aside>

      <Screen id="inicio" page={page} className="screen-home">
        <div className="home-grid"><div className="hero-copy"><p className="eyebrow"><span /> Consulta médica privada · León</p><h1>Claridad clínica.<br /><em>Atención humana.</em></h1><p className="hero-lead">Una consulta directa, cuidadosa y sin rodeos para entender qué ocurre y definir el siguiente paso con criterio médico.</p><div className="hero-actions"><ExternalAction href={SITE.links.calendar} icon="calendar">Agendar una cita</ExternalAction><ExternalAction href={SITE.links.whatsapp} icon="whatsapp" tone="glass">Hablar por WhatsApp</ExternalAction></div><div className="trust-row"><span><b>{SITE.consultation.inPerson}</b>Presencial</span><span><b>{SITE.consultation.duration}</b>Por consulta</span><span><b>{SITE.doctor.license}</b>Cédula profesional</span></div></div><button className="profile-branch" onClick={() => go("perfil")}><span className="branch-number">17</span><span><small>Años en ciencias médicas</small><b>Conoce al médico</b></span><Icon name="arrow-right" /></button></div>
      </Screen>

      <Screen id="consulta" page={page} className="screen-consultation">
        <div className="section-heading"><p className="eyebrow"><span /> Consulta y horarios</p><h2>Lo esencial, antes de reservar.</h2><p>Atención de primer contacto para adultos y niñas o niños mayores de 2 años.</p></div>
        <div className="consultation-layout"><article className="feature-card primary-card"><span className="card-icon"><Icon name="cross" /></span><small>Consulta general · {SITE.consultation.inPerson}</small><h3>Valoración clínica integral</h3><p>Historia clínica, exploración física, orientación diagnóstica, tratamiento y seguimiento.</p><button onClick={() => go("costos")}>Ver todos los servicios <Icon name="arrow-right" size={16} /></button></article><div className="schedule-card"><div className="schedule-title"><Icon name="clock" /><span><small>Días de atención</small><strong>{SITE.consultation.days}</strong></span></div><div className="schedule-hours"><b>09:00–14:00</b><i /><b>16:00–21:00</b></div><p>Dos horas libres entre 14:00 y 16:00. Anticipo de {SITE.consultation.advance} para confirmar.</p><ExternalAction href={SITE.links.calendar} icon="calendar" tone="glass">Consultar disponibilidad</ExternalAction></div><article className="feature-card"><span className="card-icon"><Icon name="phone" /></span><small>También disponible</small><h3>Consulta en línea</h3><p>Orientación y seguimiento remoto cuando el motivo no requiere exploración física inmediata.</p><b className="feature-price">{SITE.consultation.online}</b></article></div>
      </Screen>

      <Screen id="ubicacion" page={page} className="screen-location">
        <div className="location-layout"><div className="location-map"><iframe title="Mapa del consultorio en Plaza del Bosque" src={SITE.location.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><a className="map-route-button" href={SITE.links.maps} target="_blank" rel="noreferrer"><span className="map-route-icon"><Icon name="pin" size={18} /></span><span><small>Ubicación exacta</small><b>Abrir ruta en Google Maps</b></span><Icon name="arrow-right" size={16} /></a></div><div className="location-copy" data-scroll-zone><p className="eyebrow"><span /> Cómo llegar</p><h2>{SITE.location.name}</h2><p className="address">{SITE.location.address}</p><div className="arrival-guide"><Icon name="pin" /><p><b>Referencia visual</b>{SITE.location.guide}</p></div><div className="location-gallery" aria-label="Fotografías del consultorio">{SITE.locationPhotos.map((photo, index) => <button key={photo.src} onClick={() => setPhotoIndex(index)}><img src={photo.src} alt={photo.caption} /><span>{photo.label}</span></button>)}</div></div></div>
      </Screen>

      <Screen id="contacto" page={page} className="screen-contact">
        <div className="section-heading compact-heading"><p className="eyebrow"><span /> Contacto y atención fuera de horario</p><h2>Ayuda clara cuando el horario cambia.</h2><p>La atención extraordinaria depende de la disponibilidad y confirmación directa del médico.</p></div>
        <div className="after-hours-layout"><div className="after-hours-list">{SITE.afterHours.map((item) => <article key={`${item.detail}-${item.period}`}><div><small>{item.detail}</small><strong>{item.period}</strong></div><b>{item.price}</b></article>)}</div><div className="contact-stack"><div className="emergency-notice"><span><Icon name="cross" /></span><div><small>Urgencia verdadera</small><h3>No espere una respuesta por mensaje.</h3><p>Dolor intenso de pecho, dificultad grave para respirar, pérdida de conciencia, signos de EVC, convulsiones, sangrado abundante o traumatismo grave requieren atención hospitalaria inmediata.</p><b>Llame al 911 o acuda al hospital más cercano.</b></div></div><div className="contact-actions"><ContactAction href={SITE.links.whatsapp} icon="whatsapp" kicker="Atención por WhatsApp" label="477 123 5388" tone="whatsapp" /><ContactAction href={SITE.links.instagram} icon="instagram" kicker="Instagram profesional" label="@leinadrd" tone="instagram" /></div></div></div>
      </Screen>

      <Screen id="costos" page={page} className="screen-costs">
        <div className="section-heading inline-heading"><div><p className="eyebrow"><span /> Servicios y costos</p><h2>Honorarios claros, sin rodeos.</h2></div><p>Consulta médica y procedimientos ambulatorios con costos visibles antes de agendar.</p></div>
        <div className="services-scroll" data-scroll-zone><div className="services-grid">{SITE.services.map((service, index) => <article key={service.title} className="service-card"><img src={service.image} alt="" /><div><span>{String(index + 1).padStart(2, "0")}</span><h3>{service.title}</h3><p>{service.description}</p><div className="service-card-footer"><b>{service.price}</b><small>El costo del servicio no incluye el costo del material.</small></div></div></article>)}</div><p className="services-disclaimer"><b>Importante</b><span>El costo del servicio es independiente del costo de la consulta y no incluye material o anestesia.</span></p></div>
      </Screen>

      <Screen id="perfil" page={page} className="screen-profile">
        <div className="profile-layout"><div><p className="eyebrow"><span /> Identidad profesional</p><h2>{SITE.doctor.name}</h2><p className="profile-lead">Médico Cirujano con una práctica construida alrededor de la escucha, la explicación clara y el criterio clínico.</p><div className="credential-line"><span><small>Cédula profesional</small><b>{SITE.doctor.license}</b></span><span><small>Práctica privada</small><b>León · 2026</b></span><span><small>Atención</small><b>Mayores de 2 años</b></span></div><div className="profile-actions"><button onClick={() => go("trayectoria")} className="internal-action">Ver trayectoria completa <Icon name="arrow-right" /></button><ExternalAction href={SITE.links.whatsapp} icon="whatsapp" tone="glass">Contactar</ExternalAction></div></div><div className="profile-metrics"><article><b>17</b><span>Años de formación en ciencias médicas</span></article><article><b>10+</b><span>Años de práctica clínica hospitalaria</span></article><article><b>ACLS</b><span>Certificación en reanimación avanzada</span></article></div><p className="origin-note">Nacido en El Paso en 1991 · Originario de Ciudad Juárez · Formación médica desde 2009</p></div>
      </Screen>

      <Screen id="trayectoria" page={page} className="screen-career">
        <div className="career-flow" data-scroll-zone>
          <section className="career-intro">
            <p className="eyebrow"><span /> Trayectoria clínica y formación médica</p>
            <h2>Experiencia que respalda cada valoración.</h2>
            <p className="career-lead">Más de 17 años de formación en ciencias médicas y más de 10 años de práctica clínica hospitalaria, con exposición progresiva a urgencias, cirugía, medicina interna y atención integral.</p>
            <div className="career-metrics">
              <article><b>17</b><span>Años de formación médica</span></article>
              <article><b>10+</b><span>Años de práctica hospitalaria</span></article>
              <article><b>ACLS</b><span>Reanimación avanzada</span></article>
              <article><b>2009</b><span>Inicio de formación</span></article>
            </div>
          </section>

          <section className="clinical-experience">
            <div className="career-section-heading"><small>Experiencia clínica hospitalaria</small><h3>Rotaciones en instituciones públicas y privadas.</h3><p>La trayectoria integra atención de alta demanda, hospitales de referencia, práctica quirúrgica, consulta ambulatoria y docencia clínica.</p></div>
            <div className="sector-grid">
              <article><span>01</span><div><small>Sector público</small><b>Atención institucional</b><p>Experiencia en hospitales generales, comunitarios y de seguridad social, con contacto directo con urgencias y atención hospitalaria.</p></div></article>
              <article><span>02</span><div><small>Sector privado</small><b>Medicina de referencia</b><p>Rotaciones y práctica en instituciones privadas con servicios especializados, cirugía y atención clínica multidisciplinaria.</p></div></article>
            </div>
            <div className="practice-areas"><span>Urgencias</span><span>Cirugía general</span><span>Medicina interna</span><span>Atención integral</span><span>Docencia clínica</span></div>
          </section>

          <section className="rotations-section">
            <div className="career-section-heading"><small>Rotaciones y sedes clínicas</small><h3>Recorrido profesional por ciudad.</h3><p>Los hospitales aparecen como respaldo visual de la experiencia, agrupados de manera clara por sede.</p></div>
            <div className="career-cities">
              {CLINICAL_CITIES.map((city, cityIndex) => <section className="career-city-section" key={city.id}>
                <header><span>{String(cityIndex + 1).padStart(2, "0")}</span><div><small>{city.region}</small><h4>{city.city}</h4><p>{city.note}</p></div></header>
                <div className="hospital-cards continuous">{city.hospitals.map((hospital) => <a key={hospital.name} href={hospital.url} target="_blank" rel="noreferrer" className="hospital-card"><img src={hospital.image} alt={`Fachada o sede de ${hospital.name}`} loading="lazy" referrerPolicy="no-referrer" /><div><small>Sede de rotación clínica</small><strong>{hospital.name}</strong><span>Ver institución <Icon name="arrow-right" size={14} /></span></div></a>)}</div>
              </section>)}
            </div>
          </section>

          <section className="extracurricular-section">
            <div className="career-section-heading"><small>Formación extracurricular</small><h3>Preparación presencial en Estados Unidos.</h3><p>Programas intensivos orientados a ciencias básicas, razonamiento clínico y preparación USMLE.</p></div>
            <div className="education-grid">{EXTRACURRICULAR_CITIES.map((city) => <article key={city.id} className="education-card"><img src={city.hospitals[0]?.image} alt={`Kaplan en ${city.city}`} loading="lazy" referrerPolicy="no-referrer" /><div><small>{city.region}</small><h4>{city.city}</h4><p>{city.note}</p><a href={city.hospitals[0]?.url} target="_blank" rel="noreferrer">Kaplan Medical <Icon name="arrow-right" size={14} /></a></div></article>)}</div>
          </section>
        </div>
      </Screen>

      <div className="edge-controls" aria-label="Navegación lateral"><button className="edge-button left" disabled={!leftPage} onClick={() => go(leftPage)}><Icon name="arrow-left" /><span><small>Desliza a la izquierda</small><b>{leftPage ? PAGE_LABEL[leftPage] : "Fin"}</b></span></button><div className="current-page"><span>{PAGE_LABEL[page]}</span><i /></div><button className="edge-button right" disabled={!rightPage} onClick={() => go(rightPage)}><span><small>Desliza a la derecha</small><b>{rightPage ? PAGE_LABEL[rightPage] : "Fin"}</b></span><Icon name="arrow-right" /></button></div>
    </div>

    {photoIndex !== null && <div className="lightbox" role="presentation" onClick={() => setPhotoIndex(null)}><figure role="dialog" aria-modal="true" aria-label={SITE.locationPhotos[photoIndex].label} onClick={(event) => event.stopPropagation()}><button onClick={() => setPhotoIndex(null)} aria-label="Cerrar imagen"><Icon name="close" /></button><img src={SITE.locationPhotos[photoIndex].src} alt={SITE.locationPhotos[photoIndex].caption} /><figcaption><b>{SITE.locationPhotos[photoIndex].label}</b><span>{SITE.locationPhotos[photoIndex].caption}</span></figcaption></figure></div>}
  </main>;
}

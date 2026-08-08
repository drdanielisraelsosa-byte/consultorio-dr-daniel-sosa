# NUEVA GUÍA MAESTRA DE EDICIÓN  
## Consultorio Dr. Daniel Israel Sosa de Santiago  
**Versión:** 2.0 · **Fecha:** 8 de agosto de 2026  
**Documento Maestro de referencia:** v1.0 (5 de agosto de 2026)  
**Hosting:** GitHub Pages (preferente) · alternativas Netlify Free / Cloudflare Pages  
**Regla de oro:** modularidad total · cero costo · listo el mismo día  

---

## 1. Propósito de esta guía

Este documento es la **única referencia operativa** para editar, mantener y republicar el sitio one-page del consultorio **sin presupuesto**, sin frameworks de pago y sin conocimientos avanzados de programación.

**Formato de entrega:** Markdown (`.md`) listo para abrir en cualquier editor y convertir a Word (`.docx`) o PDF con:

- Microsoft Word → *Archivo → Abrir → GUIA-MAESTRA-EDICION.md* (o copiar/pegar)
- Google Docs → *Archivo → Abrir → Subir*
- Pandoc (gratis): `pandoc GUIA-MAESTRA-EDICION.md -o GUIA-MAESTRA-EDICION.pdf`
- VS Code / Cursor → previsualizar Markdown y exportar PDF

---

## 2. Limitantes inamovibles (conteo y lista)

| # | Limitante | Cumplimiento |
|---|-----------|--------------|
| 1 | **Cero presupuesto** | Sin APIs de pago, sin plantillas premium, sin CDN de costo |
| 2 | **Solo HTML/CSS puro** | Sin React, sin build obligatorio, sin Node en producción |
| 3 | **Google Maps embed gratuito** | iframe `maps.google.com` + enlace `maps.app.goo.gl` |
| 4 | **WhatsApp vía wa.me** | `https://wa.me/5214771235388` |
| 5 | **Instagram + Facebook** | Enlaces públicos del doctor |
| 6 | **Google Calendar** | Appointment schedule gratuito de Google |
| 7 | **Hosting 100 % gratuito** | GitHub Pages / Netlify Free / Cloudflare Pages |
| 8 | **Modularidad total** | Comentarios `<!-- MÓDULO: … -->` + IDs/clases estables |
| 9 | **Mobile-first** | Diseño primero en ~390 px; tablas apiladas < 640 px |
| 10 | **Áreas táctiles ≥ 44 px** | Botones, nav, redes, float WA |
| 11 | **CTAs duales siempre juntos** | WhatsApp + Google Calendar en el mismo bloque |
| 12 | **Sin alterar IDs de sección** | `#inicio` `#sobre-mi` `#servicios` `#ubicacion` `#horarios` `#cita` `#contacto` |

**Total de limitantes activas: 12**

---

## 3. Estructura del sitio (mapa de módulos)

```
consultorio-dr-daniel-sosa/
├── index.html                 ← Contenido modular (textos)
├── styles.css                 ← Estilos (tokens, layout, mobile)
├── GUIA-MAESTRA-EDICION.md    ← Esta guía
├── README.md                  ← Resumen público del repositorio
└── assets/
    ├── logo.png               ← Logo / OG / favicon
    ├── logo.svg               ← Versión vectorial (opcional)
    ├── doctor-photo.jpg       ← Foto profesional del doctor
    ├── qr-consultorio.png     ← QR para compartir (opcional)
    ├── silhouettes/           ← (opcional) PNG transparentes anatómicos
    └── gifs/                  ← (opcional) 3–5 GIFs ligeros
```

### Secciones (IDs estables — no renombrar)

| ID | Módulo | Qué editar |
|----|--------|------------|
| `#inicio` | Hero | Badge, título, subtítulo, meta, foto, CTAs |
| `#sobre-mi` | Biografía | Texto profesional/modesto + experiencia clínica + CTAs |
| `#servicios` | 6 tarjetas | Títulos, listas y subdivisiones de cada servicio |
| `#ubicacion` | Mapa + amenidades | Dirección, iframe Maps, lista de amenidades |
| `#horarios` | Horarios/precios/pago | Tablas, Scotiabank, factura |
| `#cita` | Reserva | CTAs duales (texto de botones y enlaces) |
| `#contacto` | Contacto y redes | WhatsApp, dirección, IG, FB |
| `footer` | Urgencias + COFEPRIS | Lista de emergencias, regla 15 min, aviso sanitario |

### Comentarios de módulo

En `index.html` cada bloque editable está envuelto así:

```html
<!-- MÓDULO: [NOMBRE] – EDITAR SOLO ESTE TEXTO -->
```

**Regla:** cambie **solo el texto** entre las etiquetas. No borre `id`, `class`, `href` de estructura ni los botones duales.

---

## 4. Instrucciones exactas de edición por módulo

### 4.1 Header
- **Logo texto:** `.logo-text` (nombre + subtítulo “Médico Cirujano”).
- **Nav:** enlaces con `href="#…"`; no cambie los destinos si no cambia los IDs.
- **Botón WA:** mantenga `https://wa.me/5214771235388`.

### 4.2 Hero (`#inicio`)
1. Badge (cédula).
2. Título (`h1`) y frase resaltada en `<span>`.
3. Subtítulo (`.hero-sub`).
4. Meta (ubicación, horario, precio desde).
5. Foto: `assets/doctor-photo.jpg` — ver §5 especificaciones.
6. **CTAs duales:** no elimine uno de los dos botones.

### 4.3 Sobre mí (`#sobre-mi`)
Texto del Documento Maestro (tono profesional y modesto):

- Cédula **12296387**, obtención **2020**.
- Maestría **parcial / en curso** (sin jactancia).
- Experiencia **hospitalaria**.
- Apertura del consultorio **2026**.
- Prioridad: claridad, sin prisas, plan comprensible.
- Lista de experiencia clínica (urgencias, cirugía, interna, gine, pedia, trauma, psiquiatría).

**No usar** superlativos de marketing (“el mejor”, “número uno”, “expertos exclusivos”).

### 4.4 Servicios (`#servicios`) — seis tarjetas

| # | Título | Subdivisiones clave |
|---|--------|---------------------|
| 1 | Consulta general | HC, exploración, imagen, laboratorio, plan, seguimiento, prevención |
| 2 | Aplicación de inyección | IM, IV, SC, intraarticular + nota de receta |
| 3 | Certificados | Prenupcial, licencia, escolar, laboral, justificante |
| 4 | Expediente clínico | HC, evolución, interconsulta, referencia, justificante, receta digital, 2.ª opinión, resumen EN |
| 5 | Curaciones | Menor (1.er grado, abrasiones, sin sutura) / Mayor (sangrado, postqx, úlceras) |
| 6 | Suturas y procedimientos | Sutura simple/compleja/absorbible, oído, verrugas, lipomas, sondas, pie diabético, IV, domicilio selecta |

Para editar: busque `<!-- MÓDULO: SERVICIO N -->` y modifique solo `<li>` y párrafos.

### 4.5 Ubicación (`#ubicacion`)
- Dirección completa en `.section-sub`.
- iframe de Google Maps (gratis).
- Enlace “Abrir en Google Maps”.
- Amenidades en `.amenidad`.

### 4.6 Horarios (`#horarios`)
- Tabla **Consulta regular** y **Urgencias** (precios en MXN).
- Bloque **Scotiabank**:
  - Titular: **Daniel Israel Sosa De Santiago**
  - Concepto: **consulta médica**
- Nota pequeña de **facturación** (CFDI bajo solicitud).
- **CLABE / número de cuenta:** solo publicar si el doctor lo autoriza (hay comentario HTML preparado).

### 4.7 Cita (`#cita`)
Mantener **siempre juntos**:
1. WhatsApp (con mensaje prellenado opcional).
2. Google Calendar (schedule del doctor).

### 4.8 Contacto (`#contacto`)
- Número WA visible: **477 123 5388**
- Dirección
- Instagram y Facebook (actualizar `href` si cambian perfiles)

### 4.9 Footer — urgencias + COFEPRIS
- Lista completa de situaciones de emergencia (alto contraste).
- **Regla de los 15 minutos** (`.rule-15`).
- Aviso formal **COFEPRIS** / FF-COFEPRIS-02.
- Copyright año.

---

## 5. Especificaciones de imágenes (tamaño / calidad / peso)

| Archivo | Uso | Formato | Tamaño visual | Peso máximo recomendado | Calidad |
|---------|-----|---------|---------------|-------------------------|---------|
| `assets/logo.png` | Header, footer, favicon, OG WhatsApp | PNG | 480×480 px (cuadrado) | **≤ 200 KB** (ideal ≤ 120 KB) | Fondo limpio; exportar “Save for Web” |
| `assets/logo.svg` | Alternativa vectorial | SVG | — | ≤ 50 KB | Trazos simples |
| `assets/doctor-photo.jpg` | Hero | JPG | 800×800 a 1200×1200 | **≤ 150 KB** (ideal 80–120 KB) | 70–80 % calidad; `object-position: top` |
| `assets/qr-consultorio.png` | Compartir / material impreso | PNG | 512×512 | ≤ 80 KB | Alto contraste |
| Siluetas anatómicas | Decoración sutil | PNG **transparente** | 400–600 px alto | ≤ 40 KB c/u | 1 bit alpha; sin sombras pesadas |
| GIFs opcionales (3–5) | Atmósfera / proceso | GIF o WebP animado | ≤ 320 px lado | **≤ 300 KB c/u** (ideal ≤ 150 KB) | 8–12 fps; pocos colores |

### Recomendaciones de peso y calidad

1. **Total de la página en primera carga (sin GIFs):** objetivo **< 500 KB** (HTML+CSS+logo+foto).
2. Comprima JPG con [Squoosh](https://squoosh.app) (gratis) o TinyJPG.
3. PNG del logo: use paleta optimizada; evite PNG de 2–3 MB.
4. **No suba** RAW de cámara ni capturas de pantalla sin recortar.
5. Siluetas: opacidad CSS ya está en ~12 % (`.silhouette`); no ponga siluetas opacas.
6. GIFs: deje las clases `gif-slot--hidden` hasta tener archivos reales; active quitando esa clase y poniendo `<img src="assets/gifs/…">`.
7. Open Graph (`og:image`): use `logo.png` cuadrado ≥ 300 px para previsualización en WhatsApp.

### Textos alternativos (accesibilidad)
- Toda `<img>` debe tener `alt` descriptivo en español.
- Iconos decorativos: `aria-hidden="true"`.
- Mapa: `title` y `aria-label` en el iframe / botón.

---

## 6. CSS: qué se puede tocar y qué no

**Archivo:** `styles.css`

| Sí editar | No editar / no borrar |
|-----------|------------------------|
| Tokens en `:root` (colores, tipografía) | Nombres de clases usadas en HTML |
| Espaciados, sombras, radios | IDs de sección |
| Media queries de breakpoint | Selectores de tablas mobile (`.hours-grid`) |
| Opacidad de `.silhouette` | Mínimos de `.btn` / `.float-wa` (44 px) |

**Atmósferas por sección (clases):**
- `.atmosphere-hero` / `#inicio`
- `.atmosphere-light` / `#sobre-mi` `#ubicacion` `#contacto`
- `.atmosphere-soft` / `#servicios` `#horarios`
- `.atmosphere-accent` / `#cita`

**Preparación siluetas:** `.silhouette`, `.silhouette--full|chest|abdomen|limb|head`  
**Preparación GIFs:** `.gif-pack`, `.gif-slot`, `.gif-slot--hidden`

---

## 7. Integraciones (checklist de enlaces)

| Integración | URL / valor | Dónde |
|-------------|-------------|--------|
| WhatsApp | `https://wa.me/5214771235388` | Header, hero, sobre-mí, cita, contacto, float |
| Google Calendar | Schedule `AcZssZ01XIokL2JCqR9Tcm1MCGEZz2pidBiTgsVSr8Rq3enmHzGva0LFjXROWNyhxLj77wXd6EOQkv14` | Hero, sobre-mí, cita |
| Google Maps embed | iframe q=José María Cruz 633… | `#ubicacion` |
| Google Maps app | `https://maps.app.goo.gl/kkC9djB9A528P9Ty7?g_st=ac` | Botón ubicación |
| Instagram | perfil `leinadrd` | `#contacto` |
| Facebook | share link del doctor | `#contacto` |
| Scotiabank | Titular + concepto “consulta médica” | `#horarios` |

**CTAs duales:** en hero, sobre-mí y cita deben aparecer **WhatsApp y Calendar lado a lado** (`.cta-pair`).

---

## 8. Accesibilidad y contraste

- Contraste texto/fondo: verde oscuro `#084045` / texto `#142426` sobre blancos y grises claros.
- Footer de urgencias: fondo casi negro + borde rojo + texto claro (alto contraste intencional).
- `:focus-visible` con anillo dorado.
- `lang="es"` en `<html>`.
- `aria-label` en botones WA, redes, float y mapa.
- `prefers-reduced-motion` desactiva animaciones no esenciales.
- Tablas: en < 640 px se apilan (etiqueta arriba, valor abajo).

---

## 9. Procedimiento de republicación (GitHub Pages)

### 9.1 Opción A — Editor web de GitHub (sin instalar nada)

1. Entre a:  
   https://github.com/drdanielisraelsosa-byte/consultorio-dr-daniel-sosa
2. Abra `index.html` → icono lápiz → pegue el HTML nuevo → **Commit changes**.
3. Abra `styles.css` (si es archivo nuevo: *Add file → Create new file* con nombre `styles.css`) → pegue CSS → **Commit**.
4. Si sube imágenes: *Add file → Upload files* dentro de `assets/`.
5. Verifique Pages:  
   https://github.com/drdanielisraelsosa-byte/consultorio-dr-daniel-sosa/settings/pages  
   - Source: **Deploy from a branch**  
   - Branch: `main` · Folder: `/ (root)`  
6. Espere 1–3 minutos. URL pública:  
   **https://drdanielisraelsosa-byte.github.io/consultorio-dr-daniel-sosa/**

### 9.2 Opción B — Git en computadora

```bash
git clone https://github.com/drdanielisraelsosa-byte/consultorio-dr-daniel-sosa.git
cd consultorio-dr-daniel-sosa
# Reemplazar index.html, styles.css, assets según corresponda
git add index.html styles.css assets GUIA-MAESTRA-EDICION.md README.md
git commit -m "Actualización modular Documento Maestro: bio, servicios, Scotiabank, urgencias, COFEPRIS, CSS mobile"
git push origin main
```

### 9.3 Alternativas gratuitas

| Servicio | Cómo |
|----------|------|
| **Netlify Free** | Arrastre la carpeta del sitio a [app.netlify.com/drop](https://app.netlify.com/drop) o conecte el repo GitHub |
| **Cloudflare Pages** | Dashboard → Pages → Connect to Git → seleccione el repo → build command vacío · output `/` |

No se requiere `npm`, Node ni variables de entorno.

---

## 10. Checklist de verificación post-publicación

Marque cada ítem después de publicar:

### Contenido
- [ ] Biografía con 2020 / maestría parcial / hospitalaria / apertura 2026
- [ ] Seis servicios con subdivisiones visibles
- [ ] Scotiabank: titular + concepto “consulta médica”
- [ ] Nota de facturación visible y pequeña
- [ ] Lista completa de urgencias en footer
- [ ] Regla de los 15 minutos visible
- [ ] Aviso COFEPRIS formal

### Integraciones
- [ ] WhatsApp abre chat correcto
- [ ] Google Calendar abre agenda
- [ ] Mapa se ve y “Abrir en Google Maps” funciona
- [ ] Instagram y Facebook abren perfiles
- [ ] CTAs duales presentes en hero, sobre-mí y cita

### Técnico / visual
- [ ] En móvil (~390 px) no hay scroll horizontal
- [ ] Tablas de horarios se leen apiladas en móvil
- [ ] Botones ≥ 44 px de alto táctil
- [ ] Foto y logo cargan (sin ícono roto)
- [ ] Favicon / previsualización WhatsApp muestra logo
- [ ] Contraste del bloque de emergencias es alto (fondo oscuro, texto claro)
- [ ] Comentarios `<!-- MÓDULO: -->` siguen en el HTML

### Legal / clínico (recordatorio)
- [ ] No se promete atención de emergencia hospitalaria en el consultorio
- [ ] Precios y horarios coinciden con la operación real
- [ ] CLABE solo si está autorizada a publicarse

---

## 11. Auditoría de brechas cerradas (sesión 8 ago 2026)

| Área | Antes (live) | Después (esta entrega) |
|------|--------------|------------------------|
| Biografía | Genérica, sin 2020/maestría/2026 | Redacción modesta Documento Maestro |
| Servicios | 6 tarjetas texto plano corto | 6 tarjetas con subdivisiones completas |
| Scotiabank | Ausente | Bloque titular + concepto + instrucción |
| Factura | Una línea vaga | Nota CFDI bajo solicitud |
| Urgencias footer | 1 frase genérica | Lista específica + regla 15 min |
| COFEPRIS | Mención breve | Aviso formal ampliado |
| Siluetas | No preparadas | Clases CSS + comentarios de inserción |
| GIFs | No preparados | 5 slots opcionales ocultos |
| CSS #hero vs #inicio | Selectores desalineados | CSS apunta a IDs reales del HTML |
| Tablas móvil | Filas rígidas | Apilamiento < 640 px |
| Documentación | README corto | Esta Guía Maestra completa |
| Modularidad | Sin marcas de módulo | Comentarios `MÓDULO:` en cada bloque |

---

## 12. Confirmación de cumplimiento

| Criterio | Estado |
|----------|--------|
| Modularidad total (IDs + clases + comentarios) | **CUMPLE** |
| Cero costo (stack + hosting + embeds) | **CUMPLE** |
| Listo para distribución el mismo día | **CUMPLE** |
| Mobile-first + táctil ≥ 44 px | **CUMPLE** |
| CTAs duales + Maps + WA + redes + Calendar | **CUMPLE** |

---

## 13. Contacto de mantenimiento del sitio

- **Repositorio:** https://github.com/drdanielisraelsosa-byte/consultorio-dr-daniel-sosa  
- **Sitio público:** https://drdanielisraelsosa-byte.github.io/consultorio-dr-daniel-sosa/  
- **WhatsApp consultorio:** https://wa.me/5214771235388  

---

*Fin de la NUEVA GUÍA MAESTRA DE EDICIÓN v2.0 — SuperGrok Heavy · Documento Maestro v1.0*

# FASE 1 — Auditoría (index.html live vs Documento Maestro / Worktree 2)

**Fecha:** 8 de agosto de 2026  
**Sitio auditado:** https://drdanielisraelsosa-byte.github.io/consultorio-dr-daniel-sosa/  
**Repo:** https://github.com/drdanielisraelsosa-byte/consultorio-dr-daniel-sosa  
**Commit base:** `4e6a8aa` (main)

---

## 1. Estructura real del live (antes de esta sesión)

| Elemento | Estado live |
|----------|-------------|
| Stack | HTML + CSS embebido (un solo `index.html` ~20 KB) |
| IDs HTML | `#inicio` `#sobre-mi` `#servicios` `#ubicacion` `#horarios` `#cita` `#contacto` |
| CSS selectores rotos | `#hero`, `#about`, `#location`, `#reserva` **no coincidían** con IDs del HTML |
| Assets | `logo.png`, `logo.svg`, `doctor-photo.jpg`, `qr-consultorio.png` |
| Documentación | Solo `README.md` corto (sin guía modular de edición) |

---

## 2. Brechas de contenido

| Requisito Documento Maestro | Live (antes) | Brecha |
|-----------------------------|--------------|--------|
| Bio: cédula **2020** | No menciona año de cédula | **Alta** |
| Bio: **maestría parcial** | Ausente | **Alta** |
| Bio: **experiencia hospitalaria** (redacción modesta) | Solo lista de áreas, sin marco biográfico 2020/2026 | **Alta** |
| Bio: **apertura consultorio 2026** | Ausente | **Alta** |
| Servicios: subdivisiones completas Paso 1 | 6 tarjetas con un párrafo corto cada una | **Alta** |
| Scotiabank (titular + concepto «consulta médica») | Solo “Efectivo y transferencia” | **Alta** |
| Nota pequeña de **facturación** (CFDI) | Una frase genérica | **Media** |
| Footer: **lista completa de urgencias** | Una sola frase genérica | **Alta** |
| Footer: **regla de 15 minutos** | Ausente | **Alta** |
| Footer: **COFEPRIS formal** | Mención mínima de FF-COFEPRIS-02 | **Media** |
| Comentarios `<!-- MÓDULO: -->` | Ausentes | **Alta** (modularidad) |

---

## 3. Brechas visuales / CSS

| Requisito | Live (antes) | Brecha |
|-----------|--------------|--------|
| Siluetas anatómicas (prep. PNG transparente) | No hay clases ni slots | **Media** |
| 3–5 GIFs opcionales | No preparados | **Baja** |
| Tablas apiladas < 640 px | Tablas en fila (difíciles en móvil estrecho) | **Alta** |
| Áreas táctiles ≥ 44 px | Parcial (algunos botones OK, no sistemático) | **Media** |
| Atmósferas por sección (clases) | Solo fondos por ID CSS a veces desalineados | **Media** |
| Contraste bloque emergencias | Alerta simple, contraste moderado | **Media** |
| Selectores CSS = IDs HTML | **Desalineados** (`#hero` vs `#inicio`, etc.) | **Alta** (bug visual hero/cita) |

---

## 4. Brechas de documentación

| Requisito | Live (antes) |
|-----------|--------------|
| Guía maestra de edición por módulo | **No existía** |
| Spec de peso/calidad de imágenes | **No existía** |
| Conteo de limitantes | **No existía** |
| Checklist post-publicación | **No existía** |
| Procedimiento Netlify/Cloudflare | Solo GitHub Pages en README |

---

## 5. Integraciones (estado previo — mayormente OK)

| Integración | Estado live |
|-------------|-------------|
| wa.me | OK |
| Google Calendar | OK |
| Google Maps embed + link | OK |
| Instagram / Facebook | OK |
| CTAs duales (WA+Calendar) | Presentes en hero, sobre-mí, cita |
| Open Graph / WhatsApp preview | OK (logo.png) |

---

## 6. Resolución (esta entrega)

Todas las brechas de §2–§4 quedan **cerradas** en `index.html` + `styles.css` + `GUIA-MAESTRA-EDICION.md`.  
IDs y estructura de secciones se **conservan**. Solo se actualizan textos, se corrigen selectores CSS a IDs reales y se añaden capas CSS/documentación sin romper modularidad.

Ver matriz completa en `GUIA-MAESTRA-EDICION.md` §11.

export const SITE_LINKS = {
  mainWebsite: "https://drdanielisraelsosa-byte.github.io/consultorio-dr-daniel-sosa/",
  whatsapp: "https://wa.me/5214771235388",
  maps: "https://maps.app.goo.gl/Jw4yBpNadcq8WDUP8?g_st=ac",
  instagram: "https://www.instagram.com/leinadrd?igsi=MTVmMGppZHMzMnR4dA==",
} as const;

export const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
] as const;

export const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] as const;
export const YEARS = [2026, 2027, 2028, 2029, 2030] as const;

// Cada número representa la hora de inicio de una consulta de 60 minutos.
// 14:00–16:00 queda reservado todos los días para comida.
export const APPOINTMENT_HOURS = [9, 10, 11, 12, 13, 16, 17, 18, 19, 20] as const;

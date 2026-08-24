export type PageId =
  | "inicio"
  | "consulta"
  | "ubicacion"
  | "contacto"
  | "costos"
  | "perfil"
  | "trayectoria";

export type Hospital = {
  name: string;
  image: string;
  url: string;
};

export type CareerCity = {
  id: string;
  city: string;
  region: string;
  kind: "Hospitalaria" | "Extracurricular";
  note: string;
  hospitals: Hospital[];
};

export const SITE = {
  doctor: {
    name: "Dr. Daniel Israel Sosa De Santiago",
    shortName: "Dr. Daniel Sosa",
    title: "Médico Cirujano",
    license: "12296387",
    portrait: "/doctor-full-body.jpg",
    logo: "/logo-luxury.png",
  },
  links: {
    whatsapp:
      "https://wa.me/524771235388?text=Hola%20Dr.%20Daniel%2C%20quiero%20agendar%20una%20consulta",
    calendar: "https://drdanielisraelsosa-byte.github.io/consultorio-dr-daniel-sosa/agenda/",
    maps: "https://maps.app.goo.gl/kkC9djB9A528P9Ty7?g_st=ac",
    instagram: "https://www.instagram.com/leinadrd/",
    facebook: "https://www.facebook.com/share/1S5U22dAP9/",
  },
  consultation: {
    inPerson: "$150",
    online: "$75",
    advance: "$100",
    duration: "45 min",
    regularHours: "09:00–14:00 · 16:00–21:00",
    days: "Lunes a sábado",
  },
  location: {
    name: "Consultorio 101 · Plaza del Bosque",
    address:
      "José María Cruz 633, Local 101, Real del Bosque, C.P. 37178, León de los Aldama, Guanajuato.",
    guide:
      "Ubica el pilar rojo junto a Laboratorio Chopo. Detrás encontrarás la puerta de cristal con el distintivo del Dr. Daniel Sosa.",
    mapEmbed:
      "https://www.google.com/maps?q=Jos%C3%A9%20Mar%C3%ADa%20Cruz%20633%2C%20Real%20del%20Bosque%2C%2037178%20Le%C3%B3n%20de%20los%20Aldama%2C%20Gto.&output=embed",
  },
  locationPhotos: [
    { src: "/plaza-exterior.jpg", label: "Plaza del Bosque", caption: "Vista exterior y acceso a la plaza" },
    { src: "/facade-guide.jpg", label: "Referencia exterior", caption: "Fachada blanca y pilar rojo de acceso" },
    { src: "/consultorio-entrance.jpg", label: "Puertas de cristal", caption: "Distintivo del médico en la entrada" },
    { src: "/consulting-room.jpg", label: "Consultorio", caption: "Escritorio y camilla de exploración" },
    { src: "/procedure-room.jpg", label: "Área clínica", caption: "Espacio de exploración y procedimientos" },
  ],
  services: [
    {
      title: "Consulta general",
      description: "Historia clínica, exploración física por aparatos y sistemas, orientación diagnóstica y tratamiento.",
      image: "/consulting-room.jpg",
      price: "$150",
    },
    {
      title: "Consulta en línea",
      description: "Orientación clínica y seguimiento remoto para situaciones que no requieren exploración física.",
      image: "/private-practice.png",
      price: "$75",
    },
    {
      title: "Aplicación intramuscular en consulta",
      description: "Aplicación de medicamento intramuscular indicado por el médico durante la consulta.",
      image: "/procedure-room.jpg",
      price: "$50",
    },
    {
      title: "Aplicación intramuscular con indicación externa",
      description: "Aplicación de medicamento no indicado por el médico durante la consulta; requiere presentar la indicación correspondiente.",
      image: "/procedure-room.jpg",
      price: "$75",
    },
    {
      title: "Certificados médicos",
      description: "Laborales, escolares, para licencia de conducir y prenupciales. Requiere consulta general, llenado correspondiente y exploración física por aparatos y sistemas.",
      image: "/clinical-record.jpg",
      price: "$100",
    },
    {
      title: "Sutura superficial simple",
      description: "Cierre de herida superficial con bordes regulares mediante técnica simple.",
      image: "/surgery-suture.png",
      price: "$750",
    },
    {
      title: "Sutura superficial compleja",
      description: "Cierre de herida superficial irregular o que requiere mayor tiempo y complejidad técnica.",
      image: "/surgery-suture.png",
      price: "$1,000",
    },
    {
      title: "Sutura profunda simple",
      description: "Cierre por planos de una herida profunda con trayecto simple.",
      image: "/surgery-suture.png",
      price: "$1,250",
    },
    {
      title: "Sutura profunda compleja",
      description: "Cierre por planos de una herida profunda o irregular que requiere mayor complejidad técnica.",
      image: "/surgery-suture.png",
      price: "$1,500",
    },
    {
      title: "Curación menor",
      description: "Lavado y colocación de apósitos estériles en abrasiones, cortadas que no requieren sutura y quemaduras de primer grado.",
      image: "/procedure-room.jpg",
      price: "$100",
    },
    {
      title: "Curación mayor",
      description: "Según superficie corporal y gravedad: lavado con técnica quirúrgica, apósitos estériles o inteligentes, toma de cultivo o manejo por segunda intención de herida quirúrgica.",
      image: "/procedure-room.jpg",
      price: "$300–$500",
    },
    {
      title: "Colocación de sonda nasogástrica",
      description: "Colocación de sonda nasogástrica con técnica clínica y verificación del procedimiento.",
      image: "/procedure-room.jpg",
      price: "$300",
    },
    {
      title: "Colocación de sonda Foley",
      description: "Colocación de sonda urinaria Foley con técnica estéril.",
      image: "/procedure-room.jpg",
      price: "$300",
    },
  ],
  afterHours: [
    { period: "21:00–00:00", detail: "Lunes a viernes", price: "$300" },
    { period: "00:00–08:00", detail: "Madrugada · sujeto a confirmación", price: "$500" },
    { period: "Fuera de horario", detail: "Sábado", price: "$500" },
    { period: "Fuera de horario", detail: "Domingo", price: "$500" },
  ],
} as const;

export const CAREER_CITIES: CareerCity[] = [
  {
    id: "leon",
    city: "León",
    region: "Guanajuato",
    kind: "Hospitalaria",
    note: "Práctica clínica, docencia hospitalaria y consulta privada desde 2026.",
    hospitals: [
      {
        name: "Hospital MAC León",
        image: "https://hospitalesmac.com/uploads/es/medical_unit_gallery/hmac_leon_01.jpg?v=2024-10-07-11-24-12",
        url: "https://hospitalesmac.com/hospitales/hospital/leon",
      },
      {
        name: "CMQ Hospital León",
        image: "https://www.cmqhospital.com/images/logotipo%20oficial.png?crc=127525747",
        url: "https://www.cmqhospital.com/",
      },
    ],
  },
  {
    id: "guadalajara",
    city: "Guadalajara",
    region: "Jalisco",
    kind: "Hospitalaria",
    note: "Experiencia clínica en instituciones públicas y privadas de alta especialidad.",
    hospitals: [
      {
        name: "Hospital Puerta de Hierro Andares",
        image: "https://hospitalespuertadehierro.com/wp-content/uploads/2020/04/Andares-scaled.jpg",
        url: "https://hospitalespuertadehierro.com/",
      },
      {
        name: "Hospital San Javier Guadalajara",
        image: "https://static.wixstatic.com/media/e12576_bc5180ac59374f779bf290916258b4a1~mv2.jpg/v1/fill/w_1600,h_1067,al_c,q_88/e12576_bc5180ac59374f779bf290916258b4a1~mv2.jpg",
        url: "https://sanjavier.com.mx/",
      },
      {
        name: "Hospital Civil de Guadalajara",
        image: "https://www.udg.mx/sites/default/files/styles/noticia_nodo_550x450/public/img_noticias/260313_por-sexto-ano-consecutivo-hospitales-civiles-de-guadalajara-aparecen-en-el-ranking-worlds-best-hospitals_udeg3.jpg?itok=peS1P9NA",
        url: "https://hcg.gob.mx/",
      },
    ],
  },
  {
    id: "monterrey",
    city: "Monterrey",
    region: "Nuevo León",
    kind: "Hospitalaria",
    note: "Experiencia formativa en hospitales de referencia del noreste de México.",
    hospitals: [
      {
        name: "Hospital Zambrano Hellion",
        image: "https://anahuac.com.mx/wp-content/uploads/2021/06/DJI_0956-1030x686.jpg",
        url: "https://www.tecsalud.mx/hospital-zambrano-hellion",
      },
      {
        name: "Hospital Metropolitano",
        image: "https://blob.posta.com.mx/images/2025/01/10/whatsapp_image_2025-01-09_at_6.47.55_pm-focus-0-0-1479-828.webp",
        url: "https://www.nl.gob.mx/hospital-metropolitano",
      },
      {
        name: "Hospital Materno Infantil",
        image: "https://storage.googleapis.com/tribunamexico/2025/08/bebe-murio-monterrey.jpg.webp",
        url: "https://www.nl.gob.mx/hospital-materno-infantil",
      },
      {
        name: "Hospital San José TecSalud",
        image: "https://s3.amazonaws.com/bloodersassets/sanjosetec.jpeg",
        url: "https://www.tecsalud.mx/hospital-san-jose",
      },
      {
        name: "Doctors Hospital",
        image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Doctors_Hospital.jpg",
        url: "https://www.doctorshospital.mx/",
      },
    ],
  },
  {
    id: "cdmx",
    city: "Ciudad de México",
    region: "CDMX",
    kind: "Hospitalaria",
    note: "Atención de referencia, alta especialidad, cirugía, oftalmología y salud mental.",
    hospitals: [
      {
        name: "Hospital Juárez de México",
        image: "https://assets.debate.com.mx/__export/1716566370474/sites/debate/img/2024/05/24/trasplante-organos-cdmx.jpg_242310155.jpg",
        url: "https://www.gob.mx/salud/hospitaljuarez",
      },
      {
        name: "Centro Médico Nacional 20 de Noviembre",
        image: "https://static.wixstatic.com/media/bd1345_9f1c169388cf4cd8aeda20b6572440d3~mv2.png/v1/fill/w_780%2Ch_456%2Cal_c%2Clg_1%2Cq_85/bd1345_9f1c169388cf4cd8aeda20b6572440d3~mv2.png",
        url: "https://www.gob.mx/issste/acciones-y-programas/centro-medico-nacional-20-de-noviembre",
      },
      {
        name: "Hospital Regional Ignacio Zaragoza",
        image: "https://cloudfront-us-east-1.images.arcpublishing.com/larazondemexico/52JOUUXXMZAJDKP4P5KEY42BAE.jpeg",
        url: "https://www.gob.mx/issste",
      },
      {
        name: "Hospital Ángeles",
        image: "https://drcesaradrianibarra.com/hospital-angeles-acoxpa.jpg.jpg",
        url: "https://hospitalangeles.com/",
      },
      {
        name: "Hospital de la Luz",
        image: "https://lacronicadehoy-lacronicadehoy-prod.web.arc-cdn.net/resizer/v2/MQEUOUM7YNFLTLEEOQVYFFCQBI.jpeg?auth=cb063e45035d5c7dfe2b15752104359ab7f55ccbd7b023b68b1680df17910c35&height=876&width=1440",
        url: "https://hospitaldelaluz.org/",
      },
      {
        name: "Hospital Psiquiátrico Fray Bernardino Álvarez",
        image: "https://www.amueblados.mx/wp-content/uploads/2019/02/Hospital-Psiqui%C3%A1trico-Fray-Bernardino-%C3%81lvarez.jpg",
        url: "https://www.gob.mx/salud/sap/acciones-y-programas/hospital-psiquiatrico-fray-bernardino-alvarez",
      },
    ],
  },
  {
    id: "toluca",
    city: "Toluca",
    region: "Estado de México",
    kind: "Hospitalaria",
    note: "Experiencia clínica en atención materno-infantil y medicina general.",
    hospitals: [
      {
        name: "Hospital Materno Infantil",
        image: "https://pbs.twimg.com/ext_tw_video_thumb/1626040358827335680/pu/img/-QuKwqjDr1LQISKO.jpg",
        url: "https://www.issemym.gob.mx/",
      },
      {
        name: "Centro Médico de Toluca",
        image: "https://www.tocdoc.com/sites/default/files/consultorios/centro_medico_de_toluca.jpg",
        url: "https://www.centromedicodetoluca.com.mx/",
      },
    ],
  },
  {
    id: "aguascalientes",
    city: "Aguascalientes",
    region: "Aguascalientes",
    kind: "Hospitalaria",
    note: "Formación en Cirugía General en un entorno hospitalario de alta demanda.",
    hospitals: [
      {
        name: "Hospital General de Zona No. 3 · IMSS",
        image: "https://www.imss.gob.mx/sites/all/statics/styles/flexslider_full/public/i2f_news/f.%2010.jpg?itok=-QLgWwXH",
        url: "https://www.imss.gob.mx/prensa/archivo/201806/143",
      },
    ],
  },
  {
    id: "manhattan",
    city: "Manhattan",
    region: "New York",
    kind: "Extracurricular",
    note: "Kaplan Medical · USMLE Step 1 Prep presencial en 2012 y diplomado interdisciplinario en 2016.",
    hospitals: [
      {
        name: "Kaplan Medical · USMLE Step 1 Prep",
        image: "https://storage.googleapis.com/nyc-wp/2018/11/076dbfa4-kaplan-medical3.jpg",
        url: "https://www.kaptest.com/usmle",
      },
    ],
  },
  {
    id: "chicago",
    city: "Chicago",
    region: "Illinois",
    kind: "Extracurricular",
    note: "Kaplan Basic Sciences Live Prep · programa presencial de 18 semanas en 2014.",
    hospitals: [
      {
        name: "Kaplan · Live Prep Chicago",
        image: "https://smapse.com/storage/2015/12/converted/825_585_yazikovaya-shkola-v-chicago-kaplan-international-11.jpg",
        url: "https://www.kaptest.com/usmle",
      },
    ],
  },
];

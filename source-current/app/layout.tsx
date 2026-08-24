import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dr-daniel-sosa-consulta.letstrymiso.chatgpt.site"),
  title: "Dr. Daniel Sosa | Consulta Médica Privada",
  description:
    "Consulta médica privada en León, Guanajuato. Agenda en línea, WhatsApp, servicios, horarios, ubicación y trayectoria profesional.",
  openGraph: {
    title: "Dr. Daniel Sosa | Consulta Médica Privada",
    description: "Atención médica clara, humana y personalizada en León, Guanajuato.",
    type: "website",
    images: [{ url: "/og.png", width: 1729, height: 910, alt: "Dr. Daniel Israel Sosa · Consulta médica privada" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Daniel Sosa | Consulta Médica Privada",
    description: "Atención médica clara, humana y personalizada en León, Guanajuato.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}

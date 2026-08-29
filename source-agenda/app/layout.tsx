import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agenda de citas | Dr. Daniel Sosa",
  description:
    "Consulta disponibilidad y agenda tu cita médica con el Dr. Daniel Israel Sosa de Santiago.",
  metadataBase: new URL("https://agenda-doctor-sosa.letstrymiso.chatgpt.site"),
  openGraph: {
    title: "Agenda de citas | Dr. Daniel Sosa",
    description: "Consulta disponibilidad y agenda tu cita médica en León, Guanajuato.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Agenda Médica del Dr. Daniel Sosa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agenda de citas | Dr. Daniel Sosa",
    description: "Consulta disponibilidad y agenda tu cita médica en León, Guanajuato.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body className="antialiased">{children}</body>
    </html>
  );
}

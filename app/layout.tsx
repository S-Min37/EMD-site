import type {Metadata} from "next";

import {Footer} from "@/components/Footer";
import {Nav} from "@/components/Nav";
import {getSiteSettings} from "@/lib/cms";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.longName,
      template: `%s · ${settings.name}`,
    },
    description: settings.description,
    metadataBase: new URL(settings.url),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang={settings.locale}>
      <body className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        <Nav settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}

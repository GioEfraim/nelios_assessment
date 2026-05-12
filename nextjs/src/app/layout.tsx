import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";

// Figma typography — Greek subset so accents render correctly.
const robotoFlex = Roboto_Flex({
  subsets: ["latin", "greek"],
  variable: "--font-roboto-flex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nelios — Πακέτα διακοπών",
  description: "Πακέτα διακοπών στην Ελλάδα",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className={`${robotoFlex.variable} h-full antialiased`}>
      <body className={`${robotoFlex.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}

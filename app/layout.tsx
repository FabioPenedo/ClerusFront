import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Igreja Clara | Gestão simples para igrejas",
  description:
    "SaaS de gestão para igrejas com finanças, membros, relatórios e IA para tesoureiros e liderança."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
          {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Nav from "./Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "n8n Automation Lab",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}

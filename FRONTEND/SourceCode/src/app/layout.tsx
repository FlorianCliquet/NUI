import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Network Scanner",
  description: "local web interface for network discovering / scanning using nmap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        {children}
      </ThemeProvider>
        </body>
    </html>
  );
}

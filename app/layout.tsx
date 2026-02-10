import type { Metadata } from "next";
import localFont from "next/font/local";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const orbitron = Orbitron({
   subsets: ["latin"],
   variable: "--font-orbitron",
   display: "swap",
 });
 
 const geistSans = localFont({
   src: "./fonts/GeistVF.woff",
   variable: "--font-geist-sans",
   display: "swap",
 });
 const geistMono = localFont({
   src: "./fonts/GeistMonoVF.woff",
   variable: "--font-geist-mono",
   display: "swap",
 });
 
export const metadata: Metadata = {
  title: "Tattty – Tattoo image generator widget",
  description: "Tattty tattoo image generator widget for embedding on tattty.com and other sites.",
  applicationName: "Tattty",
  metadataBase: new URL("https://widget.tattty.com"),
};
 
 export default function RootLayout({
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) {
   return (
     <html
       lang="en"
       suppressHydrationWarning
       className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable}`}
     >
       <body className="font-sans antialiased">
         <ThemeProvider
           attribute="class"
           defaultTheme="system"
           enableSystem
           disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
       </body>
     </html>
   );
 }
 
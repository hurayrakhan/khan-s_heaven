import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProvider } from "../context/clientProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task-Era | Project Management Made Simple",
  description: "Task-Era helps teams move work forward. Collaborate, manage projects, and reach new productivity peaks.",
  keywords: ["task management", "project management", "team collaboration", "productivity", "task tracking"],
  authors: [{ name: "Task-Era Team" }],
  creator: "Task-Era",
  publisher: "Task-Era",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Task-Era | Project Management Made Simple",
    description: "Task-Era helps teams move work forward. Collaborate, manage projects, and reach new productivity peaks.",
    url: "https://taskera.app",
    siteName: "Task-Era",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Task-Era | Project Management Made Simple",
    description: "Task-Era helps teams move work forward. Collaborate, manage projects, and reach new productivity peaks.",
    creator: "@TaskEra",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white dark:bg-gray-900">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <ClientProvider session={null}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: "#363636",
                color: "#fff",
                borderRadius: "8px",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "white",
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "white",
                },
              },
            }}
          />
        </ClientProvider>
      </body>
    </html>
  );
}

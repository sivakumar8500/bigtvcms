import React from 'react';
import { Metadata } from 'next';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'BIG TV CMS',
  description: 'BIG TV Content Management System',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/bigtv_logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/bigtv_logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/bigtv_logo.png" />

        {/* Load Poppins Google Font for the entire application */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

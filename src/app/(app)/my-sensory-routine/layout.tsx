// app/layout.tsx
export const dynamic = 'force-dynamic';

import React from 'react';
import './globals.css'; // your global styles
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

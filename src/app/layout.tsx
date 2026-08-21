import React from 'react';
import type { Metadata } from 'next';
import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

// Premium high-end fonts
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Print Vatika | Premium Online Printing Press Jaipur',
  description: 'Customize and order premium Business Cards, Banners, T-Shirts, Flyers, Stickers, and Custom Prints online. High-quality offset and digital print services at wholesale rates.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased text-slate-800 bg-slate-50 min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

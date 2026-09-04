import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { CartProvider } from '@/components/CartProvider';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

export const metadata = {
  title: 'New Khushi Resin Creations | Handcrafted Resin Art',
  description: 'Premium handcrafted resin art, keychains, jewelry, frames, and custom nameplates.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-gray-900`}>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}

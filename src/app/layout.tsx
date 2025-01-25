import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import { Layout } from '@/components/layout/Layout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Team Management App',
  description: 'Modern team management application built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}

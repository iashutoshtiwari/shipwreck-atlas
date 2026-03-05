import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import '@/styles/globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Shipwreck Atlas',
  description: 'Explore historical shipwrecks on an interactive world map.'
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} bg-background font-sans text-foreground antialiased transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
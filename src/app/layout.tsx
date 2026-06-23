import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { RecipeProvider } from '@/context/RecipeContext';

export const metadata: Metadata = {
  title: 'forkify // Search over 1,000,000 recipes',
  description: 'Search and bookmark your favourite recipes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <RecipeProvider>{children}</RecipeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { RecipeProvider } from '@/context/RecipeContext';

export const metadata: Metadata = {
  title: 'forkify // Search over 1,000,000 recipes',
  description: 'Search and bookmark your favourite recipes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RecipeProvider>{children}</RecipeProvider>
      </body>
    </html>
  );
}

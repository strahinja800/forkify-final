import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { RecipeProvider } from '@/context/RecipeContext';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'forkify // Search over 1,000,000 recipes',
  description: 'Search and bookmark your favourite recipes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <SessionProvider>
          <RecipeProvider>{children}</RecipeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

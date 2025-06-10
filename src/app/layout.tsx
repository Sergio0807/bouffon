import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bouffon ! - Liste de courses partagée',
  description: 'Application de liste de courses partagée simple et intuitive',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <header className="bg-white shadow-sm z-50 sticky top-0">
          <Header />
        </header>
        <main className="container mx-auto px-4 py-4 max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  )
}

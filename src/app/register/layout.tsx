import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inscription - Bouffon !',
  description: 'Créez votre profil pour commencer à utiliser Bouffon !',
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}

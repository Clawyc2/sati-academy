import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Sati Academy - El Duolingo de Bitcoin',
  description: 'Aprende Bitcoin de cero, al estilo Duolingo — con niveles, lecciones cortas, simuladores prácticos y recompensas en sats. Bitcoin para todos. Hasta para la abuelita.',
  keywords: 'Bitcoin, educación, Duolingo, México, crypto, blockchain, learning, academy, sats',
  authors: [{ name: 'Sati Academy' }],
  
  // SEO
  openGraph: {
    title: 'Sati Academy - El Duolingo de Bitcoin',
    description: 'Aprende Bitcoin de cero, al estilo Duolingo. Bitcoin para todos. Hasta para la abuelita.',
    type: 'website',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sati Academy - El Duolingo de Bitcoin',
    description: 'Aprende Bitcoin de cero, al estilo Duolingo',
  },
  
  // Seguridad
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  referrer: 'strict-origin-when-cross-origin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

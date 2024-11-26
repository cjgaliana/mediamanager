import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import AuthProvider from './providers/AuthProvider';
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import { ColorSchemeScript } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Media Collection',
  description: 'Manage your movies, video games, and books collection',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <AuthProvider session={session}>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  )
}

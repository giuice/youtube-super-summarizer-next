import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      </Head>
      <Component {...pageProps} />
      <Toaster position='top-center' />
    </ThemeProvider>
  )
}

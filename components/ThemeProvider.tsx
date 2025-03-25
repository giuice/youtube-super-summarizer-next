'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    // Get the current theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark'
    // Set initial Bootstrap theme
    document.documentElement.setAttribute('data-bs-theme', savedTheme)
  }, [])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      value={{
        light: 'light',
        dark: 'dark'
      }}
      enableSystem={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

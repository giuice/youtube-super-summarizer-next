export interface Theme {
  name: string
  colors: {
    background: string
    foreground: string
    primary: string
    secondary: string
    accent: string
    muted: string
  }
}

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#ffffff',
    foreground: '#000000',
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#d946ef',
    muted: '#f1f5f9'
  }
}

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#0f172a',
    foreground: '#ffffff',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#e879f9',
    muted: '#1e293b'
  }
}

export const themes = [lightTheme, darkTheme]
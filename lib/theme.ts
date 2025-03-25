export interface Theme {
  name: string
  displayName: string
  colors: {
    background: string
    foreground: string
    primary: string
    secondary: string
    accent: string
    muted: string
    card: string
    cardForeground: string
    border: string
    input: string
    ring: string
  }
}

// Standard YouTube Light Theme
export const lightTheme: Theme = {
  name: 'light',
  displayName: 'YouTube Light',
  colors: {
    background: '#ffffff',
    foreground: '#0f0f0f',
    primary: '#ff0000', // YouTube red
    secondary: '#606060', // YouTube dark gray
    accent: '#065fd4', // YouTube blue
    muted: '#f8f8f8', // YouTube light gray
    card: '#ffffff',
    cardForeground: '#0f0f0f',
    border: '#e5e5e5',
    input: '#f2f2f2',
    ring: '#ff0000'
  }
}

// Standard YouTube Dark Theme
export const darkTheme: Theme = {
  name: 'dark',
  displayName: 'YouTube Dark',
  colors: {
    background: '#0f0f0f', // YouTube dark background
    foreground: '#ffffff',
    primary: '#ff0000', // YouTube red
    secondary: '#aaaaaa', // YouTube gray text
    accent: '#3ea6ff', // YouTube light blue
    muted: '#272727', // YouTube dark gray
    card: '#212121',
    cardForeground: '#ffffff',
    border: '#303030',
    input: '#121212',
    ring: '#ff0000'
  }
}

export const themes = [lightTheme, darkTheme]

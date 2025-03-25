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
    primary: '#c4302b', // YouTube red
    secondary: '#606060', // YouTube dark gray
    accent: '#065fd4', // YouTube blue
    muted: '#f9f9f9' // YouTube light gray
  }
}

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#0f0f0f', // YouTube dark background
    foreground: '#ffffff',
    primary: '#c4302b', // YouTube red
    secondary: '#272727', // YouTube darker gray
    accent: '#3ea6ff', // YouTube light blue
    muted: '#212121' // YouTube dark gray
  }
}

export const themes = [lightTheme, darkTheme]
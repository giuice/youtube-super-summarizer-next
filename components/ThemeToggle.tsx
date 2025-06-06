'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

export function ThemeToggle() {
  const { setTheme } = useTheme()
  const themes = ['dark', 'valentine', 'abyss', 'dracula', 'light', 'black', 'lemonade']
  const [currentThemeIndex, setCurrentThemeIndex] = React.useState(0)

  const cycleTheme = () => {
    const nextIndex = (currentThemeIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    setTheme(nextTheme)
    setCurrentThemeIndex(nextIndex)
    toast.success(`Theme changed to ${nextTheme}`)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="glass-card"
      onClick={cycleTheme}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

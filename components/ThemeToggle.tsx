'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { themeChange } from 'theme-change'

export function ThemeToggle() {
  React.useEffect(() => {
    themeChange(false)
  }, [])

  return (
    <>
      <button
        data-toggle-theme="valentine,abyss"
        data-act-class="ACTIVECLASS"
        className="hidden"
        ref={(el) => {
          if (el) {
            // @ts-ignore
            window.themeToggleBtn = el
          }
        }}
      />
      <Button
        variant="outline"
        size="icon"
        className="glass-card"
        onClick={() => {
          // @ts-ignore
          window.themeToggleBtn?.click()
        }}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </>
  )
}

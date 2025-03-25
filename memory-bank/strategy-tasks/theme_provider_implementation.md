# Theme Provider Implementation Instructions

## Objective
Implement a comprehensive theme provider using Shadcn UI to enable a YouTube-inspired theme across the application, with proper dark/light mode support and consistent styling.

## Context
The application has already incorporated Shadcn UI components, but needs a proper theme provider to ensure consistent styling across all components. This task will set up the foundation for all UI components to leverage the theme system.

## Dependencies
- components/ui/* (Shadcn UI components)
- styles/globals.css (For global theme variables)
- pages/_app.tsx (For ThemeProvider wrapper)

## Steps
1. **Create Theme Configuration Files**
   - Create `lib/theme.ts` to define theme colors and variables
   - Define YouTube-inspired color palette with primary, secondary, and accent colors
   - Include both dark and light mode color schemes

2. **Implement ThemeProvider Component**
   - Create `components/ThemeProvider.tsx` component
   - Use the Shadcn UI ThemeProvider component as base
   - Implement theme persistence using localStorage or cookies
   - Add theme toggle functionality (light/dark mode)

3. **Update Global CSS Variables**
   - Modify `styles/globals.css` to include theme CSS variables
   - Ensure variables are properly structured for both light and dark modes
   - Match YouTube's color scheme and styling approach

4. **Integrate with Application Root**
   - Update `pages/_app.tsx` to wrap the application with ThemeProvider
   - Ensure proper theme state initialization
   - Add theme loading/transition effects

5. **Create Theme Hooks**
   - Create `lib/hooks/useTheme.ts` for easy theme access throughout the app
   - Implement functions for getting/setting theme
   - Add type definitions for theme options

## Expected Output
- Functional theme provider with YouTube-inspired styling
- Proper light/dark mode toggle functionality
- Consistent theme variables available to all components
- Theme persistence between sessions
- Type-safe theme access through hooks

## Notes
- The theme should closely match YouTube's color scheme for familiarity
- Consider accessibility when defining color contrasts
- Performance considerations for theme switching (avoid layout shifts)
- Ensure all Shadcn UI components properly inherit theme variables
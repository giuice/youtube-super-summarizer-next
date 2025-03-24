# Component Migration to Shadcn UI Instructions

## Objective
Migrate existing components to use Shadcn UI and refactor their CSS to properly leverage the theme system, starting with the ChatPopup component.

## Context
The application has implemented Shadcn UI and requires component migration to ensure consistent styling and proper theme integration. The ChatPopup component has been identified as the highest priority for this migration.

## Dependencies
- components/ui/* (Shadcn UI components)
- components/ChatPopup.tsx (Primary target for migration)
- lib/theme-config.ts (Theme configuration)
- styles/globals.css (Global theme variables)

## Steps
1. **Analyze Current ChatPopup Component**
   - Identify all styling patterns used in ChatPopup.tsx
   - Document current functionality and UI elements
   - Identify potential Shadcn UI components to replace custom elements

2. **Replace Basic UI Elements**
   - Replace custom buttons with Shadcn UI Button component
   - Replace input fields with Shadcn UI Input component
   - Replace containers with appropriate Shadcn UI Card components
   - Ensure proper props mapping between current and new components

3. **Refactor CSS Styling**
   - Remove hardcoded color values
   - Replace with theme variables using CSS variables
   - Adjust spacing to match Shadcn UI's spacing system
   - Use cn() utility for conditional class composition

4. **Implement Responsive Design**
   - Ensure responsive behavior is maintained or improved
   - Test component at various viewport sizes
   - Use Shadcn UI's responsive utilities where appropriate

5. **Component-Specific Enhancements**
   - Add proper focus states for accessibility
   - Ensure consistent animations with other Shadcn UI components
   - Implement proper aria attributes for accessibility

6. **Additional Components for Migration**
   - After ChatPopup is completed, prioritize remaining components:
     - SummaryItem.tsx and SummaryList.tsx
     - VideoModal.tsx
     - VideoTitleList.tsx
     - SummaryChaptersItem.tsx and SummaryChaptersList.tsx
     - Pagination.tsx
     - DocumentSummarizer.tsx
     - VideoSummarizer.tsx

## Expected Output
- Fully migrated ChatPopup component using Shadcn UI elements
- CSS refactored to use theme variables
- Consistent styling with YouTube-inspired theme
- Improved accessibility and responsiveness
- Plan for subsequent component migrations

## Notes
- Maintain existing functionality while improving the UI
- Consider creating reusable compound components when appropriate
- Document any component-specific theme overrides for future reference
- Test across browsers to ensure consistent rendering
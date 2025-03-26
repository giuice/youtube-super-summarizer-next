[DEP_MATRIX_START]
# KEY DEFINITIONS
nextjs_framework: next@15.2.3
tailwindcss_framework: tailwindcss@4.0.15
domain_model: domain/model
domain_summary: domain/summary
domain_transcript: domain/transcript
domain_video: domain/video
domain_video_segment: domain/video_segment
application_video_service: application/VideoDataService.ts
components_video: components/VideoSummarizer.tsx,VideoModal.tsx,VideoTitleList.tsx
components_summary: components/SummaryList.tsx,SummaryItem.tsx
components_pagination: components/Pagination.tsx
components_chat: components/ChatPopup.tsx
theme_provider: components/ThemeProvider.tsx
theme_toggle: components/ThemeToggle.tsx
shadcn_ui: components/ui/*
next_themes: next-themes@latest

# MATRIX (Row depends on Column)
# Symbols: > (depends on), < (depended by), x (mutual), - (none), d (doc)
    | nextjs | tailwind | domain_model | domain_summary | domain_transcript | domain_video | video_segment | app_service | components_video | components_summary | components_chat | theme_provider | theme_toggle | shadcn | next_themes
nextjs | - | - | - | - | - | - | - | - | > | > | > | - | - | - | -
tailwind | - | - | - | - | - | - | - | - | - | - | - | > | - | > | -
domain_model | - | - | - | < | < | < | < | - | - | - | - | - | - | - | -
domain_summary | - | - | > | - | - | - | - | > | - | > | - | - | - | - | -
domain_transcript | - | - | > | - | - | - | > | > | - | - | > | - | - | - | -
domain_video | - | - | > | - | - | - | - | > | > | - | - | - | - | - | -
video_segment | - | - | > | - | > | - | - | > | - | > | - | - | - | - | -
app_service | - | - | - | > | > | > | > | - | > | - | - | - | - | - | -
components_video | > | - | - | - | - | > | - | > | - | - | - | > | - | > | -
components_summary | > | - | - | > | - | - | > | - | - | - | - | > | - | > | -
components_chat | > | - | - | - | > | - | - | - | - | - | - | > | - | > | -
theme_provider | - | > | - | - | - | - | - | - | > | > | > | - | x | > | >
theme_toggle | - | - | - | - | - | - | - | - | - | - | - | x | - | > | >
shadcn | - | > | - | - | - | - | - | - | > | > | > | > | > | - | -
next_themes | - | - | - | - | - | - | - | - | - | - | - | > | > | - | -
[DEP_MATRIX_END]
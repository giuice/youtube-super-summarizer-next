---TRACKER_START---
# Documentation Dependencies for YouTube Super Summarizer Next.js
# Format: Document = Dependencies
# Dependencies: DESC=describes, REF=references, CONT=contains information about

README.md = DESC:domain_model,application_video_service,components_video REF:productContext.md

# Memory Bank Documentation
memory-bank/projectbrief.md = DESC:domain_model,domain_summary,domain_transcript,domain_video,domain_video_segment
memory-bank/productContext.md = DESC:components_video,components_summary REF:projectbrief.md
memory-bank/activeContext.md = DESC:infra_supabase REF:productContext.md

# Technical Documentation
# To be populated as documentation is created
---TRACKER_END---

---KEYS_START---
# Project Documentation
README.md: README.md

# Memory Bank Documentation
projectbrief.md: memory-bank/projectbrief.md
productContext.md: memory-bank/productContext.md
activeContext.md: memory-bank/activeContext.md
---KEYS_END---
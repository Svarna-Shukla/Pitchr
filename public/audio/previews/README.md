# Investor preview clips

Static `.mp3` voice samples played by the "Play Voice Sample" button in the investor preview
modal (`src/components/arena/preview/InvestorPreviewModal.tsx`). Vite serves this folder from the
site root, so `public/audio/previews/lord-vane.mp3` is reachable at `/audio/previews/lord-vane.mp3`.

The filenames must match the slugs in `PREVIEW_AUDIO_SLUG` (`src/lib/investorPreviewAudio.ts`):

- `lord-vane.mp3`
- `chad-vance.mp3`
- `victoria-sterling.mp3`
- `dr-quirk.mp3`
- `sensei-sterling.mp3`

Until a file is added, `playInvestorPreview` logs a console warning and silently no-ops instead of
throwing — the button just won't produce sound for that investor yet.

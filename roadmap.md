This is the build roadmap for Pitchr.

## Phase 1: The Battle Arena — Shipped
- [x] Build the arena screen with the 3D geometric mask as the AI investor
- [x] Implement the health bar system for the user's pitch
- [x] Make the investor ask progressively harder questions using Groq
- [x] Add mask personality animations: idle, attacking, listening, judging
- [x] Add voice input and text input for user responses
- [x] Add 5 investor personality modes, each with their own hand-sculpted mask, voice, and Groq tone: Lord Vane (The Ruthless Villain), Arthur Pendelton (The Gentle Mentor), Victoria Sterling (The Unimpressed Corporate Mogul), Professor Zany (The Chaotic Wildcard), Chad Vance (The Tech-Bro Visionary)
- [x] Add game over screen when health hits zero
- [x] Add scorecard with 6 score bars and letter grade after session ends
- [x] Add a timer to limit the time the user gets to answer the question, keeping the rapid fire theme alive
- [x] Voice: husky, dark and deep (intimidating theme maintained) via ElevenLabs, cloned per investor

## Phase 2: Founder Kit — Shipped
- [x] Build the live deck builder where slides generate as the user speaks or types out his idea
- [x] Add the 17 output checklist so founders pick only what they need
- [x] Generate formatted downloadable documents (PDF export), not just AI text blocks
- [x] Build competitor research cards with real data pulled live
- [x] Add the Battle Card tab with pokemon style startup scoring

## Phase 3: Polish and Extras — Shipped
- [x] Fix mobile so the mask and arena work on any screen size
- [x] Add voice synthesis so the mask actually speaks its judgments out loud
- [x] Add streak system rewarding consecutive strong answers ("ON FIRE" / "CRITICAL")
- [x] Add share card so users can share their pitch score
- [x] Add session history so past pitches can be reviewed (Sessions panel)
- [x] Add Presentation Mode for showing off a generated deck full-screen
- [x] Add light/dark theme toggle across the whole app

## Phase 4: The Ultimate Tank (Boss Mode) — Shipped
The flagship hero feature: face all 5 AI investors at once instead of picking just one.
- [x] High-visibility "FEATURED" hero banner on the Arena investor-select screen, entering Boss Mode skips straight to pitch intake
- [x] Single R3F scene rendering all 5 investors' masks side-by-side in a subtle curved arc, each with its own ambient float animation and particle field running simultaneously
- [x] Active Speaker FX: whichever investor is grilling the founder scales up, pushes forward on Z, and gets an intensified point light while the other 4 dim
- [x] Each turn, a random investor is picked to take the floor — their system prompt, Groq tone, and ElevenLabs voice ID swap in live, with a HUD badge naming who's currently speaking (name + archetype + 👑 Boss Mode tag)
- [x] Shared single health bar across the whole panel, plus a per-investor damage log surfaced on the scorecard ("Boss Mode Damage Report" — who hit hardest, how many times)
- [x] Groq system prompt hard-caps Boss Mode responses to 15-25 words to keep lines punchy and conserve ElevenLabs characters
- [x] HD Voice (ElevenLabs) / Fast Voice (browser-native speechSynthesis) toggle in the Arena header, so local testing never has to burn API credits

## Phase 5: What's Next
- [ ] ElevenLabs usage/credit tracking so founders (and the team) can see how many characters a session actually burns
- [ ] Rate-limit / retry handling for Groq calls, since Boss Mode can mean rapid back-to-back requests across a long session
- [ ] Overlapping/queued investor voice lines instead of one shared `Audio` instance, for a more chaotic "everyone's talking over each other" panel moment
- [ ] Boss Mode-specific difficulty tuning (right now it reuses the same basic/market/brutal round curve as solo mode)
- [ ] Wider-screen / tablet layout pass on the 5-mask Boss Tank stage to make sure all 5 seats never crowd or clip on narrower viewports

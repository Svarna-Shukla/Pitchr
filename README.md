# Pitchr

okay so I built this thing called Pitchr and I'm pretty proud of it.

basically I got tired of watching founders (including me) spend hours trying to prep a pitch using like 5 different apps that don't talk to each other. so I built one app that does everything.

## what it does

the main thing is the Battle Arena. you pitch your idea out loud and this AI investor (it looks like a creepy 3D geometric mask, trust me it's cool) immediately starts grilling you with questions. you have a health bar. bad answers drain it. good answers recover a little bit. if your health hits zero the investor wins and your pitch is dead. it's supposed to feel stressful because real investor meetings are stressful.

there's also a live deck builder where you just talk about your idea and slides generate in real time while you're still speaking. I thought that was pretty cool when I got it working.

then there's a Founder Kit that spits out a bunch of founder documents from one session. elevator pitches, competitor research, go to market stuff. all formatted as actual documents not just blocks of AI text.

and a Battle Card tab that generates a pokemon style card for your startup and rates it across product, market, team and revenue. it also generates competitor cards so you can compare.

## why I built it different from just using ChatGPT

ChatGPT gives you text. Pitchr gives you something you can actually use. every output is formatted and downloadable. you don't need to spend another 30 minutes reformatting AI output into something presentable.

## tech stack

React, TypeScript, Vite, Tailwind, Framer Motion, React Three Fiber for the 3D stuff, Groq API for the AI, Web Speech API for voice, deployed on Vercel.

## try it live

https://getpitchr.vercel.app

## run it yourself

git clone https://github.com/Svarna-Shukla/Pitchr
cd Pitchr
npm install
cp .env.example .env
add your VITE_GROQ_API_KEY to .env
npm run dev

Tai Lung's ElevenLabs voice is optional — add VITE_ELEVENLABS_API_KEY and VITE_ELEVENLABS_VOICE_ID to .env too if you want the cloned voice instead of the browser's built-in speechSynthesis fallback.

if you're deploying to Vercel, .env is gitignored and never reaches the build — add all three vars (VITE_GROQ_API_KEY, VITE_ELEVENLABS_API_KEY, VITE_ELEVENLABS_VOICE_ID) in the Vercel project's Environment Variables settings too, then redeploy.

## about me

I'm Svarna, I'm in high school in Texas and I built this for Hack Club Horizons 2026. this is probably the most complex thing I've shipped so far and I learned a lot building it.

I used AI tools to help write code but I directed everything, reviewed every file, and made all the product decisions myself.

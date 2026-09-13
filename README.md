# Omrushikesh Raiwade — Portfolio

Dark, CRT-flavoured single-page portfolio built with Next.js 16 (App Router),
TypeScript, Tailwind v4, GSAP ScrollTrigger and Lenis.

Design language taken from the str8fire reference: deep navy ground, techno
display type over monospace body copy, hairline grids and `/SECTION` labels.
The hero opens on a procedural deep-space field — nebula, planet limb,
parallax starfield, meteors — with the name set left-anchored and staggered.
Scrolling takes the field to **light speed** and drives the name past the
camera before handing off to the page.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (fully static)
```

## Editing content

**Everything you'd want to change lives in `src/lib/content.ts`.** No other file
needs touching for copy edits:

| Export        | Controls                                                |
| ------------- | ------------------------------------------------------- |
| `profile`     | Name, role, location, email, logo mark, status          |
| `heroVideo`   | Optional looping clip in place of the space field (off by default) |
| `heroQuote`   | The line in the bottom-left of the hero                   |
| `about`       | The big scroll-revealed statement + the 4 meta cells     |
| `services`    | The 01–04 `BUILD / DESIGN / AUTOMATE / LEAD` rows        |
| `projects`    | The three work cards — **check these**                   |
| `stack`       | The grouped FRONTEND / BACKEND / TOOLING rows            |
| `cinema`      | The four channels in the CRT switcher                    |
| `links`       | GitHub / LinkedIn / Letterboxd                           |
| `nav`         | Nav bar items and order                                  |

### ⚠️ Check the project copy

Both RaktSetu repos on GitHub are currently empty, and Dnyan Setu / New Desk
aren't public anywhere, so the three blurbs were written from the project names
alone. Rewrite them to say what each one actually does, and fill in the `repo`
and `live` URLs. An empty string hides that button.

## The hero background

`heroVideo.src` is empty, so the space field is rendered live on a canvas — no
video file, nothing extra to download, and it stays sharp at any size. To use
footage instead:

1. Put the file in `public/`, e.g. `public/hero.mp4`.
2. In `content.ts` set `heroVideo.src = "/hero.mp4"` (optionally a `poster`).
3. `scrim` (0–1) controls how much of the room's blue lighting stays on top.

The clip plays muted, looped and inline, and the name, quote and scroll cue all
sit over it unchanged. The starfield is skipped entirely when a clip is set.

**Use footage you own or are licensed to use** — a video lifted from Pinterest
belongs to whoever made it, and republishing it on a public site is their call,
not ours.

## Motion

Animation is on by default for everyone. A visitor who wants it off can set
`localStorage.motion = "off"` in the console; the value is applied to
`<html data-motion>` by an inline script in `layout.tsx` before first paint, so
CSS and GSAP never disagree and the title never flashes on refresh.

Note: Windows' "Show animations" setting is currently **off** on this machine,
which is why the site originally served a static fallback. That's no longer
wired to the OS setting.

## Structure

```
src/
  app/
    layout.tsx      fonts (Orbitron + JetBrains Mono), metadata, motion script
    page.tsx        section order
    globals.css     design tokens, CRT/scanline/grain, reveal, room atmosphere
  lib/
    content.ts      ← all copy
    motion.ts       motion preference helpers
    smooth.ts       Lenis instance + scrollToId (clears the fixed header)
    warp.ts         shared 0→1 warp level: GSAP writes it, the canvas reads it
  components/
    Hero.tsx        the name, HUD, and the scroll-driven warp
    SpaceBackdrop.tsx  nebula, planet, starfield, meteors, light-speed warp
    Chrome.tsx      nav bar + mobile sheet
    About.tsx       word-by-word scrub reveal
    Services.tsx    outlined → filled display words
    Work.tsx        project cards with staggered entrance + parallax
    Stack.tsx       grouped stack rows
    Cinema.tsx      CRT channel switcher (four films, auto-tuning)
    Contact.tsx     CTA, links, footer
    ui.tsx          Reveal / SectionHead / Section primitives
    Overlays.tsx    scanlines, grain, vignette
    SmoothScroll.tsx Lenis ↔ ScrollTrigger wiring
public/
  posters/          the four film posters
```

## Performance notes

The original opening scaled the whole scene 11×, far past what the effect
needed — Chrome re-rasterised a huge layer every frame and it stuttered. The
backdrop is now a canvas that never scales: the nebula and planet are painted
once into an offscreen buffer at resize and blitted with a slow drift, and each
frame only moves a few hundred 1px stars. The canvas pauses when the hero
scrolls out of view or the tab is hidden, caps DPR at 1.5, and halves its star
count under 700px. Grain and scanline overlays are dropped entirely below
640px.

## Deploy to Vercel

Fully static — no env vars, no server runtime.

```bash
npx vercel          # preview
npx vercel --prod   # production
```

Or push to GitHub and import at vercel.com/new — the Next.js preset is detected
automatically.

# Nguyen Template — Behaviors

## Header Nav

- **Interaction model:** click + scroll
- Fixed top, centered (`left-1/2 -translate-x-1/2`)
- Mobile: hamburger toggles full-width dropdown panel (`data-state` on nav)
- Desktop: inline nav links with hover color transition (`duration-150`)
- Theme toggle button (next-themes)
- Scroll behavior: nav inner container gets floating card styling after scroll (max-width shrink, shadow, rounded) — verify on scroll

## Hero

- **Interaction model:** click
- Video thumbnail button opens dialog with iframe embed
- Hover: image brightness 0.8, play button scale 1 → 1.2
- CTA buttons: primary filled + outline secondary

## Features Bento

- **Interaction model:** scroll + hover
- Cards animate in on viewport entry (`opacity 0 → 1`, `translateY 24px → 0`)
- Internal mini-UI mockups with animated task cards, chat, benchmarks, integrations marquee, workflow chart
- Card hover: `hover:shadow-lg hover:shadow-black/5`

## Solution Showcase

- **Interaction model:** scroll
- Three rows, alternating text/visual columns
- Viewport entry animation: blur + scale + translate (900ms cubic-bezier)
- AI Agents row: accordion tabs (Gemini, ChatGPT, DeepSeek) — **click-driven**
- Animated SVG paths in mention visual

## Testimonials

- **Interaction model:** time-driven (auto marquee)
- Two rows, opposite directions
- Edge fade masks on left/right
- Continuous horizontal scroll animation

## Pricing

- **Interaction model:** click
- Monthly/Annual switch toggles prices via NumberFlow
- Annual: Starter $0, Pro $29→$23, Enterprise $99→$79 (20% off)
- Plan cards with gradient header areas

## FAQ

- **Interaction model:** click
- Radix accordion, single or multiple open
- First item open by default

## Footer

- **Interaction model:** hover
- Link hover color transitions
- Social icon buttons with border + hover bg

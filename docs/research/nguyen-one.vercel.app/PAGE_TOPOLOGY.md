# Nguyen Template — Page Topology

Source: https://nguyen-one.vercel.app/

## Section Order (top to bottom)

1. **Background blur overlay** — fixed absolute, full page, mobile/desktop blur PNG
2. **Header/Nav** — fixed centered nav, scroll-triggered floating card mode on desktop
3. **Hero** — centered headline, CTAs, Ruixen attribution, video dialog thumbnail
4. **Features (#features)** — bento grid with 6 animated feature cards
5. **Solution (#solution)** — 3-row alternating showcase (Smart Context, AI Assistant, AI Agents)
6. **Testimonials (#testimonials)** — dual-row infinite marquee carousel
7. **Pricing (#pricing)** — 3-tier cards, monthly/annual switch, NumberFlow prices
8. **FAQ (#about)** — accordion with 8 items
9. **Footer** — blur background, 4 link columns, social icons

## Layout Notes

- Default theme: dark (`html.dark`)
- Font: Inter
- Max content width: `max-w-6xl`
- Section scroll anchors: `#features`, `#solution`, `#pricing`, `#about`
- No Lenis smooth scroll detected

## Z-index Layers

- Background blur: `-z-10`
- Header nav: `z-20`
- Marquee fade masks: `z-10`

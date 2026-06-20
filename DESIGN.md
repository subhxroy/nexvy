---
name: Nexvy Design System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e0bfbb'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a78a86'
  outline-variant: '#58413e'
  surface-tint: '#ffb4ab'
  primary: '#ffb4ab'
  on-primary: '#690005'
  primary-container: '#f36458'
  on-primary-container: '#5f0004'
  inverse-primary: '#ad312a'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#4edf94'
  on-tertiary: '#00391f'
  tertiary-container: '#00a866'
  on-tertiary-container: '#00331c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#8b1816'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#6ffcae'
  tertiary-fixed-dim: '#4edf94'
  on-tertiary-fixed: '#002110'
  on-tertiary-fixed-variant: '#00522f'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -1.68px
  section-headline:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.64px
  card-title:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.22px
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0px
  mono-eyebrow:
    fontFamily: Geist Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-mute:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 20px
  gutter: 12px
---

## Brand & Style
The design system is engineered for a high-performance, premium iOS fitness experience. It sits at the intersection of professional athletic data and sophisticated lifestyle aesthetics. The personality is disciplined, quiet, and ultra-precise.

The visual direction is **Minimalist-OLED**. It leverages true blacks to create an infinite canvas where data and content emerge through subtle shifts in tonal layering rather than shadows or depth effects. By rejecting gradients and skeuomorphism, the system ensures that the user's focus remains entirely on their metrics and movement. The emotional response is one of "focus and flow"—a digital environment that feels as sharp and intentional as a well-planned workout.

## Colors
The palette is rooted in an OLED-first philosophy to maximize contrast and battery efficiency on mobile devices. 

- **Primary (Coral Red):** Reserved for the singular most important action or metric on a screen. It acts as a beacon within the dark interface.
- **Canvas (True Black):** The foundation of the UI, providing a seamless transition between the hardware and software.
- **Tonal Hierarchy:** Depth is created using `Canvas Soft` for standard containers and `Hairline Soft` for structural definition.
- **Functional Green:** Used exclusively for success states, completed rings, or positive trend data.
- **Text:** High-contrast white is used for primary data points, while `Ash` and `Mute` provide a clear hierarchy for supporting information and metadata.

## Typography
The typography system prioritizes legibility during physical activity. We utilize high-performance sans-serifs (Inter as a substitute for SF Pro, and Geist Mono for SF Mono) to maintain a technical, clean appearance.

**Scale Strategy:**
- **Display Hero:** Used for big-number data points (e.g., total weight lifted, total miles).
- **Mono Eyebrow:** Used for technical metadata, timestamps, and "over-the-title" context. It should always be uppercase to reinforce the "instrumentation" feel.
- **Tight Tracking:** Larger headers utilize negative tracking to create a "compacted" professional look, typical of high-end editorial and sports design.

## Layout & Spacing
The layout follows a strict **8px linear grid** to ensure consistency across the diverse screen sizes of the iOS ecosystem. 

- **Safe Zones:** Content should maintain a minimum 20px horizontal margin from the screen edge.
- **Stacking:** Use 16px (md) spacing between related cards and 32px (xl) between major sections.
- **Alignment:** Content is generally left-aligned to mimic professional data sheets, though primary metrics in cards can be centered if they stand alone.
- **Fluidity:** Cards and interactive elements should span the full width of the safe area minus the standard margins.

## Elevation & Depth
This design system intentionally avoids the use of shadows or blurs. Depth is communicated strictly through **Tonal Layering**:

1.  **Level 0 (Background):** #0B0B0B. Used for the main app canvas.
2.  **Level 1 (Surface):** #212121. Used for cards and secondary containers.
3.  **Level 2 (Active/Highlight):** #EDEDED. Used for rare, high-contrast "Paper" cards that need to pop significantly from the dark background (e.g., summary reports).

**Definition:**
Borders are used as "hairlines" (#353535) to provide separation between Level 0 and Level 1 when content density is high. These should be 1pt wide, following the iOS standard.

## Shapes
The shape language is sophisticated and modern. We use a base radius of 16px for most interactive components to mirror the hardware corners of the modern iPhone.

- **Standard Cards:** 16px radius.
- **Onboarding/Promo Cards:** 20px radius to feel slightly more approachable and distinct.
- **Buttons:** Always use a "Full Pill" (height / 2) to distinguish interactive touch targets from static informational cards.
- **Selection Indicators:** Small 4px radius for checkboxes or toggle pips to maintain a precise, technical feel.

## Components

### Buttons
- **Primary CTA:** 52px height, full pill. Background: Coral (#F36458), Text: Black (#0B0B0B) Medium. 
- **Secondary Button:** 52px height, full pill. Background: Surface Soft (#212121), Border: 1px Hairline (#353535), Text: Ash (#B9B9B9).

### Cards
- **Standard Card:** Background: #212121, Radius: 16px, Padding: 16px or 20px.
- **Paper Card:** Background: #EDEDED, Radius: 16px, Text: #0B0B0B. Used for final workout summaries.

### Input Fields
- **Search/Form:** Background: #212121, Radius: 12px, Height: 44px. Text should be Ash (#B9B9B9) with Mute (#797979) for placeholders. No borders unless the field is in focus.

### Lists & Items
- **Workout Rows:** Border-bottom: 1px Hairline (#353535). Use Chevron-right in Mute color for navigation cues.
- **Checkboxes:** When checked, use Success (#37CD84) with a white checkmark. Circular shape only.

### Chips & Tags
- **Status Tags:** Height: 24px, Radius: 4px. Background: #212121, Text: Geist Mono 11px. Used for "Completed", "Personal Best", etc.
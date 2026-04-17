```markdown
# Design System Specification: The Radiant Kinetic Identity

## 1. Overview & Creative North Star
The creative North Star for this design system is **"The Kinetic Curator."** 

BantuPay 3.0 transcends the utility of a standard wallet to become a high-end editorial experience for digital assets. We move away from the "static grid" common in fintech, instead utilizing intentional asymmetry, overlapping layers, and a sophisticated typographic scale. The goal is a UI that feels alive and authoritative—where the warmth of the primary orange meets a clinical, tech-forward structure. 

We break the "template look" by treating every screen as a composition. Use breathing room (whitespace) not just as a gap, but as a structural element that guides the eye toward high-contrast "moments of intent."

---

## 2. Colors & Atmospheric Tones
The palette is built on the tension between the high-energy `#FC690A` and a deep, multi-layered neutral foundation.

### Core Brand Palette
- **Primary:** `#FC690A` (The "Heat" — used for action and focus)
- **Primary Gradient:** `linear-gradient(135deg, #FC690A 0%, #D4560A 100%)` (Use for Hero cards and primary CTAs to add "soul.")
- **Secondary (Muted Brand):** `#964921` (For lower-priority brand expressions.)

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** 
Boundaries must be defined solely through background color shifts. A section should end and another begin because the surface tier changes (e.g., transitioning from `surface` to `surface-container-low`), not because a line was drawn.

### Surface Hierarchy & Nesting
Treat the UI as physical layers. 
- **Surface (Base):** `#F5F6FA` (Light) / `#0F0F12` (Dark)
- **Surface-Container-Low:** Use for secondary groupings.
- **Surface-Container-Highest:** Use for "elevated" interactive elements.
*Nesting Example:* Place a `surface-container-lowest` card inside a `surface-container-low` section to create a soft, natural lift.

### Glass & Gradient Rule
For floating modals or sticky navigation, use **Glassmorphism**. Apply a semi-transparent `surface` color with a 12px–20px backdrop-blur. This ensures the vibrant primary gradients "bleed" through the UI, making the experience feel integrated.

---

## 3. Typography: The Editorial Voice
We use a tri-font system to separate brand expression from utility.

- **Headings (Plus Jakarta Sans):** Our "Display" voice. Use `display-lg` and `headline-md` for large, confident statements. The tight kerning and geometric curves convey modernity.
- **Body (Inter):** Our "Functional" voice. Used for all reading and transactional data. It is neutral, highly legible, and takes a backseat to the headlines.
- **Data (JetBrains Mono):** Our "Technical" voice. **Non-negotiable for wallet addresses and transaction hashes.** This monospace font signals precision and security.

**Hierarchy Tip:** Use extreme scale contrast. Pair a `display-lg` balance amount with a `label-sm` unit descriptor to create an editorial, "high-fashion" layout.

---

## 4. Elevation & Depth: Tonal Layering
We reject the heavy drop shadows of the early 2010s. Depth is achieved through light and layering.

### The Layering Principle
Depth is primarily communicated via color tiers. To make a card "pop," don't add a shadow—change the surface container value to one level brighter (in dark mode) or one level lower (in light mode).

### Ambient Shadows
When a floating effect is required (e.g., a "Send" button floating above a list):
- **shadow-brand:** A subtle `#FC690A` glow with a 24px blur at 15% opacity.
- **shadow-card:** A soft, diffused shadow using a tinted version of `on-surface` (4%–8% opacity). 

### The "Ghost Border" Fallback
If accessibility requires a container boundary, use the **Ghost Border**: The `outline-variant` token at 15% opacity. Never use 100% opaque borders.

---

## 5. Component Guidelines

### Buttons (The Kinetic Pill)
- **Radius:** `full` (28px) for a sleek, ergonomic feel.
- **Primary:** `linear-gradient(135deg, #FC690A 0%, #D4560A 100%)` with white text.
- **Secondary:** `surface-container-highest` with `on-surface` text.
- **Padding:** 12px vertical / 24px horizontal.

### Input Fields (The Soft Focus)
- **Radius:** `12px` (sm).
- **Styling:** Use `surface-container-low` with no border. On focus, transition to a `Ghost Border` using the primary color at 40% opacity.

### Cards (The Content Vessel)
- **Radius:** `16px–20px` (md to lg).
- **Rule:** **Strictly forbid dividers.** Use vertical whitespace (8pt grid) to separate items. If a list is dense, use alternating `surface` and `surface-container-low` backgrounds for "Zebra" striping without lines.

### Modern Wallet Additions
- **Asset Ticker:** A combination of a Phosphor Icon (Regular) + `title-md` (Inter) for the name + `JetBrains Mono` for the amount.
- **Status Pills:** Small 8px radius chips using `tertiary_container` (Blue) for "Pending" and `error_container` (Red) for "Failed."

---

## 6. Do’s and Don’ts

### Do:
- **Do** use `JetBrains Mono` for any string of alphanumeric characters (hashes/addresses).
- **Do** allow the primary orange to "glow" through glassmorphism.
- **Do** lean into asymmetrical layouts for dashboard headers.
- **Do** use Phosphor Icons in "Regular" weight to match the Inter body stroke.

### Don’t:
- **Don’t** use a black shadow on an orange button; use an orange-tinted shadow.
- **Don’t** use 1px dividers to separate list items; use 8px or 16px of vertical space.
- **Don’t** center-align long blocks of text; keep it editorial and left-aligned.
- **Don’t** use the primary `#FC690A` for error states; use the `error` token (`#BA1A1A`).

---

## 7. Spacing Scale
Everything follows an **8pt Grid System**. 
- **Internal Padding:** 16px (Card padding).
- **Section Spacing:** 32px or 48px.
- **Component Gap:** 8px or 12px.

By adhering to this system, the UI will feel less like a "software tool" and more like a premium, curated financial environment.```
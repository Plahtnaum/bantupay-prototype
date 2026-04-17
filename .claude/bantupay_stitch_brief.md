# BantuPay Wallet 3.0 — Comprehensive Design Brief for Stitch
## Complete Screen-by-Screen UI/UX Specification

**Version:** 1.1 | April 2026  
**Export target:** Figma (via Stitch export)  
**Frame size:** iPhone 16 Pro — 393 × 852px (primary), Android reference at 412 × 915px  
**Design philosophy:** "One Tap Deeper" — progressive disclosure, zero blockchain jargon in default UI, every screen has one dominant action  
**Brand mandate:** #FC690A is the non-negotiable primary. Every screen must feel like it belongs to the same product.

---

## PART 1 — DESIGN SYSTEM & TOKENS

### 1.1 Color Palette (Apply These Exactly)

**Brand**
```
brand-primary:       #FC690A   ← THE orange. Primary buttons, key icons, active states
brand-primary-dark:  #D4560A   ← Pressed states, gradient endpoint
brand-primary-light: #FF8A3D   ← Soft accent, secondary elements
brand-primary-wash:  #FFF3EC   ← Backgrounds for orange-tinted surfaces
brand-gradient:      linear-gradient(135deg, #FC690A 0%, #D4560A 100%)
```

**Backgrounds & Surfaces (Light Mode)**
```
bg-base:      #F5F6FA   ← App shell background (very light blue-grey)
bg-surface:   #FFFFFF   ← Cards, sheets, modals
bg-surface-2: #F0F1F5   ← Secondary surfaces, input backgrounds
```

**Text (Light Mode)**
```
text-primary:   #0F0F0F   ← Headings, primary labels
text-secondary: #6B7080   ← Sub-labels, metadata, timestamps
text-tertiary:  #A0A8B8   ← Placeholders, hints, disabled
text-on-brand:  #FFFFFF   ← Text on orange backgrounds
```

**Semantic**
```
success:       #16A34A   ← Received, confirmed, positive
success-wash:  #F0FDF4   ← Success state backgrounds
warning:       #D97706   ← Pending, caution
warning-wash:  #FFFBEB
error:         #DC2626   ← Failed, rejected, destructive
error-wash:    #FEF2F2
info:          #2563EB   ← Informational callouts
info-wash:     #EFF6FF
```

**Border & Divider**
```
border:        #E8EAF0   ← Card borders, input borders, dividers
border-focus:  #FC690A   ← Focused input border
```

**Dark Mode (design both — toggle in Stitch)**
```
bg-base-dark:      #0F0F12
bg-surface-dark:   #1A1A20
bg-surface-2-dark: #24242C
text-primary-dark: #F5F5F5
text-secondary-dark: #9BA3B4
border-dark:       #2A2A35
```

---

### 1.2 Typography

**Font Families**
- **Display/Headings:** Plus Jakarta Sans (weights: SemiBold 600, Bold 700)
- **Body/UI:** Inter (weights: Regular 400, Medium 500, SemiBold 600)
- **Monospace (addresses, hashes, amounts):** JetBrains Mono Regular 400

**Type Scale (Mobile — apply consistently across all screens)**

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `display-xl` | 38px | 48px | Plus Jakarta Bold | Hero balance numbers |
| `display-lg` | 30px | 40px | Plus Jakarta Bold | Large balance, splash |
| `display-md` | 24px | 32px | Plus Jakarta SemiBold | Screen titles |
| `heading-lg` | 20px | 28px | Plus Jakarta SemiBold | Section headings |
| `heading-md` | 17px | 24px | Inter SemiBold | Sub-section headings |
| `heading-sm` | 15px | 22px | Inter SemiBold | Card titles, labels |
| `body-lg` | 15px | 22px | Inter Regular | Primary body copy |
| `body-md` | 13px | 18px | Inter Regular | Secondary body, list items |
| `body-sm` | 11px | 16px | Inter Regular | Captions, timestamps, metadata |
| `label-lg` | 13px | 16px | Inter SemiBold | Button labels, nav labels |
| `label-sm` | 11px | 14px | Inter SemiBold | Tags, badges, chip labels |
| `mono-md` | 13px | 18px | JetBrains Mono | Wallet addresses, tx hashes |
| `mono-sm` | 11px | 16px | JetBrains Mono | Short addresses, amounts |

---

### 1.3 Spacing System (8pt Grid — All Spacing Must Be Multiples of 4px)

```
space-1:   4px    ← Micro gaps, icon-to-text
space-2:   8px    ← Tight padding, inline gaps
space-3:   12px   ← Component internal padding (sm)
space-4:   16px   ← Standard padding, card padding
space-5:   20px   ← Card padding (lg), section gaps
space-6:   24px   ← Section padding
space-8:   32px   ← Large section gaps
space-10:  40px   ← Screen-level padding tops
space-12:  48px   ← Hero section spacing
space-16:  64px   ← Large breathing room
```

**Screen margins:** 20px left/right on all screens  
**Safe area top:** 59px (iPhone Dynamic Island)  
**Safe area bottom:** 34px  

---

### 1.4 Border Radius

```
radius-xs:   4px    ← Tags, chips, small badges
radius-sm:   8px    ← Small buttons, icon containers
radius-md:   12px   ← Input fields, list items
radius-lg:   16px   ← Cards, modals
radius-xl:   24px   ← Bottom sheets (top corners only)
radius-2xl:  32px   ← Large cards
radius-full: 9999px ← Buttons (pill), avatars, FAB
```

---

### 1.5 Shadows / Elevation

```
shadow-sm:    0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
shadow-md:    0 4px 16px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)
shadow-lg:    0 8px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)
shadow-brand: 0 4px 20px rgba(252,105,10,0.30), 0 2px 8px rgba(252,105,10,0.15)
shadow-card:  0 2px 8px rgba(0,0,0,0.06)
```

---

### 1.6 Iconography

**Icon set:** Phosphor Icons (phosphoricons.com)  
**Default style:** Regular (1.5px stroke)  
**Emphasis style:** Bold or Fill  

| Context | Size | Style |
|---------|------|-------|
| Bottom navigation | 24px | Regular → Fill when active |
| List items | 20px | Regular |
| Action buttons inside cards | 24px | Regular |
| Empty state illustrations | 48px | Thin or Regular |
| FAB center button | 28px | Bold |
| Header icons (bell, QR) | 22px | Regular |
| Transaction direction | 20px | Fill |

**Key icons used:**
- House (home tab)
- ClockClockwise (activity tab)
- QrCode (FAB center + header)
- Wallet (wallet tab)  
- UserCircle (profile tab)
- ArrowUp (send)
- ArrowDown (receive)
- ArrowsLeftRight (swap)
- CurrencyDollar (buy/onramp)
- Check (confirmed)
- Warning (pending)
- X (failed)
- Bell (notifications)
- Fingerprint (biometrics)
- ShieldCheck (security)
- Copy (copy address)
- ShareNetwork (share)
- CaretRight (list item navigation)
- MagnifyingGlass (search)
- Plus (add)
- Storefront (merchant)
- ChartBar (analytics)
- UsersThree (multi-sig)

---

### 1.7 Component Library — Exact Specs

#### PRIMARY BUTTON
```
Height:          56px
Width:           Full width (screen width minus 40px margins) OR auto (min 120px)
Background:      #FC690A (or brand-gradient for emphasis)
Text:            16px Inter SemiBold, #FFFFFF, centered
Border-radius:   28px (full pill)
Shadow:          shadow-brand
Padding:         16px horizontal (auto-width variant)
Pressed state:   background #D4560A, scale 0.97
Disabled state:  background #E8EAF0, text #A0A8B8, no shadow
Loading state:   spinner (white, 20px) replaces text, no interaction
```

#### SECONDARY BUTTON
```
Height:          56px
Background:      transparent
Border:          1.5px solid #FC690A
Text:            16px Inter SemiBold, #FC690A, centered
Border-radius:   28px
Pressed state:   background #FFF3EC
```

#### GHOST BUTTON / TEXT LINK
```
Height:          44px (tap target)
Background:      transparent
Text:            14px Inter Medium, #FC690A
Underline:       none (underline on hover/focus only)
Use:             "Skip for now", "Forgot PIN", "Learn more"
```

#### DANGER BUTTON
```
Height:          56px
Background:      #DC2626
Text:            white
Border-radius:   28px
Use:             Destructive actions (delete, freeze wallet)
```

#### INPUT FIELD
```
Height:          56px
Background:      #FFFFFF (light) / #1A1A20 (dark)
Border:          1.5px solid #E8EAF0
Border (focus):  1.5px solid #FC690A, inner glow rgba(252,105,10,0.08) 0 0 0 3px
Border-radius:   12px
Text:            15px Inter Regular, #0F0F0F
Placeholder:     15px Inter Regular, #A0A8B8
Label above:     12px Inter SemiBold, #6B7080, 8px gap below
Error state:     border #DC2626, error text below in 11px #DC2626
Padding:         16px horizontal
```

#### OTP / PIN INPUT BOXES
```
Individual box:  56px × 64px
Background:      #F0F1F5 (empty), #FFFFFF (filled), border #FC690A (focused)
Border-radius:   12px
Text:            24px Inter Bold, #0F0F0F, centered
Gap between:     12px
Arrangement:     6 boxes in a row (centered)
```

#### NUMPAD / KEYPAD
```
Button size:     88px × 64px
Layout:          3 columns × 4 rows
Background:      #F0F1F5 (light), #24242C (dark)
Pressed:         #E8EAF0 (light), #2A2A35 (dark)
Border-radius:   16px
Text:            28px Inter Medium, #0F0F0F (light), #F5F5F5 (dark)
Special keys:    Biometric icon (left bottom), Delete icon (right bottom)
Gap:             8px between keys
```

#### CARD (Standard)
```
Background:      #FFFFFF
Border-radius:   16px
Shadow:          shadow-card
Padding:         16px
Width:           Full content width (screen - 40px)
```

#### BALANCE CARD (Hero)
```
Background:      brand-gradient (linear-gradient 135deg, #FC690A → #D4560A)
Border-radius:   20px
Padding:         20px 20px 24px 20px
Width:           Full content width
Height:          Auto (min ~160px)
Inner texture:   Subtle concentric ring pattern, white 5% opacity, in top-right corner
```

#### LIST ITEM (Asset / Transaction)
```
Height:          72px
Background:      #FFFFFF
Border-radius:   12px
Padding:         0 16px
Left:            Icon (40px circle) + 12px gap + label stack
Right:           Amount stack (amount + fiat equiv)
Bottom border:   0.5px #E8EAF0 (not on last item)
Pressed state:   background #F5F6FA
```

#### BOTTOM SHEET
```
Background:      #FFFFFF (light) / #1A1A20 (dark)
Border-radius:   24px 24px 0 0
Drag handle:     32px × 4px, #E8EAF0, centered, 12px from top
Padding:         20px (top after handle) 20px (horizontal)
Overlay:         rgba(0,0,0,0.5) behind sheet
Max height:      90% of screen height
```

#### BADGE / PILL
```
Height:          20px (sm) / 24px (md)
Padding:         4px 8px
Border-radius:   full
Text:            11px Inter SemiBold

Variants:
- Orange (pending):  bg #FFF3EC, text #FC690A
- Green (success):   bg #F0FDF4, text #16A34A
- Red (failed):      bg #FEF2F2, text #DC2626
- Grey (neutral):    bg #F0F1F5, text #6B7080
- Blue (info):       bg #EFF6FF, text #2563EB
```

#### AVATAR
```
Size:            40px (list) / 48px (profile card) / 64px (profile screen)
Shape:           Circle (radius-full)
Background:      Brand-gradient (for no-photo state)
Initials:        White, Inter SemiBold, proportional
Border:          2px solid #FFFFFF (on colored background)
```

#### ASSET TOKEN ICON
```
Size:            40px circle
XBN:             Orange circle, white X logo
cNGN:            Purple/dark circle, N logo
USDC:            Blue circle, USDC logo
BNR:             Orange circle, B logo
Others:          Grey circle, first letter of ticker
```

#### SHIMMER SKELETON
```
Background:      linear-gradient(90deg, #F0F1F5 25%, #E8EAF0 50%, #F0F1F5 75%)
Animation:       slide right, 1.2s infinite
Border-radius:   match the element being loaded
Use:             Replace all loading spinners — never show blank screens
```

#### BOTTOM NAVIGATION BAR
```
Height:          80px (includes 34px safe area bottom)
Background:      #FFFFFF, top border 1px #F0F1F5
Tab width:       Equal divisions (5 tabs)
Icon size:       24px
Active icon:     Fill style, color #FC690A
Inactive icon:   Regular style, color #A0A8B8
Active label:    11px Inter SemiBold, #FC690A
Inactive label:  11px Inter Regular, #A0A8B8
Label gap:       4px below icon

FAB (center tab):
  Size:          60px × 60px circle
  Background:    brand-gradient + shadow-brand
  Icon:          28px QrCode, white, Bold
  Position:      Centered above nav bar, overlapping by 16px (y-translate -16px)
  Notch:         The nav bar has a 80px white curved notch cut out behind the FAB
```

#### TOAST NOTIFICATION (In-app)
```
Position:        Top of screen, below status bar, 16px margins
Height:          Auto (min 56px)
Background:      #0F0F0F (dark, high contrast)
Border-radius:   14px
Padding:         14px 16px
Text:            13px Inter Medium, white
Icon:            Left-aligned, 20px
Shadow:          shadow-lg
Animation:       Slide down from top (250ms ease-out), auto-dismiss after 4s
```

#### CALLOUT / INFO BOX
```
Background:      #EFF6FF
Border-left:     3px solid #2563EB
Border-radius:   8px
Padding:         12px 14px
Text:            13px Inter Regular, #1E3A5F
Icon:            Info, 16px, #2563EB (left-aligned)
```

#### SUCCESS BOX
```
Background:      #F0FDF4
Border-left:     3px solid #16A34A
Same layout as callout
Text color:      #14532D
```

#### WARNING BOX
```
Background:      #FFFBEB
Border-left:     3px solid #D97706
Same layout as callout
Text color:      #78350F
```

---

### 1.8 Motion Principles

| Action | Duration | Easing | Notes |
|--------|----------|--------|-------|
| Button press feedback | 80ms | Instant | Scale 0.97 + haptic |
| Tab switch | 200ms | ease-out | Cross-fade + slide |
| Bottom sheet open | 350ms | spring(0.34, 1.56, 0.64, 1) | Slide up from bottom |
| Bottom sheet close | 250ms | ease-in | Slide down |
| Screen push (navigate) | 300ms | ease-out | Slide from right |
| Success celebration | 500ms | spring | Scale bounce + confetti |
| Skeleton shimmer | 1200ms | linear | Continuous loop |
| Toast appear | 250ms | ease-out | Slide from top |
| Number count-up | 600ms | ease-out | On balance load |

---

## PART 2 — SCREEN SPECIFICATIONS

> **Stitch instruction:** Design each screen at 393 × 852px. Create a separate artboard for each state. Group screens by flow/section. Export all frames to Figma.

---

## SECTION A — ONBOARDING FLOW (8 Screens + States)

### A1 — SPLASH / LAUNCH SCREEN

**Purpose:** Brand first impression, 0-state before app loads  
**Duration:** Shows for ~1.5s, then transitions to A2 or Home (if logged in)

**Layout:**
- Full-screen background: brand-gradient (#FC690A → #D4560A, 135°)
- Background texture: 3 concentric thin rings (white 8% opacity), centered in bottom-right quadrant, sizes 300px / 450px / 600px diameter
- BantuPay logo: centered horizontally, positioned at 45% from top
  - Logo mark: The X/butterfly icon from existing brand — white, 80px × 80px
  - Wordmark: "BantuPay" below logo, Plus Jakarta SemiBold 28px, white, 8px gap
- Tagline: "Empowering Humanity" — Inter Regular 15px, white 80% opacity, 12px below wordmark
- Bottom: loading indicator — 3 dots pulsing, white 60% opacity, 60px from safe-area bottom

**Dark mode:** Identical (gradient remains orange — it's brand)

---

### A2 — WELCOME / VALUE PROPOSITION

**Purpose:** First screen user actively sees; sets tone; drives signup  

**Layout:**
- Background: white (#FFFFFF)
- Top half (0–380px): Orange gradient hero area
  - Same texture rings as A1 but smaller (200px / 320px), anchored top-right
  - No logo here — focus is on message
  - Large headline: "The wallet that works like WhatsApp" 
    - Plus Jakarta Bold, 32px, white, 24px from sides, positioned at 40% from top of hero area
  - Sub: "Send, receive, and save cNGN instantly — no bank required"
    - Inter Regular 15px, white 85% opacity, 16px from sides, 12px below headline
- Bottom half (380px–852px): White card that slides up slightly over the orange (20px overlap, top radius 28px)
  - Content area padding: 32px top, 20px sides
  - Visual: 3 feature chips in a row (icon + label, pill-shaped, light orange wash):
    - [Lightning icon] Instant payments
    - [Shield icon] Self-custody
    - [Arrows icon] Easy swaps
  - 16px gap below chips
  - Primary CTA: "Get Started" — full-width primary button, 56px
  - 16px gap
  - Secondary link: "I already have a wallet →" — ghost button, centered, 15px Inter Medium #FC690A
  - Very bottom: Version number in tiny text (#A0A8B8, 11px, centered)

---

### A3 — MODE SELECTION

**Purpose:** Personalizes experience; routes to correct default UI

**Layout:**
- Background: #F5F6FA
- Status bar: light
- Back button: top-left (← arrow, 22px, #0F0F0F)
- Progress indicator: 3 dots top-center (step 1 of 3, orange dot + 2 grey)
- Headline: "What brings you here?" — Plus Jakarta Bold 28px, #0F0F0F, 20px margins, 32px from top
- Sub: "We'll set things up for you. You can change this later." — Inter Regular 14px, #6B7080, 8px below
- 28px gap
- Three mode cards, stacked with 12px gap:

  **Card 1 — Personal (default selected)**
  ```
  Height: 88px
  Background: #FFFFFF, border 2px #FC690A (selected state)
  Border-radius: 16px
  Left: emoji/icon container 48px circle (brand-wash bg), emoji 💰 (or coin icon in orange, 24px)
  Center: "Personal" (Inter SemiBold 16px #0F0F0F) + "Send and receive money" (Inter Regular 13px #6B7080)
  Right: Radio circle — filled orange with white checkmark (selected), grey ring (unselected)
  Padding: 16px
  Selected: subtle orange wash bg #FFF9F6, border #FC690A
  ```

  **Card 2 — Merchant**
  ```
  Same layout. Icon: storefront (orange icon). "Merchant" + "Accept payments at my business"
  ```

  **Card 3 — Crypto User**
  ```
  Same layout. Icon: chart-line. "Crypto User" + "I know what I'm doing"
  ```

- Bottom (fixed): "Continue" primary button, full-width, 20px bottom margin from safe area

---

### A4 — PHONE NUMBER INPUT

**Purpose:** Identity capture; phone number = primary identifier

**Layout:**
- Background: #F5F6FA
- Back button top-left
- Progress: step 2 of 5
- Top orange accent: a slim 3px-tall orange bar across full width below status bar
- Content starts 40px from top (below bar):
  - Icon: Phone icon, 48px, orange, centered, in a 72px white circle with shadow-sm
  - Headline: "What's your number?" — Plus Jakarta Bold 26px, centered, 16px below icon
  - Sub: "We'll send a verification code. No passwords to forget." — Inter Regular 14px, #6B7080, centered, 8px below, 32px margins
  - 32px gap
  - Phone input field:
    - Height: 56px
    - Left section (country code): 72px wide, bordered right with #E8EAF0, shows flag emoji + code (e.g. 🇳🇬 +234), Inter SemiBold 15px
    - Main section: number input, placeholder "800 000 0000", Inter Regular 15px
    - Border: 1.5px #E8EAF0, focus orange
    - Border-radius: 12px on entire field
  - 8px gap
  - Small text: "We auto-detected your country from your SIM" — 11px #A0A8B8 (show only when auto-detected)
  - 12px gap
  - Alternative: "Use email instead" — ghost button, centered, 13px #FC690A
- Bottom: "Send Code" primary button (enabled when 10+ digits entered)

---

### A5 — OTP VERIFICATION

**Purpose:** Verify phone ownership

**Layout:**
- Background: #F5F6FA
- Back button top-left
- Progress: step 3 of 5
- Content:
  - Icon: Chat dots (message icon), 48px orange in 72px white circle
  - Headline: "Enter the code" — Plus Jakarta Bold 26px, centered
  - Sub: "We sent a 6-digit code to +234 800 000 0000" — Inter Regular 14px #6B7080, centered, 20px sides
  - "Change number" — 13px #FC690A link, centered, 8px below sub
  - 32px gap
  - 6 OTP boxes in a row (56px × 64px each, 12px gaps, centered)
    - State: empty (bg #F0F1F5), active (border #FC690A, bg white), filled (bg white, text shown as •), error (border #DC2626)
  - 16px gap
  - Error message (conditional): "Incorrect code. 2 attempts remaining." — 13px #DC2626, centered
  - 24px gap
  - Resend timer: "Resend code in 0:28" — 13px #6B7080, centered
    - After timer: "Resend code" — 13px #FC690A, tap to resend
  - 32px gap
  - "Didn't receive it? Try WhatsApp OTP" — ghost link, centered

- No explicit "Confirm" button — auto-submits when 6th digit entered (smooth, optimistic)
- Loading state: boxes become grey, spinner at bottom

---

### A6 — DISPLAY NAME

**Purpose:** Personalization; creates emotional connection

**Layout:**
- Background: #F5F6FA
- Back button top-left
- Progress: step 4 of 5
- Content:
  - Icon: Smiley face or person icon, 48px orange in 72px white circle
  - Headline: "What should we call you?" — Plus Jakarta Bold 26px, centered
  - Sub: "This is your display name. Not your wallet address." — 14px #6B7080, centered
  - 32px gap
  - Single text input:
    - Label: "Display name"
    - Placeholder: "e.g. Amara, Chidi, or Mama"
    - Type: text, autocapitalize words
    - Character limit indicator: right-aligned, 11px #A0A8B8, "8/30"
  - 12px gap
  - Username preview (appears as user types):
    - Small card, white bg, rounded-lg, padding 12px 16px:
    - "Your BantuPay link will be:"
    - "bantupay.link/amara" — 13px JetBrains Mono, orange
    - (Username is auto-generated from display name, user can change later)
  
- Bottom: "Continue" primary button (enabled when name ≥ 2 chars)

---

### A7 — PIN SETUP

**Purpose:** Primary security credential; must feel secure but not intimidating

**Layout:**
- Background: #0F0F12 (DARK — security screens use dark background to signal seriousness)
- Status bar: light icons
- No back button (can't go back from security setup)
- Content:
  - Top: BantuPay logo mark, white, small (32px), top-center, 20px from safe area
  - 40px gap
  - Lock icon: ShieldCheck, 52px, orange, centered, in a 80px circle (white 8% opacity)
  - Headline: "Create your PIN" — Plus Jakarta SemiBold 24px, white, centered, 16px below icon
  - Sub: "6 digits. Don't share it with anyone." — Inter Regular 14px, white 60%, centered, 8px below
  - 40px gap
  - PIN dots: 6 circles, 16px diameter each, 16px gaps
    - Empty: white 20% opacity circle, stroke white 30%
    - Filled: solid white circle
  - 32px gap
  - Number keypad (dark variant — see component spec above)
  - Bottom of keypad: biometric icon left (greyed out at this stage), delete icon right

- **A7b — Confirm PIN:**
  - Same layout but headline: "Confirm your PIN"
  - Sub: "Re-enter your PIN to confirm"
  - If mismatch: dots shake (error animation), brief red flash on dots, "PINs don't match. Try again." in 13px #FF6B6B

---

### A8 — ENABLE BIOMETRICS

**Purpose:** Reduce login friction; most users should say yes

**Layout:**
- Background: #F5F6FA (back to light — less intimidating)
- No back button
- Content (centered vertically):
  - Large illustration area (180px × 180px centered):
    - A stylized phone outline (simple, line-art style)
    - Fingerprint icon or face-scan icon inside phone screen area
    - Orange glow effect around the biometric icon (orange radial gradient, 60% opacity)
  - 24px gap
  - Headline: "Use Face ID to unlock" (or "Use fingerprint to unlock" — detect device type)
  - Plus Jakarta SemiBold 24px, #0F0F0F, centered
  - Sub: "Skip the PIN every time you open BantuPay." — Inter Regular 14px, #6B7080, centered, 24px margins
  - 40px gap
  - Primary button: "Enable Face ID" — full-width, brand-gradient
  - 12px gap
  - Ghost link: "Skip for now" — centered, 13px #6B7080 (grey, not orange — deprioritized)

---

### A9 — WALLET CREATED (CELEBRATION)

**Purpose:** The "magic moment" — user has crossed the threshold. Make it memorable.

**Layout:**
- Background: #0F0F12 (dark for drama)
- Full-screen orange particle/confetti animation playing over background (60 particles, colors: #FC690A, #FF8A3D, #FFFFFF, #FFD5B8 — mix of brand oranges and white)
- Centered content (appears after 400ms animation starts):
  - Animated checkmark: circular progress ring draws in orange (500ms), then white check appears inside 64px orange circle
  - 24px gap
  - Headline: "Your wallet is ready, [Name]!" — Plus Jakarta Bold 28px, white, centered, 20px margins
  - Sub: "You're in. Fully self-custody. Only you have access." — 14px white 70%, centered
  - 32px gap
  - Wallet address card:
    - Dark card (#1A1A20, radius-lg, padding 16px)
    - Label: "Your BantuPay address" — 11px #9BA3B4 SemiBold, uppercase
    - Address: "GBPTV...XXXQ" (first 4 + ... + last 4) — 15px JetBrains Mono, white
    - Small: [Copy icon] "Tap to copy full address" — 11px #FC690A
  - 12px gap  
  - XBN + cNGN chips (showing both auto-added):
    - Two pill badges side by side: "XBN added" + "cNGN added" — green wash, green text, checkmark icon
  - 40px gap
  - Primary button: "Fund my wallet" — full-width, brand-gradient
  - 12px gap
  - Ghost: "Explore first" — 13px white 60%

---

### A10 — BACKUP NUDGE (Deferred — Non-Blocking)

**Purpose:** Appears as a banner on Home screen after first received transaction, NOT during onboarding

**Layout:** Inline banner on Home screen (not a full screen)
- Appears below the balance card
- Card style: white, radius-lg, shadow-sm, left border 3px #D97706 (warning orange)
- Padding: 14px 16px
- Left: Warning icon, 20px, #D97706
- Content: "Back up your wallet" (14px Inter SemiBold #0F0F0F) + "You received cNGN. Don't lose access to your funds." (12px #6B7080)
- Right: "Back up →" button — small, 32px height, orange, pill, 13px
- Dismiss: × icon top-right, 16px #A0A8B8

---

## SECTION B — HOME SCREEN

### B1 — HOME (Personal Mode, With Balance)

**This is the most important screen — must be pixel-perfect**

**Layout (top to bottom):**

**Header area (top of screen, 20px horizontal padding):**
- Left: User avatar (36px circle, brand-gradient, initials white) + "Hi, [Name]" (Inter Medium 15px #0F0F0F)
- Right: Two icon buttons side by side, 8px gap:
  - Bell icon (22px, #6B7080), with notification badge (8px orange dot, positioned top-right of icon)
  - QR code icon (22px, #6B7080) — quick scan

**Balance Card (12px below header, full content width):**
```
Background:    brand-gradient
Border-radius: 20px
Padding:       20px 20px 0 20px
Shadow:        shadow-brand

Content layout:
Row 1:
  Left: "Total Balance" — 12px Inter Medium, white 80%
  Right: Eye icon (20px, white 60%) — tap to toggle hide/show

Row 2 (16px gap):
  "₦47,832.50" — 38px Plus Jakarta Bold, white
  "≈ $32.14 USD" — 13px Inter Regular, white 60%, 4px below

Row 3 (16px gap):
  [Balance change today: +₦500 today (0.8%) ↑]
  Shown only if change present: 12px Inter Regular, white 70%

Row 4 (Quick Actions — bottom of card, 20px top padding):
  Background: white 12% overlay strip, -20px horizontal (full width), radius bottom 20px
  Padding: 14px 0
  4 action buttons equally spaced:
  
  Each action:
    Icon container: 44px × 44px, white 20% bg, radius-sm
    Icon: 22px, white
    Label: 11px Inter Medium, white 80%, 4px below

  Actions: [ArrowUp Send] [ArrowDown Receive] [ArrowsLeftRight Swap] [CurrencyDollar Buy]
```

**ASSETS section (20px below card):**
- Section header: "ASSETS" — 11px Inter SemiBold #A0A8B8, uppercase, letter-spacing 1.2px
- 8px gap
- Asset list (each item is a white card, radius-12px, shadow-card, stacked with 8px gap):

  **Asset List Item:**
  ```
  Height: 72px
  Background: #FFFFFF
  Border-radius: 12px
  Padding: 0 16px
  
  Left: Token icon (40px circle)
  Gap: 12px
  Center (flex column):
    Row 1: Token ticker (15px Inter SemiBold #0F0F0F) + optional badge (e.g. "Native" in grey pill)
    Row 2: Token price in NGN (13px Inter Regular #6B7080)
  Right (flex column, text-right):
    Row 1: Amount (15px Inter SemiBold #0F0F0F)
    Row 2: Fiat equivalent (13px Inter Regular #6B7080)
  ```

  **Default assets shown:** XBN, cNGN (always at top — auto-added)
  **Add assets:** Below list, a dashed-border card with [Plus icon] "Add assets" centered, #FC690A

**RECENT ACTIVITY (20px below assets):**
- Section header: "RECENT" — same style as ASSETS header
- Right-aligned: "See all →" — 13px #FC690A
- 8px gap
- Last 3 transactions as list items (see E1 Transaction Item spec)
- If empty: empty state — icon + "No transactions yet. Send or receive cNGN to get started."

**Bottom Nav Bar:** 80px, fixed to bottom

---

### B2 — HOME (Empty State / New User)

**All same layout as B1 except:**
- Balance card: "₦0" with sub "Fund your wallet to get started"
- Quick actions: Send is greyed/disabled until balance > 0
- Assets section: XBN and cNGN shown with 0 balances + orange "Fund" badge on each
- Recent: empty state with illustration + "Receive your first cNGN" CTA button
- Banner at top of screen (above balance card): "Welcome, [Name]! Fund your wallet to start using BantuPay." — info callout style

---

### B3 — HOME (Balance Hidden State)

- Balance card: amount replaced with "• • • • • •" (dots, white, 24px)
- Fiat equiv: "••••" 
- Asset amounts: all replaced with "•••"
- Eye icon: fills solid (eye-slash) to indicate hidden
- Tap anywhere on balance card to reveal (with biometric prompt if configured)

---

### B4 — NOTIFICATION CENTER

**Accessed from:** Bell icon in header

**Layout:**
- Full screen, slides in from right
- Header: "Notifications" (Plus Jakarta SemiBold 22px) + "Mark all read" (13px #FC690A, right)
- Filter chips: [All] [Payments] [Security] [Updates] — horizontally scrollable, pill shape
- List: notification items, newest first

**Notification Item:**
```
Height: 80px minimum (auto for long text)
Background: white (read), #FFF9F6 (unread — very light orange wash)
Left: 
  Icon container (40px circle):
    Payment received: green bg, ArrowDown icon
    Payment sent: orange bg, ArrowUp icon
    Security: red bg, ShieldWarning icon
    Promo: grey bg, Bell icon
    Airdrop: purple bg, Gift icon
Gap: 12px
Center:
  Title: 14px Inter SemiBold #0F0F0F (or #6B7080 if read)
  Body: 13px Inter Regular #6B7080 (max 2 lines, truncate)
  Time: 11px #A0A8B8
Right:
  Unread dot: 8px orange circle
  Or: Action button if actionable ("Accept", "Claim")
```

---

## SECTION C — SEND FLOW (3 Steps)

### C1 — SEND: AMOUNT INPUT (Step 1 of 3)

**Layout:**
- Background: #F5F6FA
- Header: "← Send" (Plus Jakarta SemiBold 22px) + "Cancel" (13px #6B7080, right)
- 
- **Asset selector bar** (20px from header):
  - Horizontal scroll of asset pills
  - Selected: orange bg pill (brand-wash), orange text, orange border
  - Unselected: white bg pill, grey text
  - Each pill: [token icon 20px] + [ticker] + [balance in grey]
  - Default selected: cNGN (if balance > 0), XBN otherwise

- **Amount display area** (centered, 32px top margin):
  - Fiat/crypto toggle: two small toggle pills at top of amount area
    - "NGN" | "cNGN" — tap to switch which denomination is primary
  - Primary amount: large display field, not a typical input
    - "0" initially, grows as keypad is pressed
    - Font: 56px Plus Jakarta Bold, #0F0F0F (light) or white (dark)
    - Fiat equiv below: "≈ 0 cNGN" — 15px Inter Regular #6B7080
    - Animation: numbers count up as pressed
  - "MAX" badge: top-right of amount area, small pill, #FC690A — tapping fills max balance

- **Exchange rate strip** (below amount, if swap-relevant):
  - "1 cNGN = ₦1.00" — 13px Inter Regular #6B7080, centered

- **Full-screen numpad** (below amount):
  - Dark variant on light background — see component spec
  - Bottom-left: biometric icon (greyed, activates at step 3)
  - Bottom-right: delete icon

- **Bottom CTA** (above safe area):
  - "Continue →" — primary button, full width, enabled when amount > 0 and ≤ balance
  - Insufficient balance: button disabled + "Insufficient cNGN balance" note in red below

---

### C2 — SEND: SELECT RECIPIENT (Step 2 of 3)

**Layout:**
- Background: #F5F6FA
- Header: "← Send [amount] cNGN" — shows amount from step 1 in header subtitle
- Step indicator: "Step 2 of 3" — 11px Inter SemiBold #A0A8B8, centered below header

- **Search / paste input** (20px margin):
  - Height: 52px
  - Left icon: MagnifyingGlass, 20px #A0A8B8
  - Placeholder: "Name, @username, phone number, or address"
  - Right icon: QR code scan icon (22px #FC690A) — opens camera
  - Border: 1.5px #E8EAF0, focus #FC690A
  - Border-radius: 12px

- **Recent recipients row** (16px below input):
  - Label: "RECENT" — 11px SemiBold #A0A8B8, uppercase
  - Horizontal scrollable row of avatar+name stacks:
    - Avatar: 48px circle, gradient, initials
    - BantuPay indicator: 12px orange dot on avatar border (if they have BantuPay)
    - Name below: 11px Inter Medium #0F0F0F, max 8 chars

- **Contact list** (shows BantuPay contacts from phonebook):
  - Section: "BANTUPAY CONTACTS" then "OTHER"
  - Each contact item:
    - Height: 64px
    - Left: 44px avatar circle (gradient, initials)
    - Center: Name (15px Inter SemiBold #0F0F0F) + BantuPay username or phone (13px #6B7080)
    - Right: Orange checkmark badge if BantuPay user, grey if not
  
- **Search results** (replaces lists during active search):
  - Live search across name, username, phone
  - "User not found" state: shows "Send to this address" option if input looks like valid address

- Bottom: "Paste address" — ghost button with clipboard icon, for manual paste

---

### C3 — SEND: REVIEW & CONFIRM (Step 3 of 3)

**Layout:**
- Background: #F5F6FA
- Header: "← Review" (back to recipient selection)

- **Transaction summary card** (20px margin, white card, shadow-md):
  - Padding: 24px
  - Row: "Sending" label (12px Inter Medium #6B7080) — left
  - Amount: "500 cNGN" — 28px Plus Jakarta Bold #0F0F0F — right
  - Fiat: "≈ ₦500.00" — 13px #6B7080 — right, below amount
  - Divider (1px #E8EAF0, full width, 16px margin)
  - Row: "To" label — left
  - Recipient: avatar + name + username — right (compact, 13px)
  - Divider
  - Row: "Network fee" — left
  - Fee: "< ₦0.01" — right, 13px Inter SemiBold #16A34A (emphasize cheapness in green)
  - Row: "Estimated arrival" — left  
  - Arrival: "~3 seconds" — right, 13px #6B7080
  - Divider (thicker, 2px)
  - Row: "Total deducted" — left, SemiBold
  - Total: "500 cNGN" — right, 17px Inter Bold #0F0F0F

- **Memo field** (12px below card):
  - Optional: "Add a note" — collapsed by default, tap to expand
  - Input: 48px height, placeholder "e.g. Rent for April"

- **Biometric prompt area** (centered, 32px below card):
  - Fingerprint/Face icon, 56px, orange, centered in 80px circle
  - Below icon: "Confirm with Face ID" — 14px Inter Medium #0F0F0F
  - Sub: "This authorizes the transaction" — 12px #6B7080
  - Tap the icon area to trigger native biometric prompt

- No separate "Send" button — biometric confirmation IS the send action

---

### C4 — SEND SUCCESS

**Layout:**
- Background: #0F0F12 (dark for drama)
- Orange confetti animation playing (same as A9)
- Center content:
  - Animated success circle: orange ring draws, white checkmark appears (64px)
  - "Sent!" — Plus Jakarta Bold 32px, white, centered, 16px below
  - Amount: "500 cNGN sent to Chidi" — 16px Inter Regular, white 70%, centered
  - 24px gap
  - Transaction summary pill: dark card (#1A1A20), padding 14px 20px, rounded-xl:
    - "Transaction confirmed in 2.1s" — 13px Inter Medium, white
    - "[View on Explorer →]" — 12px #FC690A
  - 40px gap
  - "Share Receipt" button — secondary button style, white border, white text
  - 12px gap
  - "Send Another" — ghost button, white 60%
  - 12px gap
  - "Back to Home" — ghost button, white 40%

---

## SECTION D — RECEIVE FLOW

### D1 — RECEIVE: MAIN SCREEN

**Layout:**
- Accessed from: Home quick actions → Receive
- Background: #FFFFFF (white for QR visibility — no patterns)
- Header: "← Receive" + asset selector (pill chips, same as Send)

- **QR Code** (centered, 40px below header):
  - Container: 220px × 220px, white background, 16px padding, shadow-md, radius-12px
  - QR code: 188px × 188px inside
  - Center of QR: BantuPay logo mark (24px) embedded in white 32px circle (standard QR with logo technique)
  - Asset indicator: below QR container, "Receiving [cNGN]" — 13px Inter Medium #6B7080
  
- **Address strip** (16px below QR):
  - Compact: "GBPTV...XXXQ" — 14px JetBrains Mono #0F0F0F, centered
  - Two icon buttons right of address: [Copy] [Share] — 36px each, #FC690A

- **Share link section** (16px below):
  - Grey separator line, full width
  - Label: "Or share your link" — 12px Inter Medium #6B7080, centered
  - Link: "bantupay.link/chidi" — 14px JetBrains Mono #0F0F0F, centered
  - Action row: [Copy link] [WhatsApp icon] [More options...] — three small pill buttons, side by side

- **Request amount** (12px below):
  - "Request specific amount →" — tap to expand or navigate to D2
  - Arrow pill, right-aligned, 14px Inter Medium #FC690A

---

### D2 — RECEIVE: REQUEST SPECIFIC AMOUNT

**Layout:**
- Header: "← Payment Request"
- Content: same numpad layout as C1 (Send Amount)
- Amount input, asset selector
- Memo field: "For (optional)" — "e.g. Rent, Birthday, Lunch"
- Expiry toggle: "Set expiry" (optional) — 24h / 48h / 7 days / Never
- Bottom: "Generate Payment Link" — primary button
- On generate: slide-up bottom sheet with:
  - QR code + link + share options
  - "Share on WhatsApp" (pre-composes: "Pay me ₦500 for Rent: bantupay.link/pay/...")

---

### D3 — RECEIVE: SPLIT PAYMENT SETUP

**Layout:**
- Header: "← Split Payment"
- Sub: "Split a bill with multiple people"
- Total amount input (numpad)
- "Split among [+] [−]" stepper (2–10 people)
- Per-person calculation: shown in real-time below stepper: "₦166.67 per person"
- Optional: Add participant names (tap to name each person)
- Bottom: "Create Split Links" — primary button
- Result: generates N individual payment links, shown as list with share/copy per person
- "Copy all links" — utility button

---

## SECTION E — ACTIVITY / HISTORY SCREEN

### E1 — ACTIVITY: MAIN LIST

**Layout:**
- Background: #F5F6FA
- Header: "Activity" — Plus Jakarta SemiBold 24px, 20px from safe area top
- Right: Filter icon (Funnel, 22px, #6B7080)

- **Filter tabs** (horizontally scrollable pills, 20px margin, 12px below header):
  - [All] [Sent] [Received] [Swapped] [On-ramp]
  - Selected: brand-wash bg, orange text, orange border
  - Unselected: white, grey text

- **Date grouping:**
  - "Today" — 11px Inter SemiBold #A0A8B8, uppercase, 20px left, 16px top
  - List of transactions below
  - "Yesterday", "April 14", etc.

- **Transaction List Item:**
  ```
  Height: 72px
  Background: #FFFFFF
  Border-radius: 12px
  Padding: 0 16px
  Shadow: shadow-card
  Margin-bottom: 8px
  
  Left: Direction icon container (40px circle):
    Sent: orange bg, ArrowUp icon white
    Received: green bg (#F0FDF4), ArrowDown icon #16A34A
    Swapped: blue bg, ArrowsLeftRight icon
    On-ramp: purple bg, ArrowLineDown icon
  
  Gap: 12px
  Center:
    Row 1: "Sent to Chidi Obi" OR "Received from mavol" — 15px Inter SemiBold #0F0F0F
    Row 2: "cNGN · 2 minutes ago" — 13px Inter Regular #6B7080
  
  Right:
    Row 1: Amount with sign: "−500 cNGN" (red/grey for sent) | "+100 cNGN" (green for received)
           15px Inter SemiBold, color coded
    Row 2: Fiat equiv: "₦500" — 12px #6B7080
  
  Status badge (right of center, inline):
    Confirmed: no badge (clean)
    Pending: "Pending" orange pill badge
    Failed: "Failed" red pill badge
  ```

- **Empty state** (when no transactions):
  - Illustration: simple line-art of receipt/transaction icon, 80px
  - "No transactions yet" — 17px Inter SemiBold #6B7080
  - "Send or receive cNGN to get started" — 14px #A0A8B8
  - "Receive cNGN" — orange CTA button, small

---

### E2 — TRANSACTION DETAIL

**Layout:**
- Accessed by tapping any transaction list item
- Full screen slide-up bottom sheet (or full screen on iOS)
- Header: "Transaction Detail" + × close button

- **Status section** (centered, top of detail):
  - Large status icon (64px circle): green check (confirmed) / orange spinner (pending) / red X (failed)
  - Status text: "Confirmed" / "Pending" / "Failed"
  - Amount: 32px Plus Jakarta Bold, colored (+green / −grey)
  - Fiat: 15px below in grey

- **Detail rows card** (white card, rounded, full width):
  - Each row: label left (13px #6B7080) + value right (13px Inter SemiBold #0F0F0F)
  - Divider between rows
  - Rows: Type | To/From | Asset | Fee | Date & Time | Memo (if any)
  - Transaction hash: "ABCD...1234" — JetBrains Mono + [Copy] icon

- **Action buttons** (below card):
  - "View on Explorer" — secondary button (opens bantublockchain.org explorer in-app browser)
  - "Share Receipt" — ghost button

---

## SECTION F — QR SCAN SCREEN (Center FAB)

### F1 — SCAN: CAMERA VIEW

**Layout:**
- Full screen camera viewfinder (no status bar override — keep status bar visible)
- Background: camera feed

- **Header** (over camera, 20px margin):
  - Left: ← Close (white, 22px, tappable)
  - Center: "Scan" — 17px Inter SemiBold, white
  - Right: Torch toggle icon (FlashLight, 22px, white)

- **Viewfinder frame** (centered in camera):
  - 260px × 260px
  - 4 corner brackets (orange, 24px long, 3px thick, radius-sm at corners)
  - Center: no solid overlay, just the corner brackets — clean, minimal
  - Optional subtle pulsing animation on brackets

- **Instruction text** (below viewfinder, white shadow for readability):
  - "Point at any BantuPay or Stellar QR code"
  - 14px Inter Regular, white, centered, subtle text-shadow

- **Bottom area** (above safe area):
  - "Or paste address / link" — full-width input field, semi-transparent white bg, radius-full
  - Gallery icon button (right of input) — to pick QR from photo library

---

### F2 — SCAN: PAYMENT QR DETECTED

**Auto-detected immediately on QR recognition — slide-up confirmation sheet**

**Bottom Sheet:**
- Drag handle
- Content:
  - Recipient avatar + name (large, centered): 56px avatar, 20px Plus Jakarta SemiBold below
  - If address only: "Unknown address" + short mono address
  - "Sending to [Name / address]" — 14px #6B7080, centered
  - 24px gap
  - Amount section (if encoded in QR):
    - "Requested amount:" label
    - "₦500 cNGN" — 32px Plus Jakarta Bold
    - (If no amount: show amount input numpad within sheet)
  - 24px gap
  - "Continue to send →" — primary button, full width
  - "Cancel" — ghost, grey, centered

---

### F3 — SCAN: EVENT CHECK-IN DETECTED

**Bottom Sheet:**
- Event info (centered):
  - Calendar icon in orange circle, 48px
  - Event name: "DevFest Lagos 2026" — 20px Plus Jakarta SemiBold
  - Date/location: "April 16 · Landmark Event Centre" — 14px #6B7080
  - Reward: "You'll receive 10 XBN upon confirmation" — info callout (blue)
- "Confirm Attendance" — primary button, full width
- "Cancel" — ghost

---

### F4 — SCAN: WEB3 AUTH DETECTED

**Bottom Sheet:**
- dApp info:
  - App icon (from URL metadata) in rounded-lg, 48px
  - "BantuDEX wants to connect" — 20px Plus Jakarta SemiBold, centered
  - "bantudex.io" — 13px #6B7080, centered
  - Warning: "Always verify the site before connecting" — warning-box callout
- Permissions section:
  - Small card, white, listing:
    - [Check icon] View your wallet address
    - [Check icon] Sign transactions you approve
    - [X icon] Cannot transfer funds without permission
- "Connect Wallet" — primary button
- "Reject" — danger ghost button

---

### F5 — SCAN: AIRDROP CLAIM DETECTED

**Bottom Sheet:**
- Gift/Parachute icon, 48px, orange circle
- Campaign: "BantuChain Genesis Airdrop" — 20px Plus Jakarta SemiBold
- Reward: "500 XBN" — 36px Plus Jakarta Bold, orange
- Timer: "Expires in 4h 32m" — countdown, 13px #D97706, warning-wash bg pill
- Eligible condition: "Available to all wallets created before April 2026" — 13px #6B7080
- "Claim 500 XBN" — primary button
- "Cancel" — ghost

---

## SECTION G — SWAP SCREEN

### G1 — SWAP: INPUT (Redesigned — Amount First)

**Layout:**
- Background: #F5F6FA
- Header: "Swap" — Plus Jakarta SemiBold 24px + [Settings icon] — opens slippage settings

- **Main swap card** (white, radius-xl, shadow-md, 20px margin):
  - Padding: 20px

  **"You pay" section:**
  - Label: "You pay" — 12px Inter SemiBold #6B7080
  - Amount row: Large input + asset selector button
    - Input: 40px Plus Jakarta Bold, #0F0F0F, flex-1 (takes available width)
    - Placeholder: "0"
    - Asset selector: pill button right-aligned — [token icon 24px] [ticker] [caret-down]
      - Background: #F0F1F5, radius-full, padding 8px 12px
  - Fiat equiv: "≈ ₦0" — 13px Inter Regular #6B7080, 4px below input
  - Available balance: "Available: 100 USDC" — 12px #A0A8B8 right-aligned + "MAX" link in orange

  **Flip button** (between pay and receive sections):
  - 40px circle, white, shadow-sm, centered
  - Icon: ArrowsDownUp, 20px, #FC690A
  - Tapping animates a 180° rotation and swaps the two asset selections

  **"You receive" section:**
  - Label: "You receive" — same style
  - Amount: calculated output (read-only) — 40px Plus Jakarta Bold, #0F0F0F
    - Shows "~149,850" type numbers with ~ prefix to indicate estimate
  - Asset selector (same pill button style)
  - Rate below: "1 USDC = 1,498.5 cNGN" — 12px #6B7080

  **Fee/info strip** (below receive, separated by thin divider):
  - "Network fee: < ₦0.01" — 12px #6B7080, left
  - "Slippage: 0.5%" — 12px, right, tappable (opens slippage setting)
  - Live rate refresh indicator: subtle pulsing dot + "Rate updates in 8s"

- **"Swap Now" button** (below card, full width, primary, 20px margin)
  - Disabled when amount = 0 or insufficient balance
  - When loading/processing: shows "Swapping..." with spinner

---

### G2 — SWAP: CONFIRMATION

**Bottom sheet auto-appears after tapping Swap Now**

- Title: "Confirm Swap"
- Summary card:
  - You pay: "[amount] [asset]" with logo
  - You receive: "~[amount] [asset]" with logo
  - Exchange rate
  - Fee
  - Price impact (shown only if > 0.5%, colored yellow if > 1%)
  - "Rate valid for 30 seconds" — countdown timer bar (progress bar depleting)
- "Confirm with Face ID" — primary + biometric icon

---

### G3 — SWAP: SUCCESS

- Same as Send Success but copy: "Swap complete!"
- Shows actual received vs estimated

---

## SECTION H — ON-RAMP (BUY cNGN)

### H1 — BUY: ENTRY / METHOD SELECTION

**Layout:**
- Header: "← Buy cNGN"
- Amount input + numpad (same pattern as Send C1)
- Currency: "NGN" with toggle to show in USD for diaspora
- Below numpad, before CTA: payment method selector

**Payment method cards:**
```
Each card: white, radius-lg, shadow-card, 16px padding
Left: icon (bank icon / card icon / phone icon / swap icon)
Center: Method name + description (13px #6B7080)
Right: "0%" or "1.5%" fee badge (green or orange pill) + CaretRight

Methods:
1. [Bank icon] Bank Transfer — "Instant virtual account. No fees." — "0% fee" green pill
2. [Card icon] Debit/Credit Card — "Visa, Mastercard" — "1.5% fee" orange pill
3. [Phone icon] USSD (*xxx#) — "For any phone" — "0% fee" green pill
4. [Arrows icon] Swap USDC — "Crypto-to-cNGN" — "DEX rate" grey pill
```

- "Continue" button: enabled when amount > 0 and method selected

---

### H2 — BUY: BANK TRANSFER (Virtual Account)

**Layout:**
- Header: "← Fund via Bank Transfer"
- Status: "Waiting for payment..." — orange animated pulsing dot + label
- Card (white, shadow-md, centered):
  - "Transfer exactly:" — 13px #6B7080
  - "₦1,000.00" — 28px Plus Jakarta Bold, orange (exact amount matters)
  - Divider
  - "To this account:"
  - Bank name: "GTBank" — 17px Inter SemiBold
  - Account number: "0123456789" — 24px JetBrains Mono Bold, #0F0F0F
  - [Copy account number] — full-width secondary button
  - Account name: "BANTUPAY DIGITAL / [User Name]" — 13px #6B7080
  - Divider
  - Timer: "This account expires in 28:42" — countdown, #D97706
- Info callout: "Transfer from your bank app, USSD, or any bank. cNGN will appear within 60 seconds."
- Bottom: "I've made the transfer" — ghost button (starts polling for confirmation)

---

### H3 — BUY: CONFIRMED

- Same celebration as Send Success
- "₦1,000 cNGN added to your wallet!"

---

## SECTION I — ASSET DETAIL SCREEN

### I1 — ASSET DETAIL: cNGN

**Layout:**
- Background: #F5F6FA
- Header: ← [cNGN logo 24px] "cNGN" + [...] more options right

- **Balance section** (centered, white card, shadow-sm):
  - Balance: "500 cNGN" — 36px Plus Jakarta Bold, centered
  - Fiat: "≈ ₦500.24" — 15px Inter Regular #6B7080, centered
  - Peg indicator: "1 cNGN = 1 NGN (pegged)" — info callout strip, very small

- **Quick actions** (same Send/Receive/Swap/Buy strip as home)

- **Price chart** (for non-stablecoins like XBN):
  - 7-day sparkline, orange line, no axes
  - Time selector pills: 24H | 7D | 30D | All
  - For cNGN: flat line + "Stable" label — no volatility = less anxiety

- **About** (collapsible):
  - "cNGN is Nigeria's regulated digital naira, issued by WrappedCBDC Ltd..."
  - Issuer badge, auditor link

- **Transactions for this asset:**
  - Same list format as E1 but filtered to this asset

---

## SECTION J — WALLET / ASSETS SCREEN (Wallet Tab)

### J1 — WALLET: ASSET LIST

**Layout:**
- Background: #F5F6FA
- Header: "Wallet" — Plus Jakarta SemiBold 24px

- **Total value card** (small version of home balance card, same gradient, 80px height):
  - "Portfolio Value" label + "₦47,832" large
  - 4 quick action icons (same as home card)

- **Curated Assets section** (highlighted with orange-wash bg strip):
  - "FEATURED ASSETS" label
  - Horizontal scroll: asset cards (80px × 100px each):
    - Token icon (40px), ticker, price
    - "Add" button (if not in wallet), or balance (if added)
  - Featured: cNGN, XBN, USDC — permanently pinned

- **My Assets section:**
  - Standard list of added assets (same list item format)
  - [+ Add token] row at bottom (dashed border, orange +)

---

### J2 — ADD TOKEN / CURATED ASSETS

**Layout:**
- Header: "← Add Asset"
- Search input: "Search by name or ticker"
- **Curated section** (safe, team-approved):
  - Orange badge: "CURATED BY BANTUPAY" — 10px SemiBold, uppercase
  - List of curated assets:
    - Each: same list item format + "Add" button (orange pill) or "Added" (grey pill + checkmark)
    - Tapping "Add" instantly adds trustline with biometric confirmation
- **Custom** (advanced, collapsed by default):
  - "+ Add custom asset" — expandable row with issuer/ticker/domain fields

---

## SECTION K — MERCHANT MODE

### K1 — MERCHANT: HOME DASHBOARD

**Layout:**
- Background: #F5F6FA
- Header: "[Storefront icon] [Store Name]" left + [≡ Menu] right

- **Today's Revenue card** (white, radius-xl, shadow-md, full width):
  - Padding: 20px
  - "TODAY'S REVENUE" — 11px SemiBold #A0A8B8, uppercase
  - Amount: "₦47,832" — 36px Plus Jakarta Bold, #0F0F0F
  - Change: "↑ 12% vs yesterday" — 13px #16A34A, right-aligned
  - Divider
  - Quick stats row: [22 payments] [₦2,174 avg] [8 unique customers] — 3 micro-stats

- **Action buttons** (row of 3, full content width, 12px gaps):
  - [Show my QR] — orange, pill, large icon
  - [Create Invoice] — secondary
  - [Cash Out] — secondary

- **Live payment feed** (real-time):
  - "RECENT PAYMENTS" — section label + green pulsing dot
  - Items appear from top with slide-down animation when new payment arrives
  - Each: [Avatar/initials] "Customer" [Amount in orange] [Time] [Confirmed checkmark]

- **Weekly chart** (white card):
  - 7-day bar chart, orange bars, minimal design
  - "This week" label
  - No axes labels — just the relative heights

---

### K2 — MERCHANT: QR DISPLAY MODE

**Layout (Optimized for counter display):**
- Full-screen, no navigation bars
- Background: white

- Header strip: "Scan to pay [Store Name]" — 20px Plus Jakarta SemiBold, centered, 20px top
- Below: "Powered by BantuPay" — 12px #6B7080, centered

- **QR code** (dominant, centered):
  - 280px × 280px
  - BantuPay logo center
  - No decorative borders — clean for scanning

- Below QR: "@[merchantusername]" — 20px JetBrains Mono Bold, centered, #0F0F0F

- Amount mode (when amount pre-entered):
  - Below username: "₦2,500.00" — 32px Plus Jakarta Bold, orange
  - "Exact amount required" — 12px #6B7080

- **Live payment toast** (overlaid at top when payment received):
  - Drops down from top
  - "₦2,500 received from Customer!" — white text on dark bg, confetti burst
  - Auto-dismisses after 3s

- Footer: two small icon buttons [Brightness] [Refresh QR] — very subtle, bottom corners

---

### K3 — MERCHANT: ANALYTICS

**Layout:**
- Header: "← Analytics"
- Time selector: [Today] [7 Days] [30 Days] [Custom] — tab pills

- Revenue chart: line chart (orange, filled area under curve, no gridlines)
- KPI cards row (3 cards):
  - Total received
  - No. of transactions
  - Avg transaction value

- Payment method breakdown (donut or horizontal bar — orange is cNGN, grey is XBN)
- Peak hours: small heat-map or bar chart showing payment volume by hour
- Export row: "Export CSV" + "Export PDF" — ghost buttons

---

## SECTION L — MULTI-SIG / SAFE

### L1 — SAFE: LIST / ENTRY POINT

**Accessed via:** Profile → "My Safes" (Phase 3 feature — show "Coming soon" badge in Phase 1)

**Layout:**
- Header: "My Safes" + [+ Create] button (orange, top-right)
- Empty state: illustration + "Create a shared wallet with any BantuPay user"
- Safe list item (when exists):
  - Icon: combination lock icon, orange
  - Name: "Chidi & Emeka Business"
  - Config: "2-of-2" badge
  - Balance: "₦25,000 cNGN"
  - Pending: orange badge "1 pending approval"

---

### L2 — SAFE: CREATE

**Layout (multi-step):**

**Step 1:** Name your Safe + Configure M-of-N
- Input: "Safe name" (e.g. "Business Account")
- Stepper: "Required signatures: [1] of [2]" — two steppers
- Visual: "Any [M] of [N] signers must approve transactions"

**Step 2:** Invite Signers
- "Add signers" — search same as Send recipient
- Signers shown as avatar chips with × remove
- "Send invites" — primary button

**Step 3:** Pending Setup (waiting for accepts)
- List of pending signers with status: "Pending" / "Accepted"
- "Share invite link" for those not on BantuPay

---

### L3 — SAFE: APPROVAL REQUEST

**Push notification + screen:**
- Full-screen bottom sheet
- Title: "Approval Needed"
- Request: "Chidi wants to send ₦50,000 to [Recipient]"
- Transaction details card (same as C3 review card)
- Bottom: [Approve — primary] [Reject — danger ghost]
- Biometric to approve

---

## SECTION M — PROFILE & SETTINGS

### M1 — PROFILE: MAIN

**Layout:**
- Background: #F5F6FA
- Header: "Profile" — Plus Jakarta SemiBold 24px

- **User card** (white, radius-xl, shadow-sm):
  - Large avatar: 64px circle, gradient, centered
  - Name: 20px Plus Jakarta SemiBold, centered
  - Username: "@chidi" — 14px #6B7080, centered
  - BantuPay address: short mono address — 12px JetBrains Mono #A0A8B8, centered + [Copy]
  - Badges: [KYC Tier 1] [Personal Mode] — small pills
  - [Edit Profile] — ghost button, small

- **Settings groups:**
  Each group is a white card with rounded corners, rows separated by hairline dividers:

  **Wallet group:**
  - [Referral] → (orange badge: "Earn cNGN")
  - [Curated Assets] →
  - [Import Wallet] →
  - [Backup Wallet] → (badge: "Needed" in orange if not backed up)
  - [Connected Apps] →
  - [Multi-sig / Safes] → (badge: "Coming soon")

  **Preferences group:**
  - [Language] → English
  - [Currency display] → NGN
  - [Theme] → Light | Dark | System
  - [Notifications] →

  **Security group:**
  - [Change PIN] →
  - [Biometrics] — toggle switch (orange when on)
  - [Hide balance by default] — toggle
  - [Session timeout] → "5 minutes"
  - [Freeze wallet] → (red text)

  **More group:**
  - [Help & Support] →
  - [Terms of Use] →
  - [Privacy Policy] →
  - [About BantuPay] → v3.0.0

  **Logout row:** Separate from cards, centered, "Logout" — 16px Inter SemiBold, #DC2626, top border

---

### M2 — SECURITY: BACKUP WALLET

**Layout:**
- Header: "← Backup Wallet"
- Progress: visual security score bar (0–100%, colored red→orange→green)

**Option cards:**
```
Card 1 — Cloud Backup (Recommended)
  Badge: "RECOMMENDED" — small green pill
  Icon: Cloud with lock
  Title: "Back up to iCloud" (iOS) / "Back up to Google Drive" (Android)
  Sub: "Your backup is encrypted with your PIN. We cannot access it."
  CTA: "Back up now →" — orange button

Card 2 — Recovery Phrase
  Icon: Document with words
  Title: "Save recovery phrase"
  Sub: "Write down 12 words. Keep offline. Never share."
  CTA: "View recovery phrase →" — secondary

Card 3 — Trusted Contacts (Phase 2)
  Icon: Users
  Title: "Social recovery" 
  Badge: "Coming soon" — grey
```

---

### M3 — RECOVERY PHRASE REVEAL

**Layout:**
- Dark background (#0F0F12)
- Warning: "Screenshots are not safe. Write these words down." — warning-box in dark variant
- PIN prompt before showing
- Phrase: 12 words in a 3×4 grid
  - Each word: numbered (small, orange), word in JetBrains Mono 15px, in a white 10% opacity rounded pill
- Bottom: "I've written these down" — primary button (green, not orange — confirms safety)
- "Copy to clipboard" — explicitly discouraged: grayed out with warning tooltip

---

## SECTION N — LANDING PAGE (bantupay.org)

### N1 — LANDING: HERO SECTION (Mobile viewport first)

**Layout (mobile, 390px wide):**

**Sticky header:**
- Height: 60px
- Background: white, shadow-sm on scroll
- Left: BantuPay logo mark (28px) + "BantuPay" (Inter SemiBold 17px, #0F0F0F)
- Right: "Download" — pill button, 36px height, orange

**Hero section:**
- Background: brand-gradient (full width, 520px height mobile)
- Top of hero: decorative rings (same as app splash) — low opacity, top-right
- Content (20px margins):
  - Badge: "Powered by cNGN" — small white pill, 12px, 40px from top
  - Headline: "Pay anyone in Nigeria, instantly." — Plus Jakarta Bold, 36px, white, 48px from top, tight line-height
  - Sub: "Send and receive cNGN in seconds. Free. No bank required." — Inter Regular 15px, white 80%, 12px below
  - Download buttons (column on mobile):
    - "App Store" — white pill button, [Apple icon] + "Download on the App Store" — 13px
    - "Google Play" — white pill button, same
    - "Use Web App →" — ghost link, white 60%, 13px
  - Phone mockup: positioned at right side of hero, bottom-anchored, 240px wide, showing Home screen

**Trust bar:**
- White bg, 60px height
- 4 items horizontally: "Bantu Blockchain" · "cNGN Powered" · "Self-Custody" · "500K+ Users"
- Separator: · dot in #A0A8B8
- 12px Inter Medium #6B7080, centered

**How it works section:**
- White bg, 32px vertical padding
- "Simple as 1, 2, 3" — section heading, centered
- 3 step cards (stacked on mobile):
  - Step number: 48px circle, orange gradient
  - Icon inside: white, 24px
  - Title + description
  - Steps: Download & sign up in 2 min | Fund with cNGN | Pay, send, save everywhere

**For individuals section:**
- Light orange wash bg (#FFF3EC)
- Feature grid (2×2 on mobile):
  - Instant payments | Pay with QR | Split bills | Safe savings

**For merchants section:**
- White bg
- Feature list with phone mockup of merchant home screen

**Download CTA footer:**
- Orange gradient full-width section
- "Ready to get started?"
- App store badges (white)
- Telegram mini app link

---

## SECTION O — TELEGRAM MINI APP VARIANT

### O1 — TELEGRAM: HOME SCREEN

**Layout constraints for Telegram WebApp:**
- Max width: 390px (respects Telegram native chrome)
- Top: Telegram's native header bar (don't overlay)
- Bottom: 70px reserved for Telegram navigation
- Available height: ~600px

**Simplified home screen:**
- Compact balance card (120px height):
  - Brand-gradient, rounded-xl
  - Balance: 28px Plus Jakarta Bold, white
  - "Fund" + "Send" + "Receive" — 3 icon buttons in card bottom strip

- Assets list (compact, list items 60px height)

- Bottom action row (fixed, above Telegram nav):
  - [QR Scan] [Send] [Receive] [Swap]
  - 4 equal icon+label buttons, orange icons, small labels

**Note for Stitch:** Telegram variant uses same design tokens but with a more compact layout. No bottom navigation bar (Telegram provides native nav). Reduce all vertical spacing by 20%.

---

## SECTION P — MULTI-DEVICE ACCESS & WALLET RECOVERY

> **Context (PRD Section 22):** Multi-device is explicitly supported. The Bantu Blockchain is the single source of truth — no server-side wallet state to sync. Cloud backup is opt-OUT (default ON). The seed phrase is never shown during onboarding. "Forgot PIN" flows must never dead-end.

---

### P1 — ADD NEW DEVICE: ENTRY SCREEN

**Trigger:** User opens app on a new phone where no wallet exists, or taps Profile → "Add this device" on an existing device.

**Layout:**
- Dark background (#0F0F12) — security screens always go dark
- Top: back chevron (white)
- Illustration: two phones with a subtle bridge/connection graphic — orange accent lines, 160px height
- Headline: "Set up this device" — Plus Jakarta Bold 24px, white
- Sub: "Your wallet lives on the blockchain. Add it to this device in seconds." — Inter Regular 15px, white 70%, centered, 16px below
- Two option cards (16px gap between):

```
Card 1 — Cloud Restore (Primary — shown first)
  Badge: "FASTEST" — small green pill, 11px
  Icon: Cloud with down-arrow, 28px, orange
  Title: "Restore from cloud backup" — Inter SemiBold 15px, white
  Sub: "Takes ~60 seconds. Requires your Google or iCloud account." — 13px, white 60%
  Right: orange chevron
  Border: 1px #FC690A (highlighted as recommended)
  Background: rgba(252,105,10,0.08)

Card 2 — Recovery Phrase
  Icon: Document/words icon, 28px, white 70%
  Title: "Enter recovery phrase" — Inter SemiBold 15px, white
  Sub: "Use your 12-word phrase. Works without internet." — 13px, white 60%
  Right: grey chevron
  Background: #1A1A20
  Border: 1px #2A2A35
```

- Bottom link: "What is a recovery phrase?" — Inter Regular 13px, orange underline

**States:** Default | Loading (after cloud tap, spinner) | Error (cloud auth failed)

---

### P2 — ADD DEVICE: CLOUD RESTORE FLOW

**Step 1 — Choose Account**

**Layout:**
- Dark background
- Header: "← Restore from cloud"
- Progress pill: Step 1 of 3
- Icon: Google/Apple logo (determined by platform), 48px, centered
- Headline: "Sign in to find your backup" — Plus Jakarta SemiBold 20px, white
- Sub: "We'll look for a BantuPay backup in your cloud storage." — 13px, white 60%
- Primary button (full-width): "Continue with Google" or "Continue with iCloud" — white background, platform icon left, Inter SemiBold 15px dark text
- Footer note: "Your keys are encrypted with your PIN. We never see them." — 11px, white 40%, centered

**Step 2 — Backup Found**

**Layout:**
- Success icon: green checkmark in circle, 56px
- "Backup found" — Plus Jakarta SemiBold 20px, white
- Backup metadata card:
  ```
  Last backed up: 3 days ago
  Device: iPhone 14 Pro
  Wallet: ..... ...3f9a
  ```
  White 10% opacity card, rounded-xl, mono font for address fragment
- "Enter your PIN to restore" — Inter Medium 15px, white 70%
- PIN pad: 6-dot display + numpad (same as A7, dark theme)
  - Dots: white circles, filled white on entry
  - Delete: white backspace icon
- Bottom: "Not your backup?" — link, orange

**Step 3 — Restoration Complete**

**Layout:** Same pattern as A9 (Wallet Created) but with different copy:
- Confetti burst (orange + white)
- Headline: "Welcome back!" — Plus Jakarta Bold 30px, white
- Sub: "[Name]'s wallet is ready on this device." — 17px, white 80%
- Balance preview card (orange gradient): shows current balance
- Primary CTA: "Go to my wallet" — white button, orange text
- Security note (non-blocking banner, bottom): "Tip: This device is now listed in Security > Active Devices"

**States:** Step 1 Default | Step 1 Loading | Step 2 Backup Found | Step 2 PIN Error | Step 2 No Backup Found | Step 3 Success

---

### P3 — ADD DEVICE: NO BACKUP FOUND STATE

**Trigger:** User chose cloud restore but no backup exists in their cloud account.

**Layout:**
- Warning illustration: cloud with "?" — orange/amber tones, 120px
- Headline: "No backup found" — Plus Jakarta SemiBold 20px, white
- Sub: "We couldn't find a BantuPay backup in this Google account. This might mean backup was turned off on your old device." — 13px, white 60%, centered
- Two CTAs:
  - Primary: "Try recovery phrase instead" — orange button
  - Secondary: "Try a different account" — ghost button, white border
- Bottom: "I lost access to my old wallet" — orange link → P6 (funds lost / support)

---

### P4 — ADD DEVICE: RECOVERY PHRASE ENTRY

**Layout:**
- Dark background
- Header: "← Recovery phrase"
- Headline: "Enter your 12 words" — Plus Jakarta SemiBold 20px, white
- Sub: "Type your words in order. Separated by spaces or enter one per field." — 13px, white 60%
- Input mode toggle: `[Grid — 12 boxes]` `[Paste all at once]` — pill toggle, top-right

**Grid mode (default):**
- 4x3 grid of word input boxes
  - Each box: 80px wide, 44px tall, rounded-xl
  - Number label top-left: orange, 10px, SemiBold
  - Input text: JetBrains Mono 13px, white
  - Background: #1A1A20, border #2A2A35
  - Focused border: #FC690A
  - Valid word border: #16A34A (green, after BIP-39 match)
  - Invalid word: #DC2626 with shake micro-animation
- Autocomplete suggestion bar above keyboard: shows top-3 BIP-39 matches as chips — orange selected

**Paste mode:**
- Single large textarea (180px height)
- Placeholder: "Paste all 12 words separated by spaces"
- After paste: auto-splits into grid, validates each word, shows green/red per word

**Footer:**
- Progress: "0 / 12 words entered" — updates live
- Primary button: "Restore wallet" — disabled until all 12 valid — turns orange when ready
- Error state (wrong phrase): warning banner — error-wash bg, red text: "These words don't match a valid wallet. Double-check spelling."

**States:** Default (empty) | In Progress (partial) | All Valid (button enabled) | Wrong Phrase Error | Network Error

---

### P5 — FORGOT PIN: RECOVERY OPTIONS

**Trigger:** User taps "Forgot PIN?" on the PIN entry screen after 3 failed attempts.

**Layout:**
- Bottom sheet (slides up over blurred PIN screen)
- Sheet: white bg, rounded-top-24px
- Drag handle: 32x4px, #E8EAF0, centered top
- Headline: "Can't remember your PIN?" — Plus Jakarta SemiBold 20px, #0F0F0F
- Sub: "Choose how to get back in:" — Inter Regular 15px, #6B7080

**Option list (tap to select):**
```
Row 1 — Restore from cloud
  Icon: Cloud, 24px, orange
  Label: "Sign in to Google / iCloud and restore your backup"
  Speed badge: "~60 sec" — green pill
  Right chevron

Row 2 — Use recovery phrase
  Icon: Document, 24px, grey
  Label: "Enter your 12 recovery words"
  Right chevron

Row 3 — Biometric unlock
  Icon: Face ID / fingerprint, 24px, grey
  Label: "Use Face ID or fingerprint instead" (shown only if biometrics enrolled)
  Right chevron
```

- Divider
- "I don't have any of these" — red link at bottom → P6

**States:** Default | Cloud selected (nav to P2) | Phrase selected (nav to P4) | Biometric success (unlocks) | Biometric fail

---

### P6 — WALLET UNRECOVERABLE: SUPPORT SCREEN

**Trigger:** User indicates they have no cloud backup, no seed phrase, no biometrics.

**Layout:**
- Full screen, white bg
- Illustration: lock with broken key — amber tone, 120px, centered
- Headline: "We can't recover this wallet" — Plus Jakarta SemiBold 20px, #0F0F0F
- Body (Inter Regular 15px, #6B7080, 16px margins):
  > Because BantuPay is a self-custody wallet, only you hold the keys. Without a backup or recovery phrase, the funds in this wallet cannot be accessed by anyone — including BantuPay.
- Warning callout (error-wash bg, left red border 3px):
  > "Your funds are still on the blockchain. They are not permanently lost if you ever find your recovery phrase."
- Two CTAs:
  - Primary: "Start a new wallet" — orange button
  - Secondary: "Contact support" — ghost button
- Collapse accordion: "Why can't BantuPay just reset my account?" — expands to explain self-custody in plain language

---

### P7 — ACTIVE DEVICES LIST (Security Settings)

**Navigation:** Profile → Security → Active Devices

**Layout:**
- Header: "← Active Devices"
- Sub-header: "These devices have access to your wallet" — Inter Regular 13px, #6B7080
- Device list (card per device, 16px gap):

```
Device card:
  Left: Device icon (phone outline, 28px, grey)
    — Current device: orange phone icon
  Title: "iPhone 16 Pro" — Inter SemiBold 15px
  Sub line 1: "Last active: Just now" (current) / "2 days ago" (other)
  Sub line 2: "Added: 12 Apr 2026 · Lagos, Nigeria" — 11px, #A0A8B8
  Right:
    — Current device: "This device" green pill badge
    — Other devices: "Remove" red text button
```

- Add device CTA (bottom, dashed border card):
  - Icon: + circle, orange
  - "Add another device"
  - Tap → P1

- "Freeze all devices" — destructive action, red text link at very bottom
  - Tap → confirmation bottom sheet: "This will block all transactions until you unfreeze. Continue?" — red confirm button

**States:** Single device | Multiple devices | Freeze active (banner: "Wallet frozen. Tap to unfreeze.") | Remove device confirmation sheet

---

### P8 — NEW DEVICE LOGIN ALERT (Push + In-App)

**Trigger:** A new device is added to the user's wallet. Sent as push notification AND shown as in-app alert on existing devices.

**Push notification (system level):**
```
App icon: BantuPay
Title: "New device added to your wallet"
Body: "Pixel 7 Pro in Lagos, Nigeria — Apr 16, 2026 at 3:42 PM"
Actions: [Review] [It wasn't me]
```

**In-app security alert (top of home screen — dismissible banner):**
- Background: warning-wash (#FFFBEB), left border 3px #D97706
- Icon: shield with alert, 20px, amber
- Text: "New device added 2 min ago — Pixel 7 Pro" — Inter SemiBold 13px
- Sub: "Tap to review active devices" — 11px, #6B7080
- Right: "x" dismiss + "Review" orange text link

**"It wasn't me" flow:**
- Bottom sheet: "Freeze your wallet?"
  - Body: "Freezing stops all outbound transactions until you unfreeze from Settings."
  - Primary: "Freeze now" — red button
  - Secondary: "Review first" — ghost
- Post-freeze full-screen confirmation:
  - Icon: shield locked, 56px, red
  - "Wallet frozen" — Plus Jakarta Bold 24px
  - "No transactions can be sent. Remove the device in Settings to unfreeze." — 15px
  - CTA: "Go to Active Devices" — orange button

---

### P9 — CLOUD BACKUP DISABLED WARNING

**Trigger:** User tries to turn off cloud backup in Security settings.

**Layout:** Bottom sheet (destructive action confirmation)
- Drag handle
- Warning icon: cloud with X, 40px, red
- Headline: "Turn off cloud backup?" — Plus Jakarta SemiBold 20px
- Body: "If you lose this device without a recovery phrase, your wallet will be permanently inaccessible." — 13px, #6B7080
- Checklist (both must be ticked before confirm button activates):
  ```
  [ ] I have saved my 12-word recovery phrase offline
  [ ] I understand BantuPay cannot recover my wallet without it
  ```
  Checkboxes: 20px, rounded-sm. Active fill: #DC2626 (red — signals danger, not success)
- Primary button: "Turn off backup" — disabled until both ticked — activates as red button
- Secondary: "Keep backup on (recommended)" — orange ghost button

---

## PART 3 — DESIGN EXECUTION NOTES FOR STITCH

### 3.1 File Organization in Figma Export

Create the following Figma pages:
1. `🎨 Design System` — All tokens, components, color styles, text styles
2. `🚀 Onboarding` — Screens A1–A10
3. `🏠 Home & Dashboard` — Screens B1–B4
4. `💸 Send Flow` — Screens C1–C4
5. `📥 Receive Flow` — Screens D1–D3
6. `📊 Activity` — Screens E1–E2
7. `📷 QR Scan` — Screens F1–F5
8. `🔄 Swap` — Screens G1–G3
9. `💳 Buy / On-Ramp` — Screens H1–H3
10. `💰 Asset Detail` — Screen I1
11. `👛 Wallet Tab` — Screens J1–J2
12. `🏪 Merchant Mode` — Screens K1–K3
13. `🔐 Multi-Sig` — Screens L1–L3
14. `⚙️ Profile & Settings` — Screens M1–M3
15. `🌐 Landing Page` — Screen N1 (desktop + mobile)
16. `✈️ Telegram Mini App` — Screen O1
17. `🔐 Multi-Device & Recovery` — Screens P1–P9
18. `📱 Component States` — All component variants (hover, pressed, disabled, loading, error)

### 3.2 Naming Convention

- Frames: `[Section][Number] — [Screen Name] / [State]`
  - Example: `C3 — Send: Review & Confirm / Default`
  - Example: `A7 — PIN Setup / Error (Mismatch)`
- Components: `Component/[Name]/[Variant]`
  - Example: `Component/Button/Primary/Default`
  - Example: `Component/Button/Primary/Disabled`
- Colors: Use exact token names (brand-primary, bg-base, etc.)

### 3.3 States Required for Each Screen

For every interactive screen, produce:
- **Default** — resting state
- **Loading** — skeleton or spinner shown
- **Error** — validation or network error shown
- **Empty** — no data state
- **Success** — post-action state (where applicable)
- **Dark mode** — all screens must have a dark variant

### 3.4 Prototype Connections

Set up prototype connections in the Figma export:
- A1 → A2 (auto, 1.5s)
- A2 → A3 (tap Get Started)
- A3 → A4 (tap Continue)
- A4 → A5 (tap Send Code)
- A5 → A6 (auto on 6th digit)
- A6 → A7 (tap Continue)
- A7 → A7b (6 digits entered)
- A7b → A8 (PINs match)
- A8 → A9 (biometric success)
- A9 → B1 (tap Explore First)
- B1 → C1 (tap Send in quick actions)
- C1 → C2 (tap Continue)
- C2 → C3 (tap recipient)
- C3 → C4 (biometric confirm)
- B1 → D1 (tap Receive)
- B1 → G1 (tap Swap)
- B1 → H1 (tap Buy)
- B1 → F1 (tap center FAB)
- All → B1 (tap Home nav)
- PIN screen "Forgot PIN" → P5 (recovery options sheet)
- P5 Cloud option → P2 Step 1
- P5 Phrase option → P4
- P2 Step 1 → P2 Step 2 (cloud auth success) | P3 (no backup found)
- P2 Step 2 → P2 Step 3 (PIN correct) | P2 Step 2 Error (PIN wrong)
- P2 Step 3 → B1 (wallet ready)
- P4 all valid → P2 Step 3 (restored)
- P5 "None of these" → P6
- P6 "Start new wallet" → A3
- M1 Security → P7 (Active Devices)
- P7 "Add device" → P1
- P1 Cloud → P2 Step 1
- P1 Phrase → P4
- P8 "It wasn't me" → freeze confirmation → P7

### 3.5 Key Design Decisions to Maintain

1. **Orange gradient on balance card** — never use flat color for the balance card. The gradient (135°, #FC690A → #D4560A) is mandatory.
2. **No solid dividers between most list items** — use card-per-item with gaps instead (cleaner, more modern)
3. **Biometric confirmation replaces "Are you sure?" modals** — the Face ID/fingerprint prompt IS the confirmation
4. **Green for received, grey/orange for sent** — never red for sent (red = error only)
5. **All amounts show both crypto and fiat simultaneously** — always "500 cNGN" + "≈ ₦500"
6. **Success screens are dark** — the dramatic dark + confetti pattern is the BantuPay celebration pattern
7. **Security-related screens use dark backgrounds** — PIN setup, recovery phrase = dark (#0F0F12)
8. **Merchant QR display screen is landscape-optimized** — design both portrait and landscape variants
9. **The center FAB never disappears** — it's visible on all 5 main screens
10. **Typography: Plus Jakarta Sans for all headings** — never use Inter for display text

### 3.6 Accessibility Checklist

- All text on colored backgrounds: minimum 4.5:1 contrast ratio
- Touch targets: minimum 44×44px for all interactive elements
- Focus states: visible for all interactive elements (orange ring 2px, offset 2px)
- Color not sole indicator: direction of transactions also shown by icon shape + label
- Font size floor: 11px (nothing smaller in production screens)

### 3.7 Assets / Images Needed

Stitch should generate or placeholder the following:
- BantuPay logo mark (the X/butterfly icon in white on orange circle)
- Token icons: XBN (orange circle, X), cNGN (purple/dark, N), USDC (blue), BNR (orange, B)
- Celebration confetti particles (orange, light orange, white)
- Onboarding illustrations (A4 phone icon, A5 message icon, A6 smiley, A8 biometric graphic)
- Phone mockup for landing page (use flat design, not photorealistic device frames)
- App Store badge, Google Play badge, Telegram badge

---

## PART 4 — SCREEN COUNT SUMMARY

| Section | Screens | States per Screen | Total Artboards (approx) |
|---------|---------|-------------------|--------------------------|
| Onboarding | 10 | 3–5 | ~35 |
| Home & Dashboard | 4 | 4–5 | ~18 |
| Send Flow | 4 | 3–4 | ~15 |
| Receive Flow | 3 | 3 | ~9 |
| Activity | 2 | 3 | ~6 |
| QR Scan | 5 | 2–3 | ~13 |
| Swap | 3 | 3 | ~9 |
| Buy / On-Ramp | 3 | 3 | ~9 |
| Asset Detail | 1 | 3 | ~3 |
| Wallet Tab | 2 | 3 | ~6 |
| Merchant Mode | 3 | 3–4 | ~10 |
| Multi-Sig | 3 | 3 | ~9 |
| Profile & Settings | 3 | 3 | ~9 |
| Landing Page | 1 | 2 (mobile+desktop) | ~2 |
| Telegram Mini App | 1 | 3 | ~3 |
| Multi-Device & Recovery | 9 | 3–5 | ~32 |
| Design System | — | — | ~30 (components) |
| **TOTAL** | **~57 unique screens** | — | **~218 artboards** |

---

*Brief version 1.1 — BantuPay 3.0 Stitch Design Brief*  
*April 2026 | Exports to Figma*  
*Primary color: #FC690A — This cannot change.*  
*v1.1 additions: Section P — Multi-Device Access & Wallet Recovery (9 screens, ~32 artboards)*

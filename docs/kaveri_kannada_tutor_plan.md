# Kaveri — Kannada Literacy AI Tutor
## Full Plan & Structure (Based on Vaani Template)
**Date**: 2026-05-06

---

## 1. App Identity

| | Value |
|---|---|
| **App Name** | Kaveri (ಕಾವೇರಿ) |
| **Meaning** | Karnataka's sacred river — symbol of life, learning, and heritage |
| **Tagline** | "ಕಾವೇರಿ ಕಲಿ — Learn Kannada Letter by Letter" |
| **Avatar Name** | Akka (ಅಕ್ಕ) — "elder sister" in Kannada, warm + encouraging |
| **Color Scheme** | Red-gold (ಕನ್ನಡ flag colors: yellow/red) vs Vaani's purple/orange |
| **Monorepo Path** | `apps/kaveri-tutor/` |
| **Port** | 3002 (Vaani is 3001) |
| **PM2 Name** | `rd-kaveri-ai` |
| **URL** | `robodynamics.in/kaveri` |
| **Next.js basePath** | `/kaveri` |

---

## 2. Monorepo Placement

```
apps/
  vaani-tutor/        ← Hindi (existing)
  kaveri-tutor/       ← Kannada (new) ← copy of vaani-tutor
  neet-tutor/         ← (future)
```

### Scaffold command
```bash
# From monorepo root
cp -r apps/vaani-tutor apps/kaveri-tutor
cd apps/kaveri-tutor
# Then rename + swap data files (see Section 5)
```

---

## 3. Curriculum — 6-Level Structure

### Level 1 — ಸ್ವರ (Vowels) — 13 lessons
Kannada has 13 vowels. Direct map from Vaani L1.

| Lesson | Char | Word | English | Notes |
|---|---|---|---|---|
| L1-C01-L01 | ಅ | ಅಕ್ಕ | Elder Sister | Universal Kannada word |
| L1-C01-L02 | ಆ | ಆನೆ | Elephant | Classic anchor |
| L1-C01-L03 | ಇ | ಇರುವೆ | Ant | Child-friendly |
| L1-C01-L04 | ಈ | ಈಜು | Swimming | Action word |
| L1-C01-L05 | ಉ | ಉಪ್ಪು | Salt | Everyday object |
| L1-C01-L06 | ಊ | ಊರು | Village/Town | Common word |
| L1-C01-L07 | ಋ | ಋಷಿ | Sage | (same as Hindi ऋ) |
| L1-C01-L08 | ಎ | ಎಲೆ | Leaf | Simple + visual |
| L1-C01-L09 | ಏ | ಏಣಿ | Ladder | Visual object |
| L1-C01-L10 | ಐ | ಐದು | Five (number) | Concrete concept |
| L1-C01-L11 | ಒ | ಒಂಟೆ | Camel | Fun animal |
| L1-C01-L12 | ಓ | ಓಡು | Run | Action word |
| L1-C01-L13 | ಔ | ಔಷಧಿ | Medicine | Everyday concept |

### Level 2 — ಗುಣಿತ (Vowel Markers + ಕ/ಖ/ಗ/ಘ Consonants) — 36 lessons
Teach the 4 most common consonants (ಕ ಖ ಗ ಘ) each with all 12 vowel-marker forms.
Structure identical to Vaani L2 (matras).

**Chapter C01 — ಕ (Ka) with all gunita (12 lessons)**
ಕ ಕಾ ಕಿ ಕೀ ಕು ಕೂ ಕೆ ಕೇ ಕೈ ಕೊ ಕೋ ಕೌ + Review

**Chapter C02 — ಖ (Kha) with gunita (12 lessons)**
ಖ ಖಾ ಖಿ ಖೀ ಖು ಖೂ ಖೆ ಖೇ ಖೈ ಖೊ ಖೋ ಖೌ + Review

**Chapter C03 — ಗ & ಘ (Ga & Gha) with gunita (12 lessons)**
ಗ ಗಾ ಗಿ ಗೀ ಗು ಗೂ ಗೆ ಗೇ ಗೈ ಗೊ ಗೋ ಗೌ + ಘ subset + Review

### Level 3 — ಒತ್ತಕ್ಷರ (Ottaksharas / Conjuncts) — 38 lessons
Kannada conjunct consonants. Same structure as Vaani L3.

**Chapter C01 — Common Doubles (14 lessons)**
ಕ್ಕ (ಮಕ್ಕಳು/Children), ತ್ತ (ಹತ್ತು/Ten), ಪ್ಪ (ಅಪ್ಪ/Father),
ನ್ನ (ಅನ್ನ/Rice), ಲ್ಲ (ಇಲ್ಲ/No/Not), ಮ್ಮ (ಅಮ್ಮ/Mother),
ರ್ರ (ಮೊರ್ರೆ), ಗ್ಗ, ಡ್ಡ, ಣ್ಣ, ಬ್ಬ, ಮ್ಮ, ಯ್ಯ, Review

**Chapter C02 — Conjuncts with ರ-Reph (11 lessons)**
ತ್ರ (ತ್ರಿಕೋಣ/Triangle), ಪ್ರ (ಪ್ರೇಮ/Love), ಕ್ರ (ಕ್ರಮ/Order),
ಗ್ರ (ಗ್ರಾಮ/Village), ದ್ರ, ಬ್ರ, ಭ್ರ, ಶ್ರ (ಶ್ರೀ/Revered), ಸ್ರ, ವ್ರ, Review

**Chapter C03 — Special Conjuncts (13 lessons)**
ಕ್ಷ (ಕ್ಷಮೆ/Forgiveness), ಜ್ಞ (ಜ್ಞಾನ/Knowledge), ತ್ಸ, ಸ್ಥ,
ಸ್ತ, ಸ್ಕ, ಸ್ಪ, ನ್ನ → cross-word practice, ಕ್ತ, ಕ್ಷ, ಷ್ಟ, ಷ್ಠ, Review

### Level 4 — ಬರಹ ಮಾಲೆ (Full Barakhadi Matrix) — 36 lessons
All 33 consonants with complete 12-sound gunita rows.
Identical structure to Vaani L4. One lesson per consonant + review.

**Chapter C01** — ಕ ಖ ಗ ಘ ಚ ಛ ಟ ಠ ಡ ಢ ತ + Review (12)
**Chapter C02** — ಥ ದ ಧ ಪ ಫ ಬ ಭ ಮ ಯ ರ ಲ + Review (12)
**Chapter C03** — ವ ಶ ಷ ಸ ಹ ಳ + Aspirated Review + Liquids Review + Stops Review + Nasal Review + Mastery (12)

### Level 5 — ಸರಳ ವಾಕ್ಯ (Simple Sentences) — 30 lessons
Everyday Kannada sentences, conversational focus.

**Chapter C01 — Basic Greetings & Identity (15 lessons)**

| # | Sentence | English |
|---|---|---|
| 1 | ನಮಸ್ಕಾರ ಅಣ್ಣ। | Hello brother |
| 2 | ನೀವು ಹೇಗಿದ್ದೀರಿ? | How are you? |
| 3 | ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ। | I am fine |
| 4 | ಧನ್ಯವಾದ। | Thank you |
| 5 | ದಯವಿಟ್ಟು ಕೂರಿ। | Please sit |
| 6 | ನನ್ನ ಹೆಸರು ರಾಜ। | My name is Raj |
| 7 | ನಿಮ್ಮ ಹೆಸರೇನು? | What is your name? |
| 8 | ನನಗೆ ಹಸಿವಾಗಿದೆ। | I am hungry |
| 9 | ಇದು ಒಂದು ಪುಸ್ತಕ। | This is a book |
| 10 | ನನಗೆ ಮಾವಿನಕಾಯಿ ಇಷ್ಟ। | I like mango |
| 11 | ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ। | I go to school |
| 12 | ನೀವು ಸಹಾಯ ಮಾಡಬಹುದೇ? | Can you help? |
| 13 | ಇದು ನೀರು। | This is water |
| 14 | ನನಗೆ ಬಾಯಾರಿಕೆ। | I am thirsty |
| 15 | ನಾನು ಸಂತೋಷವಾಗಿದ್ದೇನೆ। | I am happy |

**Chapter C02 — Descriptive Sentences (15 lessons)**
ಮನೆಯಲ್ಲಿ ಒಂದು ಬೆಕ್ಕಿದೆ (There's a cat), ನನ್ನ ಸ್ನೇಹಿತ ಒಳ್ಳೆಯವ, ನಾಳೆ ರಜೆ, etc.

### Level 6 — ಕನ್ನಡ ವ್ಯಾಕರಣ (Grammar Essentials) — 42 lessons
Basic Kannada grammar following Vaani L6 pattern.

**Chapter C01** — Nouns (ನಾಮಪದ): Common, Proper, Gender
**Chapter C02** — Adjectives (ವಿಶೇಷಣ): ಒಳ್ಳೆ, ದೊಡ್ಡ, ಚಿಕ್ಕ
**Chapter C03** — Pronouns (ಸರ್ವನಾಮ): ನಾನು, ನೀನು, ಅವನು, ಅವಳು
**Chapter C04** — Verbs (ಕ್ರಿಯಾಪದ): Present/Past/Future
**Chapter C05** — Sentence structure: SOV order (Subject-Object-Verb)

---

## 4. Tech Stack (Identical to Vaani)

| Component | Vaani | Kaveri |
|---|---|---|
| Framework | Next.js 14 | Same |
| Language | TypeScript | Same |
| TTS | Sarvam `hi-IN` | Sarvam **`kn-IN`** |
| Handwriting check | OpenAI Vision | Same (script-agnostic) |
| Spaced repetition | vaaniSpacedRepetition.ts | Copy → kaveriSpacedRepetition.ts |
| Worksheet gen | vaaniWorksheetGenerator.ts | Copy → kaveriWorksheetGenerator.ts |
| XP / streak | localStorage | Same keys, different prefix (`kaveri_xp`) |
| Images | `/assets/gemini/vaani_*` | `/assets/gemini/kaveri_*` |
| Avatar | Vaani SVG | New Akka SVG (similar style) |

---

## 5. File Renaming Map (Copy vaani-tutor → kaveri-tutor)

### Keep identical (zero changes needed)
```
components/Vaani/VaaniCameraCapture.tsx    → components/Kaveri/KaveriCameraCapture.tsx
components/Vaani/VaaniSpeakCheck.tsx       → components/Kaveri/KaveriSpeakCheck.tsx
lib/vaaniSpacedRepetition.ts               → lib/kaveriSpacedRepetition.ts
lib/vaaniWorksheetGenerator.ts             → lib/kaveriWorksheetGenerator.ts
lib/vaaniMusic.ts                          → lib/kaveriMusic.ts
app/api/vaani/check-letter/route.ts        → app/api/kaveri/check-letter/route.ts
app/api/voice/tts/route.ts                 → app/api/voice/tts/route.ts (change lang to kn-IN)
```

### Rebuild with Kannada content
```
lib/vaaniLevel1Data.ts    → lib/kaveriLevel1Data.ts   (Kannada vowels)
lib/vaaniLevel2Data.ts    → lib/kaveriLevel2Data.ts   (Kannada gunita)
lib/vaaniLevel3Data.ts    → lib/kaveriLevel3Data.ts   (Kannada ottaksharas)
lib/vaaniLevel4Data.ts    → lib/kaveriLevel4Data.ts   (Kannada barakhadi)
lib/vaaniLevel5Data.ts    → lib/kaveriLevel5Data.ts   (Kannada sentences)
lib/vaaniLevel6Data.ts    → lib/kaveriLevel6Data.ts   (Kannada grammar)
lib/VaaniData.ts          → lib/KaveriData.ts          (update level generators)
lib/VaaniTypes.ts         → lib/KaveriTypes.ts         (rename types)
```

### Minor changes (find-replace vaani→kaveri, Vaani→Kaveri, hindi→kannada)
```
app/page.tsx                              (branding, colors, level descriptions)
app/[level]/lesson/[lessonId]/            (rename component imports)
app/parent/                               (localStorage keys: vaani_* → kaveri_*)
next.config.mjs                           (basePath: /vaani → /kaveri)
package.json                              (name: kaveri-tutor)
```

---

## 6. Roman Transliteration Map (Kannada)

Key differences from Hindi:
```typescript
export const LEVEL_2_ROMAN_MAP: Record<string, string> = {
  // Vowels
  "ಅ": "a",  "ಆ": "aa", "ಇ": "i",  "ಈ": "ee",
  "ಉ": "u",  "ಊ": "oo", "ಋ": "ri",
  "ಎ": "e",  "ಏ": "ae", "ಐ": "ai",
  "ಒ": "o",  "ಓ": "oo", "ಔ": "au",
  // Ka-group consonants
  "ಕ": "ka", "ಖ": "kha","ಗ": "ga", "ಘ": "gha","ಙ": "nga",
  // Cha-group
  "ಚ": "cha","ಛ": "chha","ಜ": "ja","ಝ": "jha","ಞ": "nya",
  // Ta-group (retroflex)
  "ಟ": "ta", "ಠ": "tha","ಡ": "da", "ಢ": "dha","ಣ": "na",
  // Ta-group (dental)
  "ತ": "ta", "ಥ": "tha","ದ": "da", "ಧ": "dha","ನ": "na",
  // Pa-group
  "ಪ": "pa", "ಫ": "pha","ಬ": "ba", "ಭ": "bha","ಮ": "ma",
  // Others
  "ಯ": "ya", "ರ": "ra", "ಲ": "la", "ವ": "va",
  "ಶ": "sha","ಷ": "sha","ಸ": "sa", "ಹ": "ha", "ಳ": "la",
  // Gunita markers
  "ಾ": "aa", "ಿ": "i",  "ೀ": "ee", "ು": "u",  "ೂ": "oo",
  "ೃ": "ri", "ೆ": "e",  "ೇ": "ae", "ೈ": "ai",
  "ೊ": "o",  "ೋ": "oo", "ೌ": "au",
  "ಂ": "m",  "ಃ": "h",
};
```

---

## 7. Image Asset Plan

~150 images needed (same count as Vaani).
Same Gemini generation approach. Naming convention:

```
/assets/gemini/kaveri_l1_aane_aa.png         ← ಆ for ಆನೆ (elephant)
/assets/gemini/kaveri_l1_iruve_i.png         ← ಇ for ಇರುವೆ (ant)
/assets/gemini/kaveri_l2_ka_akka_1777300001.png
/assets/gemini/kaveri_l3_kka_makkalu.png     ← ಕ್ಕ for ಮಕ್ಕಳು
```

Placeholders: reuse same `/assets/gemini/placeholder.svg`.

---

## 8. TTS Change

In `app/api/voice/tts/route.ts` — one line change:

```typescript
// Vaani
const language = "hi-IN";

// Kaveri
const language = "kn-IN";
```

Sarvam API supports Kannada (`kn-IN`) — no new API key needed.

---

## 9. Deployment Plan

### Server config
```nginx
# /etc/nginx/sites-available/kaveri
location /kaveri {
    proxy_pass http://localhost:3002;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### PM2 ecosystem entry
```javascript
// ecosystem.config.js
{
  name: "rd-kaveri-ai",
  cwd: "/var/www/robodynamics/ai-tutors/kaveri",
  script: "node_modules/next/dist/bin/next",
  args: "start -p 3002",
  env: {
    NODE_ENV: "production",
    NEXT_PUBLIC_BASE_PATH: "/kaveri",
  }
}
```

### Deploy script: `deploy-kaveri-prod.sh`
Copy of `deploy-vaani-prod.sh` with:
- artifact: `kaveri-ai-prod.tar.gz`
- PM2 name: `rd-kaveri-ai`
- port: `3002`
- verify string: `"ನಮಸ್ಕಾರ"` (namaskara)

---

## 10. Execution Timeline

### Phase 1 — Scaffold (Day 1, ~3 hrs)
- [ ] Copy `apps/vaani-tutor` → `apps/kaveri-tutor`
- [ ] Global find-replace: `vaani→kaveri`, `Vaani→Kaveri`, `hindi→kannada`
- [ ] Update `next.config.mjs` basePath, port, PM2 name
- [ ] Update TTS language to `kn-IN`
- [ ] Confirm `npm run dev` starts on port 3002

### Phase 2 — Level Data Files (Days 2–4, ~2 days)
- [ ] `kaveriLevel1Data.ts` — 13 vowel lessons
- [ ] `kaveriLevel2Data.ts` — 36 gunita lessons (ಕ, ಖ, ಗ/ಘ chapters)
- [ ] `kaveriLevel3Data.ts` — 38 ottakshara lessons
- [ ] `kaveriLevel4Data.ts` — 36 barakhadi lessons
- [ ] `kaveriLevel5Data.ts` — 30 sentence lessons
- [ ] `kaveriLevel6Data.ts` — 42 grammar lessons
- [ ] `KaveriData.ts` — level generators (copy VaaniData.ts, update imports)
- [ ] Roman transliteration maps for all 6 levels

### Phase 3 — Images (Day 5, ~1 day)
- [ ] Generate prompt list (same format as `vaani_missing_images_2026-05-06.md`)
- [ ] Gemini batch generation (~150 images)
- [ ] Drop into `public/assets/gemini/kaveri_*`

### Phase 4 — Branding (Day 5, ~2 hrs)
- [ ] New avatar SVG (Akka — same style as Vaani avatar, different appearance)
- [ ] Update homepage level cards (Kannada descriptions)
- [ ] Update page title, meta tags, color scheme (red/gold instead of purple/orange)

### Phase 5 — Testing (Day 6, ~4 hrs)
- [ ] All 6 levels load without errors
- [ ] Tracing canvas works for Kannada characters
- [ ] TTS speaks Kannada correctly (test `kn-IN`)
- [ ] Handwriting check works for ಕ, ಅ etc.
- [ ] XP/streak persistence
- [ ] Worksheet PDF downloads
- [ ] Run TypeScript clean build

### Phase 6 — Deploy (Day 7, ~2 hrs)
- [ ] Create Nginx config for `/kaveri`
- [ ] PM2 process setup on server
- [ ] `tar → scp → ssh extract → pm2 start`
- [ ] Verify `https://robodynamics.in/kaveri` → HTTP 200

---

## 11. Total Effort Estimate

| Phase | Effort |
|---|---|
| Scaffold + config | 3 hrs |
| Level data (6 files) | 12–16 hrs |
| Image generation | 4 hrs (mostly waiting) |
| Branding | 2 hrs |
| Testing | 4 hrs |
| Deploy | 2 hrs |
| **Total** | **~27–31 hrs** (~1 week at normal pace) |

---

## 12. What's Reused vs Built New

| | Reused from Vaani | New for Kaveri |
|---|---|---|
| UI components | ✅ 100% | — |
| Lesson flow logic | ✅ 100% | — |
| Spaced repetition | ✅ 100% (rename) | — |
| Worksheet generator | ✅ 100% (rename) | — |
| Camera/handwriting | ✅ 100% (rename) | — |
| API routes | ✅ ~90% | TTS lang code |
| Data generators | ✅ ~80% | Kannada-specific fields |
| Level data files | ❌ 0% | All 6 data files |
| Roman maps | ❌ 0% | Kannada romanization |
| Images | ❌ 0% | ~150 Gemini images |
| Avatar/branding | ❌ 0% | Akka avatar + colors |

**~70% of the work is content (data files + images). The tech is essentially free.**

# Vaani Tutor — Missing Image Assets
**Date**: 2026-05-06  
**Total missing**: ~155 images (14 SVG + 1 placeholder + 36 L2 + 38 L3 + 36 L4 + 30 L5)  
**Destination folder**: `apps/vaani-tutor/public/assets/gemini/`

---

## Global Recommendation
All L1 SVGs (14 files) should be **regenerated as PNGs** and placed in `/assets/gemini/` alongside existing L1 PNGs. After generation, update `vaaniLevel1Data.ts` to replace each SVG path with the new PNG path. This removes the only `/assets/` SVG dependency and unifies the asset pipeline.

Also needed: `placeholder.png` — a **generic Hindi alphabet / book / pencil** image used as the fallback for any lesson with a missing image.

---

## Style Guide for All Gemini Prompts
Use this base style for every image unless noted otherwise:  
> "Bright, cheerful cartoon illustration. White background. Child-friendly, ages 5–10. Bold clean outlines. No text labels. 512×512 pixels PNG. Vibrant colours."

---

## LEVEL 1 — Missing SVGs (convert to PNG)

These 14 lessons currently reference `.svg` paths that do not exist. Generate PNGs and save to `/assets/gemini/`, then update the `assetPath` in `vaaniLevel1Data.ts`.

| # | New PNG filename | Hindi char | Hindi word | English | Gemini Prompt |
|---|---|---|---|---|---|
| 1 | `vaani_l1_khargosh_kha.png` | ख | खरगोश | Rabbit | A cute white rabbit sitting upright with big round eyes and fluffy tail. Bright cartoon style, white background. |
| 2 | `vaani_l1_gamla_ga.png` | ग | गमला | Plant Pot | A red clay flower pot with a small green plant growing out of it. Cheerful cartoon, white background. |
| 3 | `vaani_l1_charkha_cha.png` | च | चरखा | Spinning Wheel | A traditional Indian spinning wheel (charkha) in brown wood tones. Simple cartoon, white background. |
| 4 | `vaani_l1_chhatri_chha.png` | छ | छतरी | Umbrella | A bright blue open umbrella with yellow polka dots, seen from the side. Cartoon style, white background. |
| 5 | `vaani_l1_jahaz_ja.png` | ज | जहाज | Ship | A cheerful red and white sailing ship on calm blue water, cartoon style, white background. |
| 6 | `vaani_l1_jhanda_jha.png` | झ | झंडा | Flag | An Indian tricolour flag on a wooden pole, gently waving. Bright cartoon, white background. |
| 7 | `vaani_l1_tamatar_ta.png` | ट | टमाटर | Tomato | Three round red tomatoes with a green leafy stem. Bold cartoon, white background. |
| 8 | `vaani_l1_damru_da.png` | ड | डमरू | Drum | A small hourglass-shaped Shiva damru drum in orange and gold colours. Cartoon style, white background. |
| 9 | `vaani_l1_dhakkan_dha.png` | ढ | ढक्कन | Lid | A round silver pot lid with a small handle on top. Simple cheerful cartoon, white background. |
| 10 | `vaani_l1_tarbooz_ta2.png` | त | तरबूज | Watermelon | A whole green watermelon next to a triangular slice showing the red interior with black seeds. Cartoon style, white background. |
| 11 | `vaani_l1_thali_tha.png` | थ | थाली | Plate | A round silver thali (plate) with small bowls of food arranged on it. Bright cartoon, white background. |
| 12 | `vaani_l1_dawat_da2.png` | द | दावत | Feast | A round dining table with several dishes of colourful Indian food spread on it. Cartoon style, top-down view, white background. |
| 13 | `vaani_l1_dhanush_dha2.png` | ध | धनुष | Bow (archery) | An archer's wooden bow with an arrow drawn back, cartoon style, white background. |
| 14 | `vaani_l1_nal_na.png` | न | नल | Water Tap | A silver water tap with a few drops of water falling from it. Simple cheerful cartoon, white background. |

**Placeholder (also needed)**

| Filename | Usage | Gemini Prompt |
|---|---|---|
| `placeholder.png` | Generic fallback for any missing image | A friendly open Hindi textbook with a pencil beside it. Bright cartoon, white background. 512×512 PNG. |

**After generation — update these lines in `vaaniLevel1Data.ts`:**

```
L1-C02-L01 (ख)  →  assetPath: "/assets/gemini/vaani_l1_khargosh_kha.png"
L1-C02-L02 (ग)  →  assetPath: "/assets/gemini/vaani_l1_gamla_ga.png"
L1-C02-L03 (घ)  →  assetPath: "/assets/gemini/vaani_l1_gamla_ga.png"  [currently /house.png]
L1-C03-L01 (च)  →  assetPath: "/assets/gemini/vaani_l1_charkha_cha.png"
L1-C03-L02 (छ)  →  assetPath: "/assets/gemini/vaani_l1_chhatri_chha.png"
L1-C03-L03 (ज)  →  assetPath: "/assets/gemini/vaani_l1_jahaz_ja.png"
L1-C03-L04 (झ)  →  assetPath: "/assets/gemini/vaani_l1_jhanda_jha.png"
L1-C04-L01 (ट)  →  assetPath: "/assets/gemini/vaani_l1_tamatar_ta.png"
L1-C04-L02 (ठ)  →  assetPath: "/assets/gemini/vaani_l1_thathera_tha.png"  [currently placeholder.png]
L1-C04-L03 (ड)  →  assetPath: "/assets/gemini/vaani_l1_damru_da.png"
L1-C04-L04 (ढ)  →  assetPath: "/assets/gemini/vaani_l1_dhakkan_dha.png"
L1-C05-L01 (त)  →  assetPath: "/assets/gemini/vaani_l1_tarbooz_ta2.png"
L1-C05-L02 (थ)  →  assetPath: "/assets/gemini/vaani_l1_thathera_tha.png"
L1-C05-L03 (द)  →  assetPath: "/assets/gemini/vaani_l1_dawat_da2.png"
L1-C05-L04 (ध)  →  assetPath: "/assets/gemini/vaani_l1_dhanush_dha2.png"
L1-C05-L05 (न)  →  assetPath: "/assets/gemini/vaani_l1_nal_na.png"
```

---

## LEVEL 2 — Missing PNGs (36 files)

All L2 images are in `/assets/gemini/` but the files don't exist yet. Filenames are already correct in `vaaniLevel2Data.ts` — just generate and drop in.

### Chapter C01 — क (Ka) with Matras (12 lessons)

| # | Filename | Hindi | English | Gemini Prompt |
|---|---|---|---|---|
| 1 | `vaani_l2_ka_black_1777140001.png` | काला | Black | A dark black cat with bright eyes, cartoon style, white background. |
| 2 | `vaani_l2_ki_book_1777140025.png` | किताब | Book | A colourful open school notebook with ruled lines. Bright cartoon, white background. |
| 3 | `vaani_l2_kee_price_1777140049.png` | कीमत | Price | A price tag label with a rupee symbol on it. Simple cartoon, white background. |
| 4 | `vaani_l2_ku_dog_1777140073.png` | कुत्ता | Dog | A friendly golden dog sitting and wagging its tail. Bright cartoon, white background. |
| 5 | `vaani_l2_koo_jump_1777140097.png` | कूद | Jump | A child jumping joyfully in the air with arms raised. Cartoon style, white background. |
| 6 | `vaani_l2_ke_banana_1777140121.png` | केला | Banana | Two ripe yellow bananas. Bold cartoon, white background. |
| 7 | `vaani_l2_kai_how_1777140145.png` | कैसा | How | A child with a curious questioning expression, arms spread wide. Cartoon style, white background. |
| 8 | `vaani_l2_ko_cola_1777140169.png` | कोला | Cola | A fizzy cold drink bottle or glass with a straw and bubbles. Cartoon style, white background. |
| 9 | `vaani_l2_kau_who_1777140193.png` | कौन | Who | A small detective child with a magnifying glass looking curious. Cartoon style, white background. |
| 10 | `vaani_l2_kra_cricket_1777140217.png` | क्रिकेट | Cricket | A cricket bat and ball side by side. Bright cartoon, white background. |
| 11 | `vaani_l2_ksha_warrior_1777140241.png` | क्षत्रिय | Warrior | A brave cartoon warrior in traditional armour holding a shield. White background. |
| 12 | `vaani_l2_review_game_1777140265.png` | काम | Work / Review | A smiling child at a desk with books and pencils. Cartoon review-game style, white background. |

### Chapter C02 — ख (Kha) with Matras (12 lessons)

| # | Filename | Hindi | English | Gemini Prompt |
|---|---|---|---|---|
| 13 | `vaani_l2_kha_food_1777140289.png` | खाना | Food | A round thali plate with small bowls of rice, dal, and vegetable curry. Bright cartoon, white background. |
| 14 | `vaani_l2_khi_player_1777140313.png` | खिलाड़ी | Player | A child in a sports jersey kicking a football. Cartoon style, white background. |
| 15 | `vaani_l2_khee_rice_1777140337.png` | खीर | Rice Pudding | A bowl of creamy white kheer (rice pudding) garnished with nuts. Cartoon style, white background. |
| 16 | `vaani_l2_khu_happy_1777140361.png` | खुशी | Happiness | A beaming child with a big smile, arms outstretched. Bright cartoon, white background. |
| 17 | `vaani_l2_khoo_very_1777140385.png` | खूब | Very Much | Stars and sparkles radiating from a glowing object to show abundance. Cartoon style, white background. |
| 18 | `vaani_l2_khe_field_1777140409.png` | खेत | Field | A green farm field with rows of crops and a bright sun. Cartoon style, white background. |
| 19 | `vaani_l2_khai_well_1777140433.png` | खैर | Well (anyway) | A stone water well in a village. Simple cartoon, white background. |
| 20 | `vaani_l2_kho_search_1777140457.png` | खोज | Search | A child with a magnifying glass searching the ground. Cartoon style, white background. |
| 21 | `vaani_l2_khau_fear_1777140481.png` | खौफ | Fear | A child hiding under a blanket with wide scared eyes peeking out. Cartoon style, white background. |
| 22 | `vaani_l2_khra_idea_1777140505.png` | ख्रिसमस | Christmas | A decorated Christmas tree with star on top, in festive colours. Cartoon style, white background. |
| 23 | `vaani_l2_khya_imagination_1777140529.png` | ख्याल | Thought/Idea | A lightbulb above a child's head representing a bright idea. Cartoon style, white background. |
| 24 | `vaani_l2_review_consonants_1777140553.png` | खाना | Review | Two side-by-side boxes labelled क and ख with small example images. Review card style, white background. |

### Chapter C03 — ग & घ (Ga & Gha) with Matras (12 lessons)

| # | Filename | Hindi | English | Gemini Prompt |
|---|---|---|---|---|
| 25 | `vaani_l2_ga_singing_1777140577.png` | गाना | Singing | A child singing joyfully with musical notes floating around. Cartoon style, white background. |
| 26 | `vaani_l2_gi_glass_1777140601.png` | गिलास | Glass | A tall drinking glass filled with water. Simple cartoon, white background. |
| 27 | `vaani_l2_gu_rose_1777140625.png` | गुलाब | Rose | A bright red rose with two green leaves. Bold cartoon, white background. |
| 28 | `vaani_l2_ge_wheat_1777140649.png` | गेहूँ | Wheat | Golden wheat stalks tied in a small bundle. Cartoon style, white background. |
| 29 | `vaani_l2_go_lap_1777140673.png` | गोद | Lap | A mother sitting cross-legged with a small child sitting in her lap, both smiling. Cartoon style, white background. |
| 30 | `vaani_l2_gha_house_1777140697.png` | घास | Grass | Lush green blades of grass growing from the ground. Cartoon style, white background. |
| 31 | `vaani_l2_ghi_ghee_1777140721.png` | घी | Ghee | A small clay pot or golden jar with golden ghee drizzling from a spoon. Cartoon style, white background. |
| 32 | `vaani_l2_ghu_bells_1777140745.png` | घुंघरू | Ankle Bells | A pair of golden ankle-bell bracelets (ghunghru) on a dancer's feet. Cartoon style, white background. |
| 33 | `vaani_l2_ghe_circle_1777140769.png` | घेरा | Circle | A bold bright circle drawn on white. Or children holding hands in a ring. Cartoon style, white background. |
| 34 | `vaani_l2_gho_horse_1777140793.png` | घोड़ा | Horse | A brown horse trotting happily, cartoon style, white background. |
| 35 | `vaani_l2_gra_green_1777140817.png` | ग्रीन | Green | Bright green leaves or a green paint splash. Cartoon style, white background. |
| 36 | `vaani_l2_consolidation_1777140841.png` | गायन | Review | A musical stage with a child singer in the spotlight. Review celebration style, white background. |

---

## LEVEL 3 — Missing PNGs (38 files)

All L3 images in `/assets/gemini/`. Filenames correct in `vaaniLevel3Data.ts`.

### Chapter C01 — Conjuncts Set 1 (14 lessons)

| # | Filename | Hindi | English | Gemini Prompt |
|---|---|---|---|---|
| 1 | `vaani_l3_kta_conjunct_1777155001.png` | अक्त | Anointed | Hands pouring sacred oil or water in a ritual. Simple cartoon, white background. |
| 2 | `vaani_l3_nda_walrus_1777155025.png` | हंद / वालरस | Walrus | A chubby walrus with big tusks sitting on an ice floe. Cartoon style, white background. |
| 3 | `vaani_l3_mpa_vibration_1777155049.png` | कंपन | Vibration | Wavy vibration lines radiating from a ringing bell. Cartoon style, white background. |
| 4 | `vaani_l3_shtha_rigid_1777155073.png` | ईष्ठ | Rigid/Hard | A solid stone block with cracks, suggesting hardness. Cartoon style, white background. |
| 5 | `vaani_l3_lla_cluster_1777155097.png` | पल्ल | Cluster | A bunch of grapes or berries clustered together. Cartoon style, white background. |
| 6 | `vaani_l3_rja_archer_1777155121.png` | अर्जुन | Archer | A heroic archer drawing a bow, in the style of a cartoon Mahabharata character. White background. |
| 7 | `vaani_l3_vya_person_1777155145.png` | व्यक्ति | Person | A simple outline figure of a person (gender-neutral child). Cartoon style, white background. |
| 8 | `vaani_l3_tra_threefaced_1777155169.png` | त्रिमुखी | Three-faced | A decorative three-faced mask or idol face, stylised cartoon, white background. |
| 9 | `vaani_l3_dra_matter_1777155193.png` | द्रव्य | Matter/Substance | Atoms or molecules represented as colourful balls and sticks. Cartoon science style, white background. |
| 10 | `vaani_l3_ksha_region_1777155217.png` | क्षेत्र | Region/Area | A map outline of India with a highlighted region. Cartoon style, white background. |
| 11 | `vaani_l3_gnya_knowledge_1777155241.png` | ज्ञान | Knowledge | An open glowing book radiating light rays. Cartoon style, white background. |
| 12 | `vaani_l3_shra_honorable_1777155265.png` | श्रीमान | Honorable | A dignified gentleman in a traditional kurta with a respectful namaste gesture. Cartoon style, white background. |
| 13 | `vaani_l3_sta_level_1777155289.png` | स्तर | Level | A bar chart or stacked blocks showing different levels. Cartoon style, white background. |
| 14 | `vaani_l3_review1_1777155313.png` | अक्षर | Letter (Review) | A chalkboard with neat Hindi letters written on it. Review card style, white background. |

### Chapter C02 — Conjuncts Set 2 (11 lessons)

| # | Filename | Hindi | English | Gemini Prompt |
|---|---|---|---|---|
| 15 | `vaani_l3_ncha_saree_1777155337.png` | अञ्चल | End of Saree | A woman holding the border end of a colourful saree. Cartoon style, white background. |
| 16 | `vaani_l3_nda_retrofit_1777155361.png` | कण्ड | Section | A scroll of paper divided into sections with dotted lines. Cartoon style, white background. |
| 17 | `vaani_l3_tya_festival_1777155385.png` | त्यहार | Festival | Children celebrating a colourful festival with lights and diyas. Cartoon style, white background. |
| 18 | `vaani_l3_dya_today_1777155409.png` | अद्य | Today | A bright sunrise or calendar showing today's date. Cartoon style, white background. |
| 19 | `vaani_l3_pra_happy_1777155433.png` | प्रसन्न | Happy | A joyful child with a big smile and rosy cheeks. Bright cartoon, white background. |
| 20 | `vaani_l3_bra_brahma_1777155457.png` | ब्रह्म | Brahma | A stylised lotus flower with four petals glowing. Spiritual cartoon style, white background. |
| 21 | `vaani_l3_mya_sheath_1777155481.png` | म्यान | Sheath/Scabbard | A decorative sword sheath in gold and red colours. Cartoon style, white background. |
| 22 | `vaani_l3_hya_human_1777155505.png` | ह्यूमन | Human | A friendly stick-figure human outline. Simple cartoon, white background. |
| 23 | `vaani_l3_ska_school_1777155529.png` | स्कूल | School | A bright school building with a flag on top, cartoon style, white background. |
| 24 | `vaani_l3_spa_clear_1777155553.png` | स्पष्ट | Clear | A clear sparkling glass of water or a magnifying glass showing crisp detail. Cartoon style, white background. |
| 25 | `vaani_l3_lya_various_1777155577.png` | ल्यौ | Various | A colourful collection of different small objects (star, heart, flower) arranged in a grid. Cartoon style, white background. |

### Chapter C03 — Advanced Conjuncts (13 lessons)

| # | Filename | Hindi | English | Gemini Prompt |
|---|---|---|---|---|
| 26 | `vaani_l3_review2_1777155601.png` | प्रेम | Love (Review) | Two cartoon children sharing a heart between them. Review style, white background. |
| 27 | `vaani_l3_chya_dark_1777155625.png` | छ्यामा | Dark Complexioned | A graceful woman silhouette with dark complexion in a flowing sari. Artistic cartoon, white background. |
| 28 | `vaani_l3_tra_retrofit_1777155649.png` | ट्रंक | Trunk (luggage) | A big old-fashioned travel trunk suitcase in brown leather. Cartoon style, white background. |
| 29 | `vaani_l3_dra_retrofit_1777155673.png` | ड्रामा | Drama | Children performing on a stage with a curtain. Cartoon style, white background. |
| 30 | `vaani_l3_jya_light_1777155697.png` | ज्योति | Light/Flame | A glowing diya (oil lamp) with a bright flame. Cartoon style, white background. |
| 31 | `vaani_l3_dhya_meditation_1777155721.png` | ध्यान | Meditation | A child sitting cross-legged in a peaceful meditation pose. Cartoon style, white background. |
| 32 | `vaani_l3_bhra_confusion_1777155745.png` | भ्रम | Confusion | A child with question marks swirling around their head. Cartoon style, white background. |
| 33 | `vaani_l3_bhya_terrible_1777155769.png` | भ्यावह | Terrible/Scary | A cartoon ghost or monster with wide eyes, childlike scary but not too frightening. White background. |
| 34 | `vaani_l3_hna_decline_1777155793.png` | ह्नास | Decline | An arrow pointing downward on a graph. Simple cartoon, white background. |
| 35 | `vaani_l3_sya_stitched_1777155817.png` | स्यूत | Stitched | A needle and thread stitching fabric. Cartoon style, white background. |
| 36 | `vaani_l3_gya_eleven_1777155841.png` | ग्यारह | Eleven | The number 11 in large bold digits with stars around it. Cartoon style, white background. |
| 37 | `vaani_l3_ghya_attention_1777155865.png` | घ्यान | Attention | A teacher pointing at a board while students look attentively. Cartoon style, white background. |
| 38 | `vaani_l3_review3_1777155889.png` | संभव | Possible (Final Review) | A trophy cup with the Hindi word for "possible" and confetti. Celebration cartoon, white background. |

---

## LEVEL 4 — Missing PNGs (36 files)

All L4 images in `/assets/gemini/`. Filenames correct in `vaaniLevel4Data.ts`.

### Chapter C01 — Barakhadi Set 1: क–त (12 lessons)

| # | Filename | Consonant | Anchor Word | English | Gemini Prompt |
|---|---|---|---|---|---|
| 1 | `vaani_l4_ka_barakhadi_1777200001.png` | क | कमल | Lotus | A pink lotus flower blooming on water. Bright cartoon, white background. |
| 2 | `vaani_l4_kha_barakhadi_1777200025.png` | ख | खाना | Food | A thali with rice, dal, and vegetable curry. Bright cartoon, white background. |
| 3 | `vaani_l4_ga_barakhadi_1777200049.png` | ग | गाना | Singing | A child at a microphone with musical notes. Cartoon style, white background. |
| 4 | `vaani_l4_gha_barakhadi_1777200073.png` | घ | घर | House | A cosy house with a red roof and green garden. Cartoon style, white background. |
| 5 | `vaani_l4_cha_barakhadi_1777200097.png` | च | चाय | Tea | A steaming cup of chai with a biscuit. Cartoon style, white background. |
| 6 | `vaani_l4_chha_barakhadi_1777200121.png` | छ | छत | Roof | A house with the roof clearly highlighted in a different colour. Cartoon style, white background. |
| 7 | `vaani_l4_ta_retrofit_barakhadi_1777200145.png` | ट | टीका | Bindi/Mark | A forehead with a red bindi dot, gentle cartoon style, white background. |
| 8 | `vaani_l4_tha_aspir_retrofit_barakhadi_1777200169.png` | ठ | ठंड | Cold | A child bundled up in a scarf and woolly hat, shivering in the cold. Cartoon style, white background. |
| 9 | `vaani_l4_da_retrofit_barakhadi_1777200193.png` | ड | डाक | Mail | A postman with a letter bag and red bicycle. Cartoon style, white background. |
| 10 | `vaani_l4_dha_aspir_retrofit_barakhadi_1777200217.png` | ढ | ढोल | Drum | A large dhol drum being beaten at a celebration. Cartoon style, white background. |
| 11 | `vaani_l4_ta_dental_barakhadi_1777200241.png` | त | तारा | Star | A bright five-pointed yellow star with a cheerful face. Cartoon style, white background. |
| 12 | `vaani_l4_review_consolidation_1777200265.png` | Review | पढ़ना | Reading | A child sitting with a big open book, smiling. Review card style, white background. |

### Chapter C02 — Barakhadi Set 2: थ–म (12 lessons)

| # | Filename | Consonant | Anchor Word | English | Gemini Prompt |
|---|---|---|---|---|---|
| 13 | `vaani_l4_tha_dental_aspir_barakhadi_1777200289.png` | थ | थाली | Plate | A round silver thali (plate) with small bowls on it. Cartoon style, white background. |
| 14 | `vaani_l4_da_dental_barakhadi_1777200313.png` | द | दिन | Day | A bright sunny day with clouds and a happy sun. Cartoon style, white background. |
| 15 | `vaani_l4_dha_dental_aspir_barakhadi_1777200337.png` | ध | धन | Money | A stack of gold coins and currency notes. Cartoon style, white background. |
| 16 | `vaani_l4_pa_barakhadi_1777200361.png` | प | पानी | Water | A glass of clear water with ripples. Cartoon style, white background. |
| 17 | `vaani_l4_pha_barakhadi_1777200385.png` | फ | फल | Fruit | A bowl of mixed colourful fruits — apple, mango, banana. Cartoon style, white background. |
| 18 | `vaani_l4_ba_barakhadi_1777200409.png` | ब | बाजार | Market | A lively market street with stalls selling colourful goods. Cartoon style, white background. |
| 19 | `vaani_l4_bha_barakhadi_1777200433.png` | भ | भाग | Part/Run | A child running energetically. Cartoon style, white background. |
| 20 | `vaani_l4_ma_barakhadi_1777200457.png` | म | माता | Mother | A loving mother hugging her child. Warm cartoon style, white background. |
| 21 | `vaani_l4_ya_barakhadi_1777200481.png` | य | योग | Yoga | A child doing a simple yoga pose (tree pose). Cartoon style, white background. |
| 22 | `vaani_l4_ra_barakhadi_1777200505.png` | र | राजा | King | A cartoon king with a crown and royal robe. White background. |
| 23 | `vaani_l4_la_barakhadi_1777200529.png` | ल | लड़का | Boy | A smiling school boy with a backpack. Cartoon style, white background. |
| 24 | `vaani_l4_va_barakhadi_1777200554.png` | व | वाणी | Speech/Voice | A child speaking into a microphone with sound waves. Cartoon style, white background. |

### Chapter C03 — Barakhadi Set 3: श–ह + Reviews (12 lessons)

| # | Filename | Consonant | Anchor Word | English | Gemini Prompt |
|---|---|---|---|---|---|
| 25 | `vaani_l4_sha_barakhadi_1777200555.png` | श | शक्ति | Power/Strength | A superhero child with a cape and glowing fist. Cartoon style, white background. |
| 26 | `vaani_l4_retroflex_sha_barakhadi_1777200556.png` | ष | षष्ठी | Sixth | A large bold number 6 with star decorations. Cartoon style, white background. |
| 27 | `vaani_l4_sa_barakhadi_1777200557.png` | स | सूरज | Sun | A bright smiling sun with rays spreading all around. Cartoon style, white background. |
| 28 | `vaani_l4_ha_barakhadi_1777200558.png` | ह | हाथ | Hand | Two open friendly hands shown palm-forward. Cartoon style, white background. |
| 29 | `vaani_l4_ka_kha_review_1777200559.png` | Review | कमल & खाना | Lotus & Food | Side-by-side small images: a lotus and a thali. Review card style, white background. |
| 30 | `vaani_l4_ga_gha_review_1777200560.png` | Review | गाना & घर | Song & House | Side-by-side images: musical notes and a house. Review card style, white background. |
| 31 | `vaani_l4_fricatives_review_1777200561.png` | Review | स/श/ष | Sun/Power/Sixth | Three small images in a row: sun, lightning bolt, number 6. Review card style, white background. |
| 32 | `vaani_l4_liquids_review_1777200562.png` | Review | य/र/ल/व | River/King/Boy/Speech | Four small images in a 2×2 grid. Review card style, white background. |
| 33 | `vaani_l4_stops_review_1777200563.png` | Review | त/ट/द/ड | Star/Mark/Sun/Mail | Four small images in a 2×2 grid. Review card style, white background. |
| 34 | `vaani_l4_nasals_review_1777200564.png` | Review | नाम & माता | Name & Mother | A name badge and a mother-child icon side by side. Review card style, white background. |
| 35 | `vaani_l4_aspirated_challenge_1777200565.png` | Challenge | थाली/धन/फल/भाई/हाथ | Plate/Money/Fruit/Brother/Hand | Five small icons in a row: thali, coins, fruit, two boys, hands. White background. |
| 36 | `vaani_l4_mastery_complete_1777200566.png` | Mastery | हिंदी शिक्षा | Hindi Education | A graduation cap and certificate with "हिंदी" written on it. Celebration cartoon, white background. |

---

## LEVEL 5 — Missing PNGs (30 files)

All L5 images in `/assets/gemini/`. Filenames correct in `vaaniLevel5Data.ts`. These illustrate **complete Hindi sentences**.

### Chapter C01 — Basic Conversational Sentences (15 lessons)

| # | Filename | Sentence | English | Gemini Prompt |
|---|---|---|---|---|
| 1 | `vaani_l5_namaste_bhai_1777200001.png` | नमस्ते भाई। | Hello brother | Two children greeting each other with a namaste gesture and big smiles. Cartoon style, white background. |
| 2 | `vaani_l5_aap_kaise_1777200025.png` | आप कैसे? | How are you? | A child waving hello and asking a question with a curious expression. Cartoon style, white background. |
| 3 | `vaani_l5_main_theek_1777200049.png` | मैं ठीक। | I am fine | A child giving a thumbs up with a relaxed happy expression. Cartoon style, white background. |
| 4 | `vaani_l5_dhanyavaad_bhai_1777200073.png` | धन्यवाद भाई। | Thank you brother | A child bowing slightly with a grateful smile. Cartoon style, white background. |
| 5 | `vaani_l5_kripaya_baithiye_1777200097.png` | कृपया बैठिए। | Please sit down | A child gesturing to an empty chair, inviting someone to sit. Cartoon style, white background. |
| 6 | `vaani_l5_mera_naam_1777200121.png` | मेरा नाम राज। | My name is Raj | A child pointing to a name badge on their shirt that says "Raj". Cartoon style, white background. |
| 7 | `vaani_l5_aapka_naam_1777200145.png` | आपका नाम क्या है? | What is your name? | A child holding a question mark sign and looking curious. Cartoon style, white background. |
| 8 | `vaani_l5_mujhe_bhookh_1777200169.png` | मुझे भूख है। | I am hungry | A child with a grumbling tummy, holding their stomach. Cartoon style, white background. |
| 9 | `vaani_l5_yeh_kitaab_1777200193.png` | यह एक किताब है। | This is a book | A child pointing to a big colourful book. Cartoon style, white background. |
| 10 | `vaani_l5_mujhe_pasand_1777200217.png` | मुझे आम पसंद है। | I like mangoes | A child happily holding a mango with a heart symbol. Cartoon style, white background. |
| 11 | `vaani_l5_main_school_1777200241.png` | मैं स्कूल जाता हूँ। | I go to school | A child walking to school with a backpack. Cartoon style, white background. |
| 12 | `vaani_l5_madad_1777200265.png` | क्या आप मेरी मदद कर सकते हैं? | Can you help me? | A child extending a hand asking for help, another child reaching back. Cartoon style, white background. |
| 13 | `vaani_l5_yeh_pani_1777200289.png` | यह पानी है। | This is water | A child pointing to a glass of water. Cartoon style, white background. |
| 14 | `vaani_l5_mujhe_pyas_1777200313.png` | मुझे प्यास है। | I am thirsty | A child with a dry expression reaching for a water bottle. Cartoon style, white background. |
| 15 | `vaani_l5_main_khush_1777200337.png` | मैं खुश हूँ। | I am happy | A very joyful child jumping with arms in the air. Bright cartoon, white background. |

### Chapter C02 — Descriptive Sentences (15 lessons)

| # | Filename | Sentence | English | Gemini Prompt |
|---|---|---|---|---|
| 16 | `vaani_l5_intro_full_1777200361.png` | मेरा नाम राज है। | My name is Raj | A child holding a sign with their name while waving. Cartoon style, white background. |
| 17 | `vaani_l5_need_book_1777200385.png` | मुझे एक किताब चाहिए। | I need a book | A child with an outstretched hand and a book nearby. Cartoon style, white background. |
| 18 | `vaani_l5_raj_boy_1777200409.png` | राज एक लड़का है। | Raj is a boy | A smiling boy character named Raj with a name tag. Cartoon style, white background. |
| 19 | `vaani_l5_ped_1777200433.png` | यह एक पेड़ है। | This is a tree | A child pointing at a big leafy tree. Cartoon style, white background. |
| 20 | `vaani_l5_kela_pasand_1777200457.png` | मुझे केला बहुत पसंद है। | I really like bananas | A child hugging a giant banana with a big smile. Cartoon style, white background. |
| 21 | `vaani_l5_reading_routine_1777200481.png` | मैं हर दिन पढ़ता हूँ। | I read every day | A child reading a book at a desk with a calendar on the wall showing daily routine. Cartoon style, white background. |
| 22 | `vaani_l5_ghar_billi_1777200505.png` | घर में एक बिल्ली है। | There is a cat in the house | A house with a cute cat peeking from a window. Cartoon style, white background. |
| 23 | `vaani_l5_kaun_ho_1777200529.png` | आप कौन हैं? | Who are you? | Two children looking at each other in a questioning way. Cartoon style, white background. |
| 24 | `vaani_l5_delhi_rehta_1777200553.png` | मैं दिल्ली में रहता हूँ। | I live in Delhi | A child in front of the India Gate landmark in Delhi. Simple cartoon, white background. |
| 25 | `vaani_l5_mausam_1777200577.png` | आज का मौसम ठीक है। | Today's weather is nice | A bright sunny day with a few fluffy clouds and a cheerful sun. Cartoon style, white background. |
| 26 | `vaani_l5_dost_1777200601.png` | मेरा दोस्त बहुत अच्छा है। | My friend is very good | Two children with arms around each other's shoulders, smiling. Cartoon style, white background. |
| 27 | `vaani_l5_chhuti_1777200625.png` | कल स्कूल की छुट्टी है। | School is closed tomorrow | A school building with a "Closed" sign and a child celebrating. Cartoon style, white background. |
| 28 | `vaani_l5_khalna_1777200649.png` | मैं खेलना बहुत पसंद करता हूँ। | I really like to play | A child playing outdoors — running, with a kite or ball. Bright cartoon, white background. |
| 29 | `vaani_l5_hindi_bol_1777200673.png` | क्या आप हिंदी बोल सकते हैं? | Can you speak Hindi? | A child speaking with Hindi letters floating from their mouth. Cartoon style, white background. |
| 30 | `vaani_l5_mastery_final_1777200697.png` | मेरा परिवार बहुत खुश है। | My family is very happy | A happy family of four (parents + 2 kids) together. Warm cartoon, white background. |

---

## Summary Count

| Level | Missing Images | Notes |
|---|---|---|
| L1 | 14 SVGs → PNGs + 1 placeholder | Update `vaaniLevel1Data.ts` paths after generation |
| L2 | 36 PNGs | Drop in `/assets/gemini/` — no code changes needed |
| L3 | 38 PNGs | Drop in `/assets/gemini/` — no code changes needed |
| L4 | 36 PNGs | Drop in `/assets/gemini/` — no code changes needed |
| L5 | 30 PNGs | Drop in `/assets/gemini/` — no code changes needed |
| **Total** | **155 images** | |

## Gemini Image Generation Settings
- **Resolution**: 512×512 px
- **Format**: PNG
- **Style prefix to add to every prompt**: *"Bright, cheerful cartoon illustration. White background. Child-friendly, ages 5–10. Bold clean outlines. No text labels."*

## Naming Convention
Files already follow this convention: `vaani_l{level}_{keyword}_{timestamp}.png`  
The timestamps in the filenames (e.g. `1777140001`) are just sequential numbers used as IDs — keep them as-is when saving generated images so the `assetPath` in the data files matches exactly.

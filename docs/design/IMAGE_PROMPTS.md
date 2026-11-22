# San Valentín 2027 Calendar: Image Prompts

Images for the site design. They implement requirements C01–C04 and L01–L11 in [`REQUIREMENTS_ANALYSIS.md`](../requirements/REQUIREMENTS_ANALYSIS.md) §4.2–4.2a, and phase 1 of the [development plan](../plan/DEVELOPMENT_PLAN.md).

## 1. How to use these prompts

- **Start from the approved cover.** Use the edit prompts (E1–E3) with `San Valentín 2027_ Dulce Romance-1.png` attached. Pedro already chose that image, so keeping its bear and lighting matters more than a fresh look. Use the fallback prompts (G1–G3) only if editing fails.
- **Choosing a tool.** E1a works best with a masked edit (inpainting): select only the areas to change. E1b needs a tool that extends an image outward (outpainting). E2 and E3 need a tool that accepts a reference image. Most current image tools do all three.
- **Never put text in the images.** The title, subtitle, year, brand and buttons are added later as HTML (L03). Generators also misspell Spanish, which is how "reetas" ended up on the current cover.
- **Order:** E1a → E1b → E2 → E3 → optional S1–S2.
- **Check every result** against its acceptance list before exporting. An image that puts something important in a button or text zone will not work, however good it looks.

## 2. Shared blocks

Append these to every generation prompt where the prompt says so.

**Style block**

> Warm romantic Valentine's illustration in a glossy, photoreal 3D style. Soft cinematic lighting with a warm golden glow. Raspberry, magenta and rose-pink palette with cream and gold accents. Shallow depth of field with soft bokeh lights. Rich but uncluttered, elegant and gentle, high detail, clean edges.

**Avoid block**

> No text, letters, numbers, words, logos, watermarks, signatures, labels or symbols that look like writing. No people or hands. No additional teddy bears. No cartoon outlines, no flat vector style, no harsh shadows. No neon or blue tones. No objects crossing the empty areas described above.

For tools with a separate negative prompt field, use: `text, letters, typography, logo, watermark, signature, numbers, people, hands, extra bears, flat vector, neon, blue tint, clutter in center, blurry bear, deformed paws`.

## 3. Landing backgrounds

Zones are percentages of the image: across from the left, down from the top. The **safe area** is what every screen in that crop's band will show.

### E1a. Clean the approved cover (edit)

Input: the approved cover at its original size (1672×941). If the tool supports masks, mask only:

- the logo at top-left,
- the title,
- the "2027" banner,
- the subtitle,
- the sparkle marks beside the title,
- the curl-and-heart flourish under the subtitle.

> Edit this image. Remove all lettering and text: the logo in the top-left corner (a heart with a chef's hat and the words beneath it), the large title, the gold ribbon banner with the year, and the three lines of italic text. Also remove the small sparkle marks beside the title and the curly heart flourish below the text. Fill every removed area with the same softly glowing magenta bokeh background and golden sparkles, so it looks as if nothing was ever there. Keep the large glowing golden heart outline, now empty inside. Keep everything else exactly as it is: the teddy bear, its face and fur, the red scarf, the red heart with the gold bow, the roses, small white flowers, the gift box, the lantern, the floating hearts, the candle, the ribbons and petals. Same positions, sizes, colors, lighting and framing. Do not add anything.

**Accept when:**

- No trace of letters or of the logo remains.
- The bear, heart, bow and props are unchanged when you flick between the two images.
- The inside of the golden heart outline is calm and evenly lit.

**Save as** `docs/design/source/cover-clean.png`.

### E1b. Landscape 16:9 (extend)

Input: `cover-clean.png` scaled to 1920×1080 and centered on a 2560×1440 canvas, with the border left empty for the tool to fill.

> Extend this image outward on all four sides to fill the empty border. Continue the scene naturally: more softly blurred magenta and rose bokeh lights, a few more out-of-focus pink and red roses with small white flowers at the far left and far right edges, the pink satin ribbon continuing past the bottom right corner, scattered rose petals on the soft pink surface along the bottom, and warm golden glow toward the top right. The added areas must be quieter and softer than the center. Do not change anything inside the original picture. Do not add a new main subject, bear, heart or frame. [Style block] [Avoid block]

Target 2560×1440:

| Zone | Position | Requirement |
|---|---|---|
| Safe area | 14–86% across, 13–87% down | Bear, gift heart and glowing outline fully inside |
| Bear | 20–56% across | Unchanged from the cover |
| Text zone | 52–82% across, 21–62% down | Inside the glowing heart. Calm, mid-dark magenta |
| Button zone | 58–74% across, 65–74% down | Calm, with no petals, sparkles or ribbon |
| Outside the safe area | | Only bokeh, blurred flowers, ribbon and petals |

**Save as** `cover-landscape.png`.

### E2. Square 1:1 (recompose from reference)

Input: `cover-clean.png` attached as a reference.

> Using the attached image as the exact reference for the teddy bear, the red heart with the gold bow, the props, the colors and the lighting, create a new square composition. Place the same teddy bear sitting at the bottom center, with the top of its head at about half the image height and its feet near the bottom, holding the red heart with the gold satin bow. Above the bear, float the same glowing golden heart outline made of light and sparkles, centered, spanning most of the width of the upper half, with its point just above the bear's head. Leave the inside of the heart outline empty, calm and softly lit. Place the roses, small white flowers, gift box, lantern and a few glossy floating hearts at the left and right sides and lower corners, away from the center. The outer tenth of the image on every side holds only soft bokeh, petals and blurred flowers. [Style block] [Avoid block]

Target 2048×2048:

| Zone | Position | Requirement |
|---|---|---|
| Safe area | 10–90% across, 12–88% down | Bear and heart outline fully inside |
| Heart outline | About 18–82% across, 11–51% down | Empty inside |
| Text zone | 18–82% across, 15–40% down | Calm |
| Button zone | 32–68% across, 42–49% down | Calm, inside the outline's lower part |
| Bear | 52–88% down | Face fully visible, not touching the outline |

**Save as** `cover-square.png`.

### E3. Portrait 9:16 (recompose from reference)

Input: `cover-clean.png` attached as a reference.

> Using the attached image as the exact reference for the teddy bear, the red heart with the gold bow, the props, the colors and the lighting, create a new tall vertical composition for a phone screen. Place the same teddy bear sitting in the lower part, centered, about two thirds of the image width, holding the red heart with the gold satin bow, with the top of its head a little above the lower half. Above it, the same glowing golden heart outline made of light and sparkles floats centered in the upper half, wide enough to almost touch the sides, with its point just above the bear's head. Leave the inside of the outline empty, calm and softly lit. Put a few blurred roses, small white flowers and a glossy floating heart in the top corners and along the side edges. At the bottom, the soft pink surface with rose petals, the gift box partly visible at the bottom left and the pink satin ribbon at the bottom right. The top and bottom edges hold only soft bokeh and petals. [Style block] [Avoid block]

Target 1440×2560:

| Zone | Position | Requirement |
|---|---|---|
| Safe area | 10–90% across, 15–85% down | Bear and heart outline fully inside |
| Heart outline | About 12–88% across, 14–51% down | Empty inside |
| Text zone | 14–86% across, 17–41% down | Calm |
| Button zone | 25–75% across, 43–50% down | Calm |
| Bear | 52–85% down | Face fully visible |
| Top band | 0–15% down | Nothing important. The sound icon and phone status bar sit here |

**Save as** `cover-portrait.png`.

## 4. Fallback: generate from scratch

Use these only if E1–E3 fail to keep the bear consistent. Generate the landscape first. Then generate the square and portrait using it as the reference, so all three share one bear.

Scene description, used in G1–G3:

> A plush honey-tan teddy bear with soft fluffy fur, a friendly smile, small dark eyes, rosy pink cheeks and a crimson knitted scarf, sitting and hugging a large glossy red heart-shaped gift box tied with a wide gold satin bow. Its foot pads have soft pink heart shapes. Around it: deep red and pink roses, sprigs of small white flowers, a cream gift box with a red ribbon and small red hearts, a softly glowing lantern, glossy floating red and pink hearts, scattered rose petals, a heart-shaped iced cookie, pink satin ribbons, and a large glowing golden heart outline made of light and sparkles.

- **G1, landscape 16:9:**
  > [Scene] The bear sits on the left, between 20% and 56% of the width. The glowing heart outline fills the right half, empty inside, between 46% and 86% of the width, with calm space at the bottom of its interior. Wide, soft margins on all sides. [Style block] [Avoid block]
- **G2, square:** same as E2, with "[Scene]" in place of "the attached image".
- **G3, portrait:** same as E3, with "[Scene]" in place of "the attached image".

The acceptance tables in §3 apply unchanged.

## 5. Optional supporting images

### S1. Opening heart for the calendar

Use these only if Pedro wants the 14 day hearts to look like the cover's heart (requirement X02, plan task 4.4). Otherwise keep the current drawn hearts, which Pedro likes.

> A single glossy red heart-shaped gift box with a wide gold satin bow, seen from the front at a slight three-quarter angle, centered, isolated on a transparent background. [Style block] No text, no numbers, no shadow on the ground.

Produce two matching images, 1024×1024 PNG with transparency:

| File | Variation |
|---|---|
| `heart-closed.png` | Box closed |
| `heart-open.png` | Same box, lid lifted and tilted back, the bow loosened, warm golden light and small sparkles rising from inside, nothing inside the box |

The day number and padlock are added in HTML and CSS. The locked state is the closed image desaturated, so no third image is needed.

### S2. Section background texture

> A seamless, tileable, very subtle background texture: soft blush-pink paper with faint, sparse tiny hearts and a few blurred light dots, very low contrast, suitable behind small text. [Avoid block]

1024×1024. Check that it tiles without visible seams.

## 6. Images not to generate

| Image | Why | Use instead |
|---|---|---|
| Food and recipe photos | Generated dishes would misrepresent what buyers receive | Frames from Pedro's own videos |
| Pedro's photo | It must be the real person | A photo supplied by Pedro, or none |
| Logo | Undecided (Q7), and a brand mark needs Pedro's input | Live text until decided |
| Testimonial faces | Testimonials require real people with permission | None |
| Anything from the reference seller's site or video | Analysis §7 | Original work only |
| Social share image | Not a new image | Crop of `cover-landscape` at 1200×630, text added in HTML or an editor |

## 7. Export and storage

| Master in `docs/design/source/` | Web files in `Code/assets/img/` | Width | Maximum size |
|---|---|---|---|
| `cover-landscape.png` | `cover-landscape.avif`, `.webp`, `.jpg` | 2560 and 1600 | 350 KB each |
| `cover-square.png` | `cover-square.avif`, `.webp`, `.jpg` | 2048 and 1200 | 350 KB each |
| `cover-portrait.png` | `cover-portrait.avif`, `.webp`, `.jpg` | 1440 and 1080 | 350 KB each |
| `heart-closed.png`, `heart-open.png` | `.webp` with transparency | 512 | 120 KB each |

- Remove metadata on export.
- Keep the masters out of the published site.
- Record the tool and prompt used for each master in the commit message.

Before sending anything to Pedro, put the HTML text and button on each crop and check it at the eight landing sizes in the plan's testing matrix.

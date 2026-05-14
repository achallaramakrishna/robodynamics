/**
 * Kaveri AI Tutor — Batch Image Generator & Integrator
 *
 * This script runs locally and connects directly to the official Google AI/Gemini Developer API
 * using the `imagen-3.0-generate-002` model to batch generate the premium 3D cartoon illustrations
 * for the Kaveri Kannada curriculum.
 *
 * Setup:
 * 1. Set your Gemini API Key:
 *    Windows PowerShell:  $env:GEMINI_API_KEY="AIzaSy..."
 *    Mac/Linux:           export GEMINI_API_KEY="AIzaSy..."
 * 
 * 2. Run the script:
 *    node scripts/generate-kaveri-images.js --level 1
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Retrieve Gemini API Key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;

const AESTHETIC_ANCHOR = 
  "A premium, highly-detailed 3D cartoon illustration in the iconic Disney-Pixar/claymation character style. " +
  "The image must feature rich, warm volumetric lighting, soft depth-of-field shadows, vibrant and harmonious colors, " +
  "and a clean, solid, warm light-cream background (hex #fdfbf7) with subtle depth. The design must look cozy and friendly, " +
  "with smooth clay textures, large expressive cartoon eyes, and professional 3D model rendering. No flat 2D lines, " +
  "no sketch outlines, no watermarks, and no text. Pure 3D PNG asset.";

// Image Catalog Database organized by Level
const CATALOG = {
  1: [
    { filename: "kaveri_l1_akka_a.png", prompt: "A friendly Indian elder sister with long brown hair, wearing a traditional gold and blue tunic, hugging her younger brother warmly with a joyful smile." },
    { filename: "kaveri_l1_aane_aa.png", prompt: "A cheerful, plump cartoon baby elephant with big friendly eyes, sitting down and raising its trunk playfully with a happy expression." },
    { filename: "kaveri_l1_iruve_i.png", prompt: "A cute, tiny red cartoon ant wearing a miniature blue school backpack, smiling and waving its front leg enthusiastically." },
    { filename: "kaveri_l1_eeju_ee.png", prompt: "A happy child wearing colorful swimming goggles and a red lifesaver ring, splashing around joyfully in crystal-clear blue pool water." },
    { filename: "kaveri_l1_uppu_u.png", prompt: "A cute, anthropomorphic 3D salt shaker character with big cartoon eyes, smiling and shaking a few glittery salt crystals from its top." },
    { filename: "kaveri_l1_ooru_uu.png", prompt: "A breathtaking, miniature 3D model of a charming South Indian village, featuring tiny clay huts, a small well, green coconut palms, and a winding dirt path." },
    { filename: "kaveri_l1_rushi_ri.png", prompt: "A wise, friendly old sage with a long flowing white beard and orange robes, sitting cross-legged in a peaceful meditative posture under a sacred banyan tree." },
    { filename: "kaveri_l1_ele_e.png", prompt: "A single vibrant, glossy green banana leaf with tiny realistic dewdrops sitting on its surface, catching the soft morning sunlight." },
    { filename: "kaveri_l1_eni_ae.png", prompt: "A cute wooden ladder leaning against a fluffy, pink pastel cloud under a warm, smiling sun." },
    { filename: "kaveri_l1_aidu_ai.png", prompt: "A friendly, plump cartoon hand character waving with all five fingers spread wide open, showing a small smiley face on the palm." },
    { filename: "kaveri_l1_onte_o.png", prompt: "A goofy, smiling 3D cartoon camel standing on a small dune of soft golden sand, wearing a colorful striped saddle." },
    { filename: "kaveri_l1_odu_oo.png", prompt: "A happy child in bright orange sneakers running down a grassy park hill, hair blowing in the wind, with a triumphant expression." },
    { filename: "kaveri_l1_aushadhi_au.png", prompt: "A cute 3D cartoon medicine bottle with a happy face, standing next to a small wooden spoon holding a sweet strawberry drop." }
  ],
  6: [
    { filename: "kaveri_l6_c01_l01_common_nouns.png", prompt: "A beautifully organized group of everyday cartoon items representing general objects: a book, a simple desk, a tree, and a small dog." },
    { filename: "kaveri_l6_c01_l02_proper_nouns.png", prompt: "A beautiful 3D map of India with a tiny colorful flag pinned on 'Bangalore', with a glowing star representing specific named places." },
    { filename: "kaveri_l6_c01_l03_masculine_nouns.png", prompt: "A proud, friendly cartoon king wearing a small golden crown and a blue tunic, standing next to a majestic, smiling male lion." },
    { filename: "kaveri_l6_c01_l04_feminine_nouns.png", prompt: "A friendly cartoon queen wearing a tiara and a pink gown, standing next to a beautiful, smiling lioness." },
    { filename: "kaveri_l6_c01_l05_neuter_nouns.png", prompt: "A colorful collection of non-living cartoon school objects: a wooden desk, a sharp pencil, an eraser, and a backpack." },
    { filename: "kaveri_l6_c01_l06_singular_nouns.png", prompt: "A single, massive, delicious red cartoon apple resting alone in the center of the frame." },
    { filename: "kaveri_l6_c01_l07_plural_nouns.png", prompt: "A basket overflowing with many small, shiny red apples, capturing the concept of 'many'." }
  ]
};

// Sleep function to avoid overloading API quotas (3 seconds rate-limit delay)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a single image using official Google Developer API REST endpoint
 */
function generateImage(prompt, targetPath) {
  return new Promise((resolve, reject) => {
    // Correct official REST URL for AI Studio Imagen 4
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`;
    
    // Correct official REST JSON body payload structure
    const requestData = JSON.stringify({
      instances: [
        {
          prompt: `${AESTHETIC_ANCHOR} ${prompt}`
        }
      ],
      parameters: {
        sampleCount: 1,
        personGeneration: "allow_adult",
        aspectRatio: "4:3",
        sampleImageSize: "1k"
      }
    });

    const req = https.request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestData)
      }
    }, (res) => {
      let data = "";

      res.on("data", (chunk) => { data += chunk; });

      res.on("end", () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`API Error (HTTP ${res.statusCode}): ${data}`));
        }

        try {
          const responseJson = JSON.parse(data);
          // Correct official response path for AI Studio REST predictions
          const base64Bytes = responseJson.predictions?.[0]?.bytesBase64Encoded;
          
          if (!base64Bytes) {
            return reject(new Error("No image bytes returned in predictions payload. Check safety filters or account tier."));
          }

          const imageBuffer = Buffer.from(base64Bytes, "base64");
          fs.writeFileSync(targetPath, imageBuffer);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.write(requestData);
    req.end();
  });
}

/**
 * Main Orchestrator
 */
async function main() {
  const args = process.argv.slice(2);
  const levelArgIndex = args.indexOf("--level");
  
  if (levelArgIndex === -1 || !args[levelArgIndex + 1]) {
    console.error("\x1b[31mError: Please specify a target level batch (e.g. --level 1 or --level 6)\x1b[0m");
    console.log("Usage: node scripts/generate-kaveri-images.js --level 1");
    process.exit(1);
  }

  const targetLevel = parseInt(args[levelArgIndex + 1], 10);
  const items = CATALOG[targetLevel];

  if (!items) {
    console.error(`\x1b[31mError: Level ${targetLevel} is not configured inside this generator script.\x1b[0m`);
    console.log("Available levels configured: 1, 6");
    process.exit(1);
  }

  if (!API_KEY) {
    console.error("\x1b[31mError: GEMINI_API_KEY environment variable is not defined!\x1b[0m");
    console.log("Please set it in your environment before running:");
    console.log("  Powershell: $env:GEMINI_API_KEY=\"AIzaSy...\"");
    console.log("  Bash/Zsh:   export GEMINI_API_KEY=\"AIzaSy...\"");
    process.exit(1);
  }

  // Ensure output directory exists
  const outputDir = path.join(__dirname, "..", "public", "assets", "gemini");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`\x1b[34m=== Starting Kaveri Level ${targetLevel} Asset Generation ===\x1b[0m`);
  console.log(`Total images to generate in this batch: ${items.length}\n`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const targetPath = path.join(outputDir, item.filename);

    console.log(`\x1b[36m[${i + 1}/${items.length}] Generating ${item.filename}...\x1b[0m`);
    console.log(`Prompt: "${item.prompt.substring(0, 60)}..."`);

    try {
      await generateImage(item.prompt, targetPath);
      console.log(`\x1b[32m✓ Successfully saved to public/assets/gemini/${item.filename}\x1b[0m\n`);
    } catch (err) {
      console.error(`\x1b[31m✗ Failed to generate ${item.filename}: ${err.message}\x1b[0m\n`);
    }

    // Rate-limit throttle to stay well within standard Google AI Tier-1 usage limits
    if (i < items.length - 1) {
      console.log("Sleeping for 3 seconds to avoid API limit crowding...");
      await sleep(3000);
    }
  }

  console.log(`\x1b[32m=== Level ${targetLevel} Batch Generation Completed! ===\x1b[0m`);
}

main();

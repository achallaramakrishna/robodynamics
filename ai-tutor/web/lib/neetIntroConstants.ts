export interface IntroSlide {
  slide: "explain" | "demo" | "guided";
  title: string;
  description: string;
  keyPoints: string[];
  demoSteps?: string[];
  demoSpeech?: string;
  demoStepTiming?: Array<{ step: number; startTime: number; narration: string }>;
  diagramSrc?: string;
  diagramCaption?: string;
}

export interface ChapterIntro {
  code: string;
  title: string;
  slides: IntroSlide[];
}

export const chapterIntros: Record<string, ChapterIntro> = {
  // Biology Chapters
  BIO_CELL: {
    code: "BIO_CELL",
    title: "Cell: Structure and Functions",
    slides: [
      {
        slide: "explain",
        title: "Understanding Cell Structure",
        description: "Cells are the basic unit of life. Learn how cells are organized and what structures make them work.",
        keyPoints: [
          "Cell is the smallest unit of life",
          "Two types: Prokaryotic (bacteria) and Eukaryotic (plants & animals)",
          "Each organelle has a specific function",
          "Nucleus controls cell activities",
        ],
      },
      {
        slide: "demo",
        title: "How Organelles Work Together",
        description: "Watch how different parts of the cell cooperate to keep it alive and functioning.",
        keyPoints: [
          "Nucleus stores genetic information (DNA)",
          "Mitochondria produces energy (ATP)",
          "ER synthesizes proteins and lipids",
          "Golgi packages and ships molecules",
        ],
        demoSteps: [
          "DNA in nucleus instructs the cell",
          "mRNA carries instructions to ribosomes",
          "Ribosomes build proteins",
          "Golgi packages proteins for export",
          "Proteins reach their destination",
        ],
        demoSpeech:
          "The nucleus is like the control center. It sends instructions through mRNA. Ribosomes read these instructions and build proteins. The Golgi apparatus then packages these proteins and sends them where they're needed.",
      },
      {
        slide: "guided",
        title: "Practice: Match Organelles to Functions",
        description: "Now you'll practice matching each organelle to what it does in the cell.",
        keyPoints: [
          "Identify structure → Predict function",
          "Use key characteristics to distinguish organelles",
          "Remember: Form follows function in cells",
          "You'll see questions like this on NEET",
        ],
      },
    ],
  },

  BIO_BIOMOLECULES: {
    code: "BIO_BIOMOLECULES",
    title: "Biomolecules and Life Chemistry",
    slides: [
      {
        slide: "explain",
        title: "What Are Biomolecules?",
        description: "Biomolecules are organic compounds that make up all living things.",
        keyPoints: [
          "Four main types: Carbohydrates, Lipids, Proteins, Nucleic Acids",
          "Made primarily of C, H, O, N, P, S atoms",
          "Essential for life processes",
          "Each type has different roles",
        ],
      },
      {
        slide: "demo",
        title: "Building Blocks of Life",
        description: "See how simple molecules combine to form complex biomolecules.",
        keyPoints: [
          "Monosaccharides → Polysaccharides (glucose → starch)",
          "Amino acids → Proteins (20 AAs → thousands of proteins)",
          "Nucleotides → DNA/RNA (genetic information)",
          "Fatty acids → Lipids (energy & membranes)",
        ],
        demoSteps: [
          "Simple sugars bond together",
          "Form long chains (polysaccharides)",
          "Stored as energy source (starch, glycogen)",
          "Used for structure (cellulose in plants)",
        ],
        demoSpeech:
          "Monosaccharides are simple sugars. When they link together through dehydration synthesis, they form disaccharides and polysaccharides. Starch is how plants store energy, and glycogen is how your body stores energy.",
      },
      {
        slide: "guided",
        title: "Practice: Biomolecule Properties",
        description: "Apply your knowledge to identify and describe biomolecules.",
        keyPoints: [
          "Remember: Carbs = Energy (1g = 4 kcal)",
          "Proteins = Structure & Function",
          "Lipids = Energy & Insulation (1g = 9 kcal)",
          "Nucleic Acids = Heredity",
        ],
      },
    ],
  },

  BIO_GENETICS: {
    code: "BIO_GENETICS",
    title: "Heredity and Genetics",
    slides: [
      {
        slide: "explain",
        title: "How Traits Are Inherited",
        description: "Understand how genes pass from parents to offspring using Mendel's laws.",
        keyPoints: [
          "DNA carries genetic information",
          "Genes are segments of DNA",
          "Traits follow predictable patterns",
          "Dominant and recessive alleles",
        ],
      },
      {
        slide: "demo",
        title: "Mendel's Pea Plant Experiment",
        description: "See how a simple experiment revealed the laws of inheritance.",
        keyPoints: [
          "P (Parent) generation is pure-breeding",
          "F1 generation shows dominant traits only",
          "F2 generation shows 3:1 ratio (dominant:recessive)",
          "Law of Segregation: Alleles separate in gametes",
        ],
        demoSteps: [
          "Pure tall plant × pure short plant",
          "F1 generation: All tall (heterozygous Tt)",
          "F1 self-cross: Tt × Tt",
          "F2 generation: 3 tall : 1 short",
        ],
        demoSpeech:
          "Mendel crossed tall and short peas. The first generation was all tall - showing that tall is dominant. When he self-crossed these hybrids, the short trait reappeared in 1 out of 4 plants. This 3:1 ratio proves that traits are inherited in predictable patterns.",
      },
      {
        slide: "guided",
        title: "Practice: Punnett Squares and Crosses",
        description: "Solve genetics problems using Punnett squares.",
        keyPoints: [
          "Write genotypes correctly (AA, Aa, aa)",
          "Draw Punnett square accurately",
          "Calculate phenotypic ratios",
          "Identify dominant and recessive phenotypes",
        ],
      },
    ],
  },

  BIO_HUMAN_PHYSIO: {
    code: "BIO_HUMAN_PHYSIO",
    title: "Human Physiology",
    slides: [
      {
        slide: "explain",
        title: "Body Systems and Homeostasis",
        description: "Learn how the body maintains stable internal conditions.",
        keyPoints: [
          "Homeostasis: Stable internal environment",
          "Multiple systems work together",
          "Feedback mechanisms maintain balance",
          "Normal body temp = 37°C, pH = 7.4",
        ],
      },
      {
        slide: "demo",
        title: "Temperature Regulation in Action",
        description: "See how the body responds to temperature changes.",
        keyPoints: [
          "Hypothalamus detects temperature",
          "Too hot: Sweating cools body",
          "Too cold: Shivering generates heat",
          "Negative feedback keeps temp stable",
        ],
        demoSteps: [
          "Body temp rises above 37°C",
          "Hypothalamus sends signal",
          "Sweat glands activate",
          "Evaporation cools skin",
          "Temp returns to normal",
        ],
        demoSpeech:
          "When your body gets too hot, your hypothalamus acts like a thermostat. It triggers sweat glands to release moisture. As sweat evaporates from your skin, it cools you down. When you're too cold, you shiver to generate heat. Both mechanisms are examples of negative feedback that maintain homeostasis.",
      },
      {
        slide: "guided",
        title: "Practice: Organ System Functions",
        description: "Identify which system handles which process.",
        keyPoints: [
          "Digestive: Break down and absorb food",
          "Circulatory: Transport oxygen and nutrients",
          "Respiratory: Gas exchange (O₂ ↔ CO₂)",
          "Nervous: Communication and control",
        ],
      },
    ],
  },

  BIO_ECOLOGY: {
    code: "BIO_ECOLOGY",
    title: "Ecology and Ecosystems",
    slides: [
      {
        slide: "explain",
        title: "Organisms in Their Environment",
        description: "Ecology is the study of how organisms interact with each other and their environment.",
        keyPoints: [
          "Population: All members of one species",
          "Community: All populations in an area",
          "Ecosystem: Community + environment",
          "Biosphere: All of Earth's ecosystems",
        ],
      },
      {
        slide: "demo",
        title: "Energy Flow Through Ecosystems",
        description: "Watch energy move from the sun through food chains.",
        keyPoints: [
          "Sun → Producers (plants)",
          "Producers → Primary consumers (herbivores)",
          "Primary → Secondary consumers (carnivores)",
          "10% energy rule: Only 10% transfers to next level",
        ],
        demoSteps: [
          "100 units of solar energy hit plants",
          "Plants store 10 units (10%)",
          "Herbivore eats plants, gets 1 unit",
          "Carnivore eats herbivore, gets 0.1 units",
          "Energy decreases at each step",
        ],
        demoSpeech:
          "Energy enters ecosystems as sunlight. Plants capture this energy through photosynthesis. When herbivores eat plants, they only get 10% of the plant's energy - the rest is lost as heat and used for movement and metabolism. This 10% rule continues up the food chain, which is why carnivores are always less abundant than their prey.",
      },
      {
        slide: "guided",
        title: "Practice: Food Chains and Energy",
        description: "Analyze energy flow and trophic levels.",
        keyPoints: [
          "Identify producer, consumer types",
          "Calculate energy at each level",
          "Explain why pyramids are triangular",
          "Understand carrying capacity limits",
        ],
      },
    ],
  },

  BIO_EVOLUTION: {
    code: "BIO_EVOLUTION",
    title: "Evolution and Natural Selection",
    slides: [
      {
        slide: "explain",
        title: "How Species Change Over Time",
        description: "Evolution is the gradual change in populations due to natural selection.",
        keyPoints: [
          "Variation exists within populations",
          "Better-adapted organisms survive",
          "Survivors pass genes to next generation",
          "Populations change over many generations",
        ],
      },
      {
        slide: "demo",
        title: "Peppered Moths: Evolution in Action",
        description: "Classic example of natural selection in real-world populations.",
        keyPoints: [
          "Before industrial revolution: Light moths camouflaged",
          "Dark moths were rare (visible to predators)",
          "After pollution darkened trees",
          "Dark moths now had advantage (90% by 1895)",
        ],
        demoSteps: [
          "Light-barked trees → Light moths survive",
          "Dark-barked trees (pollution) → Dark moths survive",
          "Predators eat exposed moths",
          "Survivors reproduce",
          "Population color changes",
        ],
        demoSpeech:
          "In England, the peppered moth was mostly light-colored because light moths blended with lichen on tree bark. When pollution darkened the trees, dark moths suddenly had the advantage. Predators could easily spot the light moths. Over a few generations, the population became mostly dark moths - evolution happening within decades, not millions of years.",
      },
      {
        slide: "guided",
        title: "Practice: Evidence for Evolution",
        description: "Identify evolutionary mechanisms and supporting evidence.",
        keyPoints: [
          "Fossil records show transitions",
          "Homologous structures indicate common ancestry",
          "DNA similarity shows relationships",
          "Artificial selection proves selection works",
        ],
      },
    ],
  },

  BIO_REPRODUCTION: {
    code: "BIO_REPRODUCTION",
    title: "Reproduction and Development",
    slides: [
      {
        slide: "explain",
        title: "Sexual and Asexual Reproduction",
        description: "Organisms reproduce in different ways to create new generations.",
        keyPoints: [
          "Sexual: Two parents, genetic variation",
          "Asexual: One parent, identical offspring",
          "Sexual generates diversity (evolution)",
          "Asexual is fast and efficient",
        ],
      },
      {
        slide: "demo",
        title: "Meiosis: Creating Diversity",
        description: "See how meiosis produces unique gametes.",
        keyPoints: [
          "Meiosis I: Homologous chromosomes separate (2n → n)",
          "Crossing over: Exchange genetic material",
          "Meiosis II: Sister chromatids separate",
          "Result: 4 unique haploid cells",
        ],
        demoSteps: [
          "DNA replicates (2n → 2n with 2 copies)",
          "Homologous pairs align and cross over",
          "Meiosis I: Pairs separate (2n → 2n with 1 copy)",
          "Meiosis II: Sister chromatids separate",
          "Final: 4 haploid gametes (n)",
        ],
        demoSpeech:
          "Meiosis creates gametes with half the chromosome number. During prophase I, homologous chromosomes pair up and exchange segments - this crossing over is crucial for genetic variation. Then the pairs separate, and finally sister chromatids separate, giving you four unique sperm or egg cells.",
      },
      {
        slide: "guided",
        title: "Practice: Gametogenesis and Fertilization",
        description: "Understand how gametes form and combine.",
        keyPoints: [
          "Spermatogenesis produces sperm (continuous)",
          "Oogenesis produces eggs (monthly cycle)",
          "Fertilization: Sperm + Egg (n + n → 2n)",
          "Zygote develops through mitosis",
        ],
      },
    ],
  },

  BIO_PLANT_PHYSIO: {
    code: "BIO_PLANT_PHYSIO",
    title: "Plant Physiology",
    slides: [
      {
        slide: "explain",
        title: "Photosynthesis & Plant Life Processes",
        description: "Master the science of how plants make food and respond to their environment.",
        keyPoints: [
          "Photosynthesis: Light reactions produce ATP/NADPH; Calvin cycle fixes CO₂ into glucose",
          "C3 vs C4 plants: Different CO₂ fixation pathways; C4 is more efficient in heat/drought",
          "Cellular respiration: Glycolysis (2 ATP) → Krebs cycle → ETC (~38 ATP total)",
          "Phytohormones: Auxins (growth), Gibberellins (germination), ABA (stress), Cytokinins (division)",
        ],
      },
      {
        slide: "demo",
        title: "The Complete Photosynthesis Story",
        description: "See how plants capture sunlight and convert it into the chemical energy that fuels all life.",
        keyPoints: [
          "Photolysis (water splitting) produces O₂ — the oxygen you breathe comes from water, not CO₂! 💡",
          "Z-scheme: PS II → electron transport → PS I → NADPH formation",
          "Cyclic photophosphorylation: Only PS I, produces only ATP (no O₂, no NADPH)",
          "Calvin cycle (dark reactions): CO₂ + RuBP → 3-PG → glucose in the stroma",
          "C3 plants (wheat, rice): RuBisCO fixes CO₂ directly to RuBP in all cells",
          "C4 plants (maize, sugarcane): PEP carboxylase fixes CO₂ in mesophyll → OAA in bundle sheath (no photorespiration!)",
        ],
        demoSteps: [
          "Step 1: Sunlight excites chlorophyll in Photosystem II (thylakoid membrane)",
          "Step 2: Water molecules split (photolysis): 2H₂O → 4H⁺ + 4e⁻ + O₂ (oxygen released!)",
          "Step 3: Electrons travel through cytochrome b6f complex (Z-scheme path)",
          "Step 4: Energy charges Photosystem I → electrons reduce NADP⁺ to NADPH",
          "Step 5: Proton gradient drives ATP synthase → ATP production",
          "Step 6: ATP + NADPH power the Calvin cycle in stroma",
          "Step 7: CO₂ + RuBP → 3-phosphoglycerate → glucose molecule formed",
        ],
        demoSpeech:
          "Listen carefully—this is CRITICAL for NEET. In the light reactions, water splits to release oxygen. That oxygen you're breathing? It came from water photolysis, not from CO₂. The electrons travel the Z-scheme—PS II to cytochrome complex to PS I. This journey pumps protons to create an energy gradient, like water behind a dam. ATP synthase is the turbine that uses this gradient to make ATP. Meanwhile, PS I reduces NADP⁺ to NADPH. These two energy molecules—ATP and NADPH—then fuel the Calvin cycle in the stroma, where CO₂ is fixed into glucose. C4 plants are smarter: they use PEP carboxylase first, which has higher CO₂ affinity, avoiding photorespiration. That's why C4 plants thrive in hot, dry climates.",
        demoStepTiming: [
          { step: 1, startTime: 0, narration: "Photosystem II in thylakoid membrane captures light energy" },
          { step: 2, startTime: 3, narration: "Water molecules split (photolysis): 2H₂O → 4H⁺ + 4e⁻ + O₂" },
          { step: 3, startTime: 10, narration: "Electrons travel Z-scheme path through cytochrome b6f complex" },
          { step: 4, startTime: 20, narration: "Photosystem I reduces NADP⁺ to form NADPH" },
          { step: 5, startTime: 18, narration: "Proton gradient drives ATP synthase → ATP production" },
          { step: 6, startTime: 32, narration: "ATP + NADPH power the Calvin cycle in stroma" },
          { step: 7, startTime: 40, narration: "CO₂ + RuBP → glucose via Calvin cycle" },
        ],
        diagramSrc: "/neet/diagrams/photosynthesis.svg",
        diagramCaption: "Z-Scheme of Photosynthesis: PS II (P680) → PQ → Cyt b6f → PC → PS I (P700) → Fd → NADP reductase → NADPH | Thylakoid lumen accumulates H⁺ for ATP synthase | Stroma: Calvin cycle fixes CO₂ into glucose",
      },
      {
        slide: "guided",
        title: "Practice: Photosynthesis & Hormones",
        description: "Test your understanding with NEET-style questions.",
        keyPoints: [
          "C4 CO₂ acceptor in mesophyll: PEP (not RuBP); first product: OAA (not 3-PG)",
          "Cyclic photophosphorylation: Only ATP, no NADPH, no O₂ (PS I only)",
          "ABA = stress hormone: closes stomata in drought, promotes seed dormancy",
          "Gibberellins promote growth & seed germination; Auxins promote elongation & apical dominance",
        ],
      },
    ],
  },

  BIO_HUMAN_WELFARE: {
    code: "BIO_HUMAN_WELFARE",
    title: "Human Health and Disease",
    slides: [
      {
        slide: "explain",
        title: "Staying Healthy and Fighting Disease",
        description: "Learn how the body defends itself against pathogens.",
        keyPoints: [
          "Immune system protects against infection",
          "Innate immunity: First response",
          "Adaptive immunity: Specific targeting",
          "Vaccines train immune system",
        ],
      },
      {
        slide: "demo",
        title: "Immune Response to Infection",
        description: "See how the body fights off invaders step by step.",
        keyPoints: [
          "Pathogen enters → Innate immunity responds",
          "Phagocytes engulf invaders",
          "Antigen presented to T cells",
          "B cells produce antibodies",
        ],
        demoSteps: [
          "Virus enters body",
          "Innate defenses (skin, tears, mucus) fail",
          "Macrophages engulf virus",
          "Present antigen to T cells",
          "B cells produce specific antibodies",
        ],
        demoSpeech:
          "When a pathogen enters your body, your immune system springs into action. First, innate defenses like your skin and mucus try to stop it. If it gets through, macrophages engulf it and present pieces to T cells. T cells then activate B cells, which mass-produce antibodies tailored to attack that specific invader.",
      },
      {
        slide: "guided",
        title: "Practice: Disease and Immunity",
        description: "Apply immunity concepts to real diseases.",
        keyPoints: [
          "Antibiotics kill bacteria (not viruses)",
          "Vaccines activate adaptive immunity",
          "Allergies: Immune overreaction",
          "Autoimmune: Immune attacks self",
        ],
      },
    ],
  },

  BIO_BIOTECHNOLOGY: {
    code: "BIO_BIOTECHNOLOGY",
    title: "Biotechnology and Genetic Engineering",
    slides: [
      {
        slide: "explain",
        title: "Modifying Genes to Help Humans",
        description: "Biotechnology uses biology to solve problems and improve lives.",
        keyPoints: [
          "Recombinant DNA: Combining genes from different organisms",
          "PCR: Copying specific DNA sequences",
          "Gel electrophoresis: Separating DNA by size",
          "Gene therapy: Fixing defective genes",
        ],
      },
      {
        slide: "demo",
        title: "Creating GMOs Step by Step",
        description: "Watch how scientists create genetically modified organisms.",
        keyPoints: [
          "Isolate desired gene from source organism",
          "Cut DNA with restriction enzymes",
          "Insert into plasmid (circular bacterial DNA)",
          "Transform bacteria with new plasmid",
        ],
        demoSteps: [
          "Source DNA: Gene for disease resistance",
          "Restriction enzyme: Cuts at specific sequences",
          "Plasmid: Circular vector cut with same enzyme",
          "Ligase: Seals new gene into plasmid",
          "Transform: Plasmid enters bacteria/plant",
        ],
        demoSpeech:
          "To create a GMO, scientists first find a useful gene - maybe resistance to a disease. They use restriction enzymes as molecular scissors to cut the gene out and also cut a plasmid at compatible ends. The gene and plasmid are mixed with DNA ligase, which acts like molecular glue, sealing them together. This recombinant plasmid is then inserted into cells, which now have the new trait.",
      },
      {
        slide: "guided",
        title: "Practice: Biotech Applications",
        description: "Understand uses and implications of biotechnology.",
        keyPoints: [
          "Insulin production in bacteria",
          "Crop improvement and yield",
          "Medical diagnostics",
          "Ethical considerations of gene editing",
        ],
      },
    ],
  },

  BIO_STRUCTURAL_ORG: {
    code: "BIO_STRUCTURAL_ORG",
    title: "Structural Organization in Animals",
    slides: [
      {
        slide: "explain",
        title: "From Cells to Organisms",
        description: "Understand how cells organize into tissues, organs, and systems.",
        keyPoints: [
          "Cells → Tissues → Organs → Organ Systems",
          "Each tissue type has specific functions",
          "Organs combine tissues for complex tasks",
          "Systems coordinate whole-body functions",
        ],
      },
      {
        slide: "demo",
        title: "Building the Circulatory System",
        description: "See how different tissues combine into a functioning system.",
        keyPoints: [
          "Epithelial tissue: Lines blood vessels",
          "Muscle tissue: Heart pumps blood",
          "Connective tissue: Supports structure",
          "Nervous tissue: Regulates heart rate",
        ],
        demoSteps: [
          "Epithelial cells form vessel walls",
          "Smooth muscle contracts to move blood",
          "Connective tissue provides support",
          "Nerves sense oxygen levels",
          "Heart beats in coordinated pattern",
        ],
        demoSpeech:
          "The circulatory system shows perfect integration of different tissues. The inner lining is epithelial tissue that allows nutrient exchange. Surrounding it is muscle tissue that contracts to push blood forward. Connective tissue holds everything together, and nerves coordinate the pumping action. No single tissue type could do the job alone.",
      },
      {
        slide: "guided",
        title: "Practice: Tissue Types and Functions",
        description: "Match tissues to locations and functions.",
        keyPoints: [
          "Epithelial: Protection, absorption, secretion",
          "Connective: Support, insulation, energy storage",
          "Muscle: Movement (skeletal, smooth, cardiac)",
          "Nervous: Communication and control",
        ],
      },
    ],
  },

  BIO_CELL_BIOLOGY: {
    code: "BIO_CELL_BIOLOGY",
    title: "Cell Division and Cell Cycle",
    slides: [
      {
        slide: "explain",
        title: "How Cells Divide and Multiply",
        description: "The cell cycle controls cell division for growth and repair.",
        keyPoints: [
          "Interphase: Cell grows and DNA replicates",
          "Mitosis: Chromosomes divide equally",
          "Cytokinesis: Cytoplasm divides",
          "Result: 2 identical daughter cells",
        ],
      },
      {
        slide: "demo",
        title: "The Mitotic Process",
        description: "Watch a cell go through mitosis step by step.",
        keyPoints: [
          "Prophase: Chromosomes condense, spindle forms",
          "Metaphase: Chromosomes align at center",
          "Anaphase: Sister chromatids separate",
          "Telophase: Nuclear envelopes reform",
        ],
        demoSteps: [
          "DNA condenses into visible chromosomes",
          "Spindle fibers attach at centromeres",
          "Chromosomes line up at metaphase plate",
          "Spindle fibers pull chromatids apart",
          "Nuclear envelopes form around separated chromosomes",
        ],
        demoSpeech:
          "In prophase, the chromosomes become visible and the spindle fibers begin organizing. By metaphase, the chromosomes are lined up perfectly at the cell's equator. Then in anaphase, the spindle fibers pull the sister chromatids apart and drag them to opposite poles. Finally in telophase, new nuclear envelopes form around the separated chromosomes.",
      },
      {
        slide: "guided",
        title: "Practice: Cell Cycle Regulation",
        description: "Understand checkpoints and controls.",
        keyPoints: [
          "G1 checkpoint: Cell ready to synthesize DNA?",
          "G2 checkpoint: DNA replicated correctly?",
          "M checkpoint: All chromosomes attached?",
          "Uncontrolled division → Cancer",
        ],
      },
    ],
  },

  BIO_DIVERSITY: {
    code: "BIO_DIVERSITY",
    title: "Biological Classification and Diversity",
    slides: [
      {
        slide: "explain",
        title: "Organizing Life's Diversity",
        description: "Scientists organize millions of species using classification systems.",
        keyPoints: [
          "Taxonomy: System for classifying organisms",
          "Seven levels: Kingdom → Phylum → ... → Species",
          "Binomial nomenclature: Genus + species",
          "Species: Can interbreed and produce fertile offspring",
        ],
      },
      {
        slide: "demo",
        title: "Classifying a Lion",
        description: "See how scientists classify a specific animal.",
        keyPoints: [
          "Kingdom: Animalia (eats other organisms)",
          "Phylum: Chordata (backbone present)",
          "Class: Mammalia (hair, warm-blooded)",
          "Order: Carnivora (carnivorous teeth)",
          "Family: Felidae (cat family)",
          "Genus: Panthera (big cats)",
          "Species: leo (lion)",
        ],
        demoSteps: [
          "Observe characteristics of the organism",
          "Does it have a backbone? → Yes → Chordata",
          "Does it have fur and produce milk? → Yes → Mammalia",
          "What teeth does it have? → Carnassials → Carnivora",
          "What body structure? → Panthera leo",
        ],
        demoSpeech:
          "To classify an organism, we start with broad categories and narrow down. All animals have these characteristics, so Kingdom Animalia. Lions have backbones, making them Chordata. They have hair and nurse their young, so Mammalia. Their specialized carnivorous teeth put them in Carnivora. The cat family is Felidae, and lions specifically are Panthera leo - that's their scientific name.",
      },
      {
        slide: "guided",
        title: "Practice: Classification Keys",
        description: "Use identification keys to classify organisms.",
        keyPoints: [
          "Dichotomous keys: Yes/No questions",
          "Each answer narrows possibilities",
          "End with specific identification",
          "Works for any kingdom of life",
        ],
      },
    ],
  },

  // Physics Chapters
  PHY_KINEMATICS: {
    code: "PHY_KINEMATICS",
    title: "Motion in One and Two Dimensions",
    slides: [
      {
        slide: "explain",
        title: "Understanding Motion",
        description: "Kinematics describes how objects move without considering forces.",
        keyPoints: [
          "Displacement ≠ Distance",
          "Velocity = Rate of change of position",
          "Acceleration = Rate of change of velocity",
          "Use kinematic equations for predictions",
        ],
      },
      {
        slide: "demo",
        title: "A Ball in Free Fall",
        description: "See how gravity affects a falling object.",
        keyPoints: [
          "Initial velocity = 0",
          "Acceleration = g = 9.8 m/s² (downward)",
          "Velocity increases linearly: v = gt",
          "Distance increases as t²: s = ½gt²",
        ],
        demoSteps: [
          "Ball released from rest",
          "After 1s: v = 9.8 m/s, distance = 4.9 m",
          "After 2s: v = 19.6 m/s, distance = 19.6 m",
          "Notice: Distance quadruples when time doubles",
        ],
        demoSpeech:
          "When you drop a ball, gravity pulls it down. It starts with zero velocity but gains speed each second - 9.8 m/s after 1 second, 19.6 m/s after 2 seconds. The distance fallen follows a different pattern. In the first second it falls 4.9 meters, but in the second second it falls an additional 14.7 meters. The distance increases with the square of time.",
      },
      {
        slide: "guided",
        title: "Practice: Solving Motion Problems",
        description: "Use kinematic equations to solve real problems.",
        keyPoints: [
          "v = u + at (velocity)",
          "s = ut + ½at² (displacement)",
          "v² = u² + 2as (energy connection)",
          "Choose equation based on known/unknown",
        ],
      },
    ],
  },

  PHY_LAWS_MOTION: {
    code: "PHY_LAWS_MOTION",
    title: "Newton's Laws of Motion",
    slides: [
      {
        slide: "explain",
        title: "Forces and Motion",
        description: "Newton's laws explain why objects move the way they do.",
        keyPoints: [
          "First Law: Objects at rest stay at rest unless acted upon",
          "Second Law: F = ma (Force causes acceleration)",
          "Third Law: Every action has equal opposite reaction",
        ],
      },
      {
        slide: "demo",
        title: "Demonstrating Newton's Laws",
        description: "Real examples of Newton's laws in action.",
        keyPoints: [
          "Law 1: A book slides and stops (friction is force)",
          "Law 2: Harder push = Greater acceleration",
          "Law 3: Rocket exhaust pushed down → Rocket pushed up",
        ],
        demoSteps: [
          "Law 1: Inertia - object continues motion",
          "Law 2: Same force on heavier object = less acceleration",
          "Law 3: When you jump, Earth recoils (too small to notice)",
        ],
        demoSpeech:
          "Newton's first law says objects want to keep doing what they're doing. An object at rest stays at rest. An object in motion stays in motion. The second law quantifies how forces change motion: F = ma. The third law is subtle but profound: forces always come in pairs. When you sit in a chair, you push down and the chair pushes up with equal force.",
      },
      {
        slide: "guided",
        title: "Practice: Free Body Diagrams",
        description: "Analyze forces and predict motion.",
        keyPoints: [
          "Draw all forces acting on object",
          "Find net force (vector sum)",
          "Apply F = ma to find acceleration",
          "Consider friction and normal forces",
        ],
      },
    ],
  },

  PHY_WORK_ENERGY: {
    code: "PHY_WORK_ENERGY",
    title: "Work, Energy, and Power",
    slides: [
      {
        slide: "explain",
        title: "Energy and Its Transformations",
        description: "Energy is conserved and transforms between forms.",
        keyPoints: [
          "Work = Force × Displacement × cos(θ)",
          "Kinetic energy = ½mv² (energy of motion)",
          "Potential energy = mgh (stored energy)",
          "Power = Work / Time",
        ],
      },
      {
        slide: "demo",
        title: "Energy Transformations",
        description: "Watch energy change forms while staying constant.",
        keyPoints: [
          "At top: All potential energy (PE = mgh)",
          "At bottom: All kinetic energy (KE = ½mv²)",
          "During fall: PE converts to KE",
          "Total energy = PE + KE = constant",
        ],
        demoSteps: [
          "Ball at height h: PE = mgh, KE = 0",
          "Halfway down: PE and KE both present",
          "At ground: PE = 0, KE = mgh",
          "Using v² = 2gh confirms energy conservation",
        ],
        demoSpeech:
          "Imagine dropping a ball from a height. At the top, it has gravitational potential energy stored because of its position. As it falls, that potential energy converts into kinetic energy - the energy of motion. At any moment, the total energy is the same. The mechanical energy of an object stays constant if no non-conservative forces like air resistance are acting.",
      },
      {
        slide: "guided",
        title: "Practice: Energy Problems",
        description: "Apply conservation of energy to solve problems.",
        keyPoints: [
          "Identify initial and final states",
          "Account for all energy forms",
          "Consider non-conservative forces",
          "Calculate power as energy transfer rate",
        ],
      },
    ],
  },

  PHY_ROTATIONAL: {
    code: "PHY_ROTATIONAL",
    title: "Rotational Motion and Momentum",
    slides: [
      {
        slide: "explain",
        title: "Objects Spinning and Orbiting",
        description: "Rotational motion follows principles similar to linear motion.",
        keyPoints: [
          "Angular velocity (ω): Rotation rate",
          "Moment of inertia (I): Rotational mass",
          "Torque (τ): Rotational force",
          "Angular momentum (L = Iω): Conserved",
        ],
      },
      {
        slide: "demo",
        title: "Conservation of Angular Momentum",
        description: "See why spinning objects resist changes in rotation.",
        keyPoints: [
          "Ice skater pulls arms in → Spins faster",
          "Angular momentum L = Iω stays constant",
          "I decreases → ω must increase",
          "No external torque needed",
        ],
        demoSteps: [
          "Skater spinning with arms out: Large I, slow ω",
          "Pulls arms in: I decreases",
          "Spin rate increases to conserve L",
          "Extends arms: Slows down again",
        ],
        demoSpeech:
          "Angular momentum is like the rotational version of linear momentum - it's conserved. When an ice skater pulls their arms in, their moment of inertia decreases but their angular momentum stays the same, so they must spin faster. It's like a ball rolling on ice speeding up when it enters a narrower channel - the total 'motion' is conserved.",
      },
      {
        slide: "guided",
        title: "Practice: Calculating Rotation",
        description: "Solve rotational motion problems.",
        keyPoints: [
          "τ = Iα (angular Newton's second law)",
          "L = Iω (angular momentum)",
          "Use parallel-axis theorem for I",
          "Relate linear and angular quantities",
        ],
      },
    ],
  },

  PHY_GRAVITATION: {
    code: "PHY_GRAVITATION",
    title: "Gravitation",
    slides: [
      {
        slide: "explain",
        title: "Why Objects Fall and Orbits Exist",
        description: "Gravity is the force that attracts all massive objects.",
        keyPoints: [
          "Newton's Law: F = GMm/r² (inverse square law)",
          "g = GM/r² (gravitational field strength)",
          "Escape velocity: v_e = √(2GM/r)",
          "Orbital mechanics: Circular orbits, ellipses",
        ],
      },
      {
        slide: "demo",
        title: "Planetary Orbits",
        description: "Understand why planets orbit in ellipses.",
        keyPoints: [
          "Gravity provides centripetal force",
          "F = mv²/r = GMm/r²",
          "Orbital velocity v = √(GM/r)",
          "Closer to sun: Faster orbit",
        ],
        demoSteps: [
          "Planet has tangential velocity",
          "Gravity pulls it toward sun",
          "Combined motion creates ellipse",
          "At perihelion (closest): Fastest",
          "At aphelion (farthest): Slowest",
        ],
        demoSpeech:
          "A planet stays in orbit because gravity provides exactly the right amount of centripetal force. If gravity were stronger, the planet would spiral in. If it were weaker, the planet would fly away. At the perfect balance, the planet maintains a stable orbit. When the planet is closer to the sun, gravity is stronger so it moves faster. When it's farther, gravity is weaker and it moves slower.",
      },
      {
        slide: "guided",
        title: "Practice: Orbital Problems",
        description: "Calculate orbital velocities and escape speeds.",
        keyPoints: [
          "Find orbital velocity for given altitude",
          "Calculate escape velocity from a planet",
          "Determine orbital period (Kepler's law)",
          "Relate planetary properties to gravity",
        ],
      },
    ],
  },

  PHY_MECHANICS: {
    code: "PHY_MECHANICS",
    title: "Elasticity and Fluids",
    slides: [
      {
        slide: "explain",
        title: "How Materials Deform and Fluids Flow",
        description: "Materials respond to stress in predictable ways.",
        keyPoints: [
          "Stress: Force applied; Strain: Deformation",
          "Young's modulus: Material stiffness",
          "Pressure = Force / Area",
          "Buoyancy: Objects displace fluid",
        ],
      },
      {
        slide: "demo",
        title: "Pressure Under Water",
        description: "See why pressure increases with depth.",
        keyPoints: [
          "Pressure = Atmospheric + Hydrostatic",
          "P_hydrostatic = ρgh (depends on depth)",
          "Pressure acts in all directions",
          "Fish don't feel pressure difference",
        ],
        demoSteps: [
          "At surface: Only atmospheric pressure",
          "At 10m depth: Added 1 atm of water pressure",
          "At 20m depth: Added 2 atm of water pressure",
          "Pressure increases linearly with depth",
        ],
        demoSpeech:
          "The deeper you go in water, the more pressure you experience. This isn't because water gets heavier - it's because there's more water above you pressing down. Every 10 meters of water adds about 1 atmosphere of pressure. The pressure acts equally in all directions, which is why submarines can be spherical - the pressure pushes inward equally everywhere.",
      },
      {
        slide: "guided",
        title: "Practice: Material Properties",
        description: "Apply stress-strain relationships.",
        keyPoints: [
          "Calculate stress and strain",
          "Use Young's modulus to find deformation",
          "Apply Hooke's law: F = kx",
          "Understand plastic vs elastic deformation",
        ],
      },
    ],
  },

  PHY_OPTICS: {
    code: "PHY_OPTICS",
    title: "Light and Optics",
    slides: [
      {
        slide: "explain",
        title: "How Light Bends and Focuses",
        description: "Optics explains how lenses and mirrors manipulate light.",
        keyPoints: [
          "Refraction: Light bends when entering different medium",
          "Snell's Law: n₁ sin θ₁ = n₂ sin θ₂",
          "Lens equation: 1/f = 1/u + 1/v",
          "Magnification: m = v/u = h'/h",
        ],
      },
      {
        slide: "demo",
        title: "How a Lens Works",
        description: "Watch light rays refract through a lens.",
        keyPoints: [
          "Parallel rays → Converge at focal point (convex)",
          "Convex lens: Positive focal length, real images",
          "Concave lens: Negative focal length, virtual images",
          "Ray tracing: 3 key rays determine image",
        ],
        demoSteps: [
          "Ray parallel to axis → Refracts through focal point",
          "Ray through center → Passes straight through",
          "Ray through focal point → Emerges parallel",
          "All rays meet at image location",
        ],
        demoSpeech:
          "When light enters a lens, it refracts at both surfaces. In a convex lens, the curved surfaces bend light rays together so they converge at a point called the focal point. This is why magnifying glasses work - they concentrate light. In a concave lens, the surfaces bend light outward, so the rays never actually meet. By tracing just three special rays, you can find exactly where an image forms.",
      },
      {
        slide: "guided",
        title: "Practice: Image Formation",
        description: "Predict image properties using ray diagrams.",
        keyPoints: [
          "Real vs virtual images",
          "Magnified vs diminished",
          "Upright vs inverted",
          "Use lens formula to solve problems",
        ],
      },
    ],
  },

  PHY_WAVES: {
    code: "PHY_WAVES",
    title: "Waves and Sound",
    slides: [
      {
        slide: "explain",
        title: "Oscillations That Travel",
        description: "Waves transfer energy without transferring matter.",
        keyPoints: [
          "Wavelength (λ): Distance between peaks",
          "Frequency (f): Oscillations per second",
          "Wave velocity: v = fλ",
          "Interference: Constructive and destructive",
        ],
      },
      {
        slide: "demo",
        title: "Wave Interference",
        description: "See how two waves combine.",
        keyPoints: [
          "Constructive: Peaks align → Larger wave",
          "Destructive: Peak meets trough → Cancellation",
          "Path difference determines interference",
          "Used in noise-canceling headphones",
        ],
        demoSteps: [
          "Two identical waves in phase",
          "Crest + Crest = Double amplitude",
          "Crest + Trough = Zero amplitude",
          "Partial alignment = Partial cancellation",
        ],
        demoSpeech:
          "When two waves overlap, they can either amplify each other or cancel each other out. If the peaks arrive at the same time, they add together - constructive interference. If a peak from one wave arrives at the same time as a trough from another, they cancel out - destructive interference. This principle is used in noise-canceling headphones, which emit inverse sound waves to cancel unwanted noise.",
      },
      {
        slide: "guided",
        title: "Practice: Wave Problems",
        description: "Calculate wavelength, frequency, and velocity.",
        keyPoints: [
          "Doppler effect: f' = f(v ± v_observer)/(v ± v_source)",
          "Standing waves: Nodes and antinodes",
          "Resonance: Frequency match amplifies waves",
          "Diffraction: Waves bend around obstacles",
        ],
      },
    ],
  },

  PHY_ELECTROSTATICS: {
    code: "PHY_ELECTROSTATICS",
    title: "Electric Charges and Fields",
    slides: [
      {
        slide: "explain",
        title: "Understanding Electric Forces",
        description: "Charged particles exert forces on each other.",
        keyPoints: [
          "Coulomb's Law: F = kQq/r²",
          "Electric field: E = F/q",
          "Potential: V = W/q (energy per charge)",
          "Gauss's Law: Relates charge to field",
        ],
      },
      {
        slide: "demo",
        title: "Electric Field Around a Charge",
        description: "Visualize how charges create fields.",
        keyPoints: [
          "Positive charge: Field lines point outward",
          "Negative charge: Field lines point inward",
          "Field strength decreases with distance",
          "Parallel field lines: Uniform field",
        ],
        demoSteps: [
          "Place positive charge at origin",
          "Draw radial lines pointing outward",
          "Density of lines shows field strength",
          "Field strong near charge, weak far away",
        ],
        demoSpeech:
          "The electric field around a charge is strongest right next to the charge and gets weaker as you move away. Around a positive charge, the field points outward - like the charge is repelling test charges. Around a negative charge, the field points inward - like it's attracting test charges. The field strength follows an inverse square law, just like gravity.",
      },
      {
        slide: "guided",
        title: "Practice: Electrostatics Calculations",
        description: "Solve problems with Coulomb's law and fields.",
        keyPoints: [
          "Calculate force between charges",
          "Find electric field at a point",
          "Calculate potential difference",
          "Use superposition for multiple charges",
        ],
      },
    ],
  },

  PHY_CURRENT_ELECTRICITY: {
    code: "PHY_CURRENT_ELECTRICITY",
    title: "Electric Current and Circuits",
    slides: [
      {
        slide: "explain",
        title: "Charge Flow and Resistance",
        description: "Electric current is the flow of charge through conductors.",
        keyPoints: [
          "Current I = Q/t (charge per time)",
          "Resistance R = ρL/A (depends on material)",
          "Ohm's Law: V = IR",
          "Power P = VI = I²R = V²/R",
        ],
      },
      {
        slide: "demo",
        title: "Simple DC Circuit",
        description: "Watch current flow through a circuit.",
        keyPoints: [
          "Battery pushes electrons through wire",
          "Conventional current: + to - (opposite electron flow)",
          "Resistance slows charge movement",
          "Bright bulb: High power (V² / R)",
        ],
        demoSteps: [
          "Battery creates potential difference",
          "Electrons pushed from negative terminal",
          "Flow through wire to positive terminal",
          "Collisions with atoms release heat/light",
        ],
        demoSpeech:
          "In a circuit, the battery acts like a pump pushing electrons through the wire. Electrons actually flow from negative to positive, but we define conventional current as positive to negative for historical reasons. The resistance of the wire slows down the flow of electrons. More resistance means less current for the same voltage, like a narrower pipe carrying less water.",
      },
      {
        slide: "guided",
        title: "Practice: Circuit Analysis",
        description: "Analyze series and parallel circuits.",
        keyPoints: [
          "Series: Same current, voltages add",
          "Parallel: Same voltage, currents add",
          "Equivalent resistance: R_eq = 1/(1/R₁ + 1/R₂ + ...)",
          "Kirchhoff's laws: Current and voltage rules",
        ],
      },
    ],
  },

  PHY_MAGNETISM: {
    code: "PHY_MAGNETISM",
    title: "Magnetic Fields and Forces",
    slides: [
      {
        slide: "explain",
        title: "Magnets and Moving Charges",
        description: "Magnetic fields are created by moving charges.",
        keyPoints: [
          "Magnetic field: Direction shown by field lines",
          "Lorentz force: F = qv × B (perpendicular to motion)",
          "Current-carrying wires create magnetic field",
          "Solenoid: Coiled wire creates uniform field",
        ],
      },
      {
        slide: "demo",
        title: "Motor Effect",
        description: "See how a current-carrying wire moves in a magnetic field.",
        keyPoints: [
          "Current flows through wire",
          "Magnetic field perpendicular to wire",
          "Force F = BIL (along wire)",
          "Direction by right-hand rule",
        ],
        demoSteps: [
          "Current through horizontal wire (right)",
          "Magnetic field perpendicular (into page)",
          "Force perpendicular to both (upward)",
          "Wire experiences mechanical force",
        ],
        demoSpeech:
          "This is the motor effect - the basis of electric motors. When current flows through a wire in a magnetic field, the field exerts a force on the moving charges. Using the right-hand rule: point your fingers in the direction of current, curl them toward the magnetic field direction, and your thumb points in the direction of force. This force can make the wire move.",
      },
      {
        slide: "guided",
        title: "Practice: Magnetic Force Problems",
        description: "Calculate forces on charged particles and currents.",
        keyPoints: [
          "Radius of circular motion: r = mv/(qB)",
          "Period of orbit: T = 2πm/(qB)",
          "Torque on coil: τ = NABI sin θ",
          "Hall effect: Voltage due to magnetic field",
        ],
      },
    ],
  },

  PHY_DUAL_NATURE: {
    code: "PHY_DUAL_NATURE",
    title: "Dual Nature of Light and Matter",
    slides: [
      {
        slide: "explain",
        title: "Particles and Waves",
        description: "Light and matter exhibit both particle and wave properties.",
        keyPoints: [
          "Photons: Light as particles (E = hf)",
          "De Broglie wavelength: λ = h/p",
          "Wave-particle duality",
          "Photoelectric effect: Light ejects electrons",
        ],
      },
      {
        slide: "demo",
        title: "Photoelectric Effect",
        description: "See how light energy releases electrons from metal.",
        keyPoints: [
          "UV light → Electrons ejected",
          "Red light → No ejection (threshold)",
          "KE_max = hf - W (work function W)",
          "Photon energy must exceed work function",
        ],
        demoSteps: [
          "Low frequency light: No photoelectrons",
          "Increase to threshold frequency",
          "Electrons start being ejected",
          "Higher frequency: Faster electrons",
        ],
        demoSpeech:
          "Einstein's photoelectric effect shows light is quantized - it comes in packets called photons. Each photon carries energy proportional to its frequency. If a photon has enough energy, it can knock an electron free from a metal. The energy goes into escaping the metal and kinetic energy of the electron. This phenomenon revolutionized physics because it showed light behaves as particles, not just waves.",
      },
      {
        slide: "guided",
        title: "Practice: Quantum Effects",
        description: "Apply photon energy and De Broglie relations.",
        keyPoints: [
          "Calculate photon energy E = hf",
          "Find De Broglie wavelength λ = h/p",
          "Solve photoelectric effect problems",
          "Relate frequency to stopping potential",
        ],
      },
    ],
  },

  PHY_MODERN_PHYSICS: {
    code: "PHY_MODERN_PHYSICS",
    title: "Atomic and Nuclear Physics",
    slides: [
      {
        slide: "explain",
        title: "Atoms and Nuclei",
        description: "Modern physics reveals the structure of atoms and nuclei.",
        keyPoints: [
          "Rutherford model: Nucleus at center",
          "Bohr model: Quantized energy levels",
          "Nuclear forces: Strong and weak",
          "Radioactivity: Spontaneous decay",
        ],
      },
      {
        slide: "demo",
        title: "Bohr's Hydrogen Atom",
        description: "Watch electrons transition between energy levels.",
        keyPoints: [
          "Electron confined to discrete orbits",
          "Energy: E_n = -13.6/n² eV",
          "Absorption: Jump to higher level",
          "Emission: Drop to lower level (photon released)",
        ],
        demoSteps: [
          "Electron in ground state (n=1)",
          "Absorb energy → Jump to n=2",
          "Unstable → Returns to n=1",
          "Emits photon with specific frequency",
        ],
        demoSpeech:
          "In Bohr's model, electrons don't orbit randomly - they occupy specific energy levels. An electron can only jump between levels if it gains or loses exactly the right amount of energy. When it falls from a higher level to a lower one, it emits a photon. The frequency of this photon matches the energy difference. This explains the discrete lines in hydrogen's spectrum.",
      },
      {
        slide: "guided",
        title: "Practice: Atomic and Nuclear Problems",
        description: "Calculate energy transitions and decay rates.",
        keyPoints: [
          "Calculate photon frequency from energy difference",
          "Use Rydberg formula for hydrogen transitions",
          "Half-life problems: N(t) = N₀(1/2)^(t/T)",
          "Mass defect and binding energy",
        ],
      },
    ],
  },

  PHY_SEMICONDUCTOR: {
    code: "PHY_SEMICONDUCTOR",
    title: "Semiconductor Electronics",
    slides: [
      {
        slide: "explain",
        title: "Controlling Electron Flow",
        description: "Semiconductors enable modern electronics.",
        keyPoints: [
          "Intrinsic vs doped semiconductors",
          "P-type: Positive charge carriers (holes)",
          "N-type: Negative charge carriers (electrons)",
          "Diodes and transistors: Based on P-N junctions",
        ],
      },
      {
        slide: "demo",
        title: "P-N Junction Behavior",
        description: "See how P-N junctions control current.",
        keyPoints: [
          "Forward bias: Low resistance, current flows",
          "Reverse bias: High resistance, no current",
          "Barrier potential: ~0.7V for silicon",
          "Depletion region widens with reverse bias",
        ],
        demoSteps: [
          "P-side negative, N-side positive (reverse)",
          "Barrier increases, no current",
          "P-side positive, N-side negative (forward)",
          "Barrier decreases, current flows",
        ],
        demoSpeech:
          "A P-N junction is like a one-way valve for electrons. In reverse bias, the electric field strengthens the barrier between the two sides, so electrons can't cross - no current flows. In forward bias, the external voltage opposes the barrier, making it easier for electrons to cross. The junction conducts in one direction - that's how diodes work.",
      },
      {
        slide: "guided",
        title: "Practice: Semiconductor Circuits",
        description: "Analyze diode and transistor behavior.",
        keyPoints: [
          "I-V characteristics of diodes",
          "Rectification: Converting AC to DC",
          "Transistor as amplifier or switch",
          "Logic gates: AND, OR, NOT",
        ],
      },
    ],
  },
};

export function getChapterIntro(chapterCode: string): ChapterIntro | undefined {
  return chapterIntros[chapterCode];
}

export function buildIntroSlideContent(slide: IntroSlide): string {
  return `${slide.title}\n\n${slide.description}`;
}

import { Subject, Achievement, Question } from "../types";

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "Calculator",
    color: "from-blue-600 to-indigo-600",
    bgLight: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    borderLight: "border-blue-200 dark:border-blue-800",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
    description: "Algebra, Calculus, Geometry, Probability, Trigonometry & Statistics.",
    popularTopics: [
      "Algebra & Quadratic Equations",
      "Calculus (Derivatives & Integrals)",
      "Geometry & Coordinate Geometry",
      "Probability & Statistics",
      "Trigonometry & Functions",
      "Matrices & Linear Algebra",
      "Sequences & Series",
    ],
  },
  {
    id: "english",
    name: "English",
    icon: "BookOpen",
    color: "from-emerald-600 to-teal-600",
    bgLight: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    borderLight: "border-emerald-200 dark:border-emerald-800",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
    description: "Grammar, Reading Comprehension, Vocabulary, Syntax & Literature.",
    popularTopics: [
      "Grammar & Sentence Mechanics",
      "Vocabulary & Etymology",
      "Reading Comprehension",
      "Figures of Speech & Literary Devices",
      "Idioms & Phrasal Verbs",
      "Essay Structure & Cohesion",
      "Spelling & Punctuation",
    ],
  },
  {
    id: "biology",
    name: "Biology",
    icon: "Dna",
    color: "from-green-600 to-emerald-600",
    bgLight: "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300",
    borderLight: "border-green-200 dark:border-green-800",
    badgeColor: "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200",
    description: "Cell Biology, Genetics, Human Anatomy, Ecology & Evolution.",
    popularTopics: [
      "Cell Structure & Function",
      "Genetics & DNA Replication",
      "Human Circulatory & Nervous Systems",
      "Ecology & Food Webs",
      "Photosynthesis & Respiration",
      "Evolution & Natural Selection",
      "Plant Physiology",
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: "FlaskConical",
    color: "from-amber-600 to-orange-600",
    bgLight: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    borderLight: "border-amber-200 dark:border-amber-800",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
    description: "Periodic Table, Stoichiometry, Organic Chemistry, Chemical Bonding.",
    popularTopics: [
      "Periodic Table & Periodic Trends",
      "Chemical Bonding (Ionic, Covalent)",
      "Stoichiometry & Mole Concept",
      "Acids, Bases & pH Calculations",
      "Organic Chemistry (Alkanes, Alkenes)",
      "Thermodynamics & Kinetics",
      "Redox Reactions & Electrochemistry",
    ],
  },
  {
    id: "physics",
    name: "Physics",
    icon: "Atom",
    color: "from-violet-600 to-purple-600",
    bgLight: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    borderLight: "border-violet-200 dark:border-violet-800",
    badgeColor: "bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200",
    description: "Mechanics, Electricity, Magnetism, Waves, Optics & Thermodynamics.",
    popularTopics: [
      "Newtonian Mechanics & Kinematics",
      "Work, Energy & Momentum",
      "Electricity & Ohm's Law",
      "Electromagnetism & Induction",
      "Waves, Sound & Light Optics",
      "Thermal Physics & Laws of Thermodynamics",
      "Nuclear Physics & Radioactivity",
    ],
  },
  {
    id: "computer_science",
    name: "Computer Science",
    icon: "Code",
    color: "from-cyan-600 to-blue-600",
    bgLight: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300",
    borderLight: "border-cyan-200 dark:border-cyan-800",
    badgeColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200",
    description: "Algorithms, Data Structures, Web Development, Databases & Python.",
    popularTopics: [
      "Data Structures (Arrays, Linked Lists, Trees)",
      "Algorithms & Big-O Time Complexity",
      "Object-Oriented Programming (OOP)",
      "Database Design & SQL Queries",
      "Computer Networks & Protocols",
      "Operating Systems & Process Management",
      "Cybersecurity & Encryption",
    ],
  },
  {
    id: "government",
    name: "Government",
    icon: "Landmark",
    color: "from-rose-600 to-pink-600",
    bgLight: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    borderLight: "border-rose-200 dark:border-rose-800",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
    description: "Constitution, Separation of Powers, Political Systems & Civil Rights.",
    popularTopics: [
      "Arms of Government & Separation of Powers",
      "Constitutional Law & Rights",
      "Electoral Systems & Democracy",
      "Public Administration & Civil Service",
      "International Relations & Treaties",
      "Rule of Law & Judiciary Independence",
      "Political Ideologies & Parties",
    ],
  },
  {
    id: "geography",
    name: "Geography",
    icon: "Globe",
    color: "from-teal-600 to-emerald-600",
    bgLight: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300",
    borderLight: "border-teal-200 dark:border-teal-800",
    badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200",
    description: "Physical Landscapes, Weather & Climate, Plate Tectonics & Cartography.",
    popularTopics: [
      "Plate Tectonics & Volcanism",
      "Weather, Climate & Global Warming",
      "Rivers, Coastal Processes & Landforms",
      "Cartography & Map Reading",
      "Population Dynamics & Migration",
      "Economic Geography & Resources",
      "Ecosystems & Biomes",
    ],
  },
  {
    id: "custom",
    name: "Custom Subject",
    icon: "Sparkles",
    color: "from-purple-600 to-pink-600",
    bgLight: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
    borderLight: "border-purple-200 dark:border-purple-800",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
    description: "Enter any field: Economics, Psychology, History, Medicine, Art, Law...",
    popularTopics: [
      "Key Terminology & Definitions",
      "Fundamental Theories",
      "Historical Milestones",
      "Applied Practice & Scenarios",
    ],
  },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_test",
    title: "First Steps",
    description: "Complete your very first test on QUIZMASTER AI.",
    icon: "GraduationCap",
    category: "tests",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "high_flyer",
    title: "High Flyer",
    description: "Score 90% or higher on any test.",
    icon: "Trophy",
    category: "score",
    unlocked: false,
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Score 100% on a test with 5 or more questions.",
    icon: "Award",
    category: "score",
    unlocked: false,
  },
  {
    id: "streak_3",
    title: "Consistent Learner",
    description: "Maintain a 3-day daily test streak.",
    icon: "Flame",
    category: "streak",
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: "streak_7",
    title: "Master of Habit",
    description: "Reach a 7-day daily test streak.",
    icon: "Zap",
    category: "streak",
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: "polymath",
    title: "Polymath",
    description: "Complete tests in at least 4 different subjects.",
    icon: "Compass",
    category: "tests",
    unlocked: false,
    progress: 0,
    maxProgress: 4,
  },
  {
    id: "note_taker",
    title: "Scholar's Notebook",
    description: "Save 3 or more study notes for revision.",
    icon: "FileText",
    category: "study",
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: "century_club",
    title: "Century Club",
    description: "Answer 100 total questions across tests.",
    icon: "Target",
    category: "tests",
    unlocked: false,
    progress: 0,
    maxProgress: 100,
  },
];

// Fallback high quality offline questions when network or quota limits arise
export const FALLBACK_QUESTIONS: Record<string, Question[]> = {
  mathematics: [
    {
      id: "math_1",
      question: "If 2x + 5 = 17, what is the value of 3x - 4?",
      type: "multiple_choice",
      options: ["14", "12", "18", "10"],
      correctAnswer: "14",
      explanation: "First, subtract 5 from both sides: 2x = 12, so x = 6. Then substitute x = 6 into 3x - 4: 3(6) - 4 = 18 - 4 = 14.",
      hint: "Solve for x first by isolating the variable.",
      topic: "Algebra & Equations",
      difficulty: "Easy",
    },
    {
      id: "math_2",
      question: "What is the derivative of f(x) = 3x^3 - 5x^2 + 7 with respect to x?",
      type: "multiple_choice",
      options: ["9x^2 - 10x", "9x^3 - 10x^2", "6x^2 - 5x", "9x^2 - 10x + 7"],
      correctAnswer: "9x^2 - 10x",
      explanation: "Using the power rule d/dx(x^n) = n*x^(n-1): d/dx(3x^3) = 9x^2, d/dx(-5x^2) = -10x, and d/dx(7) = 0.",
      hint: "Multiply each coefficient by its exponent and decrease the exponent by 1.",
      topic: "Calculus (Derivatives)",
      difficulty: "Medium",
    },
    {
      id: "math_3",
      question: "In a standard 52-card deck, what is the probability of drawing a Queen or a Heart?",
      type: "multiple_choice",
      options: ["16/52 (4/13)", "17/52", "13/52", "4/52"],
      correctAnswer: "16/52 (4/13)",
      explanation: "There are 4 Queens and 13 Hearts. The Queen of Hearts is in both sets (overlap = 1). P(Queen or Heart) = 4 + 13 - 1 = 16 out of 52 = 4/13.",
      hint: "Remember to subtract the card that is both a Queen and a Heart.",
      topic: "Probability & Statistics",
      difficulty: "Medium",
    },
    {
      id: "math_4",
      question: "True or False: The sum of the interior angles of any planar hexagon is always 720 degrees.",
      type: "true_false",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Formula for the sum of interior angles of an n-sided polygon is (n - 2) * 180°. For a hexagon (n=6), (6 - 2) * 180° = 4 * 180° = 720°.",
      hint: "Use the polygon formula (n - 2) * 180° with n = 6.",
      topic: "Geometry",
      difficulty: "Easy",
    },
    {
      id: "math_5",
      question: "What is the exact value of sin(30 degrees) + cos(60 degrees)?",
      type: "multiple_choice",
      options: ["1", "0.5", "√3/2", "√2"],
      correctAnswer: "1",
      explanation: "sin(30°) = 0.5 (or 1/2) and cos(60°) = 0.5 (or 1/2). 0.5 + 0.5 = 1.0.",
      hint: "Recall the standard unit circle values for 30° and 60°.",
      topic: "Trigonometry",
      difficulty: "Easy",
    },
  ],
  english: [
    {
      id: "eng_1",
      question: "Which of the following sentences contains a dangling modifier?",
      type: "multiple_choice",
      options: [
        "Walking into the library, the quiet atmosphere was immediately calming.",
        "Walking into the library, she felt immediately calmed by the quiet atmosphere.",
        "She walked into the quiet library and felt instantly at ease.",
        "As we walked into the library, the serene silence welcomed us."
      ],
      correctAnswer: "Walking into the library, the quiet atmosphere was immediately calming.",
      explanation: "In option A, the participle phrase 'Walking into the library' grammatically modifies 'the quiet atmosphere', which cannot walk. The subject performing the action must immediately follow the introductory phrase.",
      hint: "Look for an introductory participial phrase where the noun immediately following it is NOT the one doing the action.",
      topic: "Grammar & Syntax",
      difficulty: "Hard",
    },
    {
      id: "eng_2",
      question: "What figure of speech is demonstrated in: 'The relentless alarm clock screamed at me to wake up'?",
      type: "multiple_choice",
      options: ["Personification", "Hyperbole", "Metaphor", "Oxymoron"],
      correctAnswer: "Personification",
      explanation: "Personification attributes human qualities (screaming) to non-human objects (an alarm clock).",
      hint: "Notice that an inanimate object is given a human action.",
      topic: "Literary Devices",
      difficulty: "Easy",
    },
    {
      id: "eng_3",
      question: "Choose the word that is closest in meaning to 'EPHEMERAL':",
      type: "multiple_choice",
      options: ["Transitory / Short-lived", "Permanent", "Eternal", "Intricate"],
      correctAnswer: "Transitory / Short-lived",
      explanation: "'Ephemeral' describes something lasting for a very brief period of time, such as mayflies or morning dew.",
      hint: "Think of fleeting moments.",
      topic: "Vocabulary",
      difficulty: "Medium",
    },
    {
      id: "eng_4",
      question: "True or False: A semi-colon can be used to join two independent clauses that are closely related in thought without a coordinating conjunction.",
      type: "true_false",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "A semicolon is properly used to link two complete, independent thoughts that have a close conceptual connection.",
      hint: "Consider the grammatical role of semicolons versus periods.",
      topic: "Punctuation",
      difficulty: "Easy",
    },
    {
      id: "eng_5",
      question: "Identify the sentence that correctly uses the subjunctive mood:",
      type: "multiple_choice",
      options: [
        "If I were the president, I would prioritize educational funding.",
        "If I was the president, I would prioritize educational funding.",
        "If I am the president, I would prioritize educational funding.",
        "If I will be the president, I will prioritize educational funding."
      ],
      correctAnswer: "If I were the president, I would prioritize educational funding.",
      explanation: "Hypothetical or counterfactual statements in English take 'were' rather than 'was' in the subjunctive mood regardless of the subject.",
      hint: "Consider contrary-to-fact conditions.",
      topic: "Grammar & Syntax",
      difficulty: "Medium",
    },
  ],
  computer_science: [
    {
      id: "cs_1",
      question: "What is the average and worst-case time complexity of searching an element in a balanced Binary Search Tree (BST)?",
      type: "multiple_choice",
      options: ["O(log n) average, O(log n) worst", "O(1) average, O(n) worst", "O(n) average, O(n log n) worst", "O(n log n) average, O(n^2) worst"],
      correctAnswer: "O(log n) average, O(log n) worst",
      explanation: "In a balanced BST (like an AVL or Red-Black tree), the height is guaranteed to be O(log n), so search operations take logarithmic time in both average and worst cases.",
      hint: "A balanced tree cuts the search space in half with each comparison.",
      topic: "Data Structures & Big-O",
      difficulty: "Medium",
    },
    {
      id: "cs_2",
      question: "Which data structure follows the Last-In, First-Out (LIFO) principle?",
      type: "multiple_choice",
      options: ["Stack", "Queue", "Linked List", "Binary Heap"],
      correctAnswer: "Stack",
      explanation: "A Stack pushes elements on top and pops from the top, making the most recently added item the first one removed (LIFO). Queues are FIFO.",
      hint: "Think of a stack of plates.",
      topic: "Data Structures",
      difficulty: "Easy",
    },
    {
      id: "cs_3",
      question: "True or False: HTTP is a stateless application-layer protocol.",
      type: "true_false",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "HTTP does not retain session state between requests on its own; mechanisms like cookies and JWT tokens are used on top of it to manage state.",
      hint: "Does a pure HTTP server retain memory of previous requests without tokens or cookies?",
      topic: "Networking & Web",
      difficulty: "Easy",
    },
    {
      id: "cs_4",
      question: "In relational databases, which SQL clause is evaluated BEFORE the SELECT statement during query execution?",
      type: "multiple_choice",
      options: ["WHERE and FROM", "ORDER BY", "LIMIT", "SELECT is always first"],
      correctAnswer: "WHERE and FROM",
      explanation: "SQL query execution order is: FROM/JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT.",
      hint: "Rows must be fetched and filtered before columns can be selected.",
      topic: "Database & SQL",
      difficulty: "Hard",
    },
    {
      id: "cs_5",
      question: "What is the primary purpose of an asymmetric encryption key pair (Public & Private keys)?",
      type: "multiple_choice",
      options: [
        "Encrypt with public key and decrypt with private key (or sign with private and verify with public)",
        "Speed up data transfer over fiber optic cables",
        "Compress large files into smaller archive sizes",
        "Allow identical keys to be shared openly without risk"
      ],
      correctAnswer: "Encrypt with public key and decrypt with private key (or sign with private and verify with public)",
      explanation: "Asymmetric cryptography allows anyone to encrypt data with the public key, but only the holder of the matching private key can decrypt it.",
      hint: "One key is known to everyone, the other is kept strictly secret.",
      topic: "Cybersecurity",
      difficulty: "Medium",
    },
  ],
  biology: [
    {
      id: "bio_1",
      question: "Which organelle is responsible for cellular respiration and ATP production in eukaryotic cells?",
      type: "multiple_choice",
      options: ["Mitochondria", "Ribosome", "Endoplasmic Reticulum", "Golgi Apparatus"],
      correctAnswer: "Mitochondria",
      explanation: "Mitochondria are known as the powerhouses of the cell, generating the majority of cellular adenosine triphosphate (ATP) via the Krebs cycle and oxidative phosphorylation.",
      hint: "Often nicknamed the powerhouse of the cell.",
      topic: "Cell Biology",
      difficulty: "Easy",
    },
    {
      id: "bio_2",
      question: "During DNA replication, which enzyme is responsible for unwinding the double helix?",
      type: "multiple_choice",
      options: ["DNA Helicase", "DNA Polymerase", "DNA Ligase", "RNA Primase"],
      correctAnswer: "DNA Helicase",
      explanation: "DNA Helicase breaks the hydrogen bonds between complementary base pairs to separate the two strands and form the replication fork.",
      hint: "Its name comes from the word 'helix'.",
      topic: "Genetics & Molecular Biology",
      difficulty: "Medium",
    },
    {
      id: "bio_3",
      question: "True or False: Arteries always carry oxygenated blood away from the heart in the human circulatory system.",
      type: "true_false",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation: "While most arteries carry oxygenated blood, the pulmonary artery carries deoxygenated blood from the right ventricle of the heart to the lungs for oxygenation.",
      hint: "Consider the blood vessel heading to the lungs.",
      topic: "Human Anatomy & Physiology",
      difficulty: "Medium",
    },
    {
      id: "bio_4",
      question: "What is the primary light-absorbing pigment in green plants responsible for initiating photosynthesis?",
      type: "multiple_choice",
      options: ["Chlorophyll a", "Carotenoids", "Anthocyanin", "Xanthophyll"],
      correctAnswer: "Chlorophyll a",
      explanation: "Chlorophyll a is the essential primary photosynthetic pigment that absorbs blue-violet and red wavelengths while reflecting green light.",
      hint: "It gives plants their green coloration.",
      topic: "Photosynthesis & Plant Biology",
      difficulty: "Easy",
    },
    {
      id: "bio_5",
      question: "In genetics, if two heterozygous tall pea plants (Tt) are crossed, what is the expected phenotypic ratio of tall to short offspring?",
      type: "multiple_choice",
      options: ["3 : 1", "1 : 2 : 1", "1 : 1", "4 : 0"],
      correctAnswer: "3 : 1",
      explanation: "Punnett square analysis of Tt x Tt yields 1 TT, 2 Tt, and 1 tt. Because T is dominant, 3 out of 4 (75%) will exhibit the tall phenotype, giving a 3:1 ratio.",
      hint: "Draw a 2x2 Punnett square with T and t on each axis.",
      topic: "Mendelian Genetics",
      difficulty: "Medium",
    },
  ],
  chemistry: [
    {
      id: "chem_1",
      question: "What type of chemical bond is formed by the electrostatic attraction between oppositely charged ions?",
      type: "multiple_choice",
      options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
      correctAnswer: "Ionic bond",
      explanation: "Ionic bonding involves the complete transfer of valence electrons from one atom (usually a metal) to another (non-metal), creating cations and anions that attract.",
      hint: "Think of common table salt (NaCl).",
      topic: "Chemical Bonding",
      difficulty: "Easy",
    },
    {
      id: "chem_2",
      question: "What is the pH of a neutral aqueous solution at standard temperature (25°C)?",
      type: "multiple_choice",
      options: ["7", "0", "14", "1"],
      correctAnswer: "7",
      explanation: "At 25°C, pure water has [H+] = 10^-7 M, yielding a pH = -log(10^-7) = 7, which denotes neutrality.",
      hint: "The midpoint of the standard 0 to 14 pH scale.",
      topic: "Acids, Bases & pH",
      difficulty: "Easy",
    },
    {
      id: "chem_3",
      question: "How many moles of gas occupy 22.4 liters at Standard Temperature and Pressure (STP)?",
      type: "multiple_choice",
      options: ["1.0 mole", "0.5 moles", "2.0 moles", "22.4 moles"],
      correctAnswer: "1.0 mole",
      explanation: "By Avogadro's hypothesis, one mole of any ideal gas occupies 22.4 dm³ (liters) at standard temperature (0°C/273K) and pressure (1 atm).",
      hint: "Avogadro's molar volume constant at STP.",
      topic: "Stoichiometry & Gas Laws",
      difficulty: "Medium",
    },
    {
      id: "chem_4",
      question: "True or False: In a redox reaction, oxidation refers to the gain of electrons.",
      type: "true_false",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation: "Oxidation is the LOSS of electrons (OIL: Oxidation Is Loss), while reduction is the GAIN of electrons (RIG: Reduction Is Gain).",
      hint: "Remember the mnemonic 'OIL RIG'.",
      topic: "Electrochemistry & Redox",
      difficulty: "Easy",
    },
    {
      id: "chem_5",
      question: "Which of the following organic compounds belongs to the alkene homologous series?",
      type: "multiple_choice",
      options: ["Ethene (C2H4)", "Ethane (C2H6)", "Ethyne (C2H2)", "Ethanol (C2H5OH)"],
      correctAnswer: "Ethene (C2H4)",
      explanation: "Alkenes possess the general molecular formula CnH2n and contain at least one carbon-carbon double bond. For n=2, C2H4 is ethene.",
      hint: "Alkenes follow the formula CnH2n.",
      topic: "Organic Chemistry",
      difficulty: "Medium",
    },
  ],
  physics: [
    {
      id: "phys_1",
      question: "According to Newton's Second Law of Motion, which formula relates force (F), mass (m), and acceleration (a)?",
      type: "multiple_choice",
      options: ["F = m * a", "F = m / a", "F = 0.5 * m * a^2", "F = m * v"],
      correctAnswer: "F = m * a",
      explanation: "Newton's second law states that the net force acting on an object is directly proportional to the product of its mass and acceleration (F = ma).",
      hint: "Force equals mass multiplied by acceleration.",
      topic: "Classical Mechanics",
      difficulty: "Easy",
    },
    {
      id: "phys_2",
      question: "What is the SI unit of electrical resistance?",
      type: "multiple_choice",
      options: ["Ohm (Ω)", "Ampere (A)", "Volt (V)", "Watt (W)"],
      correctAnswer: "Ohm (Ω)",
      explanation: "The Ohm (symbol Ω) is the SI unit of electrical resistance, named after Georg Simon Ohm. Resistance R = V / I.",
      hint: "Named after the scientist behind Ohm's Law.",
      topic: "Electricity & Circuits",
      difficulty: "Easy",
    },
    {
      id: "phys_3",
      question: "True or False: Sound waves can propagate through a total vacuum.",
      type: "true_false",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation: "Sound waves are mechanical longitudinal waves that require a material medium (solid, liquid, or gas) through which particle vibrations propagate. In a vacuum, there are no particles to vibrate.",
      hint: "Remember: 'In space, no one can hear you scream.'",
      topic: "Waves & Acoustics",
      difficulty: "Easy",
    },
    {
      id: "phys_4",
      question: "What principle states that the total mechanical energy in an isolated system remains constant in the absence of dissipative forces?",
      type: "multiple_choice",
      options: [
        "Conservation of Energy",
        "Bernoulli's Principle",
        "Archimedes' Principle",
        "Heisenberg Uncertainty Principle"
      ],
      correctAnswer: "Conservation of Energy",
      explanation: "The law of conservation of energy states that energy cannot be created or destroyed, only converted from one form to another (e.g. potential to kinetic).",
      hint: "Energy cannot be created or destroyed.",
      topic: "Work, Energy & Power",
      difficulty: "Easy",
    },
    {
      id: "phys_5",
      question: "What is the speed of light in a vacuum, commonly denoted as 'c'?",
      type: "multiple_choice",
      options: ["3.00 × 10^8 m/s", "3.00 × 10^6 m/s", "1.50 × 10^8 m/s", "3.00 × 10^5 m/s"],
      correctAnswer: "3.00 × 10^8 m/s",
      explanation: "The speed of light in vacuum is approximately 299,792,458 meters per second, conventionally rounded to 3.00 × 10^8 m/s.",
      hint: "Approximately 300,000 kilometers per second.",
      topic: "Optics & Electromagnetism",
      difficulty: "Medium",
    },
  ],
  government: [
    {
      id: "gov_1",
      question: "Which arm of government is primarily responsible for interpreting laws and adjudicating disputes?",
      type: "multiple_choice",
      options: ["Judiciary", "Legislature", "Executive", "Bureaucracy"],
      correctAnswer: "Judiciary",
      explanation: "The Judiciary interprets and applies the law in the name of the state, ensuring legislation adheres to the constitution.",
      hint: "Courts, judges, and magistrates.",
      topic: "Arms of Government",
      difficulty: "Easy",
    },
    {
      id: "gov_2",
      question: "What political principle prevents the concentration of power by dividing governmental authority across separate branches?",
      type: "multiple_choice",
      options: ["Separation of Powers", "Totalitarianism", "Gerrymandering", "Autocracy"],
      correctAnswer: "Separation of Powers",
      explanation: "Formulated prominently by Montesquieu, Separation of Powers distributes legislative, executive, and judicial powers into distinct bodies with checks and balances.",
      hint: "Separation of the branches of authority.",
      topic: "Political Theory",
      difficulty: "Easy",
    },
    {
      id: "gov_3",
      question: "True or False: In a parliamentary system, the prime minister is directly elected by the public in a separate national presidential ballot.",
      type: "true_false",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation: "In a parliamentary system, the head of government (Prime Minister) is selected from and accountable to the legislature (parliament), not chosen in an independent nationwide presidential vote.",
      hint: "The legislature chooses the Prime Minister.",
      topic: "Comparative Politics",
      difficulty: "Medium",
    },
  ],
  geography: [
    {
      id: "geog_1",
      question: "Which tectonic plate boundary is formed when two plates collide and push against each other?",
      type: "multiple_choice",
      options: ["Convergent boundary", "Divergent boundary", "Transform boundary", "Rift zone"],
      correctAnswer: "Convergent boundary",
      explanation: "Convergent boundaries occur where plates move toward one another, often leading to subduction zones, mountain ranges (like the Himalayas), and volcanic arcs.",
      hint: "Converge means coming together.",
      topic: "Plate Tectonics",
      difficulty: "Easy",
    },
    {
      id: "geog_2",
      question: "What is the imaginary line of latitude at 0 degrees that divides the Earth into the Northern and Southern Hemispheres?",
      type: "multiple_choice",
      options: ["The Equator", "Prime Meridian", "Tropic of Cancer", "International Date Line"],
      correctAnswer: "The Equator",
      explanation: "The Equator is the circle of latitude at 0 degrees that bisects Earth halfway between the North and South Poles.",
      hint: "Equal distance from both poles.",
      topic: "Cartography & Coordinates",
      difficulty: "Easy",
    },
    {
      id: "geog_3",
      question: "True or False: The Amazon Rainforest is the largest tropical rainforest in the world.",
      type: "true_false",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "The Amazon covers over 5.5 million square kilometers across South America, representing over half of the planet's remaining rainforests.",
      hint: "Located primarily in Brazil and South America.",
      topic: "Biomes & Ecosystems",
      difficulty: "Easy",
    },
  ],
  general: [
    {
      id: "gen_1",
      question: "What is the primary gas composing approximately 78% of Earth's atmosphere?",
      type: "multiple_choice",
      options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Argon"],
      correctAnswer: "Nitrogen",
      explanation: "Earth's dry air is composed of approximately 78.08% nitrogen (N2), 20.95% oxygen (O2), and 0.93% argon.",
      hint: "It is not oxygen, which makes up about 21%.",
      topic: "General Science",
      difficulty: "Easy",
    },
    {
      id: "gen_2",
      question: "In the scientific method, what is a tentative, testable explanation for an observed phenomenon?",
      type: "multiple_choice",
      options: ["Hypothesis", "Law", "Theory", "Fact"],
      correctAnswer: "Hypothesis",
      explanation: "A hypothesis is an educated, testable proposition formulated before experiments are conducted.",
      hint: "An educated guess that can be tested by experiment.",
      topic: "Scientific Method",
      difficulty: "Easy",
    },
    {
      id: "gen_3",
      question: "True or False: Light travels faster through water than through empty vacuum.",
      type: "true_false",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation: "Light travels fastest in a vacuum (c ≈ 3 × 10^8 m/s). When entering a denser optical medium like water (refractive index ≈ 1.33), its speed slows down.",
      hint: "Optical density slows down photon propagation.",
      topic: "General Physics",
      difficulty: "Easy",
    },
  ],
};

// Also expose case-insensitive aliases
FALLBACK_QUESTIONS["Mathematics"] = FALLBACK_QUESTIONS.mathematics;
FALLBACK_QUESTIONS["English"] = FALLBACK_QUESTIONS.english;
FALLBACK_QUESTIONS["Computer Science"] = FALLBACK_QUESTIONS.computer_science;
FALLBACK_QUESTIONS["computer science"] = FALLBACK_QUESTIONS.computer_science;
FALLBACK_QUESTIONS["Biology"] = FALLBACK_QUESTIONS.biology;
FALLBACK_QUESTIONS["Chemistry"] = FALLBACK_QUESTIONS.chemistry;
FALLBACK_QUESTIONS["Physics"] = FALLBACK_QUESTIONS.physics;
FALLBACK_QUESTIONS["Government"] = FALLBACK_QUESTIONS.government;
FALLBACK_QUESTIONS["Geography"] = FALLBACK_QUESTIONS.geography;
FALLBACK_QUESTIONS["General"] = FALLBACK_QUESTIONS.general;

/**
 * Foolproof retrieval of fallback practice questions.
 * Guarantees a non-empty array of valid Question objects, never undefined or null.
 */
export function getFallbackQuestions(
  subject: string,
  topic: string = "General",
  count: number = 5,
  difficulty: string = "Medium",
  questionType: string = "Multiple choice"
): Question[] {
  const normalizedSubject = String(subject || "").trim().toLowerCase();
  const cleanKey = normalizedSubject.replace(/[^a-z0-9]/g, "");

  // Match against known subject keys
  let baseQuestions: Question[] = [];

  if (cleanKey.includes("math") || cleanKey.includes("algebra") || cleanKey.includes("calc")) {
    baseQuestions = FALLBACK_QUESTIONS.mathematics;
  } else if (cleanKey.includes("eng") || cleanKey.includes("grammar") || cleanKey.includes("vocab") || cleanKey.includes("literature")) {
    baseQuestions = FALLBACK_QUESTIONS.english;
  } else if (cleanKey.includes("bio") || cleanKey.includes("dna") || cleanKey.includes("cell")) {
    baseQuestions = FALLBACK_QUESTIONS.biology;
  } else if (cleanKey.includes("chem") || cleanKey.includes("element") || cleanKey.includes("acid")) {
    baseQuestions = FALLBACK_QUESTIONS.chemistry;
  } else if (cleanKey.includes("phys") || cleanKey.includes("force") || cleanKey.includes("motion")) {
    baseQuestions = FALLBACK_QUESTIONS.physics;
  } else if (cleanKey.includes("comp") || cleanKey.includes("code") || cleanKey.includes("tech") || cleanKey.includes("data")) {
    baseQuestions = FALLBACK_QUESTIONS.computer_science;
  } else if (cleanKey.includes("gov") || cleanKey.includes("law") || cleanKey.includes("polit")) {
    baseQuestions = FALLBACK_QUESTIONS.government;
  } else if (cleanKey.includes("geo") || cleanKey.includes("earth") || cleanKey.includes("climate")) {
    baseQuestions = FALLBACK_QUESTIONS.geography;
  } else if (FALLBACK_QUESTIONS[normalizedSubject]) {
    baseQuestions = FALLBACK_QUESTIONS[normalizedSubject];
  } else if (FALLBACK_QUESTIONS[subject]) {
    baseQuestions = FALLBACK_QUESTIONS[subject];
  } else {
    // Default to a balanced general selection
    baseQuestions = FALLBACK_QUESTIONS.general || FALLBACK_QUESTIONS.mathematics;
  }

  // Ensure safe clone
  const targetCount = Math.max(1, count || 5);
  const result: Question[] = [];

  // Cycle and tailor questions if requested count exceeds available base questions
  for (let i = 0; i < targetCount; i++) {
    const template = baseQuestions[i % baseQuestions.length];
    if (!template) break;

    const qId = `fb_${cleanKey || "gen"}_${i + 1}_${Date.now()}`;
    const questionCopy: Question = {
      ...template,
      id: qId,
      topic: topic || template.topic || subject,
      difficulty: (difficulty as any) || template.difficulty || "Medium",
    };

    // Adapt format if user specifically asked for True/False or Short answer
    if (questionType === "True/False" || questionType === "true_false") {
      if (template.type !== "true_false") {
        questionCopy.type = "true_false";
        questionCopy.question = `True or False: In ${subject} (${topic}), the following statement is universally verified: ${template.correctAnswer} is correct for: ${template.question}`;
        questionCopy.options = ["True", "False"];
        questionCopy.correctAnswer = "True";
      }
    } else if (questionType === "Short answer" || questionType === "short_answer") {
      questionCopy.type = "short_answer";
      questionCopy.options = [];
    }

    result.push(questionCopy);
  }

  // Safety fallback if result is somehow empty
  if (result.length === 0) {
    result.push({
      id: `fb_fallback_${Date.now()}`,
      question: `Core concept in ${subject}: What is a primary foundational principle of ${topic}?`,
      type: "multiple_choice",
      options: [
        "Rigorous conceptual foundation & core laws",
        "Arbitrary non-standard assumption",
        "Random unverified hypothesis",
        "Irrelevant outlier condition",
      ],
      correctAnswer: "Rigorous conceptual foundation & core laws",
      explanation: `In ${subject}, understanding the fundamental laws and definitions of ${topic} allows you to solve both qualitative and numerical problems with precision.`,
      hint: `Recall the foundational definitions and standard rules for ${topic}.`,
      topic: topic || subject,
      difficulty: (difficulty as any) || "Medium",
    });
  }

  return result.slice(0, targetCount);
}

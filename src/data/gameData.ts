// Educational Games Data for QUIZMASTER AI (JAMB, WAEC, NECO, BECE & General Subjects)

export interface MatchPair {
  id: string;
  term: string;
  match: string;
  category: "Sciences" | "Mathematics" | "English" | "Social Sciences";
  hint?: string;
}

export const SPEED_MATCH_PAIRS: MatchPair[] = [
  // Sciences (Biology, Chemistry, Physics)
  {
    id: "sci-1",
    term: "Mitochondria",
    match: "Powerhouse of the cell (ATP production)",
    category: "Sciences",
    hint: "Cellular respiration occurs here",
  },
  {
    id: "sci-2",
    term: "Osmosis",
    match: "Water movement across semi-permeable membrane",
    category: "Sciences",
    hint: "From low solute to high solute concentration",
  },
  {
    id: "sci-3",
    term: "Enzyme",
    match: "Biological catalyst speeding biochemical reactions",
    category: "Sciences",
    hint: "Protein that lowers activation energy",
  },
  {
    id: "sci-4",
    term: "Chlorophyll",
    match: "Green pigment absorbing sunlight for photosynthesis",
    category: "Sciences",
    hint: "Located inside chloroplasts",
  },
  {
    id: "sci-5",
    term: "Avogadro's Constant",
    match: "6.022 × 10²³ particles per mole",
    category: "Sciences",
    hint: "Number of units in one mole of substance",
  },
  {
    id: "sci-6",
    term: "pH < 7",
    match: "Acidic solution with excess H⁺ ions",
    category: "Sciences",
    hint: "Opposite of basic/alkaline (pH > 7)",
  },
  {
    id: "sci-7",
    term: "Ohm's Law",
    match: "Voltage equals current times resistance (V = IR)",
    category: "Sciences",
    hint: "Electric circuit relationship",
  },
  {
    id: "sci-8",
    term: "Newton's 2nd Law",
    match: "Force equals mass times acceleration (F = ma)",
    category: "Sciences",
    hint: "Fundamental law of dynamics",
  },
  {
    id: "sci-9",
    term: "Kinetic Energy",
    match: "Energy of an object in motion (E = ½mv²)",
    category: "Sciences",
    hint: "Depends on mass and velocity squared",
  },
  {
    id: "sci-10",
    term: "Boyle's Law",
    match: "At constant temp: P₁V₁ = P₂V₂",
    category: "Sciences",
    hint: "Pressure is inversely proportional to volume",
  },

  // Mathematics
  {
    id: "math-1",
    term: "Pythagorean Theorem",
    match: "a² + b² = c² (right triangle)",
    category: "Mathematics",
    hint: "Hypotenuse squared equals sum of leg squares",
  },
  {
    id: "math-2",
    term: "Quadratic Formula",
    match: "x = (-b ± √(b² - 4ac)) / (2a)",
    category: "Mathematics",
    hint: "Solves ax² + bx + c = 0",
  },
  {
    id: "math-3",
    term: "Area of a Circle",
    match: "A = πr²",
    category: "Mathematics",
    hint: "Pi times radius squared",
  },
  {
    id: "math-4",
    term: "Circumference",
    match: "C = 2πr or C = πd",
    category: "Mathematics",
    hint: "Perimeter of a circle",
  },
  {
    id: "math-5",
    term: "Sum of Triangle Angles",
    match: "Always equals 180 degrees",
    category: "Mathematics",
    hint: "Interior angles sum",
  },
  {
    id: "math-6",
    term: "Slope of a Line (m)",
    match: "(y₂ - y₁) / (x₂ - x₁)",
    category: "Mathematics",
    hint: "Rise over run",
  },
  {
    id: "math-7",
    term: "Logarithm Identity",
    match: "log(A × B) = log A + log B",
    category: "Mathematics",
    hint: "Product rule for logs",
  },
  {
    id: "math-8",
    term: "Prime Number",
    match: "Only divisible by 1 and itself",
    category: "Mathematics",
    hint: "Examples: 2, 3, 5, 7, 11, 13",
  },

  // English Lexis, Idioms & Figures of Speech
  {
    id: "eng-1",
    term: "Ubiquitous",
    match: "Present everywhere simultaneously",
    category: "English",
    hint: "Synonym: Omnipresent",
  },
  {
    id: "eng-2",
    term: "Ephemeral",
    match: "Lasting for a very short time; fleeting",
    category: "English",
    hint: "Opposite of permanent / eternal",
  },
  {
    id: "eng-3",
    term: "Candid",
    match: "Frank, open, and sincere in expression",
    category: "English",
    hint: "Honest without deceit",
  },
  {
    id: "eng-4",
    term: "Pragmatic",
    match: "Dealing with things sensibly and realistically",
    category: "English",
    hint: "Practical rather than theoretical",
  },
  {
    id: "eng-5",
    term: "Oxymoron",
    match: "Figure of speech pairing contradictory terms",
    category: "English",
    hint: "E.g., 'deafening silence', 'bittersweet'",
  },
  {
    id: "eng-6",
    term: "Hyperbole",
    match: "Deliberate exaggeration for emphasis",
    category: "English",
    hint: "E.g., 'I have told you a million times'",
  },
  {
    id: "eng-7",
    term: "Benevolent",
    match: "Well-meaning, kind, and charitable",
    category: "English",
    hint: "Opposite of malevolent",
  },
  {
    id: "eng-8",
    term: "Loquacious",
    match: "Tending to talk a great deal; talkative",
    category: "English",
    hint: "Synonym: Garrulous",
  },

  // Social Sciences (Government, Economics, Nigerian History)
  {
    id: "soc-1",
    term: "Opportunity Cost",
    match: "Next best alternative forgone when making a choice",
    category: "Social Sciences",
    hint: "Fundamental concept in scarcity & economics",
  },
  {
    id: "soc-2",
    term: "Inflation",
    match: "Persistent, sustained rise in general price level",
    category: "Social Sciences",
    hint: "Reduces purchasing power of currency",
  },
  {
    id: "soc-3",
    term: "Nigeria's Independence",
    match: "October 1, 1960",
    category: "Social Sciences",
    hint: "Freedom from British colonial rule",
  },
  {
    id: "soc-4",
    term: "Nigeria's Republic Day",
    match: "October 1, 1963",
    category: "Social Sciences",
    hint: "Adoption of republican constitution",
  },
  {
    id: "soc-5",
    term: "Monopoly",
    match: "Market structure with only one single seller",
    category: "Social Sciences",
    hint: "No close substitutes, high barriers to entry",
  },
  {
    id: "soc-6",
    term: "Democracy",
    match: "Government of the people, by the people, for the people",
    category: "Social Sciences",
    hint: "Abraham Lincoln's classic definition",
  },
  {
    id: "soc-7",
    term: "ECOWAS",
    match: "Regional bloc formed in Lagos in 1975",
    category: "Social Sciences",
    hint: "Promotes West African economic integration",
  },
  {
    id: "soc-8",
    term: "Judiciary",
    match: "Organ of government that interprets the laws",
    category: "Social Sciences",
    hint: "Headed by the Chief Justice in courts",
  },
];

export interface ScrambleWord {
  id: string;
  word: string;
  clue: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const SCRAMBLE_WORDS: ScrambleWord[] = [
  // Sciences
  {
    id: "w-1",
    word: "PHOTOSYNTHESIS",
    clue: "Process by which green plants convert solar light energy into chemical glucose",
    category: "Biology",
    difficulty: "Hard",
  },
  {
    id: "w-2",
    word: "CHROMOSOME",
    clue: "Threadlike structure in the nucleus carrying genetic DNA code",
    category: "Biology",
    difficulty: "Medium",
  },
  {
    id: "w-3",
    word: "OSMOSIS",
    clue: "Diffusion of water molecules across a selectively permeable membrane",
    category: "Biology",
    difficulty: "Easy",
  },
  {
    id: "w-4",
    word: "CATALYST",
    clue: "Substance that accelerates a chemical reaction without being consumed",
    category: "Chemistry",
    difficulty: "Medium",
  },
  {
    id: "w-5",
    word: "VALENCY",
    clue: "Combining power of an element measured by hydrogen atoms it displaces",
    category: "Chemistry",
    difficulty: "Easy",
  },
  {
    id: "w-6",
    word: "VELOCITY",
    clue: "Vector quantity describing the rate of change of displacement over time",
    category: "Physics",
    difficulty: "Medium",
  },
  {
    id: "w-7",
    word: "REFRACTION",
    clue: "Bending of light waves when passing from one medium to another",
    category: "Physics",
    difficulty: "Medium",
  },
  {
    id: "w-8",
    word: "EQUILIBRIUM",
    clue: "State of balance where forward and reverse reaction rates are equal",
    category: "Chemistry",
    difficulty: "Hard",
  },
  {
    id: "w-9",
    word: "RESPIRATION",
    clue: "Biochemical breakdown of glucose to liberate ATP energy for cells",
    category: "Biology",
    difficulty: "Medium",
  },

  // English & Literature
  {
    id: "w-10",
    word: "METAPHOR",
    clue: "Figure of speech making a direct comparison without using 'like' or 'as'",
    category: "English & Lit",
    difficulty: "Easy",
  },
  {
    id: "w-11",
    word: "HYPERBOLE",
    clue: "Obvious and intentional dramatic exaggeration not meant to be taken literally",
    category: "English & Lit",
    difficulty: "Medium",
  },
  {
    id: "w-12",
    word: "EUPHEMISM",
    clue: "Mild or indirect word substituted for one considered harsh or blunt",
    category: "English & Lit",
    difficulty: "Hard",
  },
  {
    id: "w-13",
    word: "ALLITERATION",
    clue: "Repetition of identical consonant sounds at the beginning of adjacent words",
    category: "English & Lit",
    difficulty: "Hard",
  },
  {
    id: "w-14",
    word: "PRAGMATIC",
    clue: "Dealing with problems sensibly and practically rather than ideologically",
    category: "English Lexis",
    difficulty: "Medium",
  },
  {
    id: "w-15",
    word: "EPHEMERAL",
    clue: "Lasting for a very brief time; momentary and transient",
    category: "English Lexis",
    difficulty: "Medium",
  },
  {
    id: "w-16",
    word: "BENEVOLENT",
    clue: "Characterized by kindness, goodwill, and desire to help others",
    category: "English Lexis",
    difficulty: "Hard",
  },

  // Mathematics
  {
    id: "w-17",
    word: "HYPOTENUSE",
    clue: "The longest side of a right-angled triangle, opposite the 90° angle",
    category: "Mathematics",
    difficulty: "Medium",
  },
  {
    id: "w-18",
    word: "POLYGON",
    clue: "Closed two-dimensional geometric figure with three or more straight sides",
    category: "Mathematics",
    difficulty: "Easy",
  },
  {
    id: "w-19",
    word: "QUADRATIC",
    clue: "Equation of the second degree where the highest power of x is 2",
    category: "Mathematics",
    difficulty: "Medium",
  },
  {
    id: "w-20",
    word: "PROBABILITY",
    clue: "Numerical measure of the likelihood that an event will occur (0 to 1)",
    category: "Mathematics",
    difficulty: "Hard",
  },

  // Social Sciences
  {
    id: "w-21",
    word: "INFLATION",
    clue: "Continuous, sustained general rise in the price level of goods and services",
    category: "Economics",
    difficulty: "Easy",
  },
  {
    id: "w-22",
    word: "MONOPOLY",
    clue: "Market dominated by a solitary firm with total supply control",
    category: "Economics",
    difficulty: "Easy",
  },
  {
    id: "w-23",
    word: "FEDERATION",
    clue: "Political system sharing sovereignty between central and regional governments",
    category: "Government",
    difficulty: "Medium",
  },
  {
    id: "w-24",
    word: "SOVEREIGNTY",
    clue: "Supreme, independent authority and power of a state to govern itself",
    category: "Government",
    difficulty: "Hard",
  },
];

export interface TrueFalseQuestion {
  id: string;
  statement: string;
  isTrue: boolean;
  subject: string;
  explanation: string;
}

export const TRUE_FALSE_QUESTIONS: TrueFalseQuestion[] = [
  {
    id: "tf-1",
    statement: "Sound waves travel faster through water than through air.",
    isTrue: true,
    subject: "Physics",
    explanation: "Water is denser and less compressible than air, allowing sound vibrations to propagate roughly 4 times faster.",
  },
  {
    id: "tf-2",
    statement: "A light-year is an astronomical unit used to measure time.",
    isTrue: false,
    subject: "Physics",
    explanation: "A light-year measures astronomical distance (the distance light travels in one Julian year, ~9.46 trillion km).",
  },
  {
    id: "tf-3",
    statement: "In human biology, red blood cells (erythrocytes) in mature adults possess no nucleus.",
    isTrue: true,
    subject: "Biology",
    explanation: "Mature mammalian red blood cells expel their nucleus to maximize internal space for hemoglobin oxygen transport.",
  },
  {
    id: "tf-4",
    statement: "Nigeria became a Sovereign Republic in October 1960.",
    isTrue: false,
    subject: "Nigerian History",
    explanation: "Nigeria attained Independence on October 1, 1960, but became a Federal Republic on October 1, 1963.",
  },
  {
    id: "tf-5",
    statement: "Pure water has a neutral pH of 7.0 at room temperature (25°C).",
    isTrue: true,
    subject: "Chemistry",
    explanation: "At 25°C, pure water dissociates equally into H⁺ and OH⁻ ions, creating a neutral pH of 7.",
  },
  {
    id: "tf-6",
    statement: "Every quadratic equation ax² + bx + c = 0 always has at least one real number solution.",
    isTrue: false,
    subject: "Mathematics",
    explanation: "If the discriminant b² - 4ac < 0, the equation has two complex/imaginary roots and NO real solutions.",
  },
  {
    id: "tf-7",
    statement: "In economics, opportunity cost refers to the monetary price paid for a purchased good.",
    isTrue: false,
    subject: "Economics",
    explanation: "Opportunity cost is the value of the next best alternative sacrificed or forgone, not the money price.",
  },
  {
    id: "tf-8",
    statement: "Photosynthesis releases molecular oxygen (O₂) into the atmosphere as a byproduct.",
    isTrue: true,
    subject: "Biology",
    explanation: "During the light-dependent reactions, photolysis of water splits H₂O molecules, liberating O₂ gas.",
  },
  {
    id: "tf-9",
    statement: "An oxymoron is a figure of speech that deliberately pairs two contradictory words.",
    isTrue: true,
    subject: "Literature & English",
    explanation: "Examples include 'deafening silence', 'cruel kindness', and 'seriously funny'.",
  },
  {
    id: "tf-10",
    statement: "The sum of the interior angles of any regular or irregular pentagon is 540 degrees.",
    isTrue: true,
    subject: "Mathematics",
    explanation: "Formula (n - 2) × 180° = (5 - 2) × 180° = 3 × 180° = 540°.",
  },
  {
    id: "tf-11",
    statement: "Electrons carry a positive charge while protons carry a negative charge.",
    isTrue: false,
    subject: "Physics & Chemistry",
    explanation: "Protons carry positive electric charge (+1) while electrons carry negative charge (-1).",
  },
  {
    id: "tf-12",
    statement: "The Nigerian currency, the Naira, was officially introduced in 1973 to replace the Nigerian Pound.",
    isTrue: true,
    subject: "General Knowledge",
    explanation: "The Federal Military Government introduced the Naira and Kobo on January 1, 1973.",
  },
  {
    id: "tf-13",
    statement: "A triangle can possess two right (90°) angles simultaneously in Euclidean geometry.",
    isTrue: false,
    subject: "Mathematics",
    explanation: "All three angles must sum to 180°. Two 90° angles equal 180°, leaving 0° for the third vertex.",
  },
  {
    id: "tf-14",
    statement: "The liver is the heaviest and largest internal organ in the human body.",
    isTrue: true,
    subject: "Biology",
    explanation: "The liver weighs approximately 1.5 kg (skin is the largest external organ).",
  },
  {
    id: "tf-15",
    statement: "In English grammar, the word 'quickly' functions as an adjective.",
    isTrue: false,
    subject: "English",
    explanation: "'Quickly' is an adverb describing the manner of an action; 'quick' is the adjective.",
  },
  {
    id: "tf-16",
    statement: "Chemical formula for table salt is NaHCO₃.",
    isTrue: false,
    subject: "Chemistry",
    explanation: "Table salt is Sodium Chloride (NaCl). NaHCO₃ is Sodium Bicarbonate (baking soda).",
  },
  {
    id: "tf-17",
    statement: "The legislative organ of government is primarily tasked with enforcing and implementing laws.",
    isTrue: false,
    subject: "Government",
    explanation: "The Executive enforces laws; the Legislature creates/enacts laws; the Judiciary interprets laws.",
  },
  {
    id: "tf-18",
    statement: "In a series electrical circuit, the electric current is identical at all points.",
    isTrue: true,
    subject: "Physics",
    explanation: "Charge has only one single path to flow through in a series circuit, so current I remains constant.",
  },
  {
    id: "tf-19",
    statement: "Zero (0) is classified as an even integer in mathematics.",
    isTrue: true,
    subject: "Mathematics",
    explanation: "0 is evenly divisible by 2 without remainder: 0 ÷ 2 = 0.",
  },
  {
    id: "tf-20",
    statement: "The Economic Community of West African States (ECOWAS) treaty was originally signed in Accra, Ghana.",
    isTrue: false,
    subject: "Social Sciences",
    explanation: "The Treaty of Lagos founding ECOWAS was signed in Lagos, Nigeria, on May 28, 1975.",
  },
];

// Speed Math Problem Generator
export interface MathProblem {
  id: string;
  prompt: string;
  answer: number;
  options: number[];
  category: "Arithmetic" | "Algebra" | "Geometry" | "Percentages";
}

export function generateSpeedMathProblem(level: number = 1): MathProblem {
  const type = Math.floor(Math.random() * 5);
  const id = `math_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  let prompt = "";
  let answer = 0;
  let category: MathProblem["category"] = "Arithmetic";

  if (type === 0) {
    // Rapid Multiplication
    category = "Arithmetic";
    const a = Math.floor(Math.random() * 10) + 4 + level;
    const b = Math.floor(Math.random() * 9) + 3;
    prompt = `${a} × ${b} = ?`;
    answer = a * b;
  } else if (type === 1) {
    // Percentages
    category = "Percentages";
    const percents = [10, 15, 20, 25, 50, 75];
    const p = percents[Math.floor(Math.random() * percents.length)];
    const bases = [40, 60, 80, 100, 120, 200, 240, 300, 400];
    const base = bases[Math.floor(Math.random() * bases.length)];
    prompt = `${p}% of ${base} = ?`;
    answer = Math.round((p / 100) * base);
  } else if (type === 2) {
    // Squares and Roots
    category = "Arithmetic";
    const isRoot = Math.random() > 0.5;
    const num = Math.floor(Math.random() * 12) + 5;
    if (isRoot) {
      prompt = `√${num * num} = ?`;
      answer = num;
    } else {
      prompt = `${num}² = ?`;
      answer = num * num;
    }
  } else if (type === 3) {
    // Quick Algebra
    category = "Algebra";
    const xVal = Math.floor(Math.random() * 9) + 2;
    const coeff = Math.floor(Math.random() * 5) + 2;
    const constant = Math.floor(Math.random() * 15) + 3;
    const result = coeff * xVal + constant;
    prompt = `If ${coeff}x + ${constant} = ${result}, x = ?`;
    answer = xVal;
  } else {
    // Multi-step arithmetic
    category = "Arithmetic";
    const a = Math.floor(Math.random() * 40) + 10;
    const b = Math.floor(Math.random() * 30) + 5;
    const c = Math.floor(Math.random() * 15) + 2;
    prompt = `${a} + ${b} - ${c} = ?`;
    answer = a + b - c;
  }

  // Generate 4 distinct plausible options
  const optionSet = new Set<number>([answer]);
  const offsets = [-10, 10, -1, 1, -2, 2, -5, 5, -12, 12];
  let tries = 0;
  while (optionSet.size < 4 && tries < 30) {
    tries++;
    const delta = offsets[Math.floor(Math.random() * offsets.length)];
    const fake = answer + delta;
    if (fake > 0 && fake !== answer) {
      optionSet.add(fake);
    }
  }
  // Fill remaining if needed
  let fallbackDelta = 3;
  while (optionSet.size < 4) {
    optionSet.add(answer + fallbackDelta);
    fallbackDelta += 2;
  }

  const options = Array.from(optionSet).sort(() => Math.random() - 0.5);

  return {
    id,
    prompt,
    answer,
    options,
    category,
  };
}

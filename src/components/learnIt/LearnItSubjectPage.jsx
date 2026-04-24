import { useEffect, useState } from "react";

const FONT = "-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

const SUBJECT_META = {
  english: { label: "English", emoji: "📖", color: "#3B82F6", lightColor: "rgba(59,130,246,0.12)", borderColor: "rgba(59,130,246,0.25)" },
  finance: { label: "Finance", emoji: "💰", color: "#50c878", lightColor: "rgba(80,200,120,0.12)", borderColor: "rgba(80,200,120,0.25)" },
  demeanor: { label: "Demeanor", emoji: "🎯", color: "#A855F7", lightColor: "rgba(168,85,247,0.12)", borderColor: "rgba(168,85,247,0.25)" },
};

const GAMES = {
  english: [
    { id: "fill_gap", icon: "✏️", title: "Fill the Gap", desc: "Harder sentence completion with grammar, tone, and vocabulary.", type: "game" },
    { id: "word_guess", icon: "🔤", title: "Word Guess", desc: "Guess from a much larger bank of useful five-letter words.", type: "game" },
    { id: "vocab_match", icon: "🔗", title: "Vocab Match", desc: "Match advanced English terms to clear definitions.", type: "game" },
    { id: "sentence", icon: "🔀", title: "Sentence Builder", desc: "Rebuild stronger English sentences in the correct order.", type: "game" },
    { id: "word_trivia", icon: "❓", title: "Word Trivia", desc: "Grammar, punctuation, reading, writing, and language knowledge.", type: "game" },
    { id: "word_ladder", icon: "🪜", title: "Word Ladder", desc: "Change one letter at a time through smarter word paths.", type: "game" },
  ],
  finance: [
    { id: "finance_cards", icon: "📚", title: "Finance Cards", desc: "Quick finance refreshers.", type: "tool" },
    { id: "finance_focus", icon: "📊", title: "Money Focus", desc: "Keep learning money language.", type: "tool" },
  ],
  demeanor: [
    { id: "demeanor_cards", icon: "🗣️", title: "Demeanor Cards", desc: "Quick confidence and presence refreshers.", type: "tool" },
    { id: "demeanor_focus", icon: "🎯", title: "Presence Focus", desc: "Practice calm, direct communication.", type: "tool" },
  ],
};

const FILL_GAP_QS = [
  {
    "sentence": "The speaker gave a ___ explanation that everyone could follow.",
    "options": [
      "clear",
      "cloudy",
      "silent",
      "heavy"
    ],
    "answer": "clear"
  },
  {
    "sentence": "Her argument was ___ because every point had strong evidence.",
    "options": [
      "convincing",
      "fragile",
      "random",
      "empty"
    ],
    "answer": "convincing"
  },
  {
    "sentence": "A good paragraph usually has one main ___.",
    "options": [
      "idea",
      "noise",
      "colour",
      "clock"
    ],
    "answer": "idea"
  },
  {
    "sentence": "The author used vivid ___ to help readers picture the scene.",
    "options": [
      "imagery",
      "payment",
      "silence",
      "gravity"
    ],
    "answer": "imagery"
  },
  {
    "sentence": "He paused to ___ his thoughts before answering.",
    "options": [
      "organise",
      "scatter",
      "borrow",
      "erase"
    ],
    "answer": "organise"
  },
  {
    "sentence": "The instructions were ___, so nobody knew what to do.",
    "options": [
      "unclear",
      "helpful",
      "precise",
      "simple"
    ],
    "answer": "unclear"
  },
  {
    "sentence": "A formal email should use a respectful ___.",
    "options": [
      "tone",
      "joke",
      "rumour",
      "gesture"
    ],
    "answer": "tone"
  },
  {
    "sentence": "She revised the essay to remove ___ words.",
    "options": [
      "unnecessary",
      "golden",
      "musical",
      "invisible"
    ],
    "answer": "unnecessary"
  },
  {
    "sentence": "The sentence became stronger after she chose a more ___ verb.",
    "options": [
      "specific",
      "sleepy",
      "broken",
      "watery"
    ],
    "answer": "specific"
  },
  {
    "sentence": "The article was ___, presenting both sides fairly.",
    "options": [
      "balanced",
      "crooked",
      "furious",
      "lonely"
    ],
    "answer": "balanced"
  },
  {
    "sentence": "He used a dictionary to check the word's ___.",
    "options": [
      "meaning",
      "weather",
      "height",
      "price"
    ],
    "answer": "meaning"
  },
  {
    "sentence": "The story's ___ revealed why the character changed.",
    "options": [
      "ending",
      "password",
      "recipe",
      "volume"
    ],
    "answer": "ending"
  },
  {
    "sentence": "A synonym is a word with a similar ___.",
    "options": [
      "meaning",
      "sound",
      "shape",
      "weight"
    ],
    "answer": "meaning"
  },
  {
    "sentence": "An antonym has the ___ meaning of another word.",
    "options": [
      "opposite",
      "hidden",
      "same",
      "minor"
    ],
    "answer": "opposite"
  },
  {
    "sentence": "She gave a ___ summary instead of retelling every detail.",
    "options": [
      "brief",
      "messy",
      "endless",
      "noisy"
    ],
    "answer": "brief"
  },
  {
    "sentence": "The phrase was ___, so it could be interpreted in two ways.",
    "options": [
      "ambiguous",
      "obvious",
      "tiny",
      "polite"
    ],
    "answer": "ambiguous"
  },
  {
    "sentence": "Strong writers support claims with ___.",
    "options": [
      "evidence",
      "decorations",
      "excuses",
      "riddles"
    ],
    "answer": "evidence"
  },
  {
    "sentence": "The teacher asked us to ___ the poem line by line.",
    "options": [
      "analyse",
      "ignore",
      "fold",
      "chase"
    ],
    "answer": "analyse"
  },
  {
    "sentence": "His speech was ___ because it jumped between unrelated ideas.",
    "options": [
      "confusing",
      "focused",
      "elegant",
      "accurate"
    ],
    "answer": "confusing"
  },
  {
    "sentence": "A comma can separate items in a ___.",
    "options": [
      "list",
      "ladder",
      "cloud",
      "river"
    ],
    "answer": "list"
  },
  {
    "sentence": "The word 'quickly' is usually an ___.",
    "options": [
      "adverb",
      "noun",
      "article",
      "pronoun"
    ],
    "answer": "adverb"
  },
  {
    "sentence": "The word 'courage' is an abstract ___.",
    "options": [
      "noun",
      "verb",
      "preposition",
      "conjunction"
    ],
    "answer": "noun"
  },
  {
    "sentence": "A thesis statement presents the essay's main ___.",
    "options": [
      "argument",
      "font",
      "address",
      "shadow"
    ],
    "answer": "argument"
  },
  {
    "sentence": "The paragraph needs a smoother ___ between ideas.",
    "options": [
      "transition",
      "collision",
      "ending",
      "receipt"
    ],
    "answer": "transition"
  },
  {
    "sentence": "She used quotation marks to show the exact ___.",
    "options": [
      "words",
      "colours",
      "steps",
      "prices"
    ],
    "answer": "words"
  },
  {
    "sentence": "His response was too ___; it took five minutes to say one point.",
    "options": [
      "verbose",
      "concise",
      "silent",
      "formal"
    ],
    "answer": "verbose"
  },
  {
    "sentence": "The editor removed the ___ because it repeated the same idea.",
    "options": [
      "redundancy",
      "headline",
      "metaphor",
      "question"
    ],
    "answer": "redundancy"
  },
  {
    "sentence": "The novel's ___ is the time and place of the story.",
    "options": [
      "setting",
      "grammar",
      "margin",
      "answer"
    ],
    "answer": "setting"
  },
  {
    "sentence": "The ___ of the article is to persuade readers.",
    "options": [
      "purpose",
      "texture",
      "weather",
      "volume"
    ],
    "answer": "purpose"
  },
  {
    "sentence": "A question mark belongs at the end of an ___ sentence.",
    "options": [
      "interrogative",
      "declarative",
      "silent",
      "ordinary"
    ],
    "answer": "interrogative"
  },
  {
    "sentence": "The conclusion should ___ the main idea without copying it.",
    "options": [
      "restate",
      "delete",
      "confuse",
      "hide"
    ],
    "answer": "restate"
  },
  {
    "sentence": "The word 'although' introduces a ___.",
    "options": [
      "contrast",
      "payment",
      "definition",
      "celebration"
    ],
    "answer": "contrast"
  },
  {
    "sentence": "He chose a ___ example to make the point easier to understand.",
    "options": [
      "relevant",
      "distant",
      "random",
      "crooked"
    ],
    "answer": "relevant"
  },
  {
    "sentence": "The report was ___, with facts checked carefully.",
    "options": [
      "accurate",
      "careless",
      "imaginary",
      "rushed"
    ],
    "answer": "accurate"
  },
  {
    "sentence": "She added a ___ to explain where the information came from.",
    "options": [
      "citation",
      "shortcut",
      "question",
      "nickname"
    ],
    "answer": "citation"
  },
  {
    "sentence": "A metaphor compares two things without using ___.",
    "options": [
      "like",
      "because",
      "therefore",
      "however"
    ],
    "answer": "like"
  },
  {
    "sentence": "A simile often uses 'like' or ___.",
    "options": [
      "as",
      "and",
      "but",
      "if"
    ],
    "answer": "as"
  },
  {
    "sentence": "The narrator's ___ affects how the story is told.",
    "options": [
      "perspective",
      "postcode",
      "calendar",
      "volume"
    ],
    "answer": "perspective"
  },
  {
    "sentence": "A persuasive text tries to ___ the reader.",
    "options": [
      "convince",
      "measure",
      "decorate",
      "interrupt"
    ],
    "answer": "convince"
  },
  {
    "sentence": "The sentence lacked ___ because the subject and verb did not match.",
    "options": [
      "agreement",
      "colour",
      "length",
      "speed"
    ],
    "answer": "agreement"
  },
  {
    "sentence": "Good notes capture the ___ points, not every word.",
    "options": [
      "key",
      "tiny",
      "hidden",
      "random"
    ],
    "answer": "key"
  },
  {
    "sentence": "She used context clues to infer the word's ___.",
    "options": [
      "meaning",
      "temperature",
      "sound",
      "size"
    ],
    "answer": "meaning"
  },
  {
    "sentence": "The debate became more ___ when both sides gave evidence.",
    "options": [
      "substantive",
      "careless",
      "sleepy",
      "empty"
    ],
    "answer": "substantive"
  },
  {
    "sentence": "He corrected the ___ mistake before submitting the essay.",
    "options": [
      "grammar",
      "weather",
      "music",
      "drawing"
    ],
    "answer": "grammar"
  },
  {
    "sentence": "The first sentence of a paragraph is often called the ___ sentence.",
    "options": [
      "topic",
      "secret",
      "final",
      "silent"
    ],
    "answer": "topic"
  },
  {
    "sentence": "The author created ___ by delaying the answer.",
    "options": [
      "suspense",
      "discount",
      "furniture",
      "silence"
    ],
    "answer": "suspense"
  },
  {
    "sentence": "She made the instructions more ___ by numbering the steps.",
    "options": [
      "logical",
      "mysterious",
      "emotional",
      "distant"
    ],
    "answer": "logical"
  },
  {
    "sentence": "The word 'their' shows ___.",
    "options": [
      "possession",
      "movement",
      "questioning",
      "comparison"
    ],
    "answer": "possession"
  },
  {
    "sentence": "A reliable source is one you can ___.",
    "options": [
      "trust",
      "fold",
      "colour",
      "borrow"
    ],
    "answer": "trust"
  },
  {
    "sentence": "The essay needed a stronger ___ to grab attention.",
    "options": [
      "introduction",
      "receipt",
      "shadow",
      "alphabet"
    ],
    "answer": "introduction"
  },
  {
    "sentence": "The character's ___ explains what they want.",
    "options": [
      "motivation",
      "postcode",
      "costume",
      "accent"
    ],
    "answer": "motivation"
  },
  {
    "sentence": "The paragraph was ___ because every sentence supported the main idea.",
    "options": [
      "coherent",
      "fragile",
      "unrelated",
      "random"
    ],
    "answer": "coherent"
  },
  {
    "sentence": "She used a ___ tone when writing to the principal.",
    "options": [
      "formal",
      "slangy",
      "careless",
      "playful"
    ],
    "answer": "formal"
  },
  {
    "sentence": "The article's headline was designed to ___ attention.",
    "options": [
      "capture",
      "lose",
      "erase",
      "borrow"
    ],
    "answer": "capture"
  },
  {
    "sentence": "He used ___ language so readers could not misunderstand.",
    "options": [
      "precise",
      "vague",
      "lazy",
      "dull"
    ],
    "answer": "precise"
  },
  {
    "sentence": "The sentence was a ___ because it could stand alone.",
    "options": [
      "clause",
      "prefix",
      "letter",
      "fragment"
    ],
    "answer": "clause"
  },
  {
    "sentence": "The phrase 'in the morning' adds information about ___.",
    "options": [
      "time",
      "ownership",
      "cause",
      "contrast"
    ],
    "answer": "time"
  },
  {
    "sentence": "A prefix is added to the ___ of a word.",
    "options": [
      "beginning",
      "middle",
      "ending",
      "definition"
    ],
    "answer": "beginning"
  },
  {
    "sentence": "A suffix is added to the ___ of a word.",
    "options": [
      "end",
      "front",
      "sound",
      "meaning"
    ],
    "answer": "end"
  },
  {
    "sentence": "The teacher asked for a ___ answer, not a one-word reply.",
    "options": [
      "complete",
      "tiny",
      "secret",
      "blurred"
    ],
    "answer": "complete"
  },
  {
    "sentence": "The writer's ___ was calm even while discussing a serious issue.",
    "options": [
      "tone",
      "height",
      "shape",
      "colour"
    ],
    "answer": "tone"
  },
  {
    "sentence": "The speech was memorable because it used ___ repetition.",
    "options": [
      "purposeful",
      "accidental",
      "empty",
      "silent"
    ],
    "answer": "purposeful"
  }
];

const WORD_LIST = [
  "ABOUT",
  "ABUSE",
  "ACTOR",
  "ACUTE",
  "ADAPT",
  "ADMIT",
  "ADOPT",
  "ADULT",
  "AFTER",
  "AGAIN",
  "AGENT",
  "AGREE",
  "AHEAD",
  "ALARM",
  "ALBUM",
  "ALERT",
  "ALIKE",
  "ALIVE",
  "ALLOW",
  "ALTER",
  "AMONG",
  "ANGER",
  "ANGLE",
  "APPLY",
  "ARENA",
  "ARGUE",
  "ARISE",
  "ASIDE",
  "ASSET",
  "AUDIO",
  "AVOID",
  "BASIC",
  "BASIS",
  "BEACH",
  "BEGIN",
  "BEING",
  "BELOW",
  "BENCH",
  "BIRTH",
  "BLAME",
  "BLOCK",
  "BLOOM",
  "BOARD",
  "BOOST",
  "BRAIN",
  "BRAND",
  "BRAVE",
  "BREAK",
  "BRIEF",
  "BRING",
  "BROAD",
  "BROWN",
  "BUILD",
  "CARRY",
  "CATCH",
  "CAUSE",
  "CHAIN",
  "CHAIR",
  "CHART",
  "CHECK",
  "CHEST",
  "CHIEF",
  "CHILD",
  "CLAIM",
  "CLASS",
  "CLEAN",
  "CLEAR",
  "CLIMB",
  "CLOSE",
  "COACH",
  "COAST",
  "COULD",
  "COUNT",
  "COURT",
  "COVER",
  "CRAFT",
  "CRASH",
  "CREAM",
  "CRISP",
  "CROWD",
  "CROWN",
  "CURVE",
  "DAILY",
  "DANCE",
  "DEALT",
  "DEBTS",
  "DEPTH",
  "DOUBT",
  "DREAM",
  "DRESS",
  "DRIVE",
  "EARLY",
  "EARTH",
  "EIGHT",
  "ELITE",
  "EMPTY",
  "ENEMY",
  "ENJOY",
  "ENTER",
  "EQUAL",
  "ERROR",
  "EVENT",
  "EVERY",
  "EXACT",
  "FAITH",
  "FALSE",
  "FAULT",
  "FIELD",
  "FINAL",
  "FIRST",
  "FLEET",
  "FLOOR",
  "FOCUS",
  "FORCE",
  "FRAME",
  "FRESH",
  "FRONT",
  "FRUIT",
  "GIANT",
  "GIVEN",
  "GLASS",
  "GLOBE",
  "GOING",
  "GRACE",
  "GRADE",
  "GRANT",
  "GREAT",
  "GREEN",
  "GROUP",
  "GROWN",
  "GUARD",
  "GUESS",
  "GUEST",
  "GUIDE",
  "HABIT",
  "HAPPY",
  "HEART",
  "HEAVY",
  "HENCE",
  "HONOR",
  "HOUSE",
  "HUMAN",
  "HUMOR",
  "IDEAL",
  "IMAGE",
  "INDEX",
  "INNER",
  "INPUT",
  "ISSUE",
  "JOINT",
  "JUDGE",
  "KNOWN",
  "LABEL",
  "LARGE",
  "LATER",
  "LAUGH",
  "LAYER",
  "LEARN",
  "LEAST",
  "LEAVE",
  "LEGAL",
  "LEVEL",
  "LIGHT",
  "LIMIT",
  "LOCAL",
  "LOGIC",
  "LOOSE",
  "LUCKY",
  "MAJOR",
  "MARCH",
  "MATCH",
  "MAYBE",
  "MEDIA",
  "MIGHT",
  "MINOR",
  "MODEL",
  "MONEY",
  "MONTH",
  "MORAL",
  "MOTOR",
  "MOUNT",
  "MOUSE",
  "MOUTH",
  "MOVIE",
  "MUSIC",
  "NEEDS",
  "NEVER",
  "NIGHT",
  "NOISE",
  "NORTH",
  "NOVEL",
  "NURSE",
  "OFFER",
  "OFTEN",
  "ORDER",
  "OTHER",
  "OUGHT",
  "OWNER",
  "PANEL",
  "PAPER",
  "PARTY",
  "PEACE",
  "PHASE",
  "PHONE",
  "PIECE",
  "PILOT",
  "PITCH",
  "PLACE",
  "PLAIN",
  "PLANE",
  "PLANT",
  "POINT",
  "POWER",
  "PRESS",
  "PRICE",
  "PRIDE",
  "PRIME",
  "PRINT",
  "PRIOR",
  "PROOF",
  "PROUD",
  "QUICK",
  "QUIET",
  "RADIO",
  "RAISE",
  "RANGE",
  "RAPID",
  "REACH",
  "READY",
  "REALM",
  "REFER",
  "RIGHT",
  "RIVER",
  "ROUGH",
  "ROUND",
  "ROUTE",
  "ROYAL",
  "SCALE",
  "SCENE",
  "SCOPE",
  "SCORE",
  "SENSE",
  "SERVE",
  "SHARE",
  "SHARP",
  "SHEET",
  "SHIFT",
  "SHORT",
  "SKILL",
  "SMART",
  "SMILE",
  "SOLID",
  "SOUND",
  "SOUTH",
  "SPACE",
  "SPEAK",
  "SPEED",
  "SPEND",
  "SPORT",
  "STAFF",
  "STAGE",
  "STAND",
  "START",
  "STATE",
  "STEAM",
  "STEEL",
  "STILL",
  "STOCK",
  "STONE",
  "STORE",
  "STORY",
  "STYLE",
  "SUGAR",
  "TABLE",
  "TEACH",
  "THANK",
  "THEME",
  "THINK",
  "THROW",
  "TIGHT",
  "TIMER",
  "TITLE",
  "TODAY",
  "TOPIC",
  "TOTAL",
  "TOUCH",
  "TRACE",
  "TRACK",
  "TRADE",
  "TRAIN",
  "TREAT",
  "TREND",
  "TRIAL",
  "TRUST",
  "TRUTH",
  "UNION",
  "UNTIL",
  "UPPER",
  "URBAN",
  "USAGE",
  "VALUE",
  "VIDEO",
  "VISIT",
  "VOICE",
  "WASTE",
  "WATCH",
  "WATER",
  "WHERE",
  "WHILE",
  "WHOLE",
  "WOMAN",
  "WORLD",
  "WORTH",
  "WRITE",
  "WRONG",
  "YOUNG"
];

const VOCAB_PAIRS = [
  {
    "word": "Eloquent",
    "def": "Fluent, expressive, and persuasive when speaking or writing"
  },
  {
    "word": "Diligent",
    "def": "Showing careful and steady effort"
  },
  {
    "word": "Resilient",
    "def": "Able to recover after difficulty"
  },
  {
    "word": "Concise",
    "def": "Clear while using few words"
  },
  {
    "word": "Ambiguous",
    "def": "Able to be understood in more than one way"
  },
  {
    "word": "Verbose",
    "def": "Using more words than necessary"
  },
  {
    "word": "Infer",
    "def": "Work out a meaning from clues"
  },
  {
    "word": "Context",
    "def": "The surrounding words or situation that help explain meaning"
  },
  {
    "word": "Evidence",
    "def": "Facts or examples used to support a point"
  },
  {
    "word": "Thesis",
    "def": "The main argument of an essay"
  },
  {
    "word": "Coherent",
    "def": "Logical and easy to follow"
  },
  {
    "word": "Persuasive",
    "def": "Intended to convince someone"
  },
  {
    "word": "Objective",
    "def": "Based on facts rather than feelings"
  },
  {
    "word": "Subjective",
    "def": "Based on personal opinion or feeling"
  },
  {
    "word": "Tone",
    "def": "The attitude shown by a piece of writing"
  },
  {
    "word": "Audience",
    "def": "The people a text is written or spoken for"
  },
  {
    "word": "Purpose",
    "def": "The reason a text is created"
  },
  {
    "word": "Metaphor",
    "def": "A direct comparison between unlike things"
  },
  {
    "word": "Simile",
    "def": "A comparison using like or as"
  },
  {
    "word": "Alliteration",
    "def": "Repeated starting sounds in nearby words"
  },
  {
    "word": "Irony",
    "def": "A contrast between expectation and reality"
  },
  {
    "word": "Foreshadowing",
    "def": "Hints about what may happen later"
  },
  {
    "word": "Protagonist",
    "def": "The main character in a story"
  },
  {
    "word": "Antagonist",
    "def": "A character or force opposing the main character"
  },
  {
    "word": "Motivation",
    "def": "The reason a character acts"
  },
  {
    "word": "Conflict",
    "def": "A struggle between opposing forces"
  },
  {
    "word": "Resolution",
    "def": "The part where the main problem is settled"
  },
  {
    "word": "Theme",
    "def": "A deeper message or idea in a text"
  },
  {
    "word": "Setting",
    "def": "The time and place of a story"
  },
  {
    "word": "Narrator",
    "def": "The voice telling the story"
  },
  {
    "word": "Perspective",
    "def": "A point of view"
  },
  {
    "word": "Bias",
    "def": "An unfair preference for one side"
  },
  {
    "word": "Citation",
    "def": "A note showing the source of information"
  },
  {
    "word": "Paraphrase",
    "def": "Restate an idea in your own words"
  },
  {
    "word": "Summarise",
    "def": "Give the main points briefly"
  },
  {
    "word": "Analyse",
    "def": "Break something down to understand it"
  },
  {
    "word": "Evaluate",
    "def": "Judge the value or quality of something"
  },
  {
    "word": "Compare",
    "def": "Explain similarities"
  },
  {
    "word": "Contrast",
    "def": "Explain differences"
  },
  {
    "word": "Transition",
    "def": "A word or phrase that links ideas"
  },
  {
    "word": "Clause",
    "def": "A group of words with a subject and verb"
  },
  {
    "word": "Fragment",
    "def": "An incomplete sentence"
  },
  {
    "word": "Predicate",
    "def": "The part of a sentence that says what the subject does or is"
  },
  {
    "word": "Adjective",
    "def": "A word that describes a noun"
  },
  {
    "word": "Adverb",
    "def": "A word that describes a verb, adjective, or another adverb"
  },
  {
    "word": "Preposition",
    "def": "A word showing relationship, such as in, on, or before"
  },
  {
    "word": "Conjunction",
    "def": "A word that joins words or ideas"
  },
  {
    "word": "Pronoun",
    "def": "A word used in place of a noun"
  },
  {
    "word": "Synonym",
    "def": "A word with a similar meaning"
  },
  {
    "word": "Antonym",
    "def": "A word with the opposite meaning"
  },
  {
    "word": "Prefix",
    "def": "Letters added to the start of a word"
  },
  {
    "word": "Suffix",
    "def": "Letters added to the end of a word"
  },
  {
    "word": "Root Word",
    "def": "The basic part of a word"
  },
  {
    "word": "Nuance",
    "def": "A small but important difference in meaning"
  },
  {
    "word": "Connotation",
    "def": "The feeling or idea linked to a word"
  },
  {
    "word": "Denotation",
    "def": "The literal dictionary meaning of a word"
  },
  {
    "word": "Rhetoric",
    "def": "Language used to persuade or influence"
  },
  {
    "word": "Anecdote",
    "def": "A short personal story used to make a point"
  },
  {
    "word": "Hyperbole",
    "def": "Deliberate exaggeration"
  },
  {
    "word": "Credible",
    "def": "Believable and trustworthy"
  },
  {
    "word": "Plagiarism",
    "def": "Using someone else's work without credit"
  },
  {
    "word": "Syntax",
    "def": "The arrangement of words in a sentence"
  },
  {
    "word": "Punctuation",
    "def": "Marks that help organise meaning in writing"
  },
  {
    "word": "Register",
    "def": "The level of formality in language"
  }
];

const SENTENCE_QS = [
  {
    "words": [
      "strong",
      "ideas",
      "to",
      "understand",
      "makes",
      "easier",
      "Clear",
      "writing"
    ],
    "answer": [
      "Clear",
      "writing",
      "makes",
      "strong",
      "ideas",
      "easier",
      "to",
      "understand"
    ]
  },
  {
    "words": [
      "uses",
      "powerful",
      "sentence",
      "precise",
      "A",
      "words"
    ],
    "answer": [
      "A",
      "powerful",
      "sentence",
      "uses",
      "precise",
      "words"
    ]
  },
  {
    "words": [
      "evidence",
      "for",
      "look",
      "judging",
      "before",
      "readers",
      "a",
      "claim",
      "Good"
    ],
    "answer": [
      "Good",
      "readers",
      "look",
      "for",
      "evidence",
      "before",
      "judging",
      "a",
      "claim"
    ]
  },
  {
    "words": [
      "paragraph",
      "the",
      "The",
      "idea",
      "guide",
      "should",
      "main",
      "whole"
    ],
    "answer": [
      "The",
      "main",
      "idea",
      "should",
      "guide",
      "the",
      "whole",
      "paragraph"
    ]
  },
  {
    "words": [
      "they",
      "Strong",
      "speakers",
      "pause",
      "before",
      "answer"
    ],
    "answer": [
      "Strong",
      "speakers",
      "pause",
      "before",
      "they",
      "answer"
    ]
  },
  {
    "words": [
      "clear",
      "argument",
      "a",
      "Every",
      "needs",
      "essay"
    ],
    "answer": [
      "Every",
      "essay",
      "needs",
      "a",
      "clear",
      "argument"
    ]
  },
  {
    "words": [
      "keep",
      "points",
      "A",
      "the",
      "only",
      "key",
      "should",
      "summary"
    ],
    "answer": [
      "A",
      "summary",
      "should",
      "keep",
      "only",
      "the",
      "key",
      "points"
    ]
  },
  {
    "words": [
      "sharper",
      "revise",
      "sentences",
      "meaning",
      "to",
      "Writers",
      "make"
    ],
    "answer": [
      "Writers",
      "revise",
      "sentences",
      "to",
      "make",
      "meaning",
      "sharper"
    ]
  },
  {
    "words": [
      "widely",
      "Reading",
      "vocabulary",
      "builds",
      "and",
      "confidence"
    ],
    "answer": [
      "Reading",
      "widely",
      "builds",
      "vocabulary",
      "and",
      "confidence"
    ]
  },
  {
    "words": [
      "sound",
      "should",
      "and",
      "email",
      "clear",
      "respectful",
      "A",
      "formal"
    ],
    "answer": [
      "A",
      "formal",
      "email",
      "should",
      "sound",
      "respectful",
      "and",
      "clear"
    ]
  },
  {
    "words": [
      "not",
      "facts",
      "best",
      "answer",
      "uses",
      "The",
      "guesswork"
    ],
    "answer": [
      "The",
      "best",
      "answer",
      "uses",
      "facts",
      "not",
      "guesswork"
    ]
  },
  {
    "words": [
      "A",
      "introduces",
      "the",
      "point",
      "main",
      "sentence",
      "topic"
    ],
    "answer": [
      "A",
      "topic",
      "sentence",
      "introduces",
      "the",
      "main",
      "point"
    ]
  },
  {
    "words": [
      "sentence",
      "Transitions",
      "from",
      "the",
      "one",
      "to",
      "next",
      "flow",
      "ideas",
      "help"
    ],
    "answer": [
      "Transitions",
      "help",
      "ideas",
      "flow",
      "from",
      "one",
      "sentence",
      "to",
      "the",
      "next"
    ]
  },
  {
    "words": [
      "leaves",
      "conclusion",
      "the",
      "clarity",
      "strong",
      "A",
      "with",
      "reader"
    ],
    "answer": [
      "A",
      "strong",
      "conclusion",
      "leaves",
      "the",
      "reader",
      "with",
      "clarity"
    ]
  },
  {
    "words": [
      "Careful",
      "change",
      "meaning",
      "of",
      "can",
      "sentence",
      "a",
      "punctuation",
      "the"
    ],
    "answer": [
      "Careful",
      "punctuation",
      "can",
      "change",
      "the",
      "meaning",
      "of",
      "a",
      "sentence"
    ]
  },
  {
    "words": [
      "The",
      "imagery",
      "create",
      "to",
      "picture",
      "uses",
      "author",
      "clear",
      "a"
    ],
    "answer": [
      "The",
      "author",
      "uses",
      "imagery",
      "to",
      "create",
      "a",
      "clear",
      "picture"
    ]
  },
  {
    "words": [
      "side",
      "than",
      "A",
      "balanced",
      "argument",
      "shows",
      "more",
      "one"
    ],
    "answer": [
      "A",
      "balanced",
      "argument",
      "shows",
      "more",
      "than",
      "one",
      "side"
    ]
  },
  {
    "words": [
      "ideas",
      "instead",
      "capture",
      "everything",
      "of",
      "Good",
      "copying",
      "notes"
    ],
    "answer": [
      "Good",
      "notes",
      "capture",
      "ideas",
      "instead",
      "of",
      "copying",
      "everything"
    ]
  },
  {
    "words": [
      "feel",
      "make",
      "verbs",
      "Specific",
      "writing",
      "more",
      "alive"
    ],
    "answer": [
      "Specific",
      "verbs",
      "make",
      "writing",
      "feel",
      "more",
      "alive"
    ]
  },
  {
    "words": [
      "during",
      "speaker",
      "a",
      "used",
      "tone",
      "The",
      "debate",
      "calm",
      "the"
    ],
    "answer": [
      "The",
      "speaker",
      "used",
      "a",
      "calm",
      "tone",
      "during",
      "the",
      "debate"
    ]
  },
  {
    "words": [
      "whole",
      "weaken",
      "An",
      "a",
      "argument",
      "can",
      "source",
      "unreliable"
    ],
    "answer": [
      "An",
      "unreliable",
      "source",
      "can",
      "weaken",
      "a",
      "whole",
      "argument"
    ]
  },
  {
    "words": [
      "readers",
      "unknown",
      "help",
      "Context",
      "meanings",
      "clues",
      "infer"
    ],
    "answer": [
      "Context",
      "clues",
      "help",
      "readers",
      "infer",
      "unknown",
      "meanings"
    ]
  },
  {
    "words": [
      "compares",
      "two",
      "A",
      "metaphor",
      "things",
      "directly"
    ],
    "answer": [
      "A",
      "metaphor",
      "compares",
      "two",
      "things",
      "directly"
    ]
  },
  {
    "words": [
      "words",
      "simile",
      "like",
      "or",
      "uses",
      "as",
      "the",
      "A",
      "often"
    ],
    "answer": [
      "A",
      "simile",
      "often",
      "uses",
      "the",
      "words",
      "like",
      "or",
      "as"
    ]
  },
  {
    "words": [
      "the",
      "reader",
      "what",
      "The",
      "narrator",
      "controls",
      "knows"
    ],
    "answer": [
      "The",
      "narrator",
      "controls",
      "what",
      "the",
      "reader",
      "knows"
    ]
  },
  {
    "words": [
      "changes",
      "is",
      "their",
      "tested",
      "A",
      "when",
      "motivation",
      "character"
    ],
    "answer": [
      "A",
      "character",
      "changes",
      "when",
      "their",
      "motivation",
      "is",
      "tested"
    ]
  },
  {
    "words": [
      "Grammar",
      "clear",
      "sentences",
      "help",
      "rules",
      "stay"
    ],
    "answer": [
      "Grammar",
      "rules",
      "help",
      "sentences",
      "stay",
      "clear"
    ]
  },
  {
    "words": [
      "The",
      "is",
      "ideas",
      "draft",
      "begin",
      "where",
      "first"
    ],
    "answer": [
      "The",
      "first",
      "draft",
      "is",
      "where",
      "ideas",
      "begin"
    ]
  },
  {
    "words": [
      "is",
      "where",
      "gets",
      "Revision",
      "stronger",
      "writing",
      "good"
    ],
    "answer": [
      "Revision",
      "is",
      "where",
      "good",
      "writing",
      "gets",
      "stronger"
    ]
  },
  {
    "words": [
      "ends",
      "a",
      "direct",
      "question",
      "question",
      "mark",
      "A"
    ],
    "answer": [
      "A",
      "question",
      "mark",
      "ends",
      "a",
      "direct",
      "question"
    ]
  },
  {
    "words": [
      "the",
      "show",
      "exact",
      "marks",
      "someone",
      "words",
      "said",
      "Quotation"
    ],
    "answer": [
      "Quotation",
      "marks",
      "show",
      "the",
      "exact",
      "words",
      "someone",
      "said"
    ]
  },
  {
    "words": [
      "main",
      "idea",
      "focus",
      "should",
      "paragraph",
      "on",
      "A",
      "one"
    ],
    "answer": [
      "A",
      "paragraph",
      "should",
      "focus",
      "on",
      "one",
      "main",
      "idea"
    ]
  },
  {
    "words": [
      "should",
      "without",
      "The",
      "readers",
      "misleading",
      "headline",
      "attention",
      "capture"
    ],
    "answer": [
      "The",
      "headline",
      "should",
      "capture",
      "attention",
      "without",
      "misleading",
      "readers"
    ]
  },
  {
    "words": [
      "change",
      "tries",
      "think",
      "to",
      "what",
      "Persuasive",
      "writing",
      "people"
    ],
    "answer": [
      "Persuasive",
      "writing",
      "tries",
      "to",
      "change",
      "what",
      "people",
      "think"
    ]
  },
  {
    "words": [
      "keeps",
      "language",
      "facts",
      "out",
      "Objective",
      "of",
      "emotion",
      "the"
    ],
    "answer": [
      "Objective",
      "language",
      "keeps",
      "emotion",
      "out",
      "of",
      "the",
      "facts"
    ]
  },
  {
    "words": [
      "personal",
      "opinions",
      "feelings",
      "language",
      "Subjective",
      "shows",
      "or"
    ],
    "answer": [
      "Subjective",
      "language",
      "shows",
      "personal",
      "feelings",
      "or",
      "opinions"
    ]
  },
  {
    "words": [
      "checked",
      "A",
      "be",
      "source",
      "and",
      "can",
      "credible",
      "trusted"
    ],
    "answer": [
      "A",
      "credible",
      "source",
      "can",
      "be",
      "checked",
      "and",
      "trusted"
    ]
  },
  {
    "words": [
      "audience",
      "match",
      "speakers",
      "message",
      "The",
      "their",
      "to",
      "their",
      "best"
    ],
    "answer": [
      "The",
      "best",
      "speakers",
      "match",
      "their",
      "message",
      "to",
      "their",
      "audience"
    ]
  },
  {
    "words": [
      "impact",
      "can",
      "speed",
      "create",
      "and",
      "sentences",
      "Short"
    ],
    "answer": [
      "Short",
      "sentences",
      "can",
      "create",
      "speed",
      "and",
      "impact"
    ]
  },
  {
    "words": [
      "can",
      "complex",
      "relationships",
      "sentences",
      "Longer",
      "ideas",
      "between",
      "show"
    ],
    "answer": [
      "Longer",
      "sentences",
      "can",
      "show",
      "complex",
      "relationships",
      "between",
      "ideas"
    ]
  },
  {
    "words": [
      "The",
      "the",
      "ending",
      "main",
      "conflict",
      "should",
      "resolve"
    ],
    "answer": [
      "The",
      "ending",
      "should",
      "resolve",
      "the",
      "main",
      "conflict"
    ]
  },
  {
    "words": [
      "hints",
      "about",
      "Foreshadowing",
      "future",
      "small",
      "events",
      "gives"
    ],
    "answer": [
      "Foreshadowing",
      "gives",
      "small",
      "hints",
      "about",
      "future",
      "events"
    ]
  },
  {
    "words": [
      "often",
      "reversed",
      "creates",
      "surprise",
      "because",
      "are",
      "Irony",
      "expectations"
    ],
    "answer": [
      "Irony",
      "often",
      "creates",
      "surprise",
      "because",
      "expectations",
      "are",
      "reversed"
    ]
  },
  {
    "words": [
      "a",
      "make",
      "sound",
      "can",
      "memorable",
      "phrase",
      "Alliteration"
    ],
    "answer": [
      "Alliteration",
      "can",
      "make",
      "a",
      "phrase",
      "sound",
      "memorable"
    ]
  },
  {
    "words": [
      "the",
      "word",
      "changes",
      "A",
      "a",
      "of",
      "from",
      "prefix",
      "front",
      "meaning"
    ],
    "answer": [
      "A",
      "prefix",
      "changes",
      "meaning",
      "from",
      "the",
      "front",
      "of",
      "a",
      "word"
    ]
  },
  {
    "words": [
      "A",
      "from",
      "meaning",
      "of",
      "word",
      "suffix",
      "changes",
      "the",
      "a",
      "end"
    ],
    "answer": [
      "A",
      "suffix",
      "changes",
      "meaning",
      "from",
      "the",
      "end",
      "of",
      "a",
      "word"
    ]
  },
  {
    "words": [
      "express",
      "Strong",
      "vocabulary",
      "you",
      "precision",
      "with",
      "ideas",
      "helps"
    ],
    "answer": [
      "Strong",
      "vocabulary",
      "helps",
      "you",
      "express",
      "ideas",
      "with",
      "precision"
    ]
  },
  {
    "words": [
      "reader",
      "should",
      "example",
      "matters",
      "each",
      "why",
      "understand",
      "The"
    ],
    "answer": [
      "The",
      "reader",
      "should",
      "understand",
      "why",
      "each",
      "example",
      "matters"
    ]
  },
  {
    "words": [
      "other",
      "understand",
      "that",
      "the",
      "A",
      "shows",
      "counterargument",
      "you",
      "side"
    ],
    "answer": [
      "A",
      "counterargument",
      "shows",
      "that",
      "you",
      "understand",
      "the",
      "other",
      "side"
    ]
  },
  {
    "words": [
      "is",
      "rebuttal",
      "counterargument",
      "A",
      "weaker",
      "the",
      "why",
      "explains"
    ],
    "answer": [
      "A",
      "rebuttal",
      "explains",
      "why",
      "the",
      "counterargument",
      "is",
      "weaker"
    ]
  },
  {
    "words": [
      "make",
      "simple",
      "can",
      "powerful",
      "a",
      "Careful",
      "idea",
      "choice",
      "word"
    ],
    "answer": [
      "Careful",
      "word",
      "choice",
      "can",
      "make",
      "a",
      "simple",
      "idea",
      "powerful"
    ]
  },
  {
    "words": [
      "The",
      "readers",
      "argument",
      "the",
      "introduction",
      "should",
      "for",
      "prepare"
    ],
    "answer": [
      "The",
      "introduction",
      "should",
      "prepare",
      "readers",
      "for",
      "the",
      "argument"
    ]
  },
  {
    "words": [
      "claim",
      "to",
      "must",
      "clearly",
      "the",
      "Evidence",
      "connect"
    ],
    "answer": [
      "Evidence",
      "must",
      "connect",
      "clearly",
      "to",
      "the",
      "claim"
    ]
  },
  {
    "words": [
      "sentence",
      "missing",
      "part",
      "complete",
      "is",
      "fragment",
      "a",
      "of",
      "A"
    ],
    "answer": [
      "A",
      "fragment",
      "is",
      "missing",
      "part",
      "of",
      "a",
      "complete",
      "sentence"
    ]
  },
  {
    "words": [
      "clause",
      "a",
      "contains",
      "verb",
      "and",
      "A",
      "subject",
      "a"
    ],
    "answer": [
      "A",
      "clause",
      "contains",
      "a",
      "subject",
      "and",
      "a",
      "verb"
    ]
  },
  {
    "words": [
      "subject",
      "or",
      "what",
      "predicate",
      "the",
      "tells",
      "does",
      "The",
      "is"
    ],
    "answer": [
      "The",
      "predicate",
      "tells",
      "what",
      "the",
      "subject",
      "does",
      "or",
      "is"
    ]
  },
  {
    "words": [
      "replace",
      "noun",
      "avoid",
      "pronoun",
      "to",
      "repetition",
      "can",
      "a",
      "A"
    ],
    "answer": [
      "A",
      "pronoun",
      "can",
      "replace",
      "a",
      "noun",
      "to",
      "avoid",
      "repetition"
    ]
  },
  {
    "words": [
      "or",
      "connect",
      "phrases",
      "words",
      "Conjunctions",
      "clauses"
    ],
    "answer": [
      "Conjunctions",
      "connect",
      "words",
      "phrases",
      "or",
      "clauses"
    ]
  },
  {
    "words": [
      "ideas",
      "sentence",
      "Prepositions",
      "between",
      "in",
      "a",
      "show",
      "relationships"
    ],
    "answer": [
      "Prepositions",
      "show",
      "relationships",
      "between",
      "ideas",
      "in",
      "a",
      "sentence"
    ]
  },
  {
    "words": [
      "clear",
      "confident",
      "A",
      "answer",
      "polished",
      "sounds",
      "and",
      "complete"
    ],
    "answer": [
      "A",
      "polished",
      "answer",
      "sounds",
      "clear",
      "complete",
      "and",
      "confident"
    ]
  }
];

const WORD_TRIVIA = [
  {
    "q": "Which word is a noun?",
    "opts": [
      "Quickly",
      "Bravery",
      "Jump",
      "Blue"
    ],
    "ans": "Bravery"
  },
  {
    "q": "Which word is a verb?",
    "opts": [
      "Decision",
      "Decide",
      "Careful",
      "Silent"
    ],
    "ans": "Decide"
  },
  {
    "q": "Which word is an adjective?",
    "opts": [
      "Carefully",
      "Bright",
      "Run",
      "Chair"
    ],
    "ans": "Bright"
  },
  {
    "q": "Which word is an adverb?",
    "opts": [
      "Slowly",
      "Table",
      "Green",
      "Create"
    ],
    "ans": "Slowly"
  },
  {
    "q": "What is a synonym for 'happy'?",
    "opts": [
      "Joyful",
      "Angry",
      "Tired",
      "Empty"
    ],
    "ans": "Joyful"
  },
  {
    "q": "What is an antonym for 'expand'?",
    "opts": [
      "Grow",
      "Shrink",
      "Open",
      "Build"
    ],
    "ans": "Shrink"
  },
  {
    "q": "What does 'concise' mean?",
    "opts": [
      "Clear and brief",
      "Very loud",
      "Hard to read",
      "Full of jokes"
    ],
    "ans": "Clear and brief"
  },
  {
    "q": "What does 'ambiguous' mean?",
    "opts": [
      "Having more than one possible meaning",
      "Perfectly clear",
      "Written in rhyme",
      "Extremely short"
    ],
    "ans": "Having more than one possible meaning"
  },
  {
    "q": "Which sentence is a question?",
    "opts": [
      "Close the door.",
      "Where is my book?",
      "The sky is blue.",
      "I like reading."
    ],
    "ans": "Where is my book?"
  },
  {
    "q": "Which punctuation ends an exclamation?",
    "opts": [
      ".",
      "?",
      "!",
      ";"
    ],
    "ans": "!"
  },
  {
    "q": "What is a metaphor?",
    "opts": [
      "A direct comparison",
      "A spelling rule",
      "A list of facts",
      "A type of noun"
    ],
    "ans": "A direct comparison"
  },
  {
    "q": "What is a simile?",
    "opts": [
      "A comparison using like or as",
      "A paragraph ending",
      "A word with opposite meaning",
      "A formal greeting"
    ],
    "ans": "A comparison using like or as"
  },
  {
    "q": "Which is a proper noun?",
    "opts": [
      "city",
      "teacher",
      "Australia",
      "river"
    ],
    "ans": "Australia"
  },
  {
    "q": "Which is a common noun?",
    "opts": [
      "Adelaide",
      "Keanu",
      "school",
      "Monday"
    ],
    "ans": "school"
  },
  {
    "q": "What is the subject of 'The dog barked loudly'?",
    "opts": [
      "The dog",
      "barked",
      "loudly",
      "dog barked"
    ],
    "ans": "The dog"
  },
  {
    "q": "What is the verb in 'She writes every day'?",
    "opts": [
      "She",
      "writes",
      "every",
      "day"
    ],
    "ans": "writes"
  },
  {
    "q": "Which word is a conjunction?",
    "opts": [
      "Because",
      "Under",
      "Quick",
      "Chair"
    ],
    "ans": "Because"
  },
  {
    "q": "Which word is a preposition?",
    "opts": [
      "Before",
      "Beautiful",
      "Laugh",
      "Idea"
    ],
    "ans": "Before"
  },
  {
    "q": "What does a thesis statement do?",
    "opts": [
      "States the main argument",
      "Lists every source",
      "Ends the story",
      "Defines every word"
    ],
    "ans": "States the main argument"
  },
  {
    "q": "What is evidence?",
    "opts": [
      "Support for a claim",
      "A random opinion",
      "The title only",
      "A spelling mistake"
    ],
    "ans": "Support for a claim"
  },
  {
    "q": "What does 'infer' mean?",
    "opts": [
      "Work out from clues",
      "Copy exactly",
      "Read aloud",
      "Disagree loudly"
    ],
    "ans": "Work out from clues"
  },
  {
    "q": "Which word is closest to 'reliable'?",
    "opts": [
      "Trustworthy",
      "Colourful",
      "Tiny",
      "Noisy"
    ],
    "ans": "Trustworthy"
  },
  {
    "q": "Which word means 'wordy'?",
    "opts": [
      "Verbose",
      "Concise",
      "Brief",
      "Silent"
    ],
    "ans": "Verbose"
  },
  {
    "q": "Which phrase is formal?",
    "opts": [
      "Could you please assist me?",
      "Yo help me out",
      "Gimme that",
      "Nah I'm good"
    ],
    "ans": "Could you please assist me?"
  },
  {
    "q": "What is tone in writing?",
    "opts": [
      "The writer's attitude",
      "The page number",
      "The sentence length only",
      "The font size"
    ],
    "ans": "The writer's attitude"
  },
  {
    "q": "What is audience?",
    "opts": [
      "Who the text is for",
      "Where the text is printed",
      "How many commas it has",
      "The final sentence"
    ],
    "ans": "Who the text is for"
  },
  {
    "q": "What is purpose?",
    "opts": [
      "Why a text was created",
      "The longest word",
      "A type of rhyme",
      "A spelling pattern"
    ],
    "ans": "Why a text was created"
  },
  {
    "q": "Which is an example of alliteration?",
    "opts": [
      "Bright birds build bridges",
      "The bird is blue",
      "She walked home",
      "Time passed slowly"
    ],
    "ans": "Bright birds build bridges"
  },
  {
    "q": "What is a paragraph mainly built around?",
    "opts": [
      "One main idea",
      "Random topics",
      "Only quotes",
      "A title"
    ],
    "ans": "One main idea"
  },
  {
    "q": "Which is a complete sentence?",
    "opts": [
      "Because it rained",
      "The tall building",
      "She finished the task.",
      "Running through the park"
    ],
    "ans": "She finished the task."
  },
  {
    "q": "Which is a sentence fragment?",
    "opts": [
      "Although he tried",
      "He tried again.",
      "They left early.",
      "The cat slept."
    ],
    "ans": "Although he tried"
  },
  {
    "q": "What is plagiarism?",
    "opts": [
      "Using someone's work without credit",
      "Making notes",
      "Reading quickly",
      "Checking spelling"
    ],
    "ans": "Using someone's work without credit"
  },
  {
    "q": "What is a citation?",
    "opts": [
      "A note showing the source",
      "A type of verb",
      "A paragraph break",
      "A hidden meaning"
    ],
    "ans": "A note showing the source"
  },
  {
    "q": "What does 'objective' mean?",
    "opts": [
      "Fact-based",
      "Emotion-based",
      "Funny",
      "Confused"
    ],
    "ans": "Fact-based"
  },
  {
    "q": "What does 'subjective' mean?",
    "opts": [
      "Opinion-based",
      "Always false",
      "Written badly",
      "Fact-only"
    ],
    "ans": "Opinion-based"
  },
  {
    "q": "What is foreshadowing?",
    "opts": [
      "Hints about future events",
      "A repeated vowel sound",
      "A grammar mistake",
      "The final paragraph"
    ],
    "ans": "Hints about future events"
  },
  {
    "q": "What is irony?",
    "opts": [
      "A contrast between expectation and reality",
      "A list of instructions",
      "A type of dictionary",
      "A short email"
    ],
    "ans": "A contrast between expectation and reality"
  },
  {
    "q": "What is the protagonist?",
    "opts": [
      "The main character",
      "The villain only",
      "The setting",
      "The narrator's name"
    ],
    "ans": "The main character"
  },
  {
    "q": "What is the antagonist?",
    "opts": [
      "A force opposing the main character",
      "A happy ending",
      "A punctuation mark",
      "A type of synonym"
    ],
    "ans": "A force opposing the main character"
  },
  {
    "q": "What is setting?",
    "opts": [
      "Time and place",
      "Main argument",
      "Author's surname",
      "Number of chapters"
    ],
    "ans": "Time and place"
  },
  {
    "q": "What is theme?",
    "opts": [
      "A deeper message",
      "A spelling rule",
      "A comma pattern",
      "A type of font"
    ],
    "ans": "A deeper message"
  },
  {
    "q": "Which word means 'to judge quality'?",
    "opts": [
      "Evaluate",
      "Decorate",
      "Interrupt",
      "Whisper"
    ],
    "ans": "Evaluate"
  },
  {
    "q": "Which word means 'to break down and study'?",
    "opts": [
      "Analyse",
      "Ignore",
      "Invent",
      "Erase"
    ],
    "ans": "Analyse"
  },
  {
    "q": "What is a transition?",
    "opts": [
      "A link between ideas",
      "A type of noun",
      "A spelling error",
      "A book cover"
    ],
    "ans": "A link between ideas"
  },
  {
    "q": "Which transition shows contrast?",
    "opts": [
      "However",
      "Therefore",
      "Also",
      "For example"
    ],
    "ans": "However"
  },
  {
    "q": "Which transition shows cause and effect?",
    "opts": [
      "Therefore",
      "Meanwhile",
      "Similarly",
      "Instead"
    ],
    "ans": "Therefore"
  },
  {
    "q": "Which word has a prefix?",
    "opts": [
      "Unclear",
      "Clear",
      "Chair",
      "Table"
    ],
    "ans": "Unclear"
  },
  {
    "q": "Which word has a suffix?",
    "opts": [
      "Careful",
      "Care",
      "Car",
      "Cat"
    ],
    "ans": "Careful"
  },
  {
    "q": "What is the root of 'unhelpful'?",
    "opts": [
      "help",
      "un",
      "ful",
      "helpful"
    ],
    "ans": "help"
  },
  {
    "q": "What does connotation mean?",
    "opts": [
      "The feeling linked to a word",
      "The exact dictionary meaning",
      "A paragraph's title",
      "A grammar rule"
    ],
    "ans": "The feeling linked to a word"
  },
  {
    "q": "What does denotation mean?",
    "opts": [
      "The literal meaning",
      "The emotional feeling",
      "The sound of a word",
      "The speaker's volume"
    ],
    "ans": "The literal meaning"
  },
  {
    "q": "Which word is more precise than 'good'?",
    "opts": [
      "Effective",
      "Thing",
      "Nice",
      "Okay"
    ],
    "ans": "Effective"
  },
  {
    "q": "Which is a stronger verb than 'went'?",
    "opts": [
      "Rushed",
      "Was",
      "Had",
      "Did"
    ],
    "ans": "Rushed"
  },
  {
    "q": "What does 'redundant' mean?",
    "opts": [
      "Repeated unnecessarily",
      "Very important",
      "Hard to spell",
      "Completely new"
    ],
    "ans": "Repeated unnecessarily"
  },
  {
    "q": "What does 'credible' mean?",
    "opts": [
      "Believable",
      "Colourful",
      "Expensive",
      "Confusing"
    ],
    "ans": "Believable"
  },
  {
    "q": "Which sentence uses active voice?",
    "opts": [
      "The student solved the problem.",
      "The problem was solved by the student.",
      "The problem had been solved.",
      "The answer was given."
    ],
    "ans": "The student solved the problem."
  },
  {
    "q": "Which sentence uses passive voice?",
    "opts": [
      "The report was written by Mia.",
      "Mia wrote the report.",
      "Mia edits reports.",
      "Mia will write tomorrow."
    ],
    "ans": "The report was written by Mia."
  },
  {
    "q": "Which word is a pronoun?",
    "opts": [
      "They",
      "Table",
      "Quick",
      "Run"
    ],
    "ans": "They"
  },
  {
    "q": "Which word is an article?",
    "opts": [
      "The",
      "Run",
      "Blue",
      "Before"
    ],
    "ans": "The"
  },
  {
    "q": "Which is a compound sentence?",
    "opts": [
      "I studied, and I passed.",
      "Because I studied",
      "The bright red book",
      "Running quickly"
    ],
    "ans": "I studied, and I passed."
  },
  {
    "q": "Which sentence uses quotation marks correctly?",
    "opts": [
      "She said, \"I am ready.\"",
      "She said, I am ready.",
      "\"She said, I am ready.",
      "She said I am ready\"."
    ],
    "ans": "She said, \"I am ready.\""
  }
];

const WORD_LADDER_PUZZLES = [
  {
    "start": "CAT",
    "end": "DOG",
    "steps": [
      "CAT",
      "COT",
      "COG",
      "DOG"
    ]
  },
  {
    "start": "CAT",
    "end": "BUG",
    "steps": [
      "CAT",
      "BAT",
      "BAG",
      "BUG"
    ]
  },
  {
    "start": "DOG",
    "end": "BAG",
    "steps": [
      "DOG",
      "DIG",
      "BIG",
      "BAG"
    ]
  },
  {
    "start": "COLD",
    "end": "WARM",
    "steps": [
      "COLD",
      "CORD",
      "WORD",
      "WARD",
      "WARM"
    ]
  },
  {
    "start": "HEAD",
    "end": "TALL",
    "steps": [
      "HEAD",
      "HEAL",
      "TEAL",
      "TELL",
      "TALL"
    ]
  },
  {
    "start": "MAKE",
    "end": "SALE",
    "steps": [
      "MAKE",
      "TAKE",
      "TALE",
      "SALE"
    ]
  },
  {
    "start": "GOLD",
    "end": "CARD",
    "steps": [
      "GOLD",
      "COLD",
      "CORD",
      "CARD"
    ]
  },
  {
    "start": "FIRE",
    "end": "WARM",
    "steps": [
      "FIRE",
      "FIRM",
      "FARM",
      "WARM"
    ]
  },
  {
    "start": "MATH",
    "end": "CARE",
    "steps": [
      "MATH",
      "MATE",
      "MARE",
      "CARE"
    ]
  },
  {
    "start": "PARK",
    "end": "BANK",
    "steps": [
      "PARK",
      "DARK",
      "DANK",
      "BANK"
    ]
  },
  {
    "start": "LAMP",
    "end": "LIKE",
    "steps": [
      "LAMP",
      "LIMP",
      "LIME",
      "LIKE"
    ]
  },
  {
    "start": "MINE",
    "end": "WISE",
    "steps": [
      "MINE",
      "WINE",
      "WIDE",
      "WISE"
    ]
  },
  {
    "start": "FISH",
    "end": "CASH",
    "steps": [
      "FISH",
      "WISH",
      "WASH",
      "CASH"
    ]
  },
  {
    "start": "HAND",
    "end": "WARM",
    "steps": [
      "HAND",
      "HARD",
      "WARD",
      "WARM"
    ]
  },
  {
    "start": "BOLD",
    "end": "BEND",
    "steps": [
      "BOLD",
      "BOND",
      "BAND",
      "BEND"
    ]
  },
  {
    "start": "DUST",
    "end": "MINT",
    "steps": [
      "DUST",
      "MUST",
      "MIST",
      "MINT"
    ]
  },
  {
    "start": "SING",
    "end": "RUNE",
    "steps": [
      "SING",
      "RING",
      "RUNG",
      "RUNE"
    ]
  },
  {
    "start": "FORM",
    "end": "HIRE",
    "steps": [
      "FORM",
      "FIRM",
      "FIRE",
      "HIRE"
    ]
  },
  {
    "start": "SHIP",
    "end": "SLOT",
    "steps": [
      "SHIP",
      "SHOP",
      "SHOT",
      "SLOT"
    ]
  },
  {
    "start": "WORD",
    "end": "CARE",
    "steps": [
      "WORD",
      "WORE",
      "CORE",
      "CARE"
    ]
  },
  {
    "start": "TONE",
    "end": "COPS",
    "steps": [
      "TONE",
      "TONS",
      "CONS",
      "COPS"
    ]
  },
  {
    "start": "LEAD",
    "end": "LEAF",
    "steps": [
      "LEAD",
      "LOAD",
      "LOAF",
      "LEAF"
    ]
  },
  {
    "start": "COOL",
    "end": "SOUL",
    "steps": [
      "COOL",
      "FOOL",
      "FOUL",
      "SOUL"
    ]
  },
  {
    "start": "BOOK",
    "end": "WOOL",
    "steps": [
      "BOOK",
      "COOK",
      "COOL",
      "WOOL"
    ]
  },
  {
    "start": "SAND",
    "end": "FEED",
    "steps": [
      "SAND",
      "SEND",
      "SEED",
      "FEED"
    ]
  },
  {
    "start": "BOAT",
    "end": "GOLD",
    "steps": [
      "BOAT",
      "GOAT",
      "GOAD",
      "GOLD"
    ]
  },
  {
    "start": "PALE",
    "end": "PAGE",
    "steps": [
      "PALE",
      "SALE",
      "SAGE",
      "PAGE"
    ]
  },
  {
    "start": "CART",
    "end": "WORD",
    "steps": [
      "CART",
      "CARD",
      "WARD",
      "WORD"
    ]
  },
  {
    "start": "LINE",
    "end": "SONG",
    "steps": [
      "LINE",
      "LONE",
      "LONG",
      "SONG"
    ]
  },
  {
    "start": "TAIL",
    "end": "TOLD",
    "steps": [
      "TAIL",
      "TALL",
      "TOLL",
      "TOLD"
    ]
  },
  {
    "start": "SEAT",
    "end": "MELT",
    "steps": [
      "SEAT",
      "MEAT",
      "MEET",
      "MELT"
    ]
  },
  {
    "start": "GATE",
    "end": "DART",
    "steps": [
      "GATE",
      "DATE",
      "DARE",
      "DART"
    ]
  },
  {
    "start": "BIRD",
    "end": "SEND",
    "steps": [
      "BIRD",
      "BIND",
      "BEND",
      "SEND"
    ]
  },
  {
    "start": "HATE",
    "end": "PATH",
    "steps": [
      "HATE",
      "MATE",
      "MATH",
      "PATH"
    ]
  },
  {
    "start": "ROAD",
    "end": "FARM",
    "steps": [
      "ROAD",
      "ROAM",
      "FOAM",
      "FORM",
      "FARM"
    ]
  },
  {
    "start": "WIND",
    "end": "RIDE",
    "steps": [
      "WIND",
      "WINE",
      "WIDE",
      "RIDE"
    ]
  },
  {
    "start": "PLAY",
    "end": "SLAP",
    "steps": [
      "PLAY",
      "CLAY",
      "CLAP",
      "SLAP"
    ]
  },
  {
    "start": "CAMP",
    "end": "LISP",
    "steps": [
      "CAMP",
      "LAMP",
      "LIMP",
      "LISP"
    ]
  },
  {
    "start": "COST",
    "end": "LAST",
    "steps": [
      "COST",
      "LOST",
      "LIST",
      "LAST"
    ]
  },
  {
    "start": "PINK",
    "end": "LONE",
    "steps": [
      "PINK",
      "PINE",
      "LINE",
      "LONE"
    ]
  },
  {
    "start": "TILE",
    "end": "FIRM",
    "steps": [
      "TILE",
      "TIRE",
      "FIRE",
      "FIRM"
    ]
  },
  {
    "start": "BARK",
    "end": "CORN",
    "steps": [
      "BARK",
      "BARN",
      "BORN",
      "CORN"
    ]
  },
  {
    "start": "RAIN",
    "end": "SAID",
    "steps": [
      "RAIN",
      "PAIN",
      "PAID",
      "SAID"
    ]
  },
  {
    "start": "MOON",
    "end": "SOFT",
    "steps": [
      "MOON",
      "SOON",
      "SOOT",
      "SOFT"
    ]
  },
  {
    "start": "RACE",
    "end": "LUCK",
    "steps": [
      "RACE",
      "RACK",
      "LACK",
      "LUCK"
    ]
  },
  {
    "start": "BITE",
    "end": "SIPS",
    "steps": [
      "BITE",
      "SITE",
      "SITS",
      "SIPS"
    ]
  },
  {
    "start": "NOTE",
    "end": "COLD",
    "steps": [
      "NOTE",
      "VOTE",
      "VOLE",
      "COLE",
      "COLD"
    ]
  },
  {
    "start": "FOLD",
    "end": "ROAD",
    "steps": [
      "FOLD",
      "GOLD",
      "GOAD",
      "ROAD"
    ]
  },
  {
    "start": "MIND",
    "end": "SAND",
    "steps": [
      "MIND",
      "MEND",
      "SEND",
      "SAND"
    ]
  },
  {
    "start": "JUMP",
    "end": "LAMP",
    "steps": [
      "JUMP",
      "DUMP",
      "DAMP",
      "LAMP"
    ]
  },
  {
    "start": "GLOW",
    "end": "SHOT",
    "steps": [
      "GLOW",
      "SLOW",
      "SLOT",
      "SHOT"
    ]
  },
  {
    "start": "BEAR",
    "end": "COAT",
    "steps": [
      "BEAR",
      "BEAT",
      "BOAT",
      "COAT"
    ]
  },
  {
    "start": "FAST",
    "end": "DISH",
    "steps": [
      "FAST",
      "FIST",
      "FISH",
      "DISH"
    ]
  },
  {
    "start": "KING",
    "end": "PINK",
    "steps": [
      "KING",
      "RING",
      "RINK",
      "PINK"
    ]
  },
  {
    "start": "WALL",
    "end": "MILD",
    "steps": [
      "WALL",
      "WILL",
      "WILD",
      "MILD"
    ]
  }
];

const FIN_TERMS_MINI = [
  {
    "term": "Compound Interest",
    "def": "Earning interest on both your original money and previous interest."
  },
  {
    "term": "Net Worth",
    "def": "Assets minus liabilities."
  },
  {
    "term": "Budget",
    "def": "A plan for where your money goes."
  },
  {
    "term": "Emergency Fund",
    "def": "Savings kept for urgent unexpected costs."
  },
  {
    "term": "Asset",
    "def": "Something you own that has value."
  },
  {
    "term": "Liability",
    "def": "Something you owe."
  }
];

const DEMEANOR_MINI = [
  {
    "term": "Confident Response",
    "def": "Clear, calm, and direct without being aggressive."
  },
  {
    "term": "Tone",
    "def": "The emotional signal behind your words."
  },
  {
    "term": "Posture",
    "def": "How your body position affects how people read you."
  },
  {
    "term": "Eye Contact",
    "def": "Looking engaged without staring."
  },
  {
    "term": "Pause",
    "def": "A short silence that gives your words more control."
  },
  {
    "term": "Presence",
    "def": "How focused and steady you seem in the room."
  }
];

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const normaliseSubject = (value) => {
  const raw = String(value || "english").toLowerCase().replace("learn_it_", "").replace("learn-", "").replace("learn_", "");
  if (raw.includes("finance")) return "finance";
  if (raw.includes("demeanor") || raw.includes("demeanour")) return "demeanor";
  return "english";
};

function PrimaryButton({ children, onClick, color, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        border: "none",
        borderRadius: 999,
        padding: "12px 18px",
        background: disabled ? "rgba(255,255,255,0.12)" : color,
        color: disabled ? "rgba(255,255,255,0.45)" : "#050505",
        fontWeight: 800,
        fontFamily: FONT,
        cursor: disabled ? "not-allowed" : "pointer",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {children}
    </button>
  );
}

function Modal({ title, color, children, onClose, play }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "#090909", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#111" }}>
        <button
          type="button"
          onClick={() => { play?.("back"); onClose(); }}
          style={{ background: "none", border: "none", color, fontWeight: 800, fontSize: 16, fontFamily: FONT, cursor: "pointer" }}
        >
          ‹ Back
        </button>
        <strong style={{ color: "#ededed", fontSize: 17, fontFamily: FONT }}>{title}</strong>
        <span style={{ width: 54 }} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>{children}</div>
    </div>
  );
}

function Progress({ current, total, color }) {
  const pct = Math.max(0, Math.min(100, (current / total) * 100));
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.62)", fontSize: 12, marginBottom: 8, fontFamily: FONT }}>
        <span>Progress</span>
        <span>{current} / {total}</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, transition: "width 0.25s ease" }} />
      </div>
    </div>
  );
}

function ScoreScreen({ score, total, color, onReplay, onClose }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div style={{ padding: 24, fontFamily: FONT, color: "#ededed", textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 8 }}>{pct >= 80 ? "🏆" : pct >= 55 ? "✅" : "📚"}</div>
      <h2 style={{ margin: "0 0 8px", fontSize: 28 }}>{score} / {total}</h2>
      <p style={{ margin: "0 auto 22px", color: "rgba(255,255,255,0.65)", maxWidth: 360, lineHeight: 1.5 }}>
        {pct >= 80 ? "Strong work. You are building real English accuracy." : "Good attempt. Replay it and tighten the weak spots."}
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <PrimaryButton color={color} onClick={onReplay}>Replay</PrimaryButton>
        <PrimaryButton color={"rgba(255,255,255,0.18)"} onClick={onClose}>Close</PrimaryButton>
      </div>
    </div>
  );
}

function QuizGame({ title, color, items, mode, onClose, play }) {
  const [order, setOrder] = useState(() => shuffle(items));
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const item = order[qi];
  const questionText = mode === "fill" ? item.sentence : item.q;
  const options = mode === "fill" ? item.options : item.opts;
  const answer = mode === "fill" ? item.answer : item.ans;

  const pick = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === answer;
    if (correct) {
      setScore((s) => s + 1);
      play?.("correct");
    } else {
      play?.("wrong");
    }
    setTimeout(() => {
      if (qi + 1 >= order.length) setDone(true);
      else {
        setQi((n) => n + 1);
        setSelected(null);
      }
    }, 700);
  };

  if (done) {
    return <ScoreScreen score={score} total={order.length} color={color} onReplay={() => { setOrder(shuffle(items)); setQi(0); setSelected(null); setScore(0); setDone(false); }} onClose={onClose} />;
  }

  return (
    <div style={{ padding: 20, fontFamily: FONT, color: "#ededed" }}>
      <Progress current={qi + 1} total={order.length} color={color} />
      <p style={{ color, fontSize: 12, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px" }}>{title}</p>
      <h2 style={{ fontSize: 23, lineHeight: 1.35, margin: "0 0 20px" }}>{questionText}</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {options.map((opt) => {
          const isCorrect = selected && opt === answer;
          const isWrong = selected === opt && opt !== answer;
          return (
            <button
              type="button"
              key={opt}
              onClick={() => pick(opt)}
              style={{
                textAlign: "left",
                border: `1px solid ${isCorrect ? color : isWrong ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
                background: isCorrect ? `${color}22` : isWrong ? "rgba(239,68,68,0.16)" : "rgba(255,255,255,0.045)",
                color: "#ededed",
                borderRadius: 16,
                padding: "15px 16px",
                fontSize: 15,
                fontWeight: 750,
                fontFamily: FONT,
                cursor: selected ? "default" : "pointer",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected && selected !== answer ? <p style={{ color: "rgba(255,255,255,0.72)", marginTop: 14 }}>Correct answer: <strong>{answer}</strong></p> : null}
    </div>
  );
}

function WordGuessGame({ color, onClose, play }) {
  const [target, setTarget] = useState(() => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState("Type a five-letter word. You get six attempts.");
  const [done, setDone] = useState(false);

  const submit = () => {
    const cleaned = guess.trim().toUpperCase();
    if (cleaned.length !== target.length) {
      setMessage(`Use exactly ${target.length} letters.`);
      return;
    }
    const won = cleaned === target;
    const nextAttempts = [...attempts, cleaned];
    setAttempts(nextAttempts);
    setGuess("");
    if (won) {
      play?.("correct");
      setMessage("Correct. Strong word work.");
      setDone(true);
    } else if (nextAttempts.length >= 6) {
      play?.("wrong");
      setMessage(`Out of attempts. The word was ${target}.`);
      setDone(true);
    } else {
      play?.("tap");
      setMessage(nextAttempts.length >= 3 ? `Hint: starts with ${target[0]} and ends with ${target[target.length - 1]}.` : "Not it. Try another word.");
    }
  };

  const reset = () => {
    setTarget(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
    setGuess("");
    setAttempts([]);
    setMessage("Type a five-letter word. You get six attempts.");
    setDone(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: FONT, color: "#ededed" }}>
      <Progress current={attempts.length} total={6} color={color} />
      <p style={{ color, fontSize: 12, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>Word Guess</p>
      <h2 style={{ margin: "0 0 10px", fontSize: 25 }}>Guess the hidden word</h2>
      <div style={{ display: "flex", gap: 7, margin: "18px 0" }}>
        {target.split("").map((letter, i) => (
          <div key={i} style={{ width: 42, height: 48, borderRadius: 12, border: `1px solid ${color}66`, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 22, background: "rgba(255,255,255,0.05)" }}>
            {done ? letter : attempts.length >= 4 && (i === 0 || i === target.length - 1) ? letter : "•"}
          </div>
        ))}
      </div>
      <input
        value={guess}
        onChange={(e) => setGuess(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, target.length))}
        onKeyDown={(e) => { if (e.key === "Enter" && !done) submit(); }}
        placeholder="TYPE WORD"
        disabled={done}
        style={{ width: "100%", boxSizing: "border-box", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 16, background: "rgba(255,255,255,0.06)", color: "#ededed", fontSize: 20, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: FONT }}
      />
      <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.5 }}>{message}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <PrimaryButton color={color} onClick={submit} disabled={done}>Submit</PrimaryButton>
        <PrimaryButton color={"rgba(255,255,255,0.18)"} onClick={reset}>New word</PrimaryButton>
        <PrimaryButton color={"rgba(255,255,255,0.18)"} onClick={onClose}>Close</PrimaryButton>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {attempts.map((item, index) => (
          <div key={`${item}-${index}`} style={{ padding: 12, borderRadius: 14, background: item === target ? `${color}22` : "rgba(255,255,255,0.045)", border: `1px solid ${item === target ? color : "rgba(255,255,255,0.08)"}` }}>
            {item.split("").map((letter, i) => {
              const exact = letter === target[i];
              const present = !exact && target.includes(letter);
              return <span key={i} style={{ display: "inline-grid", placeItems: "center", width: 30, height: 30, marginRight: 5, borderRadius: 8, background: exact ? color : present ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)", color: exact ? "#050505" : "#ededed", fontWeight: 900 }}>{letter}</span>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function VocabMatchGame({ color, onClose, play }) {
  const [round, setRound] = useState(() => shuffle(VOCAB_PAIRS).slice(0, 12));
  const [defs, setDefs] = useState(() => shuffle(round));
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);
  const complete = matched.length === round.length;

  const reset = () => {
    const next = shuffle(VOCAB_PAIRS).slice(0, 12);
    setRound(next);
    setDefs(shuffle(next));
    setSelected(null);
    setMatched([]);
  };

  const chooseDef = (pair) => {
    if (!selected || matched.includes(pair.word)) return;
    if (selected.word === pair.word) {
      setMatched((m) => [...m, pair.word]);
      setSelected(null);
      play?.("correct");
    } else {
      play?.("wrong");
      setSelected(null);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: FONT, color: "#ededed" }}>
      <Progress current={matched.length} total={round.length} color={color} />
      <p style={{ color, fontSize: 12, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>Vocab Match</p>
      <h2 style={{ margin: "0 0 14px" }}>Match the word to the definition</h2>
      {complete ? (
        <ScoreScreen score={round.length} total={round.length} color={color} onReplay={reset} onClose={onClose} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ display: "grid", gap: 8 }}>
            {round.map((pair) => (
              <button key={pair.word} type="button" disabled={matched.includes(pair.word)} onClick={() => setSelected(pair)} style={{ border: `1px solid ${selected?.word === pair.word ? color : "rgba(255,255,255,0.1)"}`, borderRadius: 14, padding: "12px 10px", background: matched.includes(pair.word) ? `${color}22` : selected?.word === pair.word ? `${color}18` : "rgba(255,255,255,0.045)", color: "#ededed", fontWeight: 850, fontFamily: FONT, cursor: "pointer" }}>
                {matched.includes(pair.word) ? "✓ " : ""}{pair.word}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {defs.map((pair) => (
              <button key={pair.def} type="button" disabled={matched.includes(pair.word)} onClick={() => chooseDef(pair)} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "12px 10px", background: matched.includes(pair.word) ? `${color}22` : "rgba(255,255,255,0.045)", color: "rgba(255,255,255,0.86)", lineHeight: 1.35, fontSize: 13, fontFamily: FONT, cursor: "pointer", textAlign: "left" }}>
                {pair.def}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SentenceBuilderGame({ color, onClose, play }) {
  const [order, setOrder] = useState(() => shuffle(SENTENCE_QS));
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Tap words in the correct order.");
  const [done, setDone] = useState(false);
  const q = order[qi];

  const choose = (index) => {
    if (picked.includes(index)) return;
    const next = [...picked, index];
    setPicked(next);
    if (next.length === q.answer.length) {
      const built = next.map((i) => q.words[i]);
      const correct = built.join(" ") === q.answer.join(" ");
      if (correct) {
        setScore((s) => s + 1);
        setMessage("Correct sentence.");
        play?.("correct");
      } else {
        setMessage(`Correct answer: ${q.answer.join(" ")}`);
        play?.("wrong");
      }
      setTimeout(() => {
        if (qi + 1 >= order.length) setDone(true);
        else {
          setQi((n) => n + 1);
          setPicked([]);
          setMessage("Tap words in the correct order.");
        }
      }, 1200);
    }
  };

  if (done) {
    return <ScoreScreen score={score} total={order.length} color={color} onReplay={() => { setOrder(shuffle(SENTENCE_QS)); setQi(0); setPicked([]); setScore(0); setMessage("Tap words in the correct order."); setDone(false); }} onClose={onClose} />;
  }

  return (
    <div style={{ padding: 20, fontFamily: FONT, color: "#ededed" }}>
      <Progress current={qi + 1} total={order.length} color={color} />
      <p style={{ color, fontSize: 12, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>Sentence Builder</p>
      <div style={{ minHeight: 76, border: `1px dashed ${color}88`, borderRadius: 18, padding: 14, background: "rgba(255,255,255,0.04)", fontSize: 18, lineHeight: 1.5, marginBottom: 16 }}>
        {picked.length ? picked.map((i) => q.words[i]).join(" ") : "Build the sentence here..."}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {q.words.map((word, index) => (
          <button key={`${word}-${index}`} type="button" disabled={picked.includes(index)} onClick={() => choose(index)} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "10px 13px", background: picked.includes(index) ? `${color}22` : "rgba(255,255,255,0.06)", color: picked.includes(index) ? "rgba(255,255,255,0.4)" : "#ededed", fontWeight: 800, fontFamily: FONT, cursor: "pointer" }}>
            {word}
          </button>
        ))}
      </div>
      <p style={{ color: "rgba(255,255,255,0.68)" }}>{message}</p>
      <PrimaryButton color={"rgba(255,255,255,0.18)"} onClick={() => { setPicked([]); setMessage("Tap words in the correct order."); }}>Clear</PrimaryButton>
    </div>
  );
}

function WordLadderGame({ color, onClose, play }) {
  const [puzzle, setPuzzle] = useState(() => WORD_LADDER_PUZZLES[Math.floor(Math.random() * WORD_LADDER_PUZZLES.length)]);
  const [position, setPosition] = useState(0);
  const [entry, setEntry] = useState("");
  const [message, setMessage] = useState("Enter the next word in the ladder.");
  const complete = position >= puzzle.steps.length - 1;

  const submit = () => {
    if (complete) return;
    const cleaned = entry.trim().toUpperCase();
    const expected = puzzle.steps[position + 1];
    if (cleaned === expected) {
      setPosition((p) => p + 1);
      setEntry("");
      setMessage(position + 1 >= puzzle.steps.length - 1 ? "Ladder complete." : "Correct. Keep climbing.");
      play?.("correct");
    } else {
      setMessage(`Not yet. Change one letter from ${puzzle.steps[position]}.`);
      play?.("wrong");
    }
  };

  const reset = () => {
    setPuzzle(WORD_LADDER_PUZZLES[Math.floor(Math.random() * WORD_LADDER_PUZZLES.length)]);
    setPosition(0);
    setEntry("");
    setMessage("Enter the next word in the ladder.");
  };

  return (
    <div style={{ padding: 20, fontFamily: FONT, color: "#ededed" }}>
      <Progress current={position + 1} total={puzzle.steps.length} color={color} />
      <p style={{ color, fontSize: 12, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>Word Ladder</p>
      <h2 style={{ margin: "0 0 8px" }}>{puzzle.start} → {puzzle.end}</h2>
      <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.45 }}>Change one letter at a time. Each step must be the exact next word.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "18px 0" }}>
        {puzzle.steps.map((step, index) => (
          <span key={`${step}-${index}`} style={{ padding: "10px 12px", borderRadius: 12, border: `1px solid ${index <= position ? color : "rgba(255,255,255,0.1)"}`, background: index <= position ? `${color}22` : "rgba(255,255,255,0.04)", color: index <= position ? "#ededed" : "rgba(255,255,255,0.22)", fontWeight: 900, letterSpacing: "0.08em" }}>
            {index <= position ? step : "____"}
          </span>
        ))}
      </div>
      <input
        value={entry}
        onChange={(e) => setEntry(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, puzzle.start.length))}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        disabled={complete}
        placeholder={puzzle.start.length === 3 ? "WORD" : "NEXT"}
        style={{ width: "100%", boxSizing: "border-box", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 16, background: "rgba(255,255,255,0.06)", color: "#ededed", fontSize: 20, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: FONT }}
      />
      <p style={{ color: "rgba(255,255,255,0.68)" }}>{message}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <PrimaryButton color={color} onClick={submit} disabled={complete}>Submit</PrimaryButton>
        <PrimaryButton color={"rgba(255,255,255,0.18)"} onClick={reset}>New ladder</PrimaryButton>
        <PrimaryButton color={"rgba(255,255,255,0.18)"} onClick={onClose}>Close</PrimaryButton>
      </div>
    </div>
  );
}

function MiniCardsGame({ color, items, title, onClose }) {
  const [index, setIndex] = useState(0);
  const item = items[index % items.length];
  return (
    <div style={{ padding: 20, fontFamily: FONT, color: "#ededed" }}>
      <p style={{ color, fontSize: 12, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>{title}</p>
      <div style={{ border: `1px solid ${color}55`, borderRadius: 24, padding: 24, background: "rgba(255,255,255,0.05)", minHeight: 180 }}>
        <h2 style={{ marginTop: 0 }}>{item.term}</h2>
        <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.55, fontSize: 16 }}>{item.def}</p>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
        <PrimaryButton color={color} onClick={() => setIndex((n) => n + 1)}>Next card</PrimaryButton>
        <PrimaryButton color={"rgba(255,255,255,0.18)"} onClick={onClose}>Close</PrimaryButton>
      </div>
    </div>
  );
}

function GameBody({ gameId, color, onClose, play }) {
  if (gameId === "fill_gap") return <QuizGame title="Fill the Gap" color={color} items={FILL_GAP_QS} mode="fill" onClose={onClose} play={play} />;
  if (gameId === "word_guess") return <WordGuessGame color={color} onClose={onClose} play={play} />;
  if (gameId === "vocab_match") return <VocabMatchGame color={color} onClose={onClose} play={play} />;
  if (gameId === "sentence") return <SentenceBuilderGame color={color} onClose={onClose} play={play} />;
  if (gameId === "word_trivia") return <QuizGame title="Word Trivia" color={color} items={WORD_TRIVIA} mode="trivia" onClose={onClose} play={play} />;
  if (gameId === "word_ladder") return <WordLadderGame color={color} onClose={onClose} play={play} />;
  if (gameId.startsWith("finance")) return <MiniCardsGame color={color} title="Finance Cards" items={FIN_TERMS_MINI} onClose={onClose} />;
  return <MiniCardsGame color={color} title="Demeanor Cards" items={DEMEANOR_MINI} onClose={onClose} />;
}

function FlipCard({ game, color, lightColor, borderColor, index, onPlay }) {
  const [flipped, setFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), index * 60);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div style={{ perspective: "1000px", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.25s ease, transform 0.3s ease" }}>
      <div onClick={() => setFlipped((v) => !v)} style={{ position: "relative", width: "100%", aspectRatio: "1 / 1.05", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)", cursor: "pointer" }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: "rgba(255,255,255,0.045)", border: `1px solid ${borderColor}`, borderRadius: 22, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          <span style={{ position: "absolute", top: 12, right: 12, padding: "3px 8px", borderRadius: 999, background: lightColor, color, fontSize: 9, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>{game.type}</span>
          <div style={{ fontSize: 34 }}>{game.icon}</div>
          <strong style={{ color: "#ededed", fontSize: 16 }}>{game.title}</strong>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.56)", fontSize: 12, lineHeight: 1.45 }}>{game.desc}</p>
          <span style={{ position: "absolute", bottom: 10, color, fontSize: 10, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.65 }}>flip</span>
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", background: `linear-gradient(160deg, ${lightColor.replace("0.12", "0.2")} 0%, rgba(255,255,255,0.04) 100%)`, border: `1.5px solid ${color}66`, borderRadius: 22, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 12, boxShadow: `0 4px 28px ${color}25` }}>
          <div style={{ fontSize: 32 }}>{game.icon}</div>
          <strong style={{ color: "#ededed", fontSize: 15 }}>Ready to play?</strong>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.62)", fontSize: 12, lineHeight: 1.45 }}>{game.desc}</p>
          <button type="button" onClick={(e) => { e.stopPropagation(); onPlay(game); }} style={{ border: "none", borderRadius: 999, padding: "11px 24px", background: color, color: "#050505", fontWeight: 900, fontFamily: FONT, cursor: "pointer" }}>
            ▶ Play
          </button>
        </div>
      </div>
    </div>
  );
}

export function LearnItSubjectPage({ subject = "english", subjectId, activeSubject, onBack, onClose, setPage, t, play }) {
  const subjectKey = normaliseSubject(subjectId || activeSubject || subject);
  const meta = SUBJECT_META[subjectKey] || SUBJECT_META.english;
  const games = GAMES[subjectKey] || GAMES.english;
  const [activeGame, setActiveGame] = useState(null);

  const goBack = () => {
    play?.("back");
    if (onBack) onBack();
    else if (onClose) onClose();
    else if (setPage) setPage("learn_it");
  };

  return (
    <div style={{ minHeight: "100%", background: t?.skin || "#0a0a0a", color: "#ededed", fontFamily: FONT, paddingBottom: 36 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: t?.white || "#111", borderBottom: `1px solid ${t?.border || "rgba(255,255,255,0.08)"}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <button type="button" onClick={goBack} style={{ background: "none", border: "none", color: meta.color, fontSize: 16, fontWeight: 900, fontFamily: FONT, cursor: "pointer" }}>‹ Back</button>
        <div style={{ flex: 1, textAlign: "center", marginRight: 58 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 900, letterSpacing: "0.1em" }}>LEARN-IT</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{meta.emoji} {meta.label}</div>
        </div>
      </div>

      <main style={{ padding: "22px 18px" }}>
        <p style={{ margin: "0 0 18px", color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>
          {subjectKey === "english"
            ? "6 interactive activities with 50+ content items each. Tap a card to flip it, then press Play."
            : "Tap a card to flip it, then press Play."}
        </p>

        {subjectKey === "english" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: 14, marginBottom: 18 }}>
            {[
              ["Fill Gap", FILL_GAP_QS.length],
              ["Word Guess", WORD_LIST.length],
              ["Vocab Match", VOCAB_PAIRS.length],
              ["Sentence Builder", SENTENCE_QS.length],
              ["Word Trivia", WORD_TRIVIA.length],
              ["Word Ladder", WORD_LADDER_PUZZLES.length],
            ].map(([label, count]) => (
              <div key={label} style={{ border: `1px solid ${meta.borderColor}`, background: meta.lightColor, color: "#ededed", borderRadius: 16, padding: 12 }}>
                <strong style={{ color: meta.color, fontSize: 18 }}>{count}+</strong>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 }}>{label} items</div>
              </div>
            ))}
          </div>
        ) : null}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(142px, 1fr))", gap: 14 }}>
          {games.map((game, index) => (
            <FlipCard key={game.id} game={game} index={index} color={meta.color} lightColor={meta.lightColor} borderColor={meta.borderColor} onPlay={setActiveGame} />
          ))}
        </div>
      </main>

      {activeGame ? (
        <Modal title={activeGame.title} color={meta.color} onClose={() => setActiveGame(null)} play={play}>
          <GameBody gameId={activeGame.id} color={meta.color} onClose={() => setActiveGame(null)} play={play} />
        </Modal>
      ) : null}
    </div>
  );
}

export default LearnItSubjectPage;

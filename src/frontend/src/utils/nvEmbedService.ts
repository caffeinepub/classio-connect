// NVIDIA NV-Embed-v2 Integration
// To use real NV-Embed-v2 via ICP http-outcalls backend, replace the
// localCosineSimilarity function with calls to:
// POST https://integrate.api.nvidia.com/v1/embeddings
// { model: "nvidia/nv-embedqa-e5-v5", input: [text], input_type: "query" }
// Authorization: Bearer <NVIDIA_API_KEY>
export const NVIDIA_API_ENDPOINT =
  "https://integrate.api.nvidia.com/v1/embeddings";

export type ContentItem = {
  id: string;
  title: string;
  content: string;
  category:
    | "vocabulary"
    | "grammar"
    | "pronunciation"
    | "listening"
    | "reading"
    | "speaking"
    | "shadowing"
    | "roleplay";
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
};

export const CONTENT_CORPUS: ContentItem[] = [
  // VOCABULARY - 60 items
  {
    id: "v001",
    title: "Greet someone",
    content:
      "Hello, Hi, Good morning, Good afternoon, Good evening, How are you? Nice to meet you. How do you do?",
    category: "vocabulary",
    tags: ["greetings", "daily", "social"],
    difficulty: "beginner",
  },
  {
    id: "v002",
    title: "Saying goodbye",
    content:
      "Goodbye, Bye, See you later, Take care, Farewell, See you soon, Good night, Until next time.",
    category: "vocabulary",
    tags: ["farewell", "daily", "social"],
    difficulty: "beginner",
  },
  {
    id: "v003",
    title: "Airport vocabulary",
    content:
      "Departure, Arrival, Gate, Boarding pass, Check-in, Luggage, Terminal, Flight, Customs, Immigration, Passport, Visa",
    category: "vocabulary",
    tags: ["travel", "airport", "transport"],
    difficulty: "intermediate",
  },
  {
    id: "v004",
    title: "Shopping vocabulary",
    content:
      "Price, Discount, Receipt, Cashier, Refund, Exchange, Sale, Bargain, Cart, Queue, Fitting room, Size, Brand",
    category: "vocabulary",
    tags: ["shopping", "daily", "money"],
    difficulty: "beginner",
  },
  {
    id: "v005",
    title: "Medical vocabulary",
    content:
      "Doctor, Nurse, Hospital, Clinic, Prescription, Symptoms, Diagnosis, Medicine, Treatment, Surgery, Emergency, Ward",
    category: "vocabulary",
    tags: ["health", "medical", "body"],
    difficulty: "intermediate",
  },
  {
    id: "v006",
    title: "Weather expressions",
    content:
      "Sunny, Cloudy, Rainy, Windy, Stormy, Humid, Temperature, Forecast, Thunderstorm, Drizzle, Heatwave, Fog",
    category: "vocabulary",
    tags: ["weather", "daily", "nature"],
    difficulty: "beginner",
  },
  {
    id: "v007",
    title: "Food and cooking",
    content:
      "Boil, Fry, Bake, Roast, Grill, Simmer, Chop, Slice, Mix, Stir, Marinate, Blend, Season, Taste",
    category: "vocabulary",
    tags: ["food", "cooking", "kitchen"],
    difficulty: "beginner",
  },
  {
    id: "v008",
    title: "Business vocabulary",
    content:
      "Meeting, Deadline, Budget, Profit, Invoice, Client, Presentation, Negotiate, Strategy, Revenue, Partnership, Contract",
    category: "vocabulary",
    tags: ["business", "professional", "office"],
    difficulty: "advanced",
  },
  {
    id: "v009",
    title: "Technology words",
    content:
      "Software, Hardware, Network, Database, Algorithm, Interface, Download, Upload, Password, Server, Cloud, App",
    category: "vocabulary",
    tags: ["technology", "digital", "modern"],
    difficulty: "intermediate",
  },
  {
    id: "v010",
    title: "Emotions and feelings",
    content:
      "Happy, Sad, Angry, Excited, Nervous, Disappointed, Surprised, Confused, Grateful, Anxious, Proud, Embarrassed",
    category: "vocabulary",
    tags: ["emotions", "feelings", "mental"],
    difficulty: "beginner",
  },
  {
    id: "v011",
    title: "Colors and descriptions",
    content:
      "Vibrant, Pale, Bright, Dark, Translucent, Opaque, Vivid, Muted, Dull, Glossy, Shiny, Transparent",
    category: "vocabulary",
    tags: ["colors", "description", "adjectives"],
    difficulty: "beginner",
  },
  {
    id: "v012",
    title: "Time expressions",
    content:
      "Yesterday, Today, Tomorrow, Last week, Next month, Earlier, Later, Eventually, Meanwhile, Subsequently, Previously",
    category: "vocabulary",
    tags: ["time", "tense", "sequence"],
    difficulty: "intermediate",
  },
  {
    id: "v013",
    title: "Academic vocabulary",
    content:
      "Analyze, Evaluate, Compare, Contrast, Hypothesis, Evidence, Conclusion, Research, Theory, Argument, Concept, Define",
    category: "vocabulary",
    tags: ["academic", "study", "writing"],
    difficulty: "advanced",
  },
  {
    id: "v014",
    title: "Prepositions of place",
    content:
      "Above, Below, Beside, Between, Among, Inside, Outside, Opposite, Near, Far, Along, Across, Through, Beyond",
    category: "vocabulary",
    tags: ["prepositions", "location", "grammar"],
    difficulty: "beginner",
  },
  {
    id: "v015",
    title: "Action verbs",
    content:
      "Run, Jump, Climb, Swim, Throw, Catch, Push, Pull, Carry, Drop, Lift, Kick, Hit, Grab, Hold",
    category: "vocabulary",
    tags: ["verbs", "action", "physical"],
    difficulty: "beginner",
  },
  {
    id: "v016",
    title: "Describing people",
    content:
      "Tall, Short, Slim, Chubby, Young, Elderly, Blonde, Brunette, Curly, Straight, Athletic, Glasses, Beard, Tattoo",
    category: "vocabulary",
    tags: ["description", "appearance", "people"],
    difficulty: "beginner",
  },
  {
    id: "v017",
    title: "House and home",
    content:
      "Living room, Bedroom, Kitchen, Bathroom, Garden, Balcony, Ceiling, Floor, Wall, Furniture, Window, Door, Stairs",
    category: "vocabulary",
    tags: ["home", "daily", "rooms"],
    difficulty: "beginner",
  },
  {
    id: "v018",
    title: "Transportation",
    content:
      "Bus, Train, Car, Bicycle, Motorbike, Taxi, Subway, Ferry, Helicopter, Tram, Rickshaw, Scooter",
    category: "vocabulary",
    tags: ["transport", "travel", "daily"],
    difficulty: "beginner",
  },
  {
    id: "v019",
    title: "School subjects",
    content:
      "Mathematics, Science, History, Geography, Literature, Physics, Chemistry, Biology, Economics, Art, Music, Sports",
    category: "vocabulary",
    tags: ["school", "education", "subjects"],
    difficulty: "beginner",
  },
  {
    id: "v020",
    title: "Professional titles",
    content:
      "Engineer, Teacher, Doctor, Lawyer, Accountant, Designer, Architect, Programmer, Manager, Director, Consultant",
    category: "vocabulary",
    tags: ["jobs", "professional", "career"],
    difficulty: "intermediate",
  },
  {
    id: "v021",
    title: "Nature and environment",
    content:
      "Forest, Mountain, River, Ocean, Desert, Valley, Volcano, Waterfall, Glacier, Coral reef, Rainforest, Savanna",
    category: "vocabulary",
    tags: ["nature", "environment", "geography"],
    difficulty: "intermediate",
  },
  {
    id: "v022",
    title: "Sports vocabulary",
    content:
      "Match, Tournament, Champion, Score, Goal, Penalty, Referee, Stadium, Team, Coach, Training, Victory, Defeat",
    category: "vocabulary",
    tags: ["sports", "competition", "games"],
    difficulty: "beginner",
  },
  {
    id: "v023",
    title: "Money and finance",
    content:
      "Invest, Savings, Loan, Mortgage, Interest, Deposit, Withdraw, Currency, Exchange rate, Credit, Debit, Budget",
    category: "vocabulary",
    tags: ["money", "finance", "banking"],
    difficulty: "advanced",
  },
  {
    id: "v024",
    title: "Polite phrases",
    content:
      "Please, Thank you, Sorry, Excuse me, Pardon, Would you mind, Could you please, May I, I appreciate, You are welcome",
    category: "vocabulary",
    tags: ["politeness", "etiquette", "social"],
    difficulty: "beginner",
  },
  {
    id: "v025",
    title: "Idioms - common",
    content:
      "Break a leg, Hit the nail on the head, Under the weather, Bite the bullet, Cost an arm and a leg, Piece of cake",
    category: "vocabulary",
    tags: ["idioms", "expressions", "advanced"],
    difficulty: "advanced",
  },
  {
    id: "v026",
    title: "Phrasal verbs",
    content:
      "Give up, Look up, Run out of, Come across, Pick up, Put off, Turn down, Bring up, Figure out, Get along",
    category: "vocabulary",
    tags: ["phrasal verbs", "expressions", "intermediate"],
    difficulty: "intermediate",
  },
  {
    id: "v027",
    title: "Synonyms for happy",
    content:
      "Joyful, Elated, Delighted, Content, Pleased, Cheerful, Blissful, Ecstatic, Overjoyed, Thrilled, Jubilant",
    category: "vocabulary",
    tags: ["synonyms", "emotions", "writing"],
    difficulty: "intermediate",
  },
  {
    id: "v028",
    title: "Linking words",
    content:
      "However, Therefore, Nevertheless, Furthermore, Moreover, Although, Despite, In addition, On the other hand, Consequently",
    category: "vocabulary",
    tags: ["connectors", "writing", "academic"],
    difficulty: "intermediate",
  },
  {
    id: "v029",
    title: "Questions in English",
    content:
      "What, Where, When, Why, Who, Which, How, How much, How many, How long, How often, How far",
    category: "vocabulary",
    tags: ["questions", "wh-words", "conversation"],
    difficulty: "beginner",
  },
  {
    id: "v030",
    title: "Numbers and quantities",
    content:
      "Dozen, Couple, Handful, Plenty, Numerous, Several, Few, Many, Majority, Minority, Half, Quarter, Third",
    category: "vocabulary",
    tags: ["numbers", "quantity", "math"],
    difficulty: "beginner",
  },
  // GRAMMAR - 40 items
  {
    id: "g001",
    title: "Present Simple tense",
    content:
      "Use present simple for habits, routines, and facts. I eat breakfast every day. She works at a school. The sun rises in the east.",
    category: "grammar",
    tags: ["tense", "present", "habits"],
    difficulty: "beginner",
  },
  {
    id: "g002",
    title: "Past Simple tense",
    content:
      "Use past simple for completed actions. I visited Delhi last year. She graduated in 2020. They finished the project yesterday.",
    category: "grammar",
    tags: ["tense", "past", "completed"],
    difficulty: "beginner",
  },
  {
    id: "g003",
    title: "Future tense with will",
    content:
      "Use will for predictions and spontaneous decisions. I will call you tomorrow. It will rain tonight. She will probably pass.",
    category: "grammar",
    tags: ["tense", "future", "will"],
    difficulty: "beginner",
  },
  {
    id: "g004",
    title: "Articles: a, an, the",
    content:
      "Use a/an for first mention or general nouns. Use the for specific nouns. I saw a dog. The dog was barking. An apple a day.",
    category: "grammar",
    tags: ["articles", "a", "an", "the"],
    difficulty: "beginner",
  },
  {
    id: "g005",
    title: "Present Continuous",
    content:
      "Use present continuous for actions happening now or temporary situations. She is reading a book. They are working on a project right now.",
    category: "grammar",
    tags: ["tense", "continuous", "now"],
    difficulty: "beginner",
  },
  {
    id: "g006",
    title: "Modal verbs",
    content:
      "Can (ability), Must (obligation), Should (advice), May (possibility), Would (polite request). You must wear a seatbelt. Can I help you?",
    category: "grammar",
    tags: ["modal", "can", "must", "should"],
    difficulty: "intermediate",
  },
  {
    id: "g007",
    title: "Passive voice",
    content:
      "Active: They built the bridge. Passive: The bridge was built. Use passive when the subject is unknown or unimportant.",
    category: "grammar",
    tags: ["passive", "voice", "sentence structure"],
    difficulty: "intermediate",
  },
  {
    id: "g008",
    title: "Conditional sentences",
    content:
      "First conditional: If it rains, I will stay home. Second: If I had money, I would travel. Third: If I had studied, I would have passed.",
    category: "grammar",
    tags: ["conditional", "if", "hypothetical"],
    difficulty: "intermediate",
  },
  {
    id: "g009",
    title: "Relative clauses",
    content:
      "Who (people), Which (things), That (people/things), Where (places). The man who called is my uncle. The book that you gave me is great.",
    category: "grammar",
    tags: ["relative", "clauses", "who", "which"],
    difficulty: "intermediate",
  },
  {
    id: "g010",
    title: "Present Perfect tense",
    content:
      "Use for past actions with present relevance. I have visited Paris. She has just arrived. Have you ever eaten sushi?",
    category: "grammar",
    tags: ["tense", "perfect", "have"],
    difficulty: "intermediate",
  },
  {
    id: "g011",
    title: "Comparatives and superlatives",
    content:
      "Comparatives: bigger, more expensive, better. Superlatives: biggest, most expensive, best. She is taller than her sister.",
    category: "grammar",
    tags: ["comparison", "adjectives", "superlative"],
    difficulty: "beginner",
  },
  {
    id: "g012",
    title: "Question formation",
    content:
      "Yes/No questions: Do you like coffee? Is she coming? Questions with wh-words: What do you want? Where does she live?",
    category: "grammar",
    tags: ["questions", "do", "does", "did"],
    difficulty: "beginner",
  },
  {
    id: "g013",
    title: "Reported speech",
    content:
      "Direct: She said, I am happy. Reported: She said she was happy. Verb tenses shift back one step in reported speech.",
    category: "grammar",
    tags: ["reported", "indirect", "speech"],
    difficulty: "advanced",
  },
  {
    id: "g014",
    title: "Gerunds and infinitives",
    content:
      "Gerund (verb+ing) as subject or after certain verbs. I enjoy swimming. To + verb after others. She wants to learn English.",
    category: "grammar",
    tags: ["gerund", "infinitive", "verb forms"],
    difficulty: "intermediate",
  },
  {
    id: "g015",
    title: "Adjective order",
    content:
      "Opinion, Size, Age, Shape, Color, Origin, Material, Purpose. A beautiful old Italian car. Three large black leather bags.",
    category: "grammar",
    tags: ["adjectives", "order", "description"],
    difficulty: "intermediate",
  },
  {
    id: "g016",
    title: "Countable vs uncountable nouns",
    content:
      "Countable: book/books, apple/apples. Uncountable: water, advice, information. Some water please. Several books on the shelf.",
    category: "grammar",
    tags: ["nouns", "countable", "some", "any"],
    difficulty: "beginner",
  },
  {
    id: "g017",
    title: "Subject-verb agreement",
    content:
      "Singular subject needs singular verb. She walks to school. Plural: They walk to school. The team is winning.",
    category: "grammar",
    tags: ["agreement", "subject", "verb"],
    difficulty: "beginner",
  },
  {
    id: "g018",
    title: "Prepositions of time",
    content:
      "At (specific time): at 5pm, at night. On (days/dates): on Monday, on 5th March. In (months/years): in January, in 2024.",
    category: "grammar",
    tags: ["prepositions", "time", "at", "on", "in"],
    difficulty: "beginner",
  },
  {
    id: "g019",
    title: "Tag questions",
    content:
      "You are coming, aren't you? She doesn't know, does she? They finished, didn't they? It was good, wasn't it?",
    category: "grammar",
    tags: ["tag questions", "confirmation", "conversation"],
    difficulty: "intermediate",
  },
  {
    id: "g020",
    title: "Future continuous",
    content:
      "Use for actions in progress at a future time. I will be studying at 8pm. They will be travelling next week.",
    category: "grammar",
    tags: ["tense", "future", "continuous"],
    difficulty: "intermediate",
  },
  // PRONUNCIATION - 25 items
  {
    id: "p001",
    title: "Vowel sound: short /æ/",
    content:
      "The short a sound as in cat, bat, hat, man, bad, sad, add, apple. Open your mouth wide and keep tongue low.",
    category: "pronunciation",
    tags: ["vowel", "short a", "phonics"],
    difficulty: "beginner",
  },
  {
    id: "p002",
    title: "Vowel sound: long /iː/",
    content:
      "The long ee sound as in see, tree, feet, meet, tea, beat, heat, eat. Stretch your lips into a smile.",
    category: "pronunciation",
    tags: ["vowel", "long ee", "phonics"],
    difficulty: "beginner",
  },
  {
    id: "p003",
    title: "The silent letter e",
    content:
      "When a word ends in silent e, the vowel before it is long. cake (not cak), wine (not win), note (not not). Practice: late, bite, hope.",
    category: "pronunciation",
    tags: ["silent", "vowel", "spelling"],
    difficulty: "beginner",
  },
  {
    id: "p004",
    title: "Word stress patterns",
    content:
      "In 2-syllable nouns: stress usually first syllable. TAble, CHicken, COMputer. In verbs: second syllable. preSENT, reCORD, reVIEW.",
    category: "pronunciation",
    tags: ["stress", "syllable", "rhythm"],
    difficulty: "intermediate",
  },
  {
    id: "p005",
    title: "The th sound /θ/",
    content:
      "Put tongue lightly between teeth and blow. Think, thank, three, through, thin, thick, Thursday. Do not say t or d instead.",
    category: "pronunciation",
    tags: ["th", "consonant", "tongue"],
    difficulty: "beginner",
  },
  {
    id: "p006",
    title: "Consonant cluster st",
    content:
      "Practice: stop, stay, start, study, stone, street, strict, strong, strip. No vowel between s and t.",
    category: "pronunciation",
    tags: ["consonant cluster", "st", "blend"],
    difficulty: "intermediate",
  },
  {
    id: "p007",
    title: "Sentence rhythm and stress",
    content:
      "English is stress-timed. Important words (nouns, verbs, adjectives) are stressed. Function words (a, the, and) are weak.",
    category: "pronunciation",
    tags: ["rhythm", "stress", "fluency"],
    difficulty: "advanced",
  },
  {
    id: "p008",
    title: "Linking words in speech",
    content:
      "In natural speech, words link together. Come in = comin. Go out = goout. Turn it on = turniton. Practice fast connected speech.",
    category: "pronunciation",
    tags: ["linking", "connected speech", "fluency"],
    difficulty: "advanced",
  },
  {
    id: "p009",
    title: "The /r/ sound",
    content:
      "Curl your tongue back slightly, do not touch the roof of your mouth. Red, right, rain, river, run, write, wrong, wrap.",
    category: "pronunciation",
    tags: ["r sound", "consonant", "tongue"],
    difficulty: "intermediate",
  },
  {
    id: "p010",
    title: "Intonation: rising and falling",
    content:
      "Statements fall at end: I live in Mumbai↘. Yes/No questions rise: Are you ready?↗. Wh-questions fall: Where are you?↘",
    category: "pronunciation",
    tags: ["intonation", "pitch", "questions"],
    difficulty: "intermediate",
  },
  // READING - 25 items
  {
    id: "r001",
    title: "Reading: A day at the market",
    content:
      "Every Saturday morning, Priya visits the local market. She buys fresh vegetables, fruits, and spices. The market is colorful and noisy, filled with the sounds of vendors calling out prices.",
    category: "reading",
    tags: ["daily life", "market", "descriptive"],
    difficulty: "beginner",
  },
  {
    id: "r002",
    title: "Reading: My school journey",
    content:
      "I walk to school every morning with my friends. The school is near the park, so we sometimes play before class. Our teacher always greets us at the door with a smile.",
    category: "reading",
    tags: ["school", "daily", "narrative"],
    difficulty: "beginner",
  },
  {
    id: "r003",
    title: "Reading: Climate change facts",
    content:
      "Climate change is one of the greatest challenges of our time. Rising temperatures are melting glaciers and causing sea levels to rise. Scientists urge immediate action to reduce carbon emissions.",
    category: "reading",
    tags: ["environment", "science", "academic"],
    difficulty: "advanced",
  },
  {
    id: "r004",
    title: "Reading: Technology in education",
    content:
      "Digital tools are transforming classrooms around the world. Students now access textbooks on tablets, submit assignments online, and participate in virtual lessons. This shift opens new possibilities for learning.",
    category: "reading",
    tags: ["technology", "education", "modern"],
    difficulty: "intermediate",
  },
  {
    id: "r005",
    title: "Reading: Healthy eating habits",
    content:
      "A balanced diet includes proteins, carbohydrates, healthy fats, vitamins, and minerals. Eating fresh fruits and vegetables daily strengthens the immune system and provides lasting energy throughout the day.",
    category: "reading",
    tags: ["health", "food", "lifestyle"],
    difficulty: "intermediate",
  },
  {
    id: "r006",
    title: "Reading: Traveling by train",
    content:
      "Train travel in India is an adventure. The railway network connects thousands of cities and towns. Long journeys allow you to see the countryside change from mountains to plains to coast.",
    category: "reading",
    tags: ["travel", "India", "trains"],
    difficulty: "beginner",
  },
  {
    id: "r007",
    title: "Reading: The importance of sports",
    content:
      "Playing sports builds physical strength, teamwork, and discipline. Regular exercise reduces stress and improves concentration. Schools that include daily sports periods produce healthier, more focused students.",
    category: "reading",
    tags: ["sports", "health", "school"],
    difficulty: "intermediate",
  },
  {
    id: "r008",
    title: "Reading: A letter to a friend",
    content:
      "Dear Ananya, How have you been? I hope your exams went well. I am writing to tell you about my summer trip to Ooty. The hills were breathtaking and the weather was perfect. Miss you!",
    category: "reading",
    tags: ["letter", "friendly", "informal"],
    difficulty: "beginner",
  },
  {
    id: "r009",
    title: "Reading: The digital economy",
    content:
      "E-commerce has revolutionized the way people shop. Businesses operate globally through digital platforms. Payment systems have become faster and more secure, enabling millions of transactions every second.",
    category: "reading",
    tags: ["business", "economy", "digital"],
    difficulty: "advanced",
  },
  {
    id: "r010",
    title: "Reading: Animals of India",
    content:
      "India is home to incredible wildlife. The Bengal tiger, Indian elephant, and one-horned rhinoceros are among the most iconic species. Conservation efforts have helped stabilize their declining populations.",
    category: "reading",
    tags: ["animals", "India", "nature"],
    difficulty: "intermediate",
  },
  // SPEAKING - 25 items
  {
    id: "s001",
    title: "Introduce yourself",
    content:
      "Practice: Hello, my name is ___. I am from ___. I am ___ years old. I study/work at ___. My hobby is ___. Nice to meet you all!",
    category: "speaking",
    tags: ["introduction", "beginner", "social"],
    difficulty: "beginner",
  },
  {
    id: "s002",
    title: "Describe your daily routine",
    content:
      "Talk about: What time you wake up, what you eat for breakfast, how you get to school/work, what you do in the evening, what time you sleep.",
    category: "speaking",
    tags: ["routine", "daily", "present simple"],
    difficulty: "beginner",
  },
  {
    id: "s003",
    title: "Talk about your family",
    content:
      "Describe: How many members, their names and ages, what they do, one quality you admire in each person, your favorite family memory.",
    category: "speaking",
    tags: ["family", "description", "personal"],
    difficulty: "beginner",
  },
  {
    id: "s004",
    title: "Describe a problem and solution",
    content:
      "Structure: The problem is... The cause is... This affects... One solution would be... Another option is... I recommend... because...",
    category: "speaking",
    tags: ["problem solving", "structure", "intermediate"],
    difficulty: "intermediate",
  },
  {
    id: "s005",
    title: "Give your opinion",
    content:
      "Use: In my opinion... I believe that... From my point of view... I think... One reason is... However, others argue... To conclude, I feel...",
    category: "speaking",
    tags: ["opinion", "academic", "debate"],
    difficulty: "intermediate",
  },
  {
    id: "s006",
    title: "Describe a picture or scene",
    content:
      "In the foreground... In the background... On the left/right... There appears to be... The scene shows... It looks like... I can see...",
    category: "speaking",
    tags: ["description", "picture", "visual"],
    difficulty: "intermediate",
  },
  {
    id: "s007",
    title: "Talk about your future plans",
    content:
      "Use: I am going to... I plan to... I hope to... In the next five years... My goal is... I would like to... I intend to...",
    category: "speaking",
    tags: ["future", "goals", "personal"],
    difficulty: "beginner",
  },
  {
    id: "s008",
    title: "Debate: Technology and children",
    content:
      "For: Technology improves learning, digital literacy is essential. Against: Screen time is harmful, reduces physical activity. Practice arguing both sides.",
    category: "speaking",
    tags: ["debate", "technology", "advanced"],
    difficulty: "advanced",
  },
  {
    id: "s009",
    title: "Tell a story about your past",
    content:
      "Use past tense. Set the scene: It was a Tuesday morning when... Then: Suddenly... Next: After that... Finally: In the end... Reflect: Looking back, I learned...",
    category: "speaking",
    tags: ["narrative", "story", "past tense"],
    difficulty: "intermediate",
  },
  {
    id: "s010",
    title: "Phone conversation practice",
    content:
      "Opening: Hello, this is ___, may I speak to ___? Reason: I am calling about... Request: Could you please...? Closing: Thank you, goodbye!",
    category: "speaking",
    tags: ["phone", "formal", "professional"],
    difficulty: "intermediate",
  },
  // SHADOWING - 20 items
  {
    id: "sh001",
    title: "Shadowing: Greetings",
    content:
      "Good morning! How are you doing today? I hope you had a wonderful start to your day. It is great to see you!",
    category: "shadowing",
    tags: ["greetings", "natural", "beginner"],
    difficulty: "beginner",
  },
  {
    id: "sh002",
    title: "Shadowing: News intro",
    content:
      "Good evening. Here are tonight's top stories. Authorities have announced new measures to address rising inflation across the country.",
    category: "shadowing",
    tags: ["news", "formal", "intonation"],
    difficulty: "advanced",
  },
  {
    id: "sh003",
    title: "Shadowing: Casual conversation",
    content:
      "Hey! What have you been up to? I haven't seen you in ages! We should definitely catch up over coffee sometime soon.",
    category: "shadowing",
    tags: ["casual", "friends", "linking"],
    difficulty: "intermediate",
  },
  {
    id: "sh004",
    title: "Shadowing: Directions",
    content:
      "Go straight ahead for about two blocks, then turn left at the traffic light. The school will be on your right, just past the pharmacy.",
    category: "shadowing",
    tags: ["directions", "practical", "travel"],
    difficulty: "beginner",
  },
  {
    id: "sh005",
    title: "Shadowing: Ordering food",
    content:
      "Could I please have the chicken curry with rice? And a glass of water, thank you. Oh, and could we also get some extra naan bread?",
    category: "shadowing",
    tags: ["food", "polite", "restaurant"],
    difficulty: "beginner",
  },
  // ROLEPLAY - 20 items
  {
    id: "rp001",
    title: "Roleplay: At the doctor",
    content:
      "Patient: I have had a headache for three days. Doctor: Where is the pain? Patient: At the back of my head. Doctor: Any fever or nausea? Patient: A little fever, yes.",
    category: "roleplay",
    tags: ["medical", "symptoms", "conversation"],
    difficulty: "intermediate",
  },
  {
    id: "rp002",
    title: "Roleplay: Job interview",
    content:
      "Interviewer: Tell me about yourself. Candidate: I have three years experience in sales. I am results-driven and a team player. Interviewer: Why do you want this role?",
    category: "roleplay",
    tags: ["interview", "professional", "advanced"],
    difficulty: "advanced",
  },
  {
    id: "rp003",
    title: "Roleplay: At the hotel",
    content:
      "Guest: I have a reservation under Sharma. Reception: Welcome, Mr. Sharma. Room 204 on the second floor. Here is your key card. Breakfast is from 7 to 10am.",
    category: "roleplay",
    tags: ["hotel", "travel", "formal"],
    difficulty: "intermediate",
  },
  {
    id: "rp004",
    title: "Roleplay: Calling customer service",
    content:
      "Customer: I received a damaged item. I would like a replacement or refund. Agent: I apologize for that. Could you share your order number? We will resolve this immediately.",
    category: "roleplay",
    tags: ["customer service", "complaint", "professional"],
    difficulty: "intermediate",
  },
  {
    id: "rp005",
    title: "Roleplay: Meeting a neighbor",
    content:
      "Hi! I just moved in next door. Nice to meet you! I am Rahul. Oh wonderful! Welcome to the building. If you need anything at all, please knock on my door.",
    category: "roleplay",
    tags: ["social", "neighbors", "friendly"],
    difficulty: "beginner",
  },
  // LISTENING - 20 items
  {
    id: "l001",
    title: "Listening: Weather forecast",
    content:
      "Listen for: temperature, weather conditions, wind speed, forecast for next three days. Practice identifying numbers and direction words in audio.",
    category: "listening",
    tags: ["weather", "news", "numbers"],
    difficulty: "beginner",
  },
  {
    id: "l002",
    title: "Listening: Train announcement",
    content:
      "The Shatabdi Express to New Delhi is now arriving at Platform 3. Passengers are requested to have their tickets and identification ready for inspection.",
    category: "listening",
    tags: ["announcement", "travel", "formal"],
    difficulty: "intermediate",
  },
  {
    id: "l003",
    title: "Listening: A telephone conversation",
    content:
      "Listen for: the purpose of the call, the main request, the agreed solution, and the closing phrase. Focus on tone and polite expressions.",
    category: "listening",
    tags: ["phone", "conversation", "purpose"],
    difficulty: "intermediate",
  },
  {
    id: "l004",
    title: "Listening: Short lecture",
    content:
      "Practice listening to a 2-minute talk and noting: main topic, 3 key points, conclusion. Ignore unknown words, focus on overall meaning.",
    category: "listening",
    tags: ["lecture", "academic", "note taking"],
    difficulty: "advanced",
  },
  {
    id: "l005",
    title: "Listening: Directions in the city",
    content:
      "Listen and draw the route. Key words: left, right, straight, opposite, next to, corner, traffic light, roundabout, at the end of.",
    category: "listening",
    tags: ["directions", "map", "practical"],
    difficulty: "beginner",
  },
];

function tokenize(text: string): Map<string, number> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  return freq;
}

function cosineSimilarity(
  a: Map<string, number>,
  b: Map<string, number>,
): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const [w, f] of a) {
    dot += f * (b.get(w) ?? 0);
    magA += f * f;
  }
  for (const [, f] of b) magB += f * f;
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function searchContent(
  query: string,
  page = 0,
  pageSize = 10,
): { results: ContentItem[]; total: number; hasMore: boolean } {
  if (!query.trim()) return { results: [], total: 0, hasMore: false };
  const qTokens = tokenize(query);
  const scored = CONTENT_CORPUS.map((item) => {
    const itemTokens = tokenize(
      `${item.title} ${item.content} ${item.tags.join(" ")}`,
    );
    let score = cosineSimilarity(qTokens, itemTokens);
    // Tag match bonus
    for (const tag of item.tags) {
      if (query.toLowerCase().includes(tag.toLowerCase())) score += 0.2;
    }
    // Category match bonus
    if (query.toLowerCase().includes(item.category)) score += 0.15;
    return { item, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const total = scored.length;
  const slice = scored
    .slice(page * pageSize, (page + 1) * pageSize)
    .map((x) => x.item);
  return { results: slice, total, hasMore: (page + 1) * pageSize < total };
}

export function getRecommendations(completedModules: string[]): ContentItem[] {
  const categoryMap: Record<string, ContentItem["category"]> = {
    "Vocabulary Builder": "vocabulary",
    "Grammar Essentials": "grammar",
    "Pronunciation Practice": "pronunciation",
    "Listening Skills": "listening",
    "Reading Comprehension": "reading",
    "Conversation Practice": "speaking",
    "Shadowing Practice": "shadowing",
    "AI Roleplay": "roleplay",
  };
  const preferredCats = completedModules
    .map((m) => categoryMap[m])
    .filter(Boolean);
  const pool =
    preferredCats.length > 0
      ? CONTENT_CORPUS.filter((item) => preferredCats.includes(item.category))
      : CONTENT_CORPUS;
  return pool.sort(() => Math.random() - 0.5).slice(0, 6);
}

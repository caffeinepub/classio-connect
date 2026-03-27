declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import {
  AnimatedCharacter,
  type CharacterType,
} from "@/components/AnimatedCharacter";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Lightbulb,
  Mic,
  MicOff,
  Send,
  Star,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type Scenario = { title: string; description: string; roleContext: string };

const SCENARIOS: Record<number, Scenario> = {
  1: {
    title: "Greetings & Introductions",
    description:
      "Your AI partner is a new student at your school. Greet them and introduce yourself!",
    roleContext: "new_student",
  },
  2: {
    title: "Asking for Directions",
    description:
      "Your AI partner is a lost tourist. Help them find the library!",
    roleContext: "lost_tourist",
  },
};

// ─── Session Memory ───────────────────────────────────────────────────────────

interface SessionMemory {
  name: string | null;
  school: string | null;
  grade: string | null;
  sport: string | null;
  hobby: string | null;
  food: string | null;
  place: string | null;
  subject: string | null;
  job_dream: string | null;
  mentionedFacts: string[];
}

function createEmptyMemory(): SessionMemory {
  return {
    name: null,
    school: null,
    grade: null,
    sport: null,
    hobby: null,
    food: null,
    place: null,
    subject: null,
    job_dream: null,
    mentionedFacts: [],
  };
}

function addFact(memory: SessionMemory, fact: string) {
  if (!fact.trim()) return;
  memory.mentionedFacts = memory.mentionedFacts.filter(
    (f) => f.toLowerCase() !== fact.toLowerCase(),
  );
  if (memory.mentionedFacts.length >= 5) memory.mentionedFacts.shift();
  memory.mentionedFacts.push(fact);
}

// Returns the first newly-set structured fact { key, value }, or null if nothing new
function extractFacts(
  msg: string,
  memory: SessionMemory,
): { key: string; value: string } | null {
  let newFact: { key: string; value: string } | null = null;

  function setIfNew(key: keyof SessionMemory, value: string, factStr: string) {
    if (!memory[key]) {
      (memory as any)[key] = value;
      addFact(memory, factStr);
      if (!newFact) newFact = { key, value };
    } else {
      // Still update facts list even if field was known
      addFact(memory, factStr);
    }
  }

  // Name
  const nameMatch =
    msg.match(/my name is (\w+)/i) ?? msg.match(/(?:call me) (\w+)/i);
  if (nameMatch) setIfNew("name", nameMatch[1], `your name is ${nameMatch[1]}`);

  // School
  const schoolMatch =
    msg.match(/i (?:study|go) (?:at|to|in) ([\w\s]+?) school/i) ??
    msg.match(/my school is ([\w\s]+)/i);
  if (schoolMatch)
    setIfNew(
      "school",
      schoolMatch[1].trim(),
      `you go to ${schoolMatch[1].trim()} school`,
    );

  // Grade / Class
  const gradeMatch =
    msg.match(/(?:i am in |i'm in )?(?:class|grade|standard) (\w+)/i) ??
    msg.match(/(?:studying in|in) (?:class|grade) (\w+)/i);
  if (gradeMatch)
    setIfNew("grade", gradeMatch[1], `you are in class ${gradeMatch[1]}`);

  // Dream job
  const jobMatch = msg.match(
    /i (?:want to be|dream of being|wish to be) (?:a|an)? ([\w\s]+)/i,
  );
  if (jobMatch)
    setIfNew(
      "job_dream",
      jobMatch[1].trim(),
      `you want to be a ${jobMatch[1].trim()}`,
    );

  // Place
  const placeMatch = msg.match(
    /i (?:live|am from|stay|come from) (?:in|at|from)? ([\w\s]+)/i,
  );
  if (placeMatch)
    setIfNew(
      "place",
      placeMatch[1].trim(),
      `you are from ${placeMatch[1].trim()}`,
    );

  // Favourite subject
  const subjectMatch =
    msg.match(/(?:favourite|favorite|love|like) subject is ([\w\s]+)/i) ??
    msg.match(/i (?:love|like|enjoy) ([\w\s]+?) (?:class|subject|lesson)/i);
  if (subjectMatch)
    setIfNew(
      "subject",
      subjectMatch[1].trim(),
      `your favourite subject is ${subjectMatch[1].trim()}`,
    );

  // Sport
  const sportMatch =
    msg.match(/i (?:play|love playing|enjoy playing) ([\w\s]+?)(?:\.| |$)/i) ??
    msg.match(/(?:my favourite sport is) ([\w\s]+)/i);
  if (
    sportMatch &&
    /cricket|football|basketball|tennis|badminton|swimming|running|volleyball|hockey|chess/i.test(
      sportMatch[1],
    )
  )
    setIfNew("sport", sportMatch[1].trim(), `you play ${sportMatch[1].trim()}`);

  // Hobby
  const hobbyMatch = msg.match(
    /i (?:love|like|enjoy|am into) (\w+ing|\w+ \w+ing)/i,
  );
  if (
    hobbyMatch &&
    !/^(going|being|doing|having|getting|making|taking)$/i.test(hobbyMatch[1])
  )
    setIfNew(
      "hobby",
      hobbyMatch[1].trim(),
      `you enjoy ${hobbyMatch[1].trim()}`,
    );

  // Food
  const foodMatch =
    msg.match(
      /(?:my favourite food is|i love eating|i like eating) ([\w\s]+)/i,
    ) ?? msg.match(/i (?:love|like) ([\w]+) (?:a lot|so much|very much)/i);
  if (
    foodMatch &&
    /pizza|rice|biryani|noodles|pasta|curry|burger|sandwich|dosa|idli|roti|bread|cake|chocolate|ice cream/i.test(
      foodMatch[1],
    )
  )
    setIfNew(
      "food",
      foodMatch[1].trim(),
      `your favourite food is ${foodMatch[1].trim()}`,
    );

  return newFact;
}

// ─── Warm acknowledgment when a brand-new fact is discovered ─────────────────

const FACT_ACKNOWLEDGMENTS: Record<string, (v: string) => string> = {
  sport: (v) =>
    `That's wonderful that you love ${v}! Do you play for a team, or just for fun with friends? I'd love to hear more about your ${v} experiences!`,
  job_dream: (v) =>
    `That's a brilliant goal — wanting to be a ${v}! What inspired you to choose that path? Is there someone in your life who motivated you?`,
  hobby: (v) =>
    `How lovely that you enjoy ${v}! How long have you been doing it, and what first got you started?`,
  food: (v) =>
    `${v.charAt(0).toUpperCase() + v.slice(1)} — great taste! Do you enjoy making it yourself, or do you have a favourite place you love to eat it?`,
  place: (v) =>
    `How interesting — ${v}! What is your absolute favourite thing about living there?`,
  subject: (v) =>
    `${v.charAt(0).toUpperCase() + v.slice(1)} is such a fascinating subject! What is it about ${v} that excites you the most?`,
  grade: (v) =>
    `Class ${v} — exciting times ahead! What has been the most interesting thing you have learnt this year so far?`,
  name: (v) =>
    `What a lovely name, ${v}! It's so nice to know you. Where are you from, ${v}?`,
  school: (v) =>
    `That sounds like a wonderful school! What is the best thing about studying at ${v}?`,
};

// ─── Topic deepening prompts for short answers ───────────────────────────────

const DEEPENING_PROMPTS = [
  "That's a great start! Can you tell me more — describe it in 2 or 3 full sentences.",
  "I love that answer! Now try to expand on it — what makes you feel that way?",
  "Good! Now challenge yourself — can you explain *why* in a complete sentence?",
  "Nice! I'd love to hear more details. Can you paint a fuller picture for me?",
  "Great response! Now go deeper — what is the story behind that?",
];

// ─── Topic streak bridges ─────────────────────────────────────────────────────

const TOPIC_BRIDGES: Partial<
  Record<string, (mem: SessionMemory) => string | null>
> = {
  school: (mem) =>
    mem.sport
      ? `You've been doing great talking about school! Let's connect it — do sports at your school help you stay focused on your studies? You mentioned you play ${mem.sport}, so I'd love to know!`
      : `You've covered so much about school! Let's broaden the picture — outside of school, what is one activity that completely refreshes your mind?`,
  technology: (mem) =>
    mem.job_dream
      ? `Since you're passionate about technology and you want to be a ${mem.job_dream}, what specific tech skills do you think will matter most in that career?`
      : `We've explored technology thoroughly! Connecting it to the future — how do you think the technology you use today will evolve by the time you start your career?`,
  sports: (mem) =>
    mem.subject
      ? `Sport and study go hand in hand! You mentioned ${mem.subject} as your favourite subject — does your sporting mindset, like discipline and focus, help you in ${mem.subject} class?`
      : `You're clearly passionate about sports! Let's connect it to daily life — how does playing sport affect your energy levels and mood for the rest of the day?`,
  career: (mem) =>
    mem.school
      ? `We've talked a lot about career goals! Thinking about your school life — which activities or lessons are quietly shaping you for the career you want?`
      : `You've been so thoughtful about your career! Let's look at the bigger picture — what kind of impact do you want your work to have on other people's lives?`,
  music: (mem) =>
    mem.hobby
      ? `Music connects to so much! Since you enjoy ${mem.hobby}, is there a particular soundtrack or type of music that puts you in the perfect mood for it?`
      : `You clearly have a deep love for music! Let's go further — if you had to describe your personality using only three song titles or artists, what would they be?`,
  food: (mem) =>
    mem.place
      ? `Food is such a big part of culture! Since you're from ${mem.place}, is there a dish from your area that you think the whole world should try?`
      : `We've talked so much about food! Here's a fun one — if you had to eat only one meal for the rest of your life, what would it be and why?`,
};

// ─── Milestone messages ───────────────────────────────────────────────────────

const MILESTONE_MESSAGES: Record<number, string> = {
  5: "You're doing brilliantly — 5 exchanges in! Keep going, every sentence builds your fluency.",
  10: "10 exchanges! Your English is flowing so naturally. Let's keep the conversation going!",
  20: "20 exchanges — that's impressive! You are well on your way to speaking English with confidence.",
};

// ─── Personalised follow-up templates ────────────────────────────────────────

const FOLLOWUP_TEMPLATES = [
  "Earlier you mentioned {fact} — tell me more about that!",
  "You brought up {fact} a little while ago. How has that been going lately?",
  "I remember you said {fact}. I would love to know — how did that start for you?",
  "Going back to {fact} that you mentioned — what do you enjoy most about it?",
  "That connects to something you said earlier about {fact}. Can you expand on that?",
];

function buildPersonalisedFollowup(memory: SessionMemory): string | null {
  if (memory.mentionedFacts.length === 0) return null;
  const randomFact =
    memory.mentionedFacts[
      Math.floor(Math.random() * memory.mentionedFacts.length)
    ];
  const template =
    FOLLOWUP_TEMPLATES[Math.floor(Math.random() * FOLLOWUP_TEMPLATES.length)];
  return template.replace("{fact}", randomFact);
}

// ─── Grammar Correction ───────────────────────────────────────────────────────

type GrammarError = { wrong: string; correct: string };

const GRAMMAR_RULES: { pattern: RegExp; wrong: string; correct: string }[] = [
  { pattern: /\bi is\b/i, wrong: "I is", correct: "I am" },
  { pattern: /\bhe go\b(?!es)/i, wrong: "he go", correct: "he goes" },
  { pattern: /\bshe go\b(?!es)/i, wrong: "she go", correct: "she goes" },
  { pattern: /\bthey goes\b/i, wrong: "they goes", correct: "they go" },
  { pattern: /\bi goes\b/i, wrong: "I goes", correct: "I go" },
  { pattern: /\bi were\b/i, wrong: "I were", correct: "I was" },
  { pattern: /\byou was\b/i, wrong: "you was", correct: "you were" },
  { pattern: /\bwe was\b/i, wrong: "we was", correct: "we were" },
  { pattern: /\bthey was\b/i, wrong: "they was", correct: "they were" },
  { pattern: /\bhe don't\b/i, wrong: "he don't", correct: "he doesn't" },
  { pattern: /\bshe don't\b/i, wrong: "she don't", correct: "she doesn't" },
  { pattern: /\bit don't\b/i, wrong: "it don't", correct: "it doesn't" },
  { pattern: /\bi goed\b/i, wrong: "I goed", correct: "I went" },
  { pattern: /\bi buyed\b/i, wrong: "I buyed", correct: "I bought" },
  { pattern: /\bi thinked\b/i, wrong: "I thinked", correct: "I thought" },
  { pattern: /\bmore better\b/i, wrong: "more better", correct: "better" },
  { pattern: /\bmore faster\b/i, wrong: "more faster", correct: "faster" },
  {
    pattern: /\bcan able to\b/i,
    wrong: "can able to",
    correct: "can / is able to",
  },
  {
    pattern: /\bi have went\b/i,
    wrong: "I have went",
    correct: "I have gone",
  },
  { pattern: /\bhe have\b/i, wrong: "He have", correct: "He has" },
  { pattern: /\bshe have\b/i, wrong: "She have", correct: "She has" },
];

function detectGrammarError(text: string): GrammarError | null {
  for (const rule of GRAMMAR_RULES) {
    if (rule.pattern.test(text))
      return { wrong: rule.wrong, correct: rule.correct };
  }
  if (/^i\s/i.test(text.trim()) && !/^I\s/.test(text.trim())) {
    return {
      wrong: "i (lowercase as subject)",
      correct: "I (always capitalize)",
    };
  }
  return null;
}

// ─── Topic Detection & Adaptive Responses ────────────────────────────────────

const TOPIC_RESPONSES: Record<string, string[]> = {
  greetings: [
    "Hello! Great to hear from you. How are you feeling today? Tell me in a full sentence!",
    "Hi there! Lovely to chat. What is your name and where are you from?",
    "Hey! Nice to meet you. Can you introduce yourself with two or three sentences?",
  ],
  school: [
    "School sounds interesting! What is your favourite subject and why do you enjoy it?",
    "That reminds me of my school days! Do you have any exams coming up? How do you prepare?",
    "Homework can be challenging! Which subject do you find the hardest and which is the easiest?",
    "Teachers play such an important role. Tell me about a teacher who has inspired you.",
  ],
  family: [
    "Family is so important! How many people are in your family? Tell me about each of them.",
    "That sounds lovely! Do you spend a lot of time with your family on weekends?",
    "Home is where the heart is! What is your favourite thing to do with your family?",
    "Brothers and sisters can be fun! Do you have any siblings? What are they like?",
  ],
  food: [
    "Food is a wonderful topic! What is your all-time favourite dish and who cooks it best?",
    "Yummy! Do you enjoy cooking? What is the easiest dish you can make yourself?",
    "Every region has special food. What traditional food is popular in your area?",
    "Breakfast is the most important meal! What did you have for breakfast today?",
  ],
  sports: [
    "Sports are great for health! Do you play any sport regularly? Tell me more!",
    "Exciting! Who is your favourite sports player and why do you admire them?",
    "Team sports build teamwork. Have you ever played for a school team or a local club?",
    "Watching matches is thrilling! What was the most exciting match you have ever watched?",
  ],
  weather: [
    "The weather affects our mood so much! What kind of weather do you enjoy the most?",
    "Rainy days can be cosy! What do you like to do when it rains outside?",
    "Summer has its own charm! What activities do you enjoy during summer holidays?",
    "Cold winters are wonderful! Do you experience snowfall in your area?",
  ],
  travel: [
    "Travel broadens the mind! Have you visited any place that left a strong impression on you?",
    "Wonderful! If you could travel anywhere in the world, where would you go and why?",
    "Road trips can be so much fun! What is the most interesting trip you have been on?",
    "Different countries, different cultures! What is one thing you would love to experience abroad?",
  ],
  hobbies: [
    "Hobbies keep us creative! How long have you been practising your hobby and how did you start?",
    "That sounds fun! Do you prefer indoor hobbies like reading or outdoor ones like sports?",
    "Music is a universal language! Do you play any instrument or enjoy singing?",
    "Drawing and art express our feelings. Have you ever created something you are really proud of?",
  ],
  feelings: [
    "It is good to talk about feelings! Can you describe exactly how you are feeling and why?",
    "Thank you for sharing. What usually cheers you up when you are feeling down?",
    "Being excited is wonderful! What is making you feel that way? Tell me everything!",
    "Feelings are natural. Try to use describing words — are you slightly, very, or extremely happy?",
  ],
  dreams: [
    "Dreams and goals give us direction! What do you want to be when you grow up and why?",
    "Fantastic ambition! What steps are you taking right now to reach that dream?",
    "The future is bright! Where do you see yourself in ten years? Paint me a picture!",
    "Every great career starts with a plan. What subjects are most important for your dream job?",
  ],
  technology: [
    "Technology is changing everything! What is your favourite gadget and how do you use it daily?",
    "Social media is a huge part of life now. Which platforms do you use most and why?",
    "Screen time is a real topic! How many hours a day do you spend on your phone or computer?",
    "Coding is a powerful skill. Have you ever tried programming or building an app? What happened?",
    "Artificial intelligence is fascinating! What do you think AI will change about our future?",
    "Every app solves a problem. If you could build your own app, what problem would it solve?",
    "The internet connects the world. What is the most useful thing you have learnt online?",
  ],
  career: [
    "Career goals say a lot about who we are! What is your dream job and what excites you about it?",
    "Every profession needs certain skills. What skills are you building right now for your future career?",
    "Work-life balance is so important. How do you imagine balancing your career with personal life?",
    "Entrepreneurs change the world! Do you have any business ideas you would love to pursue one day?",
    "Role models inspire us. Is there someone in your field you look up to and want to learn from?",
    "Internships give real experience. Would you like to intern somewhere before your first full-time job?",
    "Interviews can be nerve-wracking! How would you describe your strengths in a job interview?",
  ],
  movies: [
    "Movies are great! What genre do you enjoy most — comedy, thriller, drama, or action?",
    "Tell me about the last movie you watched. What was your favourite scene and why?",
    "Great actors bring characters to life. Who is your all-time favourite actor or actress?",
    "Books vs movies — which do you prefer, reading a book first or watching the film?",
    "Some movies change how we see the world. Has any film ever changed your thinking?",
    "If you could recommend just one movie to a friend, which would you choose and why?",
    "Bollywood or Hollywood? Which style of filmmaking do you enjoy more?",
  ],
  music: [
    "Music speaks to the soul! What genre of music do you listen to most — pop, classical, rap, or something else?",
    "What is the one song you have on repeat right now? What do you love about it?",
    "Live concerts are an amazing experience! Have you ever attended one? What was it like?",
    "Playing an instrument is a great skill. Do you play any instrument or wish you could learn one?",
    "Music can shift our mood instantly. How does your favourite music make you feel?",
    "Creating a playlist is an art! If you made a playlist for a long road trip, what five songs would you include?",
  ],
  health: [
    "Health is our greatest wealth! Describe your daily routine — do you have any healthy habits?",
    "Sleep is so underrated! How many hours of sleep do you get and do you feel well-rested?",
    "Exercise keeps the body and mind strong. What is your favourite form of exercise and how often do you do it?",
    "Diet plays a huge role in energy levels. What healthy food do you genuinely enjoy eating?",
    "Mental health is just as important as physical health. How do you manage stress in your life?",
    "Meditation and yoga are powerful tools. Have you ever tried either? What was your experience?",
  ],
  environment: [
    "Our planet needs our help! What changes have you personally noticed because of climate change?",
    "Small daily habits add up. What eco-friendly habits do you practise at home or school?",
    "Nature is beautiful and calming. What is your favourite natural place you have visited or want to visit?",
    "Animals and wildlife are precious. What is one species you feel strongly about protecting and why?",
    "Renewable energy is the future. Do you think solar or wind power can fully replace fossil fuels?",
    "Plastic pollution is a serious problem. What alternatives to single-use plastic do you use in your daily life?",
  ],
  books: [
    "Books open new worlds! What was the last book you read, and would you recommend it?",
    "Everyone has a favourite genre. Do you prefer fiction, non-fiction, poetry, or something else?",
    "Characters stay with us long after we finish a book. Which fictional character has left the biggest impression on you?",
    "Reading builds vocabulary and imagination. How has reading helped you in school or everyday life?",
    "If you could recommend one book to everyone in your class, what would it be and why?",
    "Fiction vs non-fiction — which do you find more enjoyable and what is the reason for your preference?",
  ],
  festivals: [
    "Festivals bring so much joy! Which festival is your absolute favourite and what makes it special?",
    "Family traditions make celebrations unique. What is one tradition your family always follows during festivals?",
    "Food is a big part of every celebration! What special dish does your family make during your favourite festival?",
    "Decorations set the mood! How do you decorate your home during a major festival?",
    "What is the most memorable festival celebration you have ever experienced? Tell me every detail!",
  ],
  friendship: [
    "Friendships are such a treasure! Tell me about your best friend — how did you two meet?",
    "What qualities do you value most in a friend — loyalty, humour, honesty, or something else?",
    "Funny memories with friends are priceless! What is the most hilarious thing that has happened with your friends?",
    "Friendships change as we grow older. How have your friendships evolved from school days to now?",
    "Long-distance friendships take effort. Do you have any friends who live far away? How do you stay connected?",
    "Good friends support each other through tough times. Has a friend ever helped you through a difficult moment?",
  ],
  money: [
    "Money management is a life skill! Do you save your pocket money or spend it right away?",
    "Smart saving requires a goal. What are you currently saving up for and how long will it take?",
    "We all have a story! What is the most expensive thing you have ever bought, and was it worth it?",
    "Budgeting helps us stay on track. Do you follow any system to manage your spending?",
    "Financial goals shape our future. Where do you see your finances in five years?",
    "Cryptocurrency is a hot topic. Have you ever heard of Bitcoin? What is your opinion on digital currency?",
  ],
};

const TOPIC_KEYWORDS: Record<string, RegExp> = {
  greetings:
    /\b(hi|hello|hey|good morning|good afternoon|good evening|nice to meet|my name is)\b/i,
  school:
    /\b(school|class|teacher|homework|subject|exam|study|college|university|lesson)\b/i,
  family:
    /\b(family|mother|father|sister|brother|parents|home|mom|dad|uncle|aunt|grandma|grandpa)\b/i,
  food: /\b(eat|food|lunch|dinner|breakfast|rice|pizza|cook|hungry|meal|snack|drink)\b/i,
  sports:
    /\b(play|cricket|football|basketball|game|sport|team|match|run|swim|gym|exercise)\b/i,
  weather:
    /\b(weather|rain|sunny|cold|hot|summer|winter|spring|temperature|climate|wind|snow)\b/i,
  travel:
    /\b(travel|trip|visit|place|holiday|vacation|country|city|abroad|tour|journey)\b/i,
  hobbies:
    /\b(hobby|drawing|painting|reading|music|dance|sing|listen|collect|craft|write)\b/i,
  feelings:
    /\b(feel|feeling|happy|sad|tired|excited|nervous|bored|worried|angry|afraid|joy|stress)\b/i,
  dreams: /\b(dream|future|plan|aspire|wish|ambition)\b/i,
  technology:
    /\b(phone|smartphone|computer|laptop|internet|app|social media|youtube|games|gadget|coding|software|robot|AI|technology|online|digital|wifi|video|tablet)\b/i,
  career:
    /\b(job|career|work|profession|engineer|doctor|lawyer|business|office|salary|internship|skill|resume|interview|company|startup|entrepreneur)\b/i,
  movies:
    /\b(movie|film|cinema|watch|actor|actress|director|series|netflix|show|episode|scene|character|comedy|thriller|drama|bollywood|hollywood)\b/i,
  music:
    /\b(music|song|singer|artist|band|concert|melody|lyrics|playlist|rap|pop|classical|rhythm|instrument|guitar|piano|voice)\b/i,
  health:
    /\b(health|fit|fitness|sleep|diet|nutrition|hospital|sick|medicine|mental health|yoga|meditation|weight)\b/i,
  environment:
    /\b(environment|nature|trees|pollution|climate|earth|recycle|green|planet|energy|plastic|water|animals|wildlife|forest|global warming)\b/i,
  books:
    /\b(book|read|novel|story|author|chapter|library|fiction|non-fiction|poem|poetry|literature|page|kindle|magazine)\b/i,
  festivals:
    /\b(festival|celebrate|celebration|holiday|diwali|christmas|eid|holi|new year|party|tradition|culture|custom|event)\b/i,
  friendship:
    /\b(friend|friendship|best friend|hang out|social|peer|classmate|trust|loyal|childhood|college friend)\b/i,
  money:
    /\b(money|save|spend|budget|bank|earn|income|cost|price|expensive|cheap|pocket money|finance|investment|cryptocurrency)\b/i,
};

const CHANGE_TOPIC_REGEX =
  /\b(other topic|change topic|different topic|something else|let's talk about|talk about something|switch topic|another topic)\b/i;

function detectTopic(msg: string): string | null {
  for (const [topic, pattern] of Object.entries(TOPIC_KEYWORDS)) {
    if (pattern.test(msg)) return topic;
  }
  return null;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ChatRole = "user" | "lexi" | "tip" | "milestone";

type ChatMsg = {
  id: string;
  role: ChatRole;
  text: string;
  tipData?: { wrong: string; correct: string };
};

interface Props {
  lesson: number;
  onComplete: (score: number, total: number) => void;
}

const CHARACTER_OPTIONS: {
  type: CharacterType;
  label: string;
  color: string;
}[] = [
  { type: "boy", label: "Boy", color: "#3b82f6" },
  { type: "girl", label: "Girl", color: "#a855f7" },
  { type: "teacher", label: "Teacher", color: "#1e40af" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ClassioTipCard({
  wrong,
  correct,
}: { wrong: string; correct: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="mx-auto max-w-[90%] rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex gap-3 items-start shadow-sm"
    >
      <div className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-amber-700 mb-1">Classio Tip</p>
        <p className="text-xs text-amber-900 leading-relaxed">
          You said:{" "}
          <span className="font-semibold line-through opacity-70">{wrong}</span>
          {" — Try: "}
          <span className="font-semibold text-green-700">{correct}</span>
        </p>
        <p className="text-xs text-amber-600 mt-1 italic">
          Great catch — small fixes make a big difference!
        </p>
      </div>
    </motion.div>
  );
}

function MilestoneCard({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="mx-auto max-w-[92%] rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 px-4 py-2.5 flex gap-2.5 items-center shadow-sm"
    >
      <Star className="w-4 h-4 text-emerald-500 shrink-0 fill-emerald-400" />
      <p className="text-xs font-semibold text-emerald-700 leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ConversationModule({ lesson, onComplete }: Props) {
  const _scenario = SCENARIOS[lesson] ?? SCENARIOS[1];
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterType | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [rememberedFactsCount, setRememberedFactsCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const lastPickedRef = useRef<Record<string, number>>({});
  const memoryRef = useRef<SessionMemory>(createEmptyMemory());
  const exchangeCountRef = useRef(0);
  const topicStreakRef = useRef<{ topic: string | null; count: number }>({
    topic: null,
    count: 0,
  });

  const speakText = useCallback(
    (text: string) => {
      if (!ttsEnabled) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.9;
      u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    },
    [ttsEnabled],
  );

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Core response generator — returns the main lexi reply text
  const getLexiResponse = (
    userMessage: string,
    memory: SessionMemory,
    currentExchangeCount: number,
  ): string => {
    const msg = userMessage.toLowerCase().trim();
    const mem = memory;

    if (CHANGE_TOPIC_REGEX.test(msg)) {
      return "Sure! Which topic would you like to discuss? You can choose from school, family, sports, travel, technology, movies, music, health, career goals, books, festivals, friendship, money, or anything else you like!";
    }

    const topic = detectTopic(msg);

    // Every 4th exchange weave in a personalised follow-up
    if (
      currentExchangeCount > 0 &&
      currentExchangeCount % 4 === 3 &&
      mem.mentionedFacts.length > 0
    ) {
      const followup = buildPersonalisedFollowup(mem);
      if (followup) return followup;
    }

    // Context-aware responses by topic + memory
    if (topic === "career" && mem.job_dream) {
      return `Earlier you said you want to be a ${mem.job_dream} — that is a fantastic goal! What specific skills are you working on to get there?`;
    }
    if (topic === "school" && mem.grade) {
      return `You mentioned you are in class ${mem.grade} — which subject are you finding most challenging this year, and how are you tackling it?`;
    }
    if (topic === "sports" && mem.sport) {
      return `You talked about ${mem.sport} earlier — let us go deeper! What is your all-time favourite memory of playing?`;
    }
    if (topic === "greetings" && mem.name) {
      return `Great to chat with you again, ${mem.name}! What would you like to talk about today?`;
    }

    if (topic && TOPIC_RESPONSES[topic]) {
      const responses = TOPIC_RESPONSES[topic];
      const lastIdx = lastPickedRef.current[topic] ?? -1;
      const available = responses.map((_, i) => i).filter((i) => i !== lastIdx);
      const pool =
        available.length > 0 ? available : responses.map((_, i) => i);
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      lastPickedRef.current[topic] = chosen;
      let response = responses[chosen];
      // Occasionally address by name
      if (mem.name && currentExchangeCount % 3 === 2) {
        response = `${mem.name}, ${response.charAt(0).toLowerCase()}${response.slice(1)}`;
      }
      return response;
    }

    return "That is interesting! Which topic would you like to explore? We can talk about school, family, technology, movies, music, health, career goals, books, festivals, friendship, money, or anything on your mind!";
  };

  const startWithCharacter = (type: CharacterType) => {
    memoryRef.current = createEmptyMemory();
    exchangeCountRef.current = 0;
    topicStreakRef.current = { topic: null, count: 0 };
    setExchangeCount(0);
    setRememberedFactsCount(0);
    setSelectedCharacter(type);
    const greeting = "Let's talk! How are you?";
    setMessages([{ id: "init", role: "lexi", text: greeting }]);
    setTimeout(() => speakText(greeting), 300);
  };

  const sendText = (text: string) => {
    if (!text.trim()) return;
    const ts = Date.now();
    const newMsgs: ChatMsg[] = [];

    // 1. User message
    newMsgs.push({ id: `u-${ts}`, role: "user", text: text.trim() });

    // 2. Extract facts — returns first newly-set structured fact
    const newFact = extractFacts(text.trim(), memoryRef.current);
    setRememberedFactsCount(memoryRef.current.mentionedFacts.length);

    // 3. Update topic streak
    const detectedTopic = detectTopic(text.toLowerCase());
    if (detectedTopic && detectedTopic === topicStreakRef.current.topic) {
      topicStreakRef.current.count++;
    } else {
      topicStreakRef.current = { topic: detectedTopic, count: 1 };
    }

    // 4. Grammar tip (independent — always shown)
    const grammarError = detectGrammarError(text.trim());
    if (grammarError) {
      newMsgs.push({
        id: `tip-${ts + 1}`,
        role: "tip",
        text: "",
        tipData: grammarError,
      });
    }

    // 5. Milestone message (before AI reply)
    const nextExchangeNum = exchangeCountRef.current + 1;
    const milestoneText = MILESTONE_MESSAGES[nextExchangeNum];
    if (milestoneText) {
      newMsgs.push({
        id: `milestone-${ts + 2}`,
        role: "milestone",
        text: milestoneText,
      });
    }

    // 6. Build main lexi response — priority order:
    //    a. Topic streak bridge (3+ same topic)
    //    b. New fact warm acknowledgment
    //    c. Short answer deepening appended to normal response
    //    d. Normal adaptive response
    let lexiText: string;
    const isShortAnswer = text.trim().split(/\s+/).length < 8;
    const currentStreak = topicStreakRef.current;

    if (
      currentStreak.count >= 3 &&
      currentStreak.topic &&
      TOPIC_BRIDGES[currentStreak.topic]
    ) {
      const bridge = TOPIC_BRIDGES[currentStreak.topic]?.(memoryRef.current);
      if (bridge) {
        lexiText = bridge;
        // Reset streak so bridge doesn't fire every exchange
        topicStreakRef.current = { topic: currentStreak.topic, count: 1 };
      } else {
        lexiText = getLexiResponse(
          text.trim(),
          memoryRef.current,
          exchangeCountRef.current,
        );
      }
    } else if (newFact && FACT_ACKNOWLEDGMENTS[newFact.key]) {
      // Warm acknowledgment for the newly discovered fact
      lexiText = FACT_ACKNOWLEDGMENTS[newFact.key](newFact.value);
    } else {
      lexiText = getLexiResponse(
        text.trim(),
        memoryRef.current,
        exchangeCountRef.current,
      );
      // Append deepening prompt for short answers (skip if we already have a rich personalised response)
      if (isShortAnswer && !milestoneText) {
        const deepening =
          DEEPENING_PROMPTS[
            Math.floor(Math.random() * DEEPENING_PROMPTS.length)
          ];
        lexiText = `${lexiText} ${deepening}`;
      }
    }

    newMsgs.push({ id: `l-${ts + 3}`, role: "lexi", text: lexiText });

    setMessages((p) => [...p, ...newMsgs]);
    exchangeCountRef.current += 1;
    setExchangeCount((p) => p + 1);
    setInput("");
    speakText(lexiText);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2200);
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const send = () => sendText(input);

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert(
        "Voice input is not supported in this browser. Please use Chrome or Edge.",
      );
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => sendText(transcript), 400);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e: any) => {
      console.warn("Speech recognition error:", e.error);
      setIsListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // ─── Character selection screen ─────────────────────────────────────────────

  if (!selectedCharacter) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 py-4"
      >
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Choose Your Conversation Partner
          </h3>
          <p className="text-sm text-gray-500">
            Select a character to practice English conversation with
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CHARACTER_OPTIONS.map((opt) => (
            <motion.button
              key={opt.type}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => startWithCharacter(opt.type)}
              className="flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-white p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer"
            >
              <AnimatedCharacter type={opt.type} isSpeaking={false} />
              <span
                className="font-semibold text-sm"
                style={{ color: opt.color }}
              >
                {opt.label}
              </span>
            </motion.button>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Adaptive conversation — talk about any topic you choose!
        </p>
      </motion.div>
    );
  }

  // ─── Active conversation screen ─────────────────────────────────────────────

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[35%_65%] gap-4 min-h-0">
        {/* Left panel — character + info */}
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-b from-cyan-50 to-blue-50 border border-cyan-200 p-4 w-full flex flex-col items-center gap-2 relative">
            <AnimatedCharacter
              type={selectedCharacter}
              isSpeaking={isSpeaking}
            />
            <div className="flex items-center gap-1">
              {isSpeaking && (
                <span className="flex gap-0.5">
                  <span
                    className="w-1 h-3 bg-cyan-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1 h-4 bg-cyan-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1 h-3 bg-cyan-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </span>
              )}
              <span className="text-xs font-medium text-cyan-700">
                {isSpeaking
                  ? "Speaking..."
                  : isListening
                    ? "Listening to you..."
                    : "Waiting..."}
              </span>
            </div>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Listening
              </motion.div>
            )}
          </div>

          <div className="rounded-xl bg-white border border-border p-3 w-full">
            <p className="text-xs font-semibold text-cyan-800 mb-1">
              Adaptive Conversation
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Talk about any topic — school, family, sports, food, technology,
              movies, music, health, career goals, books, festivals, friendship,
              money, travel, or anything you like!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedCharacter(null)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Change character
            </button>
            <button
              type="button"
              title={
                ttsEnabled ? "Mute character voice" : "Enable character voice"
              }
              onClick={() => {
                setTtsEnabled((v) => !v);
                if (ttsEnabled) window.speechSynthesis.cancel();
              }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              {ttsEnabled ? (
                <Volume2 className="h-3.5 w-3.5" />
              ) : (
                <VolumeX className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* Exchange counter */}
          <div className="flex items-center justify-center w-full">
            <span className="text-xs text-muted-foreground">
              {exchangeCount} {exchangeCount === 1 ? "exchange" : "exchanges"}
            </span>
          </div>

          {/* Session Memory chip — shown when 2+ facts are remembered */}
          <AnimatePresence>
            {rememberedFactsCount >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="w-full flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2"
              >
                <Brain className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span className="text-xs text-blue-700 font-medium">
                  Remembering {rememberedFactsCount} thing
                  {rememberedFactsCount !== 1 ? "s" : ""} you said
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Complete Lesson button */}
          <Button
            data-ocid="conversation.complete.primary_button"
            variant="outline"
            size="sm"
            onClick={() => onComplete(Math.max(exchangeCount * 10, 10), 100)}
            className="w-full text-xs"
          >
            Complete Lesson
          </Button>
        </div>

        {/* Right panel — chat */}
        <div className="flex flex-col border border-border rounded-2xl bg-white overflow-hidden">
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                if (msg.role === "tip") {
                  return (
                    <ClassioTipCard
                      key={msg.id}
                      wrong={msg.tipData?.wrong ?? ""}
                      correct={msg.tipData?.correct ?? ""}
                    />
                  );
                }
                if (msg.role === "milestone") {
                  return <MilestoneCard key={msg.id} text={msg.text} />;
                }
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {msg.role === "lexi" && (
                      <div className="shrink-0 w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-xs">
                        {selectedCharacter === "boy"
                          ? "B"
                          : selectedCharacter === "girl"
                            ? "G"
                            : "T"}
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-cyan-50 text-cyan-900 border border-cyan-200 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-border p-3 flex gap-2">
            <input
              data-ocid="conversation.message.input"
              type="text"
              placeholder={
                isListening
                  ? "Listening... speak now"
                  : "Type or tap mic to speak..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 border border-border"
            />
            <button
              type="button"
              data-ocid="conversation.mic.button"
              onClick={toggleVoice}
              title={isListening ? "Stop listening" : "Speak your message"}
              className={`p-2 rounded-lg transition-colors ${
                isListening
                  ? "animate-pulse bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              data-ocid="conversation.send.button"
              onClick={send}
              className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

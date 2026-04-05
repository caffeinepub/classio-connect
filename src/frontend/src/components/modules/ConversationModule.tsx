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
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

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
  pet: string | null;
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
    pet: null,
    mentionedFacts: [],
  };
}

function addFact(memory: SessionMemory, fact: string) {
  if (!fact.trim()) return;
  memory.mentionedFacts = memory.mentionedFacts.filter(
    (f) => f.toLowerCase() !== fact.toLowerCase(),
  );
  if (memory.mentionedFacts.length >= 8) memory.mentionedFacts.shift();
  memory.mentionedFacts.push(fact);
}

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
      addFact(memory, factStr);
    }
  }

  const nameMatch =
    msg.match(/my name is (\w+)/i) ?? msg.match(/(?:call me|i'm|i am) (\w+)/i);
  if (nameMatch && nameMatch[1].length > 2)
    setIfNew("name", nameMatch[1], `your name is ${nameMatch[1]}`);

  const schoolMatch =
    msg.match(/i (?:study|go) (?:at|to|in) ([\w\s]+?) school/i) ??
    msg.match(/my school is ([\w\s]+)/i);
  if (schoolMatch)
    setIfNew(
      "school",
      schoolMatch[1].trim(),
      `you go to ${schoolMatch[1].trim()} school`,
    );

  const gradeMatch = msg.match(
    /(?:i am in |i'm in )?(?:class|grade|standard) (\w+)/i,
  );
  if (gradeMatch)
    setIfNew("grade", gradeMatch[1], `you are in class ${gradeMatch[1]}`);

  const jobMatch = msg.match(
    /i (?:want to be|dream of being|wish to be|hope to be) (?:a|an)? ([\w\s]+)/i,
  );
  if (jobMatch)
    setIfNew(
      "job_dream",
      jobMatch[1].trim(),
      `you want to be a ${jobMatch[1].trim()}`,
    );

  const placeMatch = msg.match(
    /i (?:live|am from|stay|come from) (?:in|at|from)? ([\w\s,]+?)(?:\.|,|$)/i,
  );
  if (placeMatch)
    setIfNew(
      "place",
      placeMatch[1].trim(),
      `you're from ${placeMatch[1].trim()}`,
    );

  const subjectMatch =
    msg.match(/(?:favourite|favorite|love|like) subject is ([\w\s]+)/i) ??
    msg.match(/i (?:love|like|enjoy) ([\w\s]+?) (?:class|subject|lesson)/i);
  if (subjectMatch)
    setIfNew(
      "subject",
      subjectMatch[1].trim(),
      `your favourite subject is ${subjectMatch[1].trim()}`,
    );

  const sportMatch =
    msg.match(/i (?:play|love playing|enjoy playing) ([\w\s]+?)(?:\.| |$)/i) ??
    msg.match(/(?:my favourite sport is) ([\w\s]+)/i);
  if (
    sportMatch &&
    /cricket|football|soccer|basketball|tennis|badminton|swimming|running|volleyball|hockey|chess|kabaddi/i.test(
      sportMatch[1],
    )
  )
    setIfNew("sport", sportMatch[1].trim(), `you play ${sportMatch[1].trim()}`);

  const hobbyMatch = msg.match(
    /i (?:love|like|enjoy|am into|really like) (\w+ing|\w+ \w+ing)/i,
  );
  if (
    hobbyMatch &&
    !/^(going|being|doing|having|getting|making|taking|talking|saying)$/i.test(
      hobbyMatch[1],
    )
  )
    setIfNew(
      "hobby",
      hobbyMatch[1].trim(),
      `you enjoy ${hobbyMatch[1].trim()}`,
    );

  const foodMatch = msg.match(
    /(?:my favourite food is|i love eating|i like eating|i enjoy eating) ([\w\s]+)/i,
  );
  if (
    foodMatch &&
    /pizza|rice|biryani|noodles|pasta|curry|burger|sandwich|dosa|idli|roti|bread|cake|chocolate|ice cream|samosa|pani puri/i.test(
      foodMatch[1],
    )
  )
    setIfNew(
      "food",
      foodMatch[1].trim(),
      `your favourite food is ${foodMatch[1].trim()}`,
    );

  const petMatch = msg.match(
    /i have a (?:pet )?(dog|cat|rabbit|fish|parrot|hamster|bird)/i,
  );
  if (petMatch) setIfNew("pet", petMatch[1], `you have a ${petMatch[1]}`);

  return newFact;
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
  { pattern: /\bi have went\b/i, wrong: "I have went", correct: "I have gone" },
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

// ─── Topic Detection ──────────────────────────────────────────────────────────

const TOPIC_KEYWORDS: Record<string, RegExp> = {
  school:
    /\b(school|class|teacher|homework|subject|exam|study|college|university|lesson|test|marks)\b/i,
  family:
    /\b(family|mother|father|sister|brother|parents|home|mom|dad|uncle|aunt|grandma|grandpa|sibling)\b/i,
  food: /\b(eat|food|lunch|dinner|breakfast|rice|pizza|cook|hungry|meal|snack|biryani|dosa|curry|restaurant)\b/i,
  sports:
    /\b(play|cricket|football|soccer|basketball|sport|team|match|run|swim|gym|exercise|badminton|tennis)\b/i,
  weather:
    /\b(weather|rain|sunny|cold|hot|summer|winter|spring|temperature|climate|wind|snow)\b/i,
  travel:
    /\b(travel|trip|visit|holiday|vacation|country|city|abroad|tour|journey|place)\b/i,
  hobbies:
    /\b(hobby|drawing|painting|reading|dance|sing|collect|craft|write|photography|cooking|gaming)\b/i,
  feelings:
    /\b(feel|feeling|happy|sad|tired|excited|nervous|bored|worried|angry|stressed|joy)\b/i,
  dreams: /\b(dream|future|plan|aspire|wish|ambition|goal|want to be|hope)\b/i,
  technology:
    /\b(phone|smartphone|computer|laptop|internet|app|social media|youtube|game|gadget|coding|software|robot|AI|technology|online|digital|wifi|video)\b/i,
  career:
    /\b(job|career|work|profession|engineer|doctor|lawyer|business|office|salary|internship|skill|company|startup|entrepreneur)\b/i,
  movies:
    /\b(movie|film|cinema|watch|actor|actress|director|series|netflix|show|episode|scene|comedy|thriller|drama|bollywood|hollywood)\b/i,
  music:
    /\b(music|song|singer|artist|band|concert|melody|lyrics|playlist|rap|pop|classical|instrument|guitar|piano)\b/i,
  health:
    /\b(health|fit|fitness|sleep|diet|nutrition|hospital|sick|medicine|mental health|yoga|meditation|weight)\b/i,
  environment:
    /\b(environment|nature|trees|pollution|climate|earth|recycle|green|planet|plastic|animals|wildlife|forest)\b/i,
  books:
    /\b(book|read|novel|story|author|chapter|library|fiction|poetry|literature|page|magazine)\b/i,
  festivals:
    /\b(festival|celebrate|celebration|holiday|diwali|christmas|eid|holi|new year|party|tradition|culture)\b/i,
  friendship:
    /\b(friend|friendship|best friend|hang out|classmate|trust|loyal|childhood)\b/i,
  money:
    /\b(money|save|spend|budget|bank|earn|income|cost|price|expensive|pocket money|finance)\b/i,
  pets: /\b(dog|cat|pet|rabbit|fish|parrot|hamster|bird|animal|puppy|kitten)\b/i,
};

function detectTopic(msg: string): string | null {
  for (const [topic, pattern] of Object.entries(TOPIC_KEYWORDS)) {
    if (pattern.test(msg)) return topic;
  }
  return null;
}

// ─── Natural Response Engine ──────────────────────────────────────────────────

// Opening lines — rotate naturally
const OPENING_LINES = [
  "Hey! How are you doing today?",
  "Hi there! What's been on your mind lately?",
  "Hey! Been up to anything fun recently?",
  "Hi! How's your day going so far?",
  "Hey, good to see you! What's up?",
];

// Casual fillers / acknowledgments to mix in
const CASUAL_ACKS = [
  "Oh nice!",
  "That's cool!",
  "Haha, yeah!",
  "Interesting!",
  "Oh wow!",
  "I see!",
  "Right?",
  "Yeah totally.",
  "Nice one!",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Short-answer nudges
const SHORT_NUDGES = [
  "Nice! Say more?",
  "Oh yeah? Like what?",
  "Really? Tell me more!",
  "Interesting! Go on...",
  "Haha, what do you mean exactly?",
  "Oh cool — how so?",
  "I'm curious, say more!",
];

// Fallbacks when nothing matches — never lists topics
const FALLBACKS = [
  "Interesting! Tell me more about that.",
  "Oh yeah? What do you mean exactly?",
  "That's cool. Go on!",
  "I'm curious — can you tell me a bit more?",
  "Haha, really? Explain that!",
  "Oh wow, I didn't expect that. What's the story?",
  "Sounds fun! What happened next?",
];

// Pivot starters when conversation stalls (only after 5+ exchanges with no topic)
const CASUAL_PIVOTS = [
  "By the way, what do you usually do after school?",
  "Hey, what kind of music are you into?",
  "Random question — what's your favourite food?",
  "What's something you've been thinking about lately?",
  "Do you have any hobbies outside school?",
];

// Per-topic natural response banks — SHORT and varied
const TOPIC_BANKS: Record<string, string[]> = {
  school: [
    "Oh, school! Which subject do you like most?",
    "Nice! What grade are you in right now?",
    "Exams coming up? That can be stressful.",
    "Any teachers you actually enjoy? Like, who makes it fun?",
    "What's the hardest thing about school for you?",
    "Is school far from your home?",
    "Do you have a favourite spot at school — library, canteen?",
  ],
  family: [
    "Nice! Big family or small?",
    "Sounds sweet. Do you hang out with them on weekends?",
    "Oh cool! Any siblings?",
    "What's something your family loves doing together?",
    "Is there someone in your family you're really close to?",
  ],
  food: [
    "Ooh, food! Homemade or restaurant?",
    "Nice! Do you cook at all?",
    "That sounds delicious. What's the last amazing thing you ate?",
    "Ha, I think I'd love that too. Any favourite snacks?",
    "What would your perfect meal look like?",
  ],
  sports: [
    "Oh cool! Do you play for a team or just casually?",
    "Nice! How long have you been playing?",
    "Who's your favourite player?",
    "That's a great sport! Do you play with friends or in a club?",
    "Any memorable match you've played or watched?",
  ],
  weather: [
    "Ugh, tell me about it! What's the weather like where you are?",
    "Oh nice! What do you usually do on rainy days?",
    "So are you more of a summer or winter person?",
    "Does the weather affect your mood much?",
  ],
  travel: [
    "Oh nice, where did you go?",
    "That sounds fun! How was it?",
    "Cool! What was the best part of the trip?",
    "Have you ever been somewhere that really surprised you?",
    "If you could go anywhere tomorrow, where?",
  ],
  hobbies: [
    "Oh that's fun! How long have you been doing it?",
    "Nice! What got you into that?",
    "That sounds chill. Do you do it alone or with friends?",
    "Have you ever shared your work with anyone?",
  ],
  feelings: [
    "Aw, what's making you feel that way?",
    "That makes sense. What helps when you feel like that?",
    "Yeah I get that. What happened?",
    "Oh, what's got you excited?",
  ],
  dreams: [
    "Oh nice! What made you want that?",
    "That's a great goal. Are you doing anything towards it?",
    "Where do you see yourself in a few years?",
    "What's the first step you'd take?",
  ],
  technology: [
    "Ha, same! What gadget can you absolutely not live without?",
    "Oh interesting! Have you ever tried coding anything?",
    "What do you think about AI — cool or a bit scary?",
    "Do you spend a lot of time online? What do you usually do?",
    "Any app that you think everyone should use?",
  ],
  career: [
    "Nice goal! What made you want that career?",
    "That's cool. What skills are you building for it?",
    "Do you know anyone in that field?",
    "What does your dream workday look like?",
  ],
  movies: [
    "Oh nice! What was the last movie you watched?",
    "Ha, what genre are you into — action, comedy, drama?",
    "Any movie that actually changed the way you think?",
    "Bollywood or Hollywood?",
    "Who's your favourite actor?",
  ],
  music: [
    "Nice taste! Who do you listen to most?",
    "Oh, what kind of music puts you in a good mood?",
    "Do you play any instruments?",
    "What's that one song you have on repeat right now?",
  ],
  health: [
    "Nice! Do you exercise regularly?",
    "How do you manage stress? Any tricks?",
    "Are you a morning person or night owl?",
    "Do you think sleep is underrated? Because I definitely do.",
  ],
  environment: [
    "Yeah, it's pretty serious. Do you do anything eco-friendly?",
    "What's one environmental issue you actually care about?",
    "Have you noticed any changes in weather where you live?",
  ],
  books: [
    "Oh nice! What's the last book you read?",
    "Fiction or non-fiction — which do you prefer?",
    "Any character from a book you really connected with?",
    "What kind of stories do you like?",
  ],
  festivals: [
    "Oh fun! Which festival is your favourite?",
    "What's one tradition your family always follows?",
    "What's the best food from your favourite festival?",
    "Any memorable celebration that stands out?",
  ],
  friendship: [
    "Aw nice! How did you two meet?",
    "What's something funny you've done with your friends?",
    "What do you look for in a friend?",
    "Have you kept in touch with any childhood friends?",
  ],
  money: [
    "Ha, saving or spending type?",
    "What are you saving up for right now?",
    "Do you get pocket money?",
    "What's the most useful thing you've ever bought?",
  ],
  pets: [
    "Aww! What's their name?",
    "That's so sweet. How long have you had them?",
    "I think pets make everything better. Do they?",
    "What's the funniest thing your pet has ever done?",
  ],
};

// Memory-based call-backs — weave in what they said before naturally
function buildMemoryCallback(memory: SessionMemory): string | null {
  const callbacks: string[] = [];
  if (memory.sport)
    callbacks.push(
      `Wait — you play ${memory.sport} right? Do you practice every day?`,
    );
  if (memory.food)
    callbacks.push(
      `Oh by the way, earlier you mentioned ${memory.food}. Homemade or do you order it?`,
    );
  if (memory.job_dream)
    callbacks.push(
      `Didn't you say you want to be a ${memory.job_dream}? That's such a cool goal.`,
    );
  if (memory.hobby)
    callbacks.push(
      `You mentioned you enjoy ${memory.hobby} — how's that going lately?`,
    );
  if (memory.place)
    callbacks.push(
      `Oh yeah, you're from ${memory.place} — what do you like most about it?`,
    );
  if (memory.subject)
    callbacks.push(
      `You said ${memory.subject} is your favourite subject — why that one?`,
    );
  if (memory.pet)
    callbacks.push(`How's your ${memory.pet} doing? They must keep you busy!`);
  if (callbacks.length === 0) return null;
  return pick(callbacks);
}

// Fact acknowledgments — short and natural
const FACT_ACKS: Record<string, (v: string) => string> = {
  sport: (v) =>
    pick([
      `Oh, ${v}! Do you play for a team or just for fun?`,
      `Nice! How long have you been playing ${v}?`,
      `${v.charAt(0).toUpperCase() + v.slice(1)}? Are you pretty good at it?`,
    ]),
  job_dream: (v) =>
    pick([
      `A ${v}? That's awesome! What made you choose that?`,
      `Oh wow, a ${v}! What's the most exciting part about that career?`,
      `Nice goal! Are you already doing anything to work towards being a ${v}?`,
    ]),
  hobby: (v) =>
    pick([
      `Oh, ${v}? How long have you been doing that?`,
      `Nice! What got you into ${v}?`,
      `That's fun! Do you do ${v} alone or with others?`,
    ]),
  food: (v) =>
    pick([
      `${v.charAt(0).toUpperCase() + v.slice(1)}! Homemade or restaurant?`,
      `Ooh, ${v}! Who makes the best one you've had?`,
    ]),
  place: (v) =>
    pick([
      `Oh, ${v}! What's your favourite thing about it?`,
      `Nice! Have you always lived in ${v}?`,
    ]),
  subject: (v) =>
    pick([
      `${v.charAt(0).toUpperCase() + v.slice(1)}! What do you love about it?`,
      `Oh interesting — why ${v} specifically?`,
    ]),
  name: (v) =>
    pick([
      `Nice to meet you, ${v}! So what's on your mind today?`,
      `Hey ${v}! Cool name. Where are you from?`,
    ]),
  pet: (v) =>
    pick([
      `A ${v}! What's their name?`,
      `Oh that's adorable! What does your ${v} do all day?`,
    ]),
};

// ─── Core Response Generator ──────────────────────────────────────────────────

function generateReply(
  userMsg: string,
  memory: SessionMemory,
  exchangeCount: number,
  newFact: { key: string; value: string } | null,
  lastTopicRef: { topic: string | null; count: number },
): string {
  const msg = userMsg.trim();
  const words = msg.split(/\s+/).length;
  const isVeryShort = words <= 3;
  const isShort = words <= 7;
  const lower = msg.toLowerCase();

  // Very short one-word or yes/no replies — gentle nudge
  if (isVeryShort) {
    // Check if it's a yes/no
    if (
      /^(yes|yeah|yep|yup|sure|okay|ok|no|nope|nah|maybe|hmm|hm|oh)$/i.test(msg)
    ) {
      return pick([
        "Haha yeah! What else is on your mind?",
        "Nice! Tell me more about that.",
        "Oh interesting! What do you mean?",
        "Right? So what do you usually do about it?",
        "Ha, go on then!",
      ]);
    }
    if (
      /^(good|fine|great|awesome|amazing|nice|cool|bad|okay|alright)$/i.test(
        msg,
      )
    ) {
      return pick([
        "Nice! What's making it good?",
        "Cool, what's been happening?",
        "Oh yeah? Tell me more!",
        "Haha, say more!",
      ]);
    }
    return pick(SHORT_NUDGES);
  }

  // Greetings
  if (
    /^(hi|hello|hey|good morning|good afternoon|good evening|howdy)\b/i.test(
      msg,
    )
  ) {
    if (memory.name)
      return `Hey ${memory.name}! Good to hear from you. What's up?`;
    return pick([
      "Hey! How's your day been so far?",
      "Hi! What's going on?",
      "Hey! Been up to anything interesting?",
    ]);
  }

  // Positive feelings
  if (
    /\b(happy|excited|great|awesome|amazing|wonderful|fantastic|love|enjoying)\b/i.test(
      lower,
    )
  ) {
    const ack = pick(CASUAL_ACKS);
    const topic = detectTopic(msg);
    if (topic && TOPIC_BANKS[topic]) {
      return `${ack} ${pick(TOPIC_BANKS[topic])}`;
    }
    return `${ack} What's making you feel that way?`;
  }

  // Negative feelings
  if (
    /\b(tired|bored|sad|stressed|nervous|worried|bad|terrible|awful|hate|annoyed)\b/i.test(
      lower,
    )
  ) {
    return pick([
      "Aw, what's going on?",
      "That sounds rough. What happened?",
      "Oh no! What's bothering you?",
      "I get that. What usually helps when you feel like that?",
    ]);
  }

  // New fact discovered — react naturally
  if (newFact && FACT_ACKS[newFact.key]) {
    return FACT_ACKS[newFact.key](newFact.value);
  }

  // Every 5th exchange after 4 — recall something they said (50% chance)
  if (
    exchangeCount > 4 &&
    exchangeCount % 5 === 0 &&
    memory.mentionedFacts.length >= 2
  ) {
    const recall = buildMemoryCallback(memory);
    if (recall) return recall;
  }

  // Detect topic and respond
  const topic = detectTopic(msg);
  if (topic) {
    // Update streak
    if (topic === lastTopicRef.topic) {
      lastTopicRef.count++;
    } else {
      lastTopicRef.topic = topic;
      lastTopicRef.count = 1;
    }
    // Use memory context
    if (topic === "career" && memory.job_dream) {
      return pick([
        `Since you want to be a ${memory.job_dream} — what's the hardest part about getting there?`,
        `Cool! Are you working on any skills for your ${memory.job_dream} career?`,
      ]);
    }
    if (topic === "school" && memory.grade) {
      return pick([
        `Class ${memory.grade} is intense! Which part is hardest right now?`,
        `Oh right, you're in class ${memory.grade}. Any subjects you actually enjoy?`,
      ]);
    }
    if (topic === "sports" && memory.sport) {
      return pick([
        `Oh nice, ${memory.sport} again! Are you getting better at it?`,
        `Ha, you really love ${memory.sport}. Have you played any matches lately?`,
      ]);
    }
    if (TOPIC_BANKS[topic]) {
      const resp = pick(TOPIC_BANKS[topic]);
      // Occasionally add a casual ack before the question
      if (Math.random() > 0.5 && !isShort) {
        return `${pick(CASUAL_ACKS)} ${resp}`;
      }
      return resp;
    }
  } else {
    // No topic matched — reset streak
    lastTopicRef.topic = null;
    lastTopicRef.count = 0;
  }

  // If the conversation has stalled — offer a casual pivot
  if (exchangeCount > 6 && !topic) {
    return pick(CASUAL_PIVOTS);
  }

  return pick(FALLBACKS);
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ChatRole = "user" | "lexi" | "tip";

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
          Small fix, big difference!
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ConversationModule({ lesson: _lesson, onComplete }: Props) {
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
      u.rate = 0.92;
      u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    },
    [ttsEnabled],
  );

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const startWithCharacter = (type: CharacterType) => {
    memoryRef.current = createEmptyMemory();
    exchangeCountRef.current = 0;
    topicStreakRef.current = { topic: null, count: 0 };
    setExchangeCount(0);
    setRememberedFactsCount(0);
    setSelectedCharacter(type);
    const greeting =
      OPENING_LINES[Math.floor(Math.random() * OPENING_LINES.length)];
    setMessages([{ id: "init", role: "lexi", text: greeting }]);
    setTimeout(() => speakText(greeting), 300);
  };

  const sendText = (text: string) => {
    if (!text.trim()) return;
    const ts = Date.now();
    const newMsgs: ChatMsg[] = [];

    // 1. User message
    newMsgs.push({ id: `u-${ts}`, role: "user", text: text.trim() });

    // 2. Extract facts
    const newFact = extractFacts(text.trim(), memoryRef.current);
    setRememberedFactsCount(memoryRef.current.mentionedFacts.length);

    // 3. Grammar tip
    const grammarError = detectGrammarError(text.trim());
    if (grammarError) {
      newMsgs.push({
        id: `tip-${ts + 1}`,
        role: "tip",
        text: "",
        tipData: grammarError,
      });
    }

    // 4. Build AI reply
    const reply = generateReply(
      text.trim(),
      memoryRef.current,
      exchangeCountRef.current,
      newFact,
      topicStreakRef.current,
    );

    newMsgs.push({ id: `l-${ts + 2}`, role: "lexi", text: reply });

    setMessages((p) => [...p, ...newMsgs]);
    exchangeCountRef.current += 1;
    setExchangeCount((p) => p + 1);
    setInput("");
    speakText(reply);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2000);
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
            Just chat naturally — no scripts, no rules. Talk about anything!
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
              data-ocid={`conversation.${opt.type}.button`}
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
      </motion.div>
    );
  }

  // ─── Active conversation screen ─────────────────────────────────────────────

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[35%_65%] gap-4 min-h-0">
        {/* Left panel — character + controls */}
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-b from-cyan-50 to-blue-50 border border-cyan-200 p-4 w-full flex flex-col items-center gap-2 relative">
            <AnimatedCharacter
              type={selectedCharacter}
              isSpeaking={isSpeaking}
            />
            <div className="flex items-center gap-1.5">
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
                    ? "Listening..."
                    : "Ready"}
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

          {/* Controls row */}
          <div className="flex items-center justify-between w-full px-1">
            <button
              type="button"
              onClick={() => setSelectedCharacter(null)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Change character
            </button>
            <button
              type="button"
              title={ttsEnabled ? "Mute voice" : "Enable voice"}
              onClick={() => {
                setTtsEnabled((v) => !v);
                if (ttsEnabled) window.speechSynthesis.cancel();
              }}
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              data-ocid="conversation.audio.toggle"
            >
              {ttsEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Exchange counter */}
          <div className="flex items-center justify-center w-full">
            <span className="text-xs text-muted-foreground">
              {exchangeCount} {exchangeCount === 1 ? "exchange" : "exchanges"}
            </span>
          </div>

          {/* Session Memory chip */}
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
          <div
            className="h-80 overflow-y-auto p-4 space-y-3"
            data-ocid="conversation.panel"
          >
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
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {msg.role === "lexi" && (
                      <div className="shrink-0 w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-semibold text-cyan-700">
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
                isListening ? "Listening... speak now" : "Say anything..."
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

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

const OPENING_LINES = [
  "Hey! How are you doing today?",
  "Hi there! What's been on your mind lately?",
  "Hey! Been up to anything fun recently?",
  "Hi! How's your day going so far?",
  "Hey, good to see you! What's up?",
];

// Expanded casual acknowledgments — varied reactions, not just "Oh nice!"
const CASUAL_ACKS = [
  "Oh wow!",
  "That's actually really interesting!",
  "Wait, seriously?",
  "No way!",
  "Haha I can relate.",
  "That makes a lot of sense.",
  "Oh I love that.",
  "I didn't expect that!",
  "Honestly, same.",
  "Oh that's cool.",
  "Ha, nice!",
  "Right, totally.",
  "Oh interesting!",
  "Okay, I get it.",
  "That's kind of amazing.",
  "Oh for real?",
  "Yeah that tracks.",
  "Hmm, that's a good point.",
  "Oh nice!",
  "Haha, yeah!",
];

// Pick a fresh unused item from an array; fallback to any random if all used
function pickFresh(arr: string[], used: Set<string>): string {
  const unused = arr.filter((s) => !used.has(s));
  const pool = unused.length > 0 ? unused : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Context-aware short-answer reactions by topic
const SHORT_TOPIC_REACTIONS: Record<string, string[]> = {
  sports: [
    "Oh, cricket! That's such an exciting sport. Do you play in any matches?",
    "Football? Nice! Do you support a particular team as well?",
    "Basketball is intense! How long have you been playing?",
    "Oh you play badminton? I think it's one of the most underrated sports. Do you play competitively?",
    "Swimming is great for everything — fitness, focus, stress. How often do you go?",
  ],
  food: [
    "Pizza! Do you prefer thin crust or the thick loaded kind?",
    "Biryani is a serious answer. Chicken, mutton, or veg?",
    "Oh, dosa! Simple or masala?",
    "Chocolate! Dark or milk? Because that says a lot about a person.",
    "Noodles — instant or the real deal from a restaurant?",
  ],
  movies: [
    "Oh nice genre choice! Any specific film you've watched recently?",
    "Bollywood or Hollywood — which side do you usually pick?",
    "Action movies are fun. Any film where the stunts actually blew your mind?",
    "Comedy is the best. Do you have a go-to comedy movie you rewatch?",
  ],
  music: [
    "Oh you listen to that? What kind of song puts you in the best mood?",
    "Do you actually play any instrument or just enjoy listening?",
    "What's on your playlist right now — any artist you're obsessed with?",
  ],
  school: [
    "That subject is tough! What part do you find hardest?",
    "Oh, you like that class. What makes it interesting for you?",
    "Exams in that subject can be tricky. How do you usually prepare?",
  ],
  technology: [
    "Oh that app! Do you use it daily or just casually?",
    "That gadget is pretty popular. What do you use it most for?",
    "Coding is such a powerful skill — have you built anything yet?",
  ],
  career: [
    "That's a great field! What got you interested in it?",
    "Oh, that career path is competitive but rewarding. Any role models in that field?",
    "Are you already doing anything to work towards that goal?",
  ],
};

// Generic short-answer nudges with actual content reactions
const SHORT_NUDGES = [
  "Oh really? What's that like for you?",
  "Ha, interesting! What got you into that?",
  "Wait, tell me more about that!",
  "Oh yeah? How does that usually go?",
  "I'm curious — can you say a bit more?",
  "That's unexpected! What's the story there?",
  "Haha, what do you mean exactly?",
];

// Fallbacks — natural, varied, never lists topics
const FALLBACKS = [
  "That's interesting — how does it make you feel?",
  "Oh yeah? What usually happens next?",
  "I like where this is going. Tell me more!",
  "That's a take I didn't expect. What's your reasoning?",
  "Haha, go on!",
  "Okay I'm listening — explain that a bit more!",
  "That's kind of a big thing. What do you think about it?",
  "Sounds like there's a story behind that.",
];

// Casual pivots when conversation needs a new spark
const CASUAL_PIVOTS = [
  "Random thought — what's something you've been thinking about a lot lately?",
  "Hey, what do you usually do to unwind after a long day?",
  "What kind of music do you have on when you're doing homework?",
  "Quick question — if you had a free day tomorrow, what would you do?",
  "What's one thing you're really good at that most people don't know?",
  "Do you prefer spending weekends out or staying home?",
  "What's the last thing that genuinely made you laugh?",
];

// Topic response banks — expanded to 8-10 entries each, mix of statement+question formats
const TOPIC_BANKS: Record<string, string[]> = {
  school: [
    "Which subject do you like most right now?",
    "What grade are you in? School life must be pretty busy.",
    "Exams coming up? That kind of stress is real.",
    "Any teacher who actually makes lessons fun?",
    "What's the hardest thing about school for you lately?",
    "Is school far from your house, or can you walk?",
    "Do you have a favourite spot there — library, canteen, somewhere else?",
    "I think a lot of people secretly enjoy school more than they admit. Do you?",
    "What time do you usually get to school in the morning?",
    "What's the one subject you'd remove from the timetable if you could?",
  ],
  family: [
    "Big family or small?",
    "Do you hang out with them much on weekends?",
    "Any siblings? Are you close with them?",
    "What's something your family loves doing all together?",
    "Is there one person in your family you really look up to?",
    "Families are funny — any running joke or tradition you have at home?",
    "Who's the best cook in your house?",
    "Do you think family shapes who you become? Because I do.",
  ],
  food: [
    "Homemade or restaurant — which do you prefer honestly?",
    "Do you cook anything yourself?",
    "What's the last truly amazing thing you ate?",
    "Any favourite snacks you always keep around?",
    "What would your perfect meal look like?",
    "I think food is one of the best ways to know someone's culture. What's a dish that's very 'you'?",
    "Is there a food you used to hate as a kid but love now?",
    "Street food or proper sit-down restaurant — which wins for you?",
  ],
  sports: [
    "Do you play for a team or just casually?",
    "How long have you been into that sport?",
    "Who's your favourite player to watch?",
    "Do you play with friends or in a club?",
    "Any memorable match you've played or watched recently?",
    "I actually think sport teaches discipline more than almost anything. Would you agree?",
    "What's the most exciting moment you've had playing or watching?",
    "Does it ever get stressful in a match, or do you zone in?",
    "Would you ever want to play professionally, or is it just for fun?",
    "What's something about that sport that most people don't appreciate?",
  ],
  weather: [
    "What's the weather like where you are right now?",
    "What do you usually do on rainy days?",
    "Are you more of a summer or winter person?",
    "Does the weather actually affect your mood?",
    "Hot weather is energising or exhausting — which is it for you?",
    "Any weather that you secretly enjoy even if it's inconvenient?",
  ],
  travel: [
    "Where did you go? How was it?",
    "What was the best part of the trip?",
    "Has a place ever genuinely surprised you — like it was totally different from what you expected?",
    "If you could go anywhere tomorrow with no cost, where?",
    "Do you prefer cities or nature when you travel?",
    "Travelling solo or with people — which would you choose?",
    "What's a place you'd love to visit someday and why?",
    "Have you ever been somewhere that changed how you think a little?",
  ],
  hobbies: [
    "How long have you been doing that?",
    "What got you into it in the first place?",
    "Is it something you do alone or with others?",
    "Have you ever shared your work or progress with anyone?",
    "Is it something you could see yourself doing long-term?",
    "Do you have a goal with it, or is it purely for enjoyment?",
    "What's the hardest part of learning it?",
    "Has that hobby ever surprised you — like shown you something about yourself?",
  ],
  feelings: [
    "What's making you feel that way?",
    "That makes sense. What usually helps you when you feel like that?",
    "Yeah, I get it. What happened?",
    "It's okay to feel that. What do you usually do with that energy?",
    "What would make today feel better?",
    "Do you usually talk to someone when you're feeling low, or keep it in?",
  ],
  dreams: [
    "What made you want that in the first place?",
    "That's a great goal. Are you doing anything towards it right now?",
    "Where do you see yourself in five years?",
    "What's the first step you'd take if you started tomorrow?",
    "Have you talked to anyone already doing that thing you want to do?",
    "Dreams are easy — plans are harder. Do you have a plan?",
    "What's the biggest obstacle standing between you and that dream?",
    "If success was guaranteed, would you still choose the same dream?",
  ],
  technology: [
    "What gadget can you absolutely not live without?",
    "Have you ever tried coding anything, even something small?",
    "What do you actually think about AI — exciting, or a bit worrying?",
    "How much time are you online daily? What do you mostly do?",
    "Any app you think genuinely makes life better?",
    "Do you think people are too addicted to their phones? Be honest.",
    "What's one piece of tech you wish existed but doesn't yet?",
    "If you had to give up one piece of tech for a month, what would hurt least?",
    "Social media — does it make you feel connected or just more distracted?",
    "Do you think screen time is overrated as an issue, or is it genuinely a problem?",
  ],
  career: [
    "What made you want that career?",
    "What skills are you building for it right now?",
    "Do you know anyone who's actually in that field?",
    "What does your dream workday look like in that job?",
    "Is it something you'd love even if it paid less?",
    "What's the hardest thing about getting into that career?",
    "Have you ever shadowed someone or done anything related to it yet?",
    "What does success look like to you — money, impact, freedom, or something else?",
  ],
  movies: [
    "What was the last movie you watched?",
    "What genre are you usually into — action, comedy, drama?",
    "Any movie that actually changed the way you think?",
    "Bollywood or Hollywood — which side do you pick?",
    "Who's your favourite actor right now?",
    "Is there a movie you can rewatch over and over without getting bored?",
    "Do you prefer watching alone or with others?",
    "What kind of ending do you prefer — happy, realistic, or open?",
    "Any underrated film you think more people should watch?",
    "Do you ever cry in movies? What kind gets you?",
  ],
  music: [
    "Who do you listen to most right now?",
    "What kind of music puts you in a good mood?",
    "Do you play any instruments, or just enjoy listening?",
    "What's one song you've had on repeat recently?",
    "Do you listen to lyrics or just vibe to the sound?",
    "Is there a song that means something specific to you?",
    "Concerts — have you ever been to one? Would you want to go?",
    "Do you think music taste says a lot about a person?",
    "What's one artist you think everyone should know about?",
  ],
  health: [
    "Do you exercise regularly, or is it more on and off?",
    "How do you manage stress — any tricks that actually work?",
    "Are you a morning person or night owl? Be honest.",
    "Sleep is honestly underrated. How much do you usually get?",
    "Do you think mental health gets enough attention at school?",
    "Is there one healthy habit you've actually managed to stick with?",
    "What does your diet look like — do you think about it much?",
    "Do you think fitness is more about the body or the mind?",
  ],
  environment: [
    "Do you do anything eco-friendly in your daily life?",
    "What environmental issue actually worries you the most?",
    "Have you noticed any weather changes where you live compared to a few years ago?",
    "Do you think individual choices matter, or is it mostly up to governments and companies?",
    "Is there one small change everyone could make that would actually help?",
    "Do you think your generation will handle the environment better than previous ones?",
  ],
  books: [
    "What's the last book you read — and was it worth it?",
    "Fiction or non-fiction — which do you prefer?",
    "Any character from a book you really connected with?",
    "What kind of stories pull you in the most?",
    "Is there a book you'd recommend to literally everyone?",
    "Do you prefer reading at night or during the day?",
    "Do you think reading is underrated as a skill now that everything is video?",
    "What's a book that made you think differently about something?",
  ],
  festivals: [
    "Which festival is your absolute favourite?",
    "What's one tradition your family always follows at that time?",
    "Best food from your favourite festival — what is it?",
    "Any memorable celebration that really stands out?",
    "Do you like the commercial side of festivals, or do you prefer the meaning behind them?",
    "Is there a festival you'd love to experience from a different culture?",
    "What's the best part — the food, the atmosphere, or the people?",
  ],
  friendship: [
    "How did you two meet?",
    "What's something funny or memorable you've done with your friends?",
    "What do you actually look for in a friend?",
    "Have you kept in touch with any childhood friends?",
    "Do you think it's easier to make friends online or in person now?",
    "What's the most important thing in a friendship — honesty, loyalty, or just fun?",
    "Is there a friend who's genuinely changed how you see things?",
    "Do you think you're a good friend? What makes you say that?",
  ],
  money: [
    "Saving or spending type — which are you honestly?",
    "What are you saving up for right now, if anything?",
    "Do you get pocket money? How do you usually use it?",
    "What's the most useful thing you've ever spent money on?",
    "Do you think financial education should be taught in school?",
    "What's something you'd never spend money on that others do?",
    "If you got a large amount of money tomorrow, what's the first thing you'd do?",
  ],
  pets: [
    "Aww! What's their name?",
    "How long have you had them?",
    "Pets genuinely seem to help with stress. Is that true for you?",
    "What's the funniest thing your pet has ever done?",
    "Do they have any weird habits?",
    "Has having a pet changed how you think about animals generally?",
    "What do they do all day when you're not home?",
  ],
};

// Deep-dive questions per topic — for when same topic continues 3+ exchanges
const TOPIC_DEEP_DIVES: Record<string, string[]> = {
  school: [
    "What's something about school that people your age complain about but you actually think is important?",
    "If you could redesign your school schedule, what would a perfect learning day look like?",
    "Has a teacher ever said something that genuinely changed how you think?",
  ],
  sports: [
    "What do you think sport teaches people that you can't learn in a classroom?",
    "Has there been a time in sport where you had to push through something really hard?",
    "Do you think competing at a higher level would make it less fun, or more exciting?",
  ],
  technology: [
    "Do you think AI will take over jobs in the area you're interested in?",
    "If you had the skills to build any app, what problem would you solve?",
    "What do you think the internet has taken away that we don't talk about enough?",
  ],
  music: [
    "If your life had a soundtrack right now, what song would be playing?",
    "Do you think music affects how you perform at things — studying, working out?",
    "Is there a type of music you pretend not to like but actually enjoy?",
  ],
  movies: [
    "If your life was a movie, what genre would it be?",
    "Do you think movies reflect reality, or do they distort what we expect from life?",
    "What's a movie that stuck with you weeks after you watched it?",
  ],
  career: [
    "Do you think passion or stability is more important when choosing a career?",
    "Is there a backup plan if your first career choice doesn't work out?",
    "What does your ideal work-life balance look like?",
  ],
  friendship: [
    "Have you ever had to end a friendship? How do you handle that?",
    "What's the difference between someone who's a friend and someone who's just an acquaintance?",
    "Is it possible to have a really deep friendship online with someone you've never met?",
  ],
  food: [
    "Do you think food is more about nourishment or pleasure for you?",
    "Is there a food memory — like a meal that takes you back to something specific?",
    "Would you rather be an amazing cook or have someone always cook amazing food for you?",
  ],
};

// Direct follow-ups when the user answers a specific AI question
const DIRECT_FOLLOW_UPS: Record<string, string[]> = {
  sport_asked: [
    "That's great! Have you played in any competitions or was it just casual so far?",
    "Oh nice — do you think sport teaches you things that school doesn't?",
    "How often do you actually practice? Daily, or when you get the chance?",
    "Do you have a team you play with, or is it mostly solo training?",
  ],
  food_asked: [
    "Solid choice! Do you make it yourself or do you always order/buy it?",
    "Is that something you eat often, or more of a special occasion thing?",
    "Who in your life makes the best version of that?",
    "Would you say that's your comfort food — the thing you go to when you need cheering up?",
  ],
  career_asked: [
    "That's a big goal — what specifically made you want that?",
    "Are you already doing anything to work towards it, or is it more of a long-term idea?",
    "Do you know anyone in that field you could learn from?",
    "What's the part of that career that excites you most?",
  ],
  hobby_asked: [
    "How did you first get into that?",
    "Do you do it alone or is it something you share with others?",
    "Have you ever shared what you made or done with anyone outside your circle?",
    "Is there a level you're working towards with it?",
  ],
  place_asked: [
    "What do you like most about living there?",
    "Is it a place most people would know, or more of a hidden gem?",
    "Has living there shaped how you think about things?",
    "If you could live anywhere else, would you — or would you stay?",
  ],
  subject_asked: [
    "What is it about that subject that clicks for you?",
    "Is it the teacher, the content, or both?",
    "Do you think you'll use it after school?",
  ],
  general_answered: [
    "That's a really honest answer. What made you think of it that way?",
    "Interesting perspective — has that always been your view or did something change it?",
    "I like that answer. Is there something behind it?",
    "That's a solid take. Would you say that's something you care a lot about?",
  ],
};

// Memory-based call-backs — weave in what they said before
function buildMemoryCallback(
  memory: SessionMemory,
  used: Set<string>,
): string | null {
  const callbacks: string[] = [];
  if (memory.sport)
    callbacks.push(
      `Wait — you play ${memory.sport}, right? How's that been going lately?`,
    );
  if (memory.food)
    callbacks.push(
      `Oh, earlier you mentioned ${memory.food}. Is that like your go-to comfort food?`,
    );
  if (memory.job_dream)
    callbacks.push(
      `You said you want to be a ${memory.job_dream} — has that always been the dream or is it new?`,
    );
  if (memory.hobby)
    callbacks.push(
      `You mentioned enjoying ${memory.hobby} — any recent progress or something cool you made?`,
    );
  if (memory.place)
    callbacks.push(
      `Oh yeah, you're from ${memory.place} — has that place shaped you in any way?`,
    );
  if (memory.subject)
    callbacks.push(
      `You said ${memory.subject} is your favourite subject — do you think you'll use it later in life?`,
    );
  if (memory.pet)
    callbacks.push(
      `How's your ${memory.pet} doing? They must keep things lively at home!`,
    );
  if (callbacks.length === 0) return null;
  const fresh = callbacks.filter((c) => !used.has(c));
  const pool = fresh.length > 0 ? fresh : callbacks;
  return pick(pool);
}

// Fact acknowledgments — short, natural, varied
const FACT_ACKS: Record<string, (v: string) => string> = {
  sport: (v) =>
    pickFresh(
      [
        `Oh, ${v}! Do you play for a team or just for fun?`,
        `Nice! How long have you been playing ${v}?`,
        `${v.charAt(0).toUpperCase() + v.slice(1)}? Are you actually pretty good at it?`,
        `${v} is great! Do you find it helps with focus or stress?",`,
      ],
      new Set(),
    ),
  job_dream: (v) =>
    pick([
      `A ${v}? That's a solid goal — what made you choose that?`,
      `Oh wow, ${v}! What part of that career excites you most?`,
      `Nice! Are you already doing anything to work towards being a ${v}?`,
      `${v.charAt(0).toUpperCase() + v.slice(1)} — that's ambitious. What's your plan to get there?`,
    ]),
  hobby: (v) =>
    pick([
      `Oh, ${v}? How long have you been doing that?`,
      `Nice! What got you into ${v} in the first place?`,
      `That sounds fun — do you do ${v} alone or with others?`,
      `${v.charAt(0).toUpperCase() + v.slice(1)} is a great hobby. Has it ever surprised you with how good it feels?`,
    ]),
  food: (v) =>
    pick([
      `${v.charAt(0).toUpperCase() + v.slice(1)}! Homemade or from a restaurant?`,
      `Ooh, ${v}! Who makes the best one you've ever had?`,
      `${v} is a solid choice. Is it a regular thing or more of a treat?`,
    ]),
  place: (v) =>
    pick([
      `Oh, ${v}! What's your favourite thing about it?`,
      `Nice! Have you always lived in ${v}, or did you move there?`,
      `${v} — is it a place most people would know?`,
    ]),
  subject: (v) =>
    pick([
      `${v.charAt(0).toUpperCase() + v.slice(1)}! What do you love about it specifically?`,
      `Oh interesting — why ${v}? Is it the content or the way it's taught?`,
      `That's a great subject. Do you think you'll use it after school?`,
    ]),
  name: (v) =>
    pick([
      `Nice to meet you, ${v}! So what's been on your mind lately?`,
      `Hey ${v}! Love the name. Where are you from?`,
      `${v}! Great. So tell me — what's something you're into right now?`,
    ]),
  pet: (v) =>
    pick([
      `A ${v}! What's their name?`,
      `Oh that's adorable — what does your ${v} do all day while you're at school?`,
      `${v.charAt(0).toUpperCase() + v.slice(1)}s are the best. Does yours have any funny quirks?`,
    ]),
};

// ─── Core Response Generator ──────────────────────────────────────────────────

function generateReply(
  userMsg: string,
  memory: SessionMemory,
  exchangeCount: number,
  newFact: { key: string; value: string } | null,
  lastTopicRef: { topic: string | null; count: number },
  usedReplies: Set<string>,
  lastAIQuestion: string | null,
  milestonesFired: Set<number>,
): string {
  const msg = userMsg.trim();
  const words = msg.split(/\s+/).length;
  const isVeryShort = words <= 3;
  const isShort = words <= 7;
  const lower = msg.toLowerCase();

  // Emit reply, mark used
  function emit(text: string): string {
    usedReplies.add(text);
    return text;
  }

  // ── Milestone celebrations (fire once per milestone) ──
  if (exchangeCount === 5 && !milestonesFired.has(5)) {
    milestonesFired.add(5);
    return emit(
      "Hey, we've been chatting for a bit — you're doing really well! Keep going.",
    );
  }
  if (exchangeCount === 10 && !milestonesFired.has(10)) {
    milestonesFired.add(10);
    return emit(
      "10 exchanges! You're really opening up — I love how natural this feels now.",
    );
  }
  if (exchangeCount === 20 && !milestonesFired.has(20)) {
    milestonesFired.add(20);
    return emit(
      "Wow, 20 exchanges! Honestly, you're basically a pro at this now. What else is on your mind?",
    );
  }

  // ── Detect if user is answering the last AI question directly ──
  if (lastAIQuestion) {
    const lq = lastAIQuestion.toLowerCase();
    let followUpPool: string[] | null = null;

    if (/sport|play|team|cricket|football/i.test(lq)) {
      // Check if user gave a sport name answer
      if (
        /cricket|football|soccer|basketball|badminton|tennis|swimming|volleyball/i.test(
          lower,
        )
      ) {
        const sportName = lower.match(
          /cricket|football|soccer|basketball|badminton|tennis|swimming|volleyball/i,
        )?.[0];
        if (sportName) {
          const reactions = SHORT_TOPIC_REACTIONS.sports;
          return emit(
            pickFresh(
              reactions.filter((r) =>
                r.toLowerCase().includes(sportName.toLowerCase()),
              ).length > 0
                ? reactions.filter((r) =>
                    r.toLowerCase().includes(sportName.toLowerCase()),
                  )
                : reactions,
              usedReplies,
            ),
          );
        }
      }
      followUpPool = DIRECT_FOLLOW_UPS.sport_asked;
    } else if (/food|eat|meal|snack|favourite.*food/i.test(lq)) {
      // User answered with a food name
      const foodKeywords = [
        "pizza",
        "biryani",
        "rice",
        "noodles",
        "dosa",
        "burger",
        "chocolate",
        "ice cream",
        "roti",
        "curry",
        "pasta",
      ];
      const matchedFood = foodKeywords.find((f) => lower.includes(f));
      if (matchedFood) {
        const reactions = SHORT_TOPIC_REACTIONS.food.filter((r) =>
          r.toLowerCase().includes(matchedFood),
        );
        if (reactions.length > 0) {
          return emit(pickFresh(reactions, usedReplies));
        }
      }
      followUpPool = DIRECT_FOLLOW_UPS.food_asked;
    } else if (/career|job|dream|want to be|profession/i.test(lq)) {
      followUpPool = DIRECT_FOLLOW_UPS.career_asked;
    } else if (/hobby|do.*free time|enjoy|into/i.test(lq)) {
      followUpPool = DIRECT_FOLLOW_UPS.hobby_asked;
    } else if (/live|from|place|city|town/i.test(lq)) {
      followUpPool = DIRECT_FOLLOW_UPS.place_asked;
    } else if (/subject|class|lesson|favourite.*subject/i.test(lq)) {
      followUpPool = DIRECT_FOLLOW_UPS.subject_asked;
    }

    // If we found a relevant follow-up pool for the last question
    if (followUpPool && words >= 1) {
      return emit(pickFresh(followUpPool, usedReplies));
    }
  }

  // ── Very short one-word / yes-no replies — react to content if possible ──
  if (isVeryShort) {
    if (
      /^(yes|yeah|yep|yup|sure|okay|ok|no|nope|nah|maybe|hmm|hm|oh)$/i.test(msg)
    ) {
      return emit(
        pickFresh(
          [
            "Ha, fair enough! What's on your mind right now?",
            "Haha — say more!",
            "Oh interesting! What do you mean by that?",
            "Right? So what do you usually do about it?",
            "Go on then!",
          ],
          usedReplies,
        ),
      );
    }
    if (
      /^(good|fine|great|awesome|amazing|nice|cool|bad|okay|alright)$/i.test(
        msg,
      )
    ) {
      return emit(
        pickFresh(
          [
            "Nice — what's been making it good?",
            "Cool! What's been happening today?",
            "Oh yeah? What are you up to?",
            "Ha, tell me more about that!",
          ],
          usedReplies,
        ),
      );
    }

    // Check if the short answer is a sport/food/topic that we can react to specifically
    const detectedTopic = detectTopic(msg);
    if (detectedTopic && SHORT_TOPIC_REACTIONS[detectedTopic]) {
      return emit(pickFresh(SHORT_TOPIC_REACTIONS[detectedTopic], usedReplies));
    }
    return emit(pickFresh(SHORT_NUDGES, usedReplies));
  }

  // ── Greetings ──
  if (
    /^(hi|hello|hey|good morning|good afternoon|good evening|howdy)\b/i.test(
      msg,
    )
  ) {
    if (memory.name) {
      return emit(`Hey ${memory.name}! Good to hear from you. What's up?`);
    }
    return emit(
      pickFresh(
        [
          "Hey! How's your day been so far?",
          "Hi! What's going on with you?",
          "Hey! Been up to anything interesting lately?",
        ],
        usedReplies,
      ),
    );
  }

  // ── Positive feelings ──
  if (
    /\b(happy|excited|great|awesome|amazing|wonderful|fantastic|love|enjoying)\b/i.test(
      lower,
    )
  ) {
    const ack = pickFresh(CASUAL_ACKS, usedReplies);
    const topic = detectTopic(msg);
    if (topic && TOPIC_BANKS[topic]) {
      return emit(`${ack} ${pickFresh(TOPIC_BANKS[topic], usedReplies)}`);
    }
    return emit(`${ack} What's making you feel that way?`);
  }

  // ── Negative feelings ──
  if (
    /\b(tired|bored|sad|stressed|nervous|worried|bad|terrible|awful|hate|annoyed)\b/i.test(
      lower,
    )
  ) {
    return emit(
      pickFresh(
        [
          "Aw, what's going on?",
          "That sounds rough. What happened?",
          "Oh no — what's bothering you?",
          "I get that. What usually helps when you feel like that?",
          "That's valid. Do you want to talk about it or distract yourself?",
        ],
        usedReplies,
      ),
    );
  }

  // ── New fact discovered — react naturally ──
  if (newFact && FACT_ACKS[newFact.key]) {
    return emit(FACT_ACKS[newFact.key](newFact.value));
  }

  // ── Memory recall every ~5 exchanges (not too often) ──
  if (
    exchangeCount > 4 &&
    exchangeCount % 5 === 0 &&
    memory.mentionedFacts.length >= 2
  ) {
    const recall = buildMemoryCallback(memory, usedReplies);
    if (recall) return emit(recall);
  }

  // ── Detect topic and build a contextual response ──
  const topic = detectTopic(msg);
  if (topic) {
    // Update streak
    if (topic === lastTopicRef.topic) {
      lastTopicRef.count++;
    } else {
      lastTopicRef.topic = topic;
      lastTopicRef.count = 1;
    }

    // Deep-dive responses when on same topic for 3+ exchanges
    if (lastTopicRef.count >= 3 && TOPIC_DEEP_DIVES[topic]) {
      return emit(pickFresh(TOPIC_DEEP_DIVES[topic], usedReplies));
    }

    // Memory-contextual responses
    if (topic === "career" && memory.job_dream) {
      return emit(
        pickFresh(
          [
            `Since you want to be a ${memory.job_dream} — what's the hardest part about getting there?`,
            `Are you working on any skills specifically for your ${memory.job_dream} career?`,
            `When did you first decide you wanted to be a ${memory.job_dream}?`,
          ],
          usedReplies,
        ),
      );
    }
    if (topic === "school" && memory.grade) {
      return emit(
        pickFresh(
          [
            `Class ${memory.grade} keeps you busy — which part is hardest right now?`,
            `Oh right, you're in class ${memory.grade}. Any subjects you actually look forward to?`,
            `How are things going in class ${memory.grade} overall?`,
          ],
          usedReplies,
        ),
      );
    }
    if (topic === "sports" && memory.sport) {
      return emit(
        pickFresh(
          [
            `Oh nice, ${memory.sport} again! Are you getting better at it?`,
            `Ha, you really love ${memory.sport}. Had any good matches lately?`,
            `${memory.sport.charAt(0).toUpperCase() + memory.sport.slice(1)} keeps coming up — there must be something you really love about it?`,
          ],
          usedReplies,
        ),
      );
    }

    if (TOPIC_BANKS[topic]) {
      const resp = pickFresh(TOPIC_BANKS[topic], usedReplies);
      // Add a casual acknowledgment before the response ~40% of the time (only on longer messages)
      if (Math.random() > 0.6 && !isShort) {
        const ack = pickFresh(CASUAL_ACKS, usedReplies);
        return emit(`${ack} ${resp}`);
      }
      return emit(resp);
    }
  } else {
    // No topic matched — reset streak
    lastTopicRef.topic = null;
    lastTopicRef.count = 0;
  }

  // ── General answered follow-up if there was a last question ──
  if (lastAIQuestion && !isVeryShort) {
    return emit(pickFresh(DIRECT_FOLLOW_UPS.general_answered, usedReplies));
  }

  // ── Pivot suggestion if conversation stalled ──
  if (exchangeCount > 6 && !topic) {
    return emit(pickFresh(CASUAL_PIVOTS, usedReplies));
  }

  return emit(pickFresh(FALLBACKS, usedReplies));
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
  // Anti-repetition: track used replies
  const usedRepliesRef = useRef<Set<string>>(new Set());
  // Track what the AI last asked
  const lastAIQuestionRef = useRef<string | null>(null);
  // Track milestone celebrations
  const milestonesFiredRef = useRef<Set<number>>(new Set());

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
    usedRepliesRef.current = new Set();
    lastAIQuestionRef.current = null;
    milestonesFiredRef.current = new Set();
    setExchangeCount(0);
    setRememberedFactsCount(0);
    setSelectedCharacter(type);
    const greeting =
      OPENING_LINES[Math.floor(Math.random() * OPENING_LINES.length)];
    usedRepliesRef.current.add(greeting);
    lastAIQuestionRef.current = greeting;
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

    // 4. Build AI reply using enriched engine
    const reply = generateReply(
      text.trim(),
      memoryRef.current,
      exchangeCountRef.current,
      newFact,
      topicStreakRef.current,
      usedRepliesRef.current,
      lastAIQuestionRef.current,
      milestonesFiredRef.current,
    );

    // Store what AI just said as the last question
    lastAIQuestionRef.current = reply;

    // Clear usedReplies after ~12 exchanges to allow reuse if needed
    if (exchangeCountRef.current > 12 && usedRepliesRef.current.size > 30) {
      // Keep only the last 8 to avoid true immediate repeats
      const arr = Array.from(usedRepliesRef.current);
      usedRepliesRef.current = new Set(arr.slice(-8));
    }

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

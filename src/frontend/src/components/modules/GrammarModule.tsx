import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { useState } from "react";

type GrammarLesson = {
  title: string;
  rule: string;
  examples: string[];
  question: string;
  sampleAnswer: string;
  videoUrl?: string;
  videoTitle?: string;
};

const GRAMMAR_LESSONS: Record<number, GrammarLesson[]> = {
  1: [
    {
      title: "Present Simple Tense",
      rule: "Use Present Simple for habits, routines, and general facts. Structure: Subject + Base Verb (add -s/-es for he/she/it).",
      examples: [
        "She reads every morning.",
        "They play cricket on weekends.",
        "He goes to school by bus.",
      ],
      question:
        "Write 2 sentences about your daily routine using Present Simple tense.",
      sampleAnswer:
        "I wake up at 7 AM every day. I eat breakfast before going to school.",
      videoUrl: "https://www.youtube.com/embed/Iu5gMOIKM8s",
      videoTitle: "Present Simple Tense Explained",
    },
    {
      title: "Negative Form",
      rule: "For negatives in Present Simple: Subject + do/does + not + Base Verb. 'Does not' is used with he/she/it.",
      examples: [
        "I do not like coffee.",
        "She does not watch TV.",
        "They don't play outside.",
      ],
      question:
        "Convert to negative: 'He speaks loudly in class.' and 'They visit the park often.'",
      sampleAnswer:
        "He does not speak loudly in class. They do not visit the park often.",
      videoUrl: "https://www.youtube.com/embed/VkFB5c0wX0g",
      videoTitle: "Negative Sentences in English",
    },
  ],
  2: [
    {
      title: "Articles: A, An, The",
      rule: "Use 'a' before consonant sounds, 'an' before vowel sounds. Use 'the' for specific/known nouns.",
      examples: ["I saw a dog.", "She ate an apple.", "The dog was friendly."],
      question:
        "Fill in: ___ apple a day keeps ___ doctor away. I have ___ umbrella.",
      sampleAnswer: "An apple a day keeps the doctor away. I have an umbrella.",
      videoUrl: "https://www.youtube.com/embed/KOsO-3nXFEo",
      videoTitle: "Articles A, An, The — Full Explanation",
    },
    {
      title: "Question Formation",
      rule: "Questions use auxiliary verbs at the start: Do/Does, Is/Are, Has/Have. Invert subject and auxiliary.",
      examples: [
        "Do you like tea?",
        "Is she coming?",
        "Has he finished his work?",
      ],
      question:
        "Convert to questions: 'He speaks English well.' and 'They are playing football.'",
      sampleAnswer: "Does he speak English well? Are they playing football?",
      videoUrl: "https://www.youtube.com/embed/T9pDsJPDiNE",
      videoTitle: "How to Form Questions in English",
    },
  ],
  3: [
    {
      title: "Past Simple Tense",
      rule: "Use Past Simple for completed actions in the past. Regular verbs add -ed. Irregular verbs change form: go → went, eat → ate, see → saw.",
      examples: [
        "She walked to school yesterday.",
        "They ate biryani for lunch.",
        "He went to the market in the morning.",
      ],
      question:
        "Write 2 sentences about what you did yesterday using Past Simple tense.",
      sampleAnswer:
        "I watched a cricket match yesterday. My family visited our grandmother last Sunday.",
      videoUrl: "https://www.youtube.com/embed/HGLMlZBGMqU",
      videoTitle: "Past Simple Tense — Regular & Irregular Verbs",
    },
    {
      title: "Was / Were",
      rule: "'Was' is used with I/he/she/it. 'Were' is used with you/we/they. These are past tense forms of the verb 'to be'.",
      examples: [
        "I was happy at the party.",
        "They were tired after the game.",
        "She was the best student in class.",
      ],
      question:
        "Fill in the blanks: 'The children ___ playing outside. The teacher ___ very kind. I ___ at home all day.'",
      sampleAnswer:
        "The children were playing outside. The teacher was very kind. I was at home all day.",
      videoUrl: "https://www.youtube.com/embed/kJDpGGnfkIM",
      videoTitle: "Was and Were — Past Tense of To Be",
    },
  ],
  4: [
    {
      title: "Future Tense with 'Will'",
      rule: "Use 'will' + base verb for predictions, promises, and spontaneous decisions. It works with all subjects (I/you/he/she/we/they).",
      examples: [
        "I will call you tomorrow.",
        "She will pass the exam.",
        "It will rain tonight.",
      ],
      question: "Write 2 sentences about your plans for tomorrow using 'will'.",
      sampleAnswer:
        "I will study English tomorrow morning. My friend will come to my house in the evening.",
      videoUrl: "https://www.youtube.com/embed/IhfFJSMBRmQ",
      videoTitle: "Future Tense with Will — Simple Guide",
    },
    {
      title: "Future with 'Going To' & Future Negative",
      rule: "Use 'going to' for planned future actions. For negatives with 'will', add 'not': will not / won't. For 'going to' negatives: is/am/are not going to.",
      examples: [
        "I am going to visit my uncle this weekend.",
        "She is not going to miss the class.",
        "They won't be late for school.",
      ],
      question:
        "Make negative sentences: 'He will come.' → ___. 'They are going to play.' → ___.",
      sampleAnswer:
        "He will not come. / He won't come. They are not going to play.",
      videoUrl: "https://www.youtube.com/embed/5c5iUYzMafs",
      videoTitle: "Going To and Future Negatives Explained",
    },
  ],
  5: [
    {
      title: "Prepositions of Place",
      rule: "Prepositions of place tell us WHERE something is. Common ones: in (inside), on (touching a surface), at (a specific point), under (below).",
      examples: [
        "The book is on the table.",
        "The cat is under the chair.",
        "She is at the bus stop.",
      ],
      question:
        "Fill in: 'The ball is ___ the box. She lives ___ Chennai. The keys are ___ the drawer.'",
      sampleAnswer:
        "The ball is in the box. She lives in Chennai. The keys are in the drawer.",
      videoUrl: "https://www.youtube.com/embed/f6qiGEbkiY0",
      videoTitle: "Prepositions of Place — In, On, At, Under",
    },
    {
      title: "Prepositions of Time",
      rule: "Use 'at' for specific times (at 6 PM), 'on' for days/dates (on Monday, on 15th August), and 'in' for months, years, seasons (in January, in 2024, in summer).",
      examples: [
        "School starts at 8 AM.",
        "We celebrate Diwali in October or November.",
        "The match is on Sunday.",
      ],
      question:
        "Fill in: 'I was born ___ 2012. My birthday is ___ March. School ends ___ 3 PM.'",
      sampleAnswer:
        "I was born in 2012. My birthday is in March. School ends at 3 PM.",
      videoUrl: "https://www.youtube.com/embed/9P5bSC2nZGc",
      videoTitle: "Prepositions of Time — At, On, In",
    },
  ],
  6: [
    {
      title: "Adjectives & Comparatives",
      rule: "Adjectives describe nouns. Comparatives compare two things. For short adjectives, add -er (bigger, faster). For long adjectives, use 'more' (more beautiful, more intelligent).",
      examples: [
        "An elephant is bigger than a horse.",
        "Mango is sweeter than lemon.",
        "This road is more dangerous than the other.",
      ],
      question:
        "Write 2 comparative sentences comparing: 1) a train and a bicycle 2) summer and winter.",
      sampleAnswer:
        "A train is faster than a bicycle. Summer is hotter than winter in most parts of India.",
      videoUrl: "https://www.youtube.com/embed/1OaBpBH-WNA",
      videoTitle: "Adjectives and Comparatives in English",
    },
    {
      title: "Superlatives",
      rule: "Superlatives describe the highest degree among three or more things. Short adjectives: add -est (tallest, fastest). Long adjectives: use 'most' (most beautiful, most intelligent). Always use 'the' before superlatives.",
      examples: [
        "Mount Everest is the tallest mountain in the world.",
        "She is the most hardworking student in class.",
        "This is the cheapest shop in the market.",
      ],
      question:
        "Write 2 superlative sentences about: 1) an animal you know 2) a place you have visited.",
      sampleAnswer:
        "The cheetah is the fastest animal in the world. Shimla is the most beautiful place I have visited.",
      videoUrl: "https://www.youtube.com/embed/bsY4FDyiinI",
      videoTitle: "Superlatives — The Best, The Fastest, The Most",
    },
  ],
  7: [
    {
      title: "Modal Verbs — Can, Could, Should, Must",
      rule: "Modal verbs express ability, possibility, advice, or obligation. 'Can' = ability now, 'Could' = ability in past/polite request, 'Should' = advice, 'Must' = strong obligation or necessity.",
      examples: [
        "I can speak three languages.",
        "You should drink more water.",
        "She must wear a helmet while cycling.",
      ],
      question:
        "Fill in the blanks with the correct modal verb (can/could/should/must): 1) You ___ eat vegetables daily. 2) ___ you help me with this? 3) Students ___ wear uniform to school.",
      sampleAnswer:
        "1) You should eat vegetables daily. 2) Could you help me with this? 3) Students must wear uniform to school.",
      videoUrl: "https://www.youtube.com/embed/OTOe9PLVXfc",
      videoTitle: "Modal Verbs — Can, Could, Should, Must",
    },
    {
      title: "Modal Negatives",
      rule: "Add 'not' after a modal verb to make it negative. Can + not = cannot/can't. Should + not = should not/shouldn't. Must + not = must not/mustn't (prohibition). Need not = don't need to (not necessary).",
      examples: [
        "You must not run in the corridor.",
        "She cannot swim in the deep end.",
        "You should not speak rudely to elders.",
      ],
      question:
        "Write negative sentences: 1) Use 'must not' for a school rule. 2) Use 'should not' for a health tip. 3) Use 'cannot' for something you are unable to do.",
      sampleAnswer:
        "1) You must not use your phone during class. 2) You should not skip breakfast. 3) I cannot play guitar yet.",
      videoUrl: "https://www.youtube.com/embed/Ku4ScKbA1bM",
      videoTitle: "Modal Verb Negatives — Can't, Shouldn't, Mustn't",
    },
  ],
  8: [
    {
      title: "Countable & Uncountable Nouns",
      rule: "Countable nouns can be counted and have a plural form (1 apple, 2 apples). Uncountable nouns cannot be counted individually — they have no plural (water, rice, advice, information). Use 'some' or 'a little' with uncountable nouns.",
      examples: [
        "I have three books and some milk.",
        "She gave me a lot of information.",
        "Can I have some water and two biscuits?",
      ],
      question:
        "Sort these into countable (C) and uncountable (U): apple, water, chair, rice, egg, happiness, book, music.",
      sampleAnswer:
        "Countable: apple, chair, egg, book. Uncountable: water, rice, happiness, music.",
      videoUrl: "https://www.youtube.com/embed/BUoOxDrZFfI",
      videoTitle: "Countable and Uncountable Nouns Explained",
    },
    {
      title: "Possessive Pronouns",
      rule: "Possessive pronouns show ownership and replace a noun phrase. They stand alone. Mine (I), Yours (you), His (he), Hers (she), Ours (we), Theirs (they). Do NOT use 'apostrophe s' with these pronouns.",
      examples: [
        "This pencil is mine, not yours.",
        "The red bag is hers.",
        "We won the match — the trophy is ours!",
      ],
      question:
        "Replace with possessive pronouns: 1) 'This is my book.' → This book is ___. 2) 'That is their house.' → That house is ___.",
      sampleAnswer: "1) This book is mine. 2) That house is theirs.",
      videoUrl: "https://www.youtube.com/embed/fxJQiDgn-1g",
      videoTitle: "Possessive Pronouns — Mine, Yours, His, Hers",
    },
  ],
};

interface Props {
  lesson: number;
  onComplete: (score: number, total: number) => void;
}

export function GrammarModule({ lesson, onComplete }: Props) {
  const lessonItems = GRAMMAR_LESSONS[lesson] ?? GRAMMAR_LESSONS[1];
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selfScore, setSelfScore] = useState(0);
  const [done, setDone] = useState(false);
  const [videoExpanded, setVideoExpanded] = useState(false);

  const current = lessonItems[exerciseIndex];
  const total = lessonItems.length;

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmitted(true);
  };

  const handleSelfEval = (correct: boolean) => {
    const nextScore = correct ? selfScore + 1 : selfScore;
    if (correct) setSelfScore(nextScore);
    if (exerciseIndex + 1 >= total) {
      setDone(true);
    } else {
      setExerciseIndex((p) => p + 1);
      setAnswer("");
      setSubmitted(false);
      setVideoExpanded(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-4"
      >
        <div className="text-6xl">✏️</div>
        <h3 className="text-2xl font-bold">Grammar Complete!</h3>
        <p className="text-muted-foreground">
          You got {selfScore} out of {total} exercises right
        </p>
        <div className="text-4xl font-bold text-primary">
          {Math.round((selfScore / total) * 100)}%
        </div>
        <Button
          data-ocid="grammar.complete.primary_button"
          onClick={() => onComplete(selfScore, total)}
          className="gradient-cyan text-primary-foreground px-8 text-base py-3"
        >
          Complete Lesson 🎉
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={exerciseIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-5"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Exercise {exerciseIndex + 1} of {total}
        </span>
      </div>

      {/* Video Section */}
      {current.videoUrl && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50 overflow-hidden">
          <button
            type="button"
            onClick={() => setVideoExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎬</span>
              <div>
                <p className="text-sm font-bold text-purple-800">
                  Watch Video Explanation
                </p>
                <p className="text-xs text-purple-600">{current.videoTitle}</p>
              </div>
            </div>
            <span className="text-purple-500 text-lg">
              {videoExpanded ? "▲" : "▼"}
            </span>
          </button>
          {videoExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="px-4 pb-4"
            >
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  src={current.videoUrl}
                  title={current.videoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full rounded-xl border border-purple-200"
                />
              </div>
            </motion.div>
          )}
        </div>
      )}

      <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-5 space-y-3">
        <h3 className="font-bold text-cyan-800">{current.title}</h3>
        <p className="text-sm text-cyan-700 leading-relaxed">{current.rule}</p>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">
            Examples
          </p>
          {current.examples.map((ex) => (
            <p key={ex} className="text-sm text-cyan-800 italic">
              → {ex}
            </p>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-semibold text-foreground">📝 {current.question}</p>
        <Textarea
          data-ocid="grammar.answer.textarea"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={submitted}
          className="min-h-28 resize-none"
          rows={4}
        />
        {!submitted && (
          <Button
            data-ocid="grammar.check.primary_button"
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="w-full gradient-cyan text-primary-foreground"
          >
            Check Answer
          </Button>
        )}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-3"
        >
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">
            ✅ Sample Answer
          </p>
          <p className="text-sm text-green-800 font-medium leading-relaxed">
            {current.sampleAnswer}
          </p>
          <p className="text-sm text-muted-foreground">
            Compare your answer with the sample above.
          </p>
          <div className="flex gap-3 pt-1">
            <Button
              data-ocid="grammar.correct.button"
              onClick={() => handleSelfEval(true)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              👍 I Got It Right
            </Button>
            <Button
              data-ocid="grammar.wrong.button"
              variant="outline"
              onClick={() => handleSelfEval(false)}
              className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              🔄 Need More Practice
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

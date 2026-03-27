import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useState } from "react";

type Choice = { label: string; correct: boolean; explanation?: string };
type Question = { q: string; choices: Choice[] };
type ReadingLesson = { title: string; passage: string; questions: Question[] };

const LESSONS: Record<number, ReadingLesson> = {
  1: {
    title: "Man's Best Friend",
    passage:
      "Dogs have been companions to humans for thousands of years. They were first domesticated from wolves and trained to help with hunting and herding. Today, dogs serve many roles: they are beloved pets, working animals, therapy companions, and even search-and-rescue heroes. Studies show that owning a dog can reduce stress, lower blood pressure, and increase physical activity. The bond between humans and dogs is built on loyalty, trust, and mutual affection. Dogs are known for their ability to sense human emotions and respond with comfort. It is no wonder they are called 'man's best friend'.",
    questions: [
      {
        q: "Dogs were originally domesticated from which animal?",
        choices: [
          {
            label: "Cats",
            correct: false,
            explanation: "Cats were domesticated separately.",
          },
          {
            label: "Foxes",
            correct: false,
            explanation: "Foxes were not the source of dog domestication.",
          },
          {
            label: "Wolves",
            correct: true,
            explanation:
              "Correct! Dogs descended from wolves over thousands of years.",
          },
          {
            label: "Bears",
            correct: false,
            explanation: "Bears are not related to dog domestication.",
          },
        ],
      },
      {
        q: "What is the main idea of the passage?",
        choices: [
          {
            label: "Dogs are dangerous",
            correct: false,
            explanation: "The passage highlights positive qualities.",
          },
          {
            label: "Dogs and humans share a long beneficial relationship",
            correct: true,
            explanation: "Correct! The whole passage is about this bond.",
          },
          {
            label: "Dogs reduce stress only",
            correct: false,
            explanation: "This is just one of many benefits mentioned.",
          },
          {
            label: "Dogs were always pets",
            correct: false,
            explanation: "Dogs had working roles too.",
          },
        ],
      },
      {
        q: "Which benefit is NOT mentioned in the passage?",
        choices: [
          {
            label: "Reduces stress",
            correct: false,
            explanation: "This is mentioned.",
          },
          {
            label: "Improves vision",
            correct: true,
            explanation: "Correct! Improved vision is not mentioned.",
          },
          {
            label: "Lowers blood pressure",
            correct: false,
            explanation: "This is mentioned.",
          },
          {
            label: "Increases activity",
            correct: false,
            explanation: "This is mentioned.",
          },
        ],
      },
    ],
  },
  2: {
    title: "Making Inferences",
    passage:
      "Making inferences means reading beyond the literal words on the page. When a writer says 'She grabbed an umbrella before leaving the house,' they don't state it is raining, but we can infer it from context clues. Skilled readers constantly make inferences to fill in gaps left by writers. To infer effectively, use clues from the text combined with your own background knowledge. For example, if a character is described as wearing a heavy coat and shivering, you can infer the setting is cold. This skill makes reading richer and more engaging.",
    questions: [
      {
        q: "What does 'making inferences' mean?",
        choices: [
          {
            label: "Guessing randomly",
            correct: false,
            explanation:
              "Inferences are based on evidence, not random guessing.",
          },
          {
            label: "Using clues to draw conclusions",
            correct: true,
            explanation:
              "Correct! Inferences combine text clues with background knowledge.",
          },
          {
            label: "Only reading literally",
            correct: false,
            explanation: "Literal reading is the opposite of inference.",
          },
          {
            label: "Ignoring context",
            correct: false,
            explanation: "Context is essential for inference.",
          },
        ],
      },
      {
        q: "In the umbrella example, what can we infer?",
        choices: [
          {
            label: "She forgot something",
            correct: false,
            explanation: "There is no evidence of forgetting.",
          },
          {
            label: "It might rain",
            correct: true,
            explanation:
              "Correct! Grabbing an umbrella suggests rain is expected.",
          },
          {
            label: "She is going to school",
            correct: false,
            explanation: "Her destination is not mentioned.",
          },
          {
            label: "It is sunny",
            correct: false,
            explanation: "This contradicts taking an umbrella.",
          },
        ],
      },
    ],
  },
  3: {
    title: "The Water Cycle",
    passage:
      "Water on Earth is always moving in a cycle called the water cycle. When the sun heats water in rivers, lakes, and oceans, it evaporates and turns into water vapour that rises into the sky. As the vapour cools high up in the atmosphere, it condenses and forms clouds. When the clouds become heavy with water droplets, the water falls back to the ground as rain or snow — this is called precipitation. The rainwater flows into rivers and lakes, soaks into the ground, or collects in reservoirs. From there, the cycle begins again. The water cycle is essential for all living things on Earth.",
    questions: [
      {
        q: "What happens when the sun heats water in rivers and lakes?",
        choices: [
          {
            label: "The water freezes",
            correct: false,
            explanation:
              "Freezing happens in cold temperatures, not when heated.",
          },
          {
            label: "The water evaporates and rises as vapour",
            correct: true,
            explanation:
              "Correct! Evaporation is the first step in the water cycle.",
          },
          {
            label: "The water becomes salt",
            correct: false,
            explanation: "This is not part of the water cycle.",
          },
          {
            label: "Clouds sink to the ground",
            correct: false,
            explanation: "Clouds form high up in the atmosphere.",
          },
        ],
      },
      {
        q: "What is precipitation?",
        choices: [
          {
            label: "Water rising as vapour",
            correct: false,
            explanation: "That is evaporation, not precipitation.",
          },
          {
            label: "Cloud formation",
            correct: false,
            explanation: "That is condensation.",
          },
          {
            label: "Water falling as rain or snow",
            correct: true,
            explanation:
              "Correct! Precipitation is rain or snow falling to the ground.",
          },
          {
            label: "Water freezing underground",
            correct: false,
            explanation: "That is not precipitation.",
          },
        ],
      },
      {
        q: "Why is the water cycle important?",
        choices: [
          {
            label: "It makes the sky blue",
            correct: false,
            explanation: "The sky's colour is unrelated to the water cycle.",
          },
          {
            label: "It is essential for all living things",
            correct: true,
            explanation:
              "Correct! All life depends on water, which the cycle continuously replenishes.",
          },
          {
            label: "It creates mountains",
            correct: false,
            explanation: "Mountains are formed by geological processes.",
          },
          {
            label: "It stops floods",
            correct: false,
            explanation: "The water cycle does not prevent floods.",
          },
        ],
      },
    ],
  },
  4: {
    title: "A Day at the Market",
    passage:
      "Every Saturday morning, Priya and her mother visit the local sabzi mandi to buy fresh vegetables and fruits. The market is crowded and full of colour — green coriander, red tomatoes, yellow bananas, and purple brinjals are piled high on every stall. The vendors call out loudly to attract customers with their best prices. Priya's mother is an expert at bargaining — she never pays the first price asked. After negotiating, they fill two big jute bags with their weekly groceries. On the way home, Priya always treats herself to a fresh sugarcane juice from the corner stall. She loves Saturday mornings because the market feels alive, noisy, and full of energy.",
    questions: [
      {
        q: "When do Priya and her mother visit the market?",
        choices: [
          {
            label: "Every Sunday evening",
            correct: false,
            explanation: "The passage says every Saturday morning.",
          },
          {
            label: "Every Saturday morning",
            correct: true,
            explanation: "Correct! The passage clearly states this.",
          },
          {
            label: "On weekdays after school",
            correct: false,
            explanation: "There is no mention of weekday visits.",
          },
          {
            label: "Once a month",
            correct: false,
            explanation: "The passage says weekly, every Saturday.",
          },
        ],
      },
      {
        q: "What does Priya's mother do well at the market?",
        choices: [
          {
            label: "Cooking food",
            correct: false,
            explanation: "Cooking is not mentioned in the passage.",
          },
          {
            label: "Bargaining for better prices",
            correct: true,
            explanation:
              "Correct! The passage says she never pays the first price asked.",
          },
          {
            label: "Selling vegetables",
            correct: false,
            explanation: "She is a buyer, not a seller.",
          },
          {
            label: "Making sugarcane juice",
            correct: false,
            explanation: "Priya buys sugarcane juice from a stall.",
          },
        ],
      },
      {
        q: "What does Priya buy as a treat on the way home?",
        choices: [
          {
            label: "A mango",
            correct: false,
            explanation: "Mangoes are not mentioned as her treat.",
          },
          {
            label: "A sugarcane juice",
            correct: true,
            explanation:
              "Correct! The passage says she treats herself to fresh sugarcane juice.",
          },
          {
            label: "A banana",
            correct: false,
            explanation: "Bananas are seen in the market but not her treat.",
          },
          {
            label: "Sweets from a shop",
            correct: false,
            explanation: "No sweets shop is mentioned.",
          },
        ],
      },
    ],
  },
  5: {
    title: "The Importance of Trees",
    passage:
      "Trees are one of the most important living things on our planet. They produce oxygen, which all animals and humans need to breathe. Trees absorb carbon dioxide and other harmful gases, helping to keep the air clean and reduce pollution. Their roots hold the soil in place and prevent floods and landslides. Forests are home to millions of animals, birds, and insects — cutting down trees destroys these habitats. Trees also provide shade, cooling the area around them and reducing the need for fans and air conditioners. Many medicines come from the bark, leaves, and roots of trees. Planting and protecting trees is one of the most powerful actions we can take to protect our environment.",
    questions: [
      {
        q: "What gas do trees produce that all living things need?",
        choices: [
          {
            label: "Carbon dioxide",
            correct: false,
            explanation:
              "Trees absorb carbon dioxide — they do not produce it.",
          },
          {
            label: "Nitrogen",
            correct: false,
            explanation: "Trees do not primarily produce nitrogen.",
          },
          {
            label: "Oxygen",
            correct: true,
            explanation:
              "Correct! Trees produce oxygen through photosynthesis.",
          },
          {
            label: "Hydrogen",
            correct: false,
            explanation: "Hydrogen is not what trees produce for breathing.",
          },
        ],
      },
      {
        q: "How do tree roots help the land?",
        choices: [
          {
            label: "They cause landslides",
            correct: false,
            explanation: "The opposite is true — roots prevent landslides.",
          },
          {
            label: "They hold the soil and prevent floods",
            correct: true,
            explanation: "Correct! Roots stabilise the soil.",
          },
          {
            label: "They absorb sunlight",
            correct: false,
            explanation: "Leaves absorb sunlight, not roots.",
          },
          {
            label: "They produce rain",
            correct: false,
            explanation: "Trees do not directly produce rain.",
          },
        ],
      },
      {
        q: "What is one way trees help reduce heat?",
        choices: [
          {
            label: "They produce cold wind",
            correct: false,
            explanation: "Trees do not produce wind.",
          },
          {
            label: "They provide shade that cools the area",
            correct: true,
            explanation:
              "Correct! Shade from trees reduces the need for fans and air conditioners.",
          },
          {
            label: "They make it rain",
            correct: false,
            explanation: "This is not how trees reduce heat.",
          },
          {
            label: "They absorb sunlight in soil",
            correct: false,
            explanation: "Soil does not absorb sunlight in this way.",
          },
        ],
      },
    ],
  },
  6: {
    title: "Space Exploration",
    passage:
      "Space exploration is the adventure of travelling beyond the Earth to learn about our universe. The first human to go to space was Yuri Gagarin from the Soviet Union in 1961. In 1969, American astronauts Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon. Rockets are powerful machines that carry astronauts and satellites into space. Our solar system has eight planets, and scientists study them using powerful telescopes and robotic space probes. India has also made great progress in space exploration — the Indian Space Research Organisation, known as ISRO, successfully launched a spacecraft to Mars in 2013. Space exploration helps us understand the origins of the universe and find answers to some of the biggest questions about life and existence.",
    questions: [
      {
        q: "Who was the first human to travel to space?",
        choices: [
          {
            label: "Neil Armstrong",
            correct: false,
            explanation:
              "Neil Armstrong was the first human to walk on the Moon, not the first in space.",
          },
          {
            label: "Buzz Aldrin",
            correct: false,
            explanation:
              "Buzz Aldrin walked on the Moon but was not the first in space.",
          },
          {
            label: "Yuri Gagarin",
            correct: true,
            explanation:
              "Correct! Yuri Gagarin from the Soviet Union went to space in 1961.",
          },
          {
            label: "Rakesh Sharma",
            correct: false,
            explanation:
              "Rakesh Sharma was the first Indian in space but not the first human.",
          },
        ],
      },
      {
        q: "What did Neil Armstrong and Buzz Aldrin do in 1969?",
        choices: [
          {
            label: "They launched the first satellite",
            correct: false,
            explanation: "They walked on the Moon, not launched a satellite.",
          },
          {
            label: "They walked on the Moon",
            correct: true,
            explanation:
              "Correct! They were the first humans to walk on the Moon.",
          },
          {
            label: "They reached Mars",
            correct: false,
            explanation: "No humans have reached Mars yet.",
          },
          {
            label: "They built the first rocket",
            correct: false,
            explanation: "Rockets existed before 1969.",
          },
        ],
      },
      {
        q: "What achievement did ISRO accomplish in 2013?",
        choices: [
          {
            label: "Landed on the Moon",
            correct: false,
            explanation: "ISRO's 2013 mission was to Mars.",
          },
          {
            label: "Sent an astronaut to space",
            correct: false,
            explanation:
              "The 2013 mission was a spacecraft, not a crewed flight.",
          },
          {
            label: "Launched a spacecraft to Mars",
            correct: true,
            explanation:
              "Correct! India's Mars Orbiter Mission (Mangalyaan) was launched in 2013.",
          },
          {
            label: "Built the largest telescope",
            correct: false,
            explanation: "ISRO's 2013 achievement was the Mars mission.",
          },
        ],
      },
    ],
  },
};

interface Props {
  lesson: number;
  onComplete: (score: number, total: number) => void;
}

export function ReadingModule({ lesson, onComplete }: Props) {
  const data = LESSONS[lesson] ?? LESSONS[1];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = data.questions.filter(
    (q, i) => q.choices[answers[i]]?.correct,
  ).length;
  const total = data.questions.length;

  const handleAnswer = (qi: number, ci: number) => {
    if (submitted) return;
    setAnswers((p) => ({ ...p, [qi]: ci }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-white p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <h3 className="font-bold text-lg">{data.title}</h3>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          {data.passage}
        </p>
      </div>

      <div className="space-y-5">
        <h3 className="font-bold">Comprehension Questions</h3>
        {data.questions.map((q, qi) => (
          <div
            key={q.q}
            className="rounded-xl border border-border bg-white p-5 space-y-3"
          >
            <p className="font-medium">
              {qi + 1}. {q.q}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.choices.map((choice, ci) => {
                let cls =
                  "border-border bg-white hover:border-primary/50 hover:bg-primary/5";
                if (submitted) {
                  if (choice.correct)
                    cls = "border-green-400 bg-green-50 text-green-800";
                  else if (answers[qi] === ci)
                    cls = "border-red-400 bg-red-50 text-red-800";
                } else if (answers[qi] === ci) {
                  cls = "border-primary bg-primary/10 text-primary";
                }
                return (
                  <button
                    type="button"
                    key={choice.label}
                    onClick={() => handleAnswer(qi, ci)}
                    disabled={submitted}
                    className={`rounded-xl border-2 py-2.5 px-4 text-sm text-left transition-all ${cls}`}
                  >
                    <span className="font-semibold mr-2">
                      {["A", "B", "C", "D"][ci]}.
                    </span>
                    {choice.label}
                  </button>
                );
              })}
            </div>
            {submitted && answers[qi] !== undefined && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs mt-1 ${q.choices[answers[qi]]?.correct ? "text-green-700" : "text-red-700"}`}
              >
                {q.choices[answers[qi]]?.explanation}
              </motion.p>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <Button
          data-ocid="reading.submit.primary_button"
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < total}
          className="w-full gradient-cyan text-primary-foreground"
        >
          Submit Answers
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-3 py-4"
        >
          <p className="text-2xl font-bold text-primary">
            {score} / {total} correct
          </p>
          <p className="text-muted-foreground text-sm">
            {Math.round((score / total) * 100)}% score
          </p>
          <Button
            data-ocid="reading.complete.primary_button"
            onClick={() => onComplete(score, total)}
            className="gradient-cyan text-primary-foreground px-8"
          >
            Complete Lesson 🎉
          </Button>
        </motion.div>
      )}
      {Object.keys(answers).length >= 1 && !submitted && (
        <div className="pt-2 text-center">
          <Button
            variant="outline"
            size="sm"
            data-ocid="reading.complete.secondary_button"
            onClick={() => onComplete(score, total)}
            className="text-muted-foreground text-xs"
          >
            Complete with current progress
          </Button>
        </div>
      )}
    </div>
  );
}

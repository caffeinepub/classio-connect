import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ChevronRight, Eye, Image } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Props = {
  lesson: number;
  onComplete: (score: number, total: number) => void;
};

type Scene = {
  title: string;
  hint: string;
  svg: React.ReactNode;
};

// 5 scene sets × 3 scenes each = 15 total scenes
const SCENE_SETS: Scene[][] = [
  // Set 0 — Classroom, Market, Park
  [
    {
      title: "A Busy Classroom",
      hint: "Look at the teacher, students, and objects around the room.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          {/* Sky-blue background */}
          <rect width="400" height="240" fill="#e0f2fe" />
          {/* Floor */}
          <rect x="0" y="180" width="400" height="60" fill="#fde68a" />
          {/* Walls */}
          <rect x="0" y="0" width="400" height="185" fill="#bfdbfe" />
          {/* Blackboard */}
          <rect x="60" y="20" width="200" height="100" rx="4" fill="#166534" />
          <text
            x="160"
            y="60"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontFamily="sans-serif"
          >
            Hello!
          </text>
          <text
            x="160"
            y="85"
            textAnchor="middle"
            fill="#86efac"
            fontSize="11"
            fontFamily="sans-serif"
          >
            A B C D E F G
          </text>
          {/* Teacher */}
          <circle cx="340" cy="120" r="18" fill="#fbbf24" />
          <rect x="325" y="138" width="30" height="40" rx="4" fill="#7c3aed" />
          <line
            x1="340"
            y1="155"
            x2="340"
            y2="180"
            stroke="#5b21b6"
            strokeWidth="3"
          />
          {/* Student 1 */}
          <circle cx="100" cy="150" r="14" fill="#fde68a" />
          <rect x="88" y="164" width="24" height="30" rx="3" fill="#3b82f6" />
          {/* Desk 1 */}
          <rect x="80" y="185" width="50" height="6" rx="2" fill="#a16207" />
          <rect x="85" y="191" width="6" height="14" fill="#92400e" />
          <rect x="119" y="191" width="6" height="14" fill="#92400e" />
          {/* Student 2 */}
          <circle cx="200" cy="150" r="14" fill="#fca5a5" />
          <rect x="188" y="164" width="24" height="30" rx="3" fill="#ec4899" />
          {/* Desk 2 */}
          <rect x="180" y="185" width="50" height="6" rx="2" fill="#a16207" />
          <rect x="185" y="191" width="6" height="14" fill="#92400e" />
          <rect x="219" y="191" width="6" height="14" fill="#92400e" />
          {/* Books on shelf */}
          <rect x="290" y="30" width="12" height="40" rx="1" fill="#ef4444" />
          <rect x="303" y="35" width="12" height="35" rx="1" fill="#3b82f6" />
          <rect x="316" y="28" width="12" height="42" rx="1" fill="#22c55e" />
          <rect x="329" y="33" width="12" height="37" rx="1" fill="#f59e0b" />
          {/* Window */}
          <rect
            x="10"
            y="30"
            width="40"
            height="50"
            rx="2"
            fill="#7dd3fc"
            stroke="#64748b"
            strokeWidth="2"
          />
          <line
            x1="30"
            y1="30"
            x2="30"
            y2="80"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <line
            x1="10"
            y1="55"
            x2="50"
            y2="55"
            stroke="#64748b"
            strokeWidth="1.5"
          />
        </svg>
      ),
    },
    {
      title: "A Colourful Market",
      hint: "Notice the stalls, fruits, vegetables, and people shopping.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          <rect width="400" height="240" fill="#fef9c3" />
          {/* Ground */}
          <rect x="0" y="190" width="400" height="50" fill="#d97706" />
          {/* Sky */}
          <rect x="0" y="0" width="400" height="195" fill="#e0f2fe" />
          {/* Stall 1 */}
          <rect
            x="20"
            y="100"
            width="100"
            height="90"
            fill="#fee2e2"
            stroke="#fca5a5"
            strokeWidth="1.5"
          />
          <polygon points="10,100 130,100 120,70 20,70" fill="#ef4444" />
          {/* Fruits on stall 1 */}
          <circle cx="45" cy="150" r="12" fill="#f97316" />
          <circle cx="70" cy="148" r="13" fill="#facc15" />
          <circle cx="95" cy="150" r="12" fill="#22c55e" />
          {/* Stall 2 */}
          <rect
            x="150"
            y="100"
            width="100"
            height="90"
            fill="#dcfce7"
            stroke="#86efac"
            strokeWidth="1.5"
          />
          <polygon points="140,100 260,100 250,70 150,70" fill="#16a34a" />
          {/* Veggies */}
          <ellipse cx="175" cy="152" rx="14" ry="10" fill="#4ade80" />
          <ellipse cx="200" cy="150" rx="10" ry="14" fill="#f97316" />
          <ellipse cx="225" cy="152" rx="14" ry="9" fill="#facc15" />
          {/* Stall 3 */}
          <rect
            x="280"
            y="100"
            width="100"
            height="90"
            fill="#ede9fe"
            stroke="#c4b5fd"
            strokeWidth="1.5"
          />
          <polygon points="270,100 390,100 380,70 280,70" fill="#8b5cf6" />
          <circle cx="305" cy="148" r="10" fill="#f43f5e" />
          <circle cx="325" cy="150" r="10" fill="#fb923c" />
          <circle cx="350" cy="148" r="10" fill="#facc15" />
          {/* Shopper 1 */}
          <circle cx="130" cy="155" r="13" fill="#fde68a" />
          <rect x="119" y="168" width="22" height="28" rx="3" fill="#3b82f6" />
          {/* Shopper 2 */}
          <circle cx="265" cy="155" r="13" fill="#fca5a5" />
          <rect x="254" y="168" width="22" height="28" rx="3" fill="#ec4899" />
          {/* Sun */}
          <circle cx="360" cy="35" r="22" fill="#fbbf24" />
          <line
            x1="360"
            y1="5"
            x2="360"
            y2="0"
            stroke="#fbbf24"
            strokeWidth="3"
          />
          <line
            x1="385"
            y1="10"
            x2="390"
            y2="5"
            stroke="#fbbf24"
            strokeWidth="3"
          />
          <line
            x1="395"
            y1="35"
            x2="400"
            y2="35"
            stroke="#fbbf24"
            strokeWidth="3"
          />
        </svg>
      ),
    },
    {
      title: "A Green Park",
      hint: "Look at the trees, bench, children, and sky above.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          <rect width="400" height="240" fill="#e0f2fe" />
          {/* Grass */}
          <rect x="0" y="170" width="400" height="70" fill="#4ade80" />
          {/* Hills */}
          <ellipse cx="80" cy="180" rx="100" ry="30" fill="#86efac" />
          <ellipse cx="320" cy="185" rx="110" ry="28" fill="#86efac" />
          {/* Big tree left */}
          <rect x="50" y="100" width="16" height="70" fill="#92400e" />
          <circle cx="58" cy="85" r="40" fill="#15803d" />
          <circle cx="40" cy="100" r="28" fill="#16a34a" />
          <circle cx="76" cy="100" r="28" fill="#16a34a" />
          {/* Big tree right */}
          <rect x="330" y="100" width="16" height="70" fill="#92400e" />
          <circle cx="338" cy="85" r="40" fill="#15803d" />
          <circle cx="320" cy="100" r="28" fill="#16a34a" />
          <circle cx="356" cy="100" r="28" fill="#16a34a" />
          {/* Bench */}
          <rect x="170" y="155" width="80" height="8" rx="3" fill="#a16207" />
          <rect x="174" y="163" width="8" height="16" fill="#92400e" />
          <rect x="238" y="163" width="8" height="16" fill="#92400e" />
          {/* Child on bench */}
          <circle cx="200" cy="143" r="12" fill="#fde68a" />
          <rect x="190" y="155" width="20" height="20" rx="3" fill="#3b82f6" />
          {/* Running child */}
          <circle cx="290" cy="148" r="11" fill="#fca5a5" />
          <rect x="281" y="159" width="18" height="22" rx="3" fill="#ec4899" />
          <line
            x1="281"
            y1="170"
            x2="270"
            y2="185"
            stroke="#9d174d"
            strokeWidth="2.5"
          />
          <line
            x1="299"
            y1="170"
            x2="308"
            y2="185"
            stroke="#9d174d"
            strokeWidth="2.5"
          />
          {/* Kite */}
          <polygon
            points="120,50 100,80 120,110 140,80"
            fill="#f97316"
            stroke="#c2410c"
            strokeWidth="1.5"
          />
          <line
            x1="120"
            y1="110"
            x2="150"
            y2="140"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          {/* Cloud */}
          <ellipse cx="250" cy="40" rx="45" ry="18" fill="white" />
          <ellipse cx="220" cy="45" rx="30" ry="16" fill="white" />
          <ellipse cx="280" cy="45" rx="30" ry="16" fill="white" />
          {/* Sun */}
          <circle cx="360" cy="40" r="22" fill="#fbbf24" />
        </svg>
      ),
    },
  ],
  // Set 1 — Kitchen, Beach, Library
  [
    {
      title: "A Cosy Kitchen",
      hint: "Can you spot the stove, food, and the person cooking?",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          <rect width="400" height="240" fill="#fef9c3" />
          {/* Floor */}
          <rect x="0" y="190" width="400" height="50" fill="#fcd34d" />
          {/* Wall */}
          <rect x="0" y="0" width="400" height="195" fill="#fef3c7" />
          {/* Wall tiles */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
            [0, 1, 2, 3].map((j) => (
              <rect
                key={`${i}-${j}`}
                x={i * 50}
                y={j * 50}
                width="49"
                height="49"
                fill="none"
                stroke="#fde68a"
                strokeWidth="1"
              />
            )),
          )}
          {/* Counter */}
          <rect x="0" y="140" width="400" height="55" fill="#a16207" />
          <rect x="0" y="135" width="400" height="10" rx="2" fill="#d97706" />
          {/* Stove */}
          <rect x="50" y="100" width="100" height="50" rx="4" fill="#374151" />
          <circle
            cx="80"
            cy="115"
            r="10"
            fill="#6b7280"
            stroke="#9ca3af"
            strokeWidth="1.5"
          />
          <circle
            cx="120"
            cy="115"
            r="10"
            fill="#6b7280"
            stroke="#9ca3af"
            strokeWidth="1.5"
          />
          {/* Pot */}
          <rect x="68" y="95" width="45" height="30" rx="4" fill="#1e40af" />
          <rect x="56" y="100" width="10" height="6" rx="1" fill="#374151" />
          <rect x="113" y="100" width="10" height="6" rx="1" fill="#374151" />
          {/* Steam */}
          <path
            d="M80,90 Q83,80 80,70"
            stroke="#94a3b8"
            strokeWidth="2"
            fill="none"
            strokeDasharray="3 2"
          />
          <path
            d="M90,88 Q93,78 90,68"
            stroke="#94a3b8"
            strokeWidth="2"
            fill="none"
            strokeDasharray="3 2"
          />
          {/* Vegetables */}
          <circle cx="220" cy="130" r="12" fill="#22c55e" />
          <circle cx="250" cy="128" r="11" fill="#f97316" />
          <circle cx="275" cy="130" r="9" fill="#ef4444" />
          {/* Cook */}
          <circle cx="350" cy="100" r="18" fill="#fde68a" />
          <rect x="336" y="118" width="28" height="40" rx="4" fill="#dc2626" />
          {/* Chef hat */}
          <rect x="340" y="82" width="20" height="8" rx="2" fill="white" />
          <ellipse cx="350" cy="82" rx="14" ry="10" fill="white" />
          {/* Knife */}
          <rect x="158" y="130" width="4" height="40" rx="1" fill="#374151" />
          <polygon points="158,130 162,130 164,100" fill="#9ca3af" />
          {/* Window */}
          <rect
            x="280"
            y="20"
            width="80"
            height="65"
            rx="3"
            fill="#7dd3fc"
            stroke="#64748b"
            strokeWidth="2"
          />
          <line
            x1="320"
            y1="20"
            x2="320"
            y2="85"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <line
            x1="280"
            y1="52"
            x2="360"
            y2="52"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          {/* Flower in window */}
          <circle cx="295" cy="40" r="8" fill="#f9a8d4" />
          <rect x="293" y="48" width="4" height="15" fill="#4ade80" />
        </svg>
      ),
    },
    {
      title: "A Sunny Beach",
      hint: "Describe the sea, sand, people, and things you can see.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          {/* Sky */}
          <rect width="400" height="150" fill="#bfdbfe" />
          {/* Sea */}
          <rect x="0" y="130" width="400" height="60" fill="#2563eb" />
          <rect
            x="0"
            y="130"
            width="400"
            height="15"
            fill="#3b82f6"
            opacity="0.7"
          />
          {/* Waves */}
          <path
            d="M0,145 Q40,138 80,145 Q120,152 160,145 Q200,138 240,145 Q280,152 320,145 Q360,138 400,145"
            stroke="white"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          {/* Sand */}
          <rect x="0" y="175" width="400" height="65" fill="#fde68a" />
          <rect x="0" y="170" width="400" height="15" fill="#fbbf24" />
          {/* Sun */}
          <circle cx="60" cy="40" r="28" fill="#fbbf24" />
          {/* Clouds */}
          <ellipse cx="200" cy="35" rx="50" ry="18" fill="white" />
          <ellipse cx="170" cy="42" rx="35" ry="15" fill="white" />
          <ellipse cx="235" cy="42" rx="35" ry="15" fill="white" />
          {/* Umbrella */}
          <line
            x1="180"
            y1="175"
            x2="180"
            y2="220"
            stroke="#92400e"
            strokeWidth="3"
          />
          <path
            d="M130,175 Q180,140 230,175"
            fill="#ef4444"
            stroke="#b91c1c"
            strokeWidth="1.5"
          />
          <path
            d="M130,175 Q155,165 180,175"
            fill="#fbbf24"
            stroke="#b45309"
            strokeWidth="1"
          />
          <path
            d="M180,175 Q205,165 230,175"
            fill="#3b82f6"
            stroke="#1d4ed8"
            strokeWidth="1"
          />
          {/* Person sitting */}
          <circle cx="155" cy="182" r="12" fill="#fde68a" />
          <rect x="144" y="194" width="22" height="18" rx="3" fill="#fb923c" />
          {/* Person standing */}
          <circle cx="290" cy="170" r="13" fill="#fca5a5" />
          <rect x="279" y="183" width="22" height="25" rx="3" fill="#60a5fa" />
          {/* Shells */}
          <ellipse cx="50" cy="210" rx="10" ry="6" fill="#fca5a5" />
          <ellipse cx="100" cy="215" rx="8" ry="5" fill="#c084fc" />
          <ellipse cx="350" cy="208" rx="9" ry="5" fill="#fdba74" />
          {/* Boat on sea */}
          <polygon points="310,140 340,140 330,150 320,150" fill="#dc2626" />
          <rect x="321" y="120" width="3" height="20" fill="#374151" />
          <polygon points="324,120 340,135 324,135" fill="white" />
        </svg>
      ),
    },
    {
      title: "A Quiet Library",
      hint: "Look at the books, shelves, and people reading.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          <rect width="400" height="240" fill="#fef3c7" />
          {/* Floor */}
          <rect x="0" y="195" width="400" height="45" fill="#d97706" />
          {/* Walls */}
          <rect x="0" y="0" width="400" height="200" fill="#fef9c3" />
          {/* Bookshelf left */}
          <rect x="10" y="20" width="100" height="160" rx="2" fill="#92400e" />
          {[0, 1, 2, 3].map((row) =>
            [
              { c: "#ef4444" },
              { c: "#3b82f6" },
              { c: "#22c55e" },
              { c: "#f59e0b" },
              { c: "#8b5cf6" },
            ].map((book, col) => (
              <rect
                key={`${row}-${col}-${book.c}`}
                x={15 + col * 18}
                y={25 + row * 38}
                width="15"
                height="32"
                rx="1"
                fill={book.c}
              />
            )),
          )}
          {/* Shelf dividers */}
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x="10"
              y={22 + i * 38}
              width="100"
              height="4"
              fill="#78350f"
            />
          ))}
          {/* Bookshelf right */}
          <rect x="290" y="20" width="100" height="160" rx="2" fill="#92400e" />
          {[0, 1, 2, 3].map((row) =>
            [
              { c: "#f43f5e" },
              { c: "#a78bfa" },
              { c: "#34d399" },
              { c: "#fb923c" },
              { c: "#60a5fa" },
            ].map((book, col) => (
              <rect
                key={`${row}-${col}-${book.c}`}
                x={295 + col * 18}
                y={25 + row * 38}
                width="15"
                height="32"
                rx="1"
                fill={book.c}
              />
            )),
          )}
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x="290"
              y={22 + i * 38}
              width="100"
              height="4"
              fill="#78350f"
            />
          ))}
          {/* Table */}
          <rect x="130" y="150" width="140" height="8" rx="2" fill="#a16207" />
          <rect x="138" y="158" width="8" height="35" fill="#92400e" />
          <rect x="254" y="158" width="8" height="35" fill="#92400e" />
          {/* Reader 1 */}
          <circle cx="170" cy="130" r="16" fill="#fde68a" />
          <rect x="158" y="146" width="24" height="30" rx="3" fill="#3b82f6" />
          {/* Open book */}
          <rect
            x="148"
            y="144"
            width="50"
            height="32"
            rx="3"
            fill="white"
            stroke="#d1d5db"
            strokeWidth="1"
          />
          <line
            x1="173"
            y1="144"
            x2="173"
            y2="176"
            stroke="#9ca3af"
            strokeWidth="1"
          />
          {/* Reader 2 */}
          <circle cx="240" cy="130" r="16" fill="#fca5a5" />
          <rect x="228" y="146" width="24" height="30" rx="3" fill="#ec4899" />
          {/* Open book 2 */}
          <rect
            x="218"
            y="144"
            width="50"
            height="32"
            rx="3"
            fill="white"
            stroke="#d1d5db"
            strokeWidth="1"
          />
          <line
            x1="243"
            y1="144"
            x2="243"
            y2="176"
            stroke="#9ca3af"
            strokeWidth="1"
          />
          {/* Lamp */}
          <rect x="195" y="105" width="6" height="45" fill="#374151" />
          <polygon points="185,100 215,100 210,105 190,105" fill="#fbbf24" />
          <circle cx="198" cy="100" r="5" fill="#fef08a" />
        </svg>
      ),
    },
  ],
  // Set 2 — Birthday Party, Sports Field, Restaurant
  [
    {
      title: "A Birthday Party",
      hint: "Describe the cake, balloons, decorations and the celebration.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          <rect width="400" height="240" fill="#fce7f3" />
          {/* Floor */}
          <rect x="0" y="195" width="400" height="45" fill="#f9a8d4" />
          {/* Bunting */}
          <path
            d="M0,10 Q200,30 400,10"
            stroke="#64748b"
            strokeWidth="1.5"
            fill="none"
          />
          {[
            { x: 30, c: "#ef4444" },
            { x: 70, c: "#f97316" },
            { x: 110, c: "#eab308" },
            { x: 150, c: "#22c55e" },
            { x: 190, c: "#3b82f6" },
            { x: 230, c: "#8b5cf6" },
            { x: 270, c: "#ec4899" },
            { x: 310, c: "#ef4444" },
            { x: 350, c: "#f97316" },
          ].map((b) => (
            <polygon
              key={b.x}
              points={`${b.x - 10},10 ${b.x + 10},10 ${b.x},30`}
              fill={b.c}
            />
          ))}
          {/* Table */}
          <rect x="120" y="155" width="160" height="10" rx="3" fill="#a16207" />
          <rect x="128" y="165" width="8" height="30" fill="#92400e" />
          <rect x="264" y="165" width="8" height="30" fill="#92400e" />
          {/* Cake */}
          <rect x="175" y="115" width="50" height="40" rx="4" fill="#fde68a" />
          <rect x="175" y="112" width="50" height="10" rx="2" fill="#f9a8d4" />
          {/* Candles */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect
                x={181 + i * 8}
                y={97}
                width={4}
                height={16}
                rx={1}
                fill={
                  ["#ef4444", "#3b82f6", "#22c55e", "#f97316", "#8b5cf6"][i]
                }
              />
              <ellipse
                cx={183 + i * 8}
                cy={96}
                rx={3}
                ry={5}
                fill="#fbbf24"
                opacity="0.9"
              />
            </g>
          ))}
          {/* Balloons */}
          {[
            { x: 60, y: 60, c: "#ef4444" },
            { x: 90, y: 40, c: "#3b82f6" },
            { x: 315, y: 55, c: "#22c55e" },
            { x: 345, y: 35, c: "#f97316" },
            { x: 200, y: 50, c: "#ec4899" },
          ].map((b) => (
            <g key={b.x}>
              <circle cx={b.x} cy={b.y} r={18} fill={b.c} opacity="0.9" />
              <line
                x1={b.x}
                y1={b.y + 18}
                x2={b.x + 5}
                y2={b.y + 50}
                stroke="#64748b"
                strokeWidth="1.5"
              />
            </g>
          ))}
          {/* Children */}
          <circle cx="90" cy="160" r="14" fill="#fde68a" />
          <rect x="78" y="174" width="24" height="28" rx="3" fill="#3b82f6" />
          <circle cx="310" cy="160" r="14" fill="#fca5a5" />
          <rect x="298" y="174" width="24" height="28" rx="3" fill="#ec4899" />
          {/* Gift boxes */}
          <rect x="40" y="170" width="35" height="28" rx="2" fill="#fbbf24" />
          <rect x="40" y="160" width="35" height="12" rx="2" fill="#f59e0b" />
          <line
            x1="57"
            y1="160"
            x2="57"
            y2="198"
            stroke="#ef4444"
            strokeWidth="2"
          />
          <path
            d="M57,160 Q50,150 42,154"
            stroke="#ef4444"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M57,160 Q64,150 72,154"
            stroke="#ef4444"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      ),
    },
    {
      title: "A Sports Field",
      hint: "Describe the players, game, and what is happening.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          {/* Sky */}
          <rect width="400" height="145" fill="#bfdbfe" />
          {/* Grass */}
          <rect x="0" y="145" width="400" height="95" fill="#16a34a" />
          {/* Field markings */}
          <rect
            x="0"
            y="145"
            width="400"
            height="95"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <line
            x1="200"
            y1="145"
            x2="200"
            y2="240"
            stroke="white"
            strokeWidth="2"
          />
          <circle
            cx="200"
            cy="192"
            r="30"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <circle cx="200" cy="192" r="5" fill="white" />
          {/* Goal left */}
          <rect x="5" y="165" width="5" height="40" fill="white" />
          <rect x="30" y="165" width="5" height="40" fill="white" />
          <rect x="5" y="165" width="30" height="5" fill="white" />
          {/* Goal right */}
          <rect x="360" y="165" width="5" height="40" fill="white" />
          <rect x="385" y="165" width="5" height="40" fill="white" />
          <rect x="360" y="165" width="30" height="5" fill="white" />
          {/* Ball */}
          <circle
            cx="200"
            cy="192"
            r="8"
            fill="white"
            stroke="#374151"
            strokeWidth="1"
          />
          {/* Player 1 red */}
          <circle cx="150" cy="170" r="12" fill="#fde68a" />
          <rect x="140" y="182" width="20" height="24" rx="3" fill="#ef4444" />
          <line
            x1="140"
            y1="195"
            x2="130"
            y2="215"
            stroke="#b91c1c"
            strokeWidth="2.5"
          />
          <line
            x1="160"
            y1="195"
            x2="168"
            y2="215"
            stroke="#b91c1c"
            strokeWidth="2.5"
          />
          {/* Player 2 blue */}
          <circle cx="260" cy="170" r="12" fill="#fca5a5" />
          <rect x="250" y="182" width="20" height="24" rx="3" fill="#3b82f6" />
          <line
            x1="250"
            y1="195"
            x2="242"
            y2="215"
            stroke="#1d4ed8"
            strokeWidth="2.5"
          />
          <line
            x1="270"
            y1="195"
            x2="278"
            y2="215"
            stroke="#1d4ed8"
            strokeWidth="2.5"
          />
          {/* Player 3 */}
          <circle cx="100" cy="185" r="11" fill="#fde68a" />
          <rect x="91" y="196" width="18" height="22" rx="3" fill="#ef4444" />
          {/* Player 4 */}
          <circle cx="300" cy="185" r="11" fill="#fca5a5" />
          <rect x="291" y="196" width="18" height="22" rx="3" fill="#3b82f6" />
          {/* Sun and clouds */}
          <circle cx="350" cy="40" r="22" fill="#fbbf24" />
          <ellipse cx="150" cy="35" rx="45" ry="16" fill="white" />
          <ellipse cx="120" cy="42" rx="30" ry="13" fill="white" />
          <ellipse cx="180" cy="42" rx="30" ry="13" fill="white" />
        </svg>
      ),
    },
    {
      title: "A Busy Restaurant",
      hint: "Describe the tables, food, people, and what they are doing.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          <rect width="400" height="240" fill="#fff7ed" />
          {/* Floor */}
          <rect x="0" y="195" width="400" height="45" fill="#d97706" />
          {/* Wall */}
          <rect x="0" y="0" width="400" height="200" fill="#fef3c7" />
          {/* Window */}
          <rect
            x="30"
            y="20"
            width="70"
            height="55"
            rx="3"
            fill="#7dd3fc"
            stroke="#64748b"
            strokeWidth="2"
          />
          <line
            x1="65"
            y1="20"
            x2="65"
            y2="75"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <line
            x1="30"
            y1="47"
            x2="100"
            y2="47"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          {/* Menu board */}
          <rect x="280" y="10" width="100" height="70" rx="3" fill="#1e3a5f" />
          <text
            x="330"
            y="32"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="10"
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            MENU
          </text>
          <text
            x="330"
            y="48"
            textAnchor="middle"
            fill="white"
            fontSize="8"
            fontFamily="sans-serif"
          >
            Pizza $8
          </text>
          <text
            x="330"
            y="60"
            textAnchor="middle"
            fill="white"
            fontSize="8"
            fontFamily="sans-serif"
          >
            Pasta $7
          </text>
          <text
            x="330"
            y="72"
            textAnchor="middle"
            fill="white"
            fontSize="8"
            fontFamily="sans-serif"
          >
            Soup $5
          </text>
          {/* Table 1 left */}
          <rect x="30" y="155" width="100" height="8" rx="3" fill="#a16207" />
          <rect x="38" y="163" width="8" height="30" fill="#92400e" />
          <rect x="114" y="163" width="8" height="30" fill="#92400e" />
          {/* Food on table 1 */}
          <circle
            cx="60"
            cy="148"
            r="10"
            fill="#fde68a"
            stroke="#d97706"
            strokeWidth="1"
          />
          <circle
            cx="80"
            cy="148"
            r="8"
            fill="#f9a8d4"
            stroke="#db2777"
            strokeWidth="1"
          />
          <rect cx="95" y="140" width="20" height="10" rx="2" fill="#fee2e2" />
          <rect x="95" y="140" width="20" height="15" rx="2" fill="#fca5a5" />
          {/* Diner 1 */}
          <circle cx="50" cy="135" r="13" fill="#fde68a" />
          <rect x="39" y="148" width="22" height="20" rx="3" fill="#3b82f6" />
          {/* Diner 2 */}
          <circle cx="100" cy="135" r="13" fill="#fca5a5" />
          <rect x="89" y="148" width="22" height="20" rx="3" fill="#ec4899" />
          {/* Table 2 right */}
          <rect x="230" y="155" width="100" height="8" rx="3" fill="#a16207" />
          <rect x="238" y="163" width="8" height="30" fill="#92400e" />
          <rect x="314" y="163" width="8" height="30" fill="#92400e" />
          {/* Food on table 2 */}
          <circle
            cx="260"
            cy="148"
            r="11"
            fill="#fde68a"
            stroke="#d97706"
            strokeWidth="1"
          />
          <circle
            cx="290"
            cy="148"
            r="9"
            fill="#86efac"
            stroke="#16a34a"
            strokeWidth="1"
          />
          {/* Diner 3 */}
          <circle cx="250" cy="135" r="13" fill="#fde68a" />
          <rect x="239" y="148" width="22" height="20" rx="3" fill="#7c3aed" />
          {/* Waiter */}
          <circle cx="170" cy="130" r="14" fill="#fde68a" />
          <rect
            x="159"
            y="144"
            width="22"
            height="34"
            rx="3"
            fill="white"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          {/* Tray */}
          <ellipse cx="185" cy="128" rx="20" ry="6" fill="#d97706" />
          <circle cx="180" cy="124" r="6" fill="#fde68a" />
          <circle cx="192" cy="124" r="6" fill="#f9a8d4" />
        </svg>
      ),
    },
  ],
  // Set 3 — Bus Stop, Hospital, Zoo
  [
    {
      title: "A Bus Stop",
      hint: "Describe the people waiting, the bus, and surroundings.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          {/* Sky */}
          <rect width="400" height="185" fill="#e0f2fe" />
          {/* Ground */}
          <rect x="0" y="185" width="400" height="55" fill="#9ca3af" />
          {/* Road line */}
          <line
            x1="0"
            y1="210"
            x2="400"
            y2="210"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="30 15"
          />
          {/* Pavement */}
          <rect x="0" y="185" width="400" height="15" fill="#6b7280" />
          {/* Bus */}
          <rect
            x="200"
            y="120"
            width="185"
            height="70"
            rx="8"
            fill="#fbbf24"
            stroke="#d97706"
            strokeWidth="2"
          />
          {/* Bus windows */}
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={212 + i * 40}
              y={130}
              width="28"
              height="20"
              rx="3"
              fill="#7dd3fc"
            />
          ))}
          {/* Bus wheels */}
          <circle cx="240" cy="193" r="12" fill="#374151" />
          <circle cx="240" cy="193" r="6" fill="#9ca3af" />
          <circle cx="355" cy="193" r="12" fill="#374151" />
          <circle cx="355" cy="193" r="6" fill="#9ca3af" />
          {/* Bus number */}
          <rect x="210" y="122" width="28" height="12" rx="2" fill="#ef4444" />
          <text
            x="224"
            y="132"
            textAnchor="middle"
            fill="white"
            fontSize="9"
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            42
          </text>
          {/* Bus stop sign */}
          <rect x="70" y="80" width="8" height="110" fill="#374151" />
          <rect x="50" y="75" width="50" height="30" rx="4" fill="#3b82f6" />
          <text
            x="75"
            y="94"
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            BUS
          </text>
          {/* Shelter */}
          <rect x="10" y="110" width="140" height="5" rx="2" fill="#374151" />
          <rect x="10" y="110" width="5" height="75" fill="#374151" />
          <rect x="145" y="110" width="5" height="75" fill="#374151" />
          <rect
            x="15"
            y="115"
            width="130"
            height="70"
            fill="#bfdbfe"
            opacity="0.4"
          />
          {/* Waiting people */}
          <circle cx="50" cy="148" r="13" fill="#fde68a" />
          <rect x="39" y="161" width="22" height="28" rx="3" fill="#3b82f6" />
          <circle cx="90" cy="145" r="12" fill="#fca5a5" />
          <rect x="80" y="157" width="20" height="26" rx="3" fill="#ec4899" />
          <circle cx="125" cy="150" r="11" fill="#fde68a" />
          <rect x="115" y="161" width="20" height="24" rx="3" fill="#16a34a" />
          {/* Cloud */}
          <ellipse cx="280" cy="40" rx="50" ry="18" fill="white" />
          <ellipse cx="250" cy="47" rx="35" ry="15" fill="white" />
          <ellipse cx="315" cy="47" rx="35" ry="15" fill="white" />
          {/* Sun */}
          <circle cx="50" cy="40" r="22" fill="#fbbf24" />
        </svg>
      ),
    },
    {
      title: "A Hospital Reception",
      hint: "Describe the doctor, nurse, patients, and the environment.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          <rect width="400" height="240" fill="#f0fdf4" />
          {/* Floor */}
          <rect x="0" y="195" width="400" height="45" fill="#bbf7d0" />
          {/* Floor tiles */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
            [0, 1, 2, 3].map((j) => (
              <rect
                key={`${i}-${j}`}
                x={i * 50}
                y={195 + j * 15}
                width="49"
                height="14"
                fill="none"
                stroke="#86efac"
                strokeWidth="0.5"
              />
            )),
          )}
          {/* Reception desk */}
          <rect
            x="120"
            y="130"
            width="160"
            height="65"
            rx="4"
            fill="#d1fae5"
            stroke="#6ee7b7"
            strokeWidth="1.5"
          />
          <rect x="120" y="125" width="160" height="12" rx="2" fill="#34d399" />
          <text
            x="200"
            y="135"
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            RECEPTION
          </text>
          {/* Computer */}
          <rect x="165" y="140" width="50" height="35" rx="3" fill="#374151" />
          <rect x="168" y="143" width="44" height="28" rx="2" fill="#7dd3fc" />
          {/* Nurse */}
          <circle cx="200" cy="108" r="14" fill="#fde68a" />
          <rect
            x="188"
            y="122"
            width="24"
            height="32"
            rx="3"
            fill="white"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          {/* Red cross on nurse */}
          <rect x="198" y="126" width="4" height="12" fill="#ef4444" />
          <rect x="194" y="130" width="12" height="4" fill="#ef4444" />
          {/* Patient 1 */}
          <circle cx="60" cy="150" r="13" fill="#fde68a" />
          <rect x="49" y="163" width="22" height="30" rx="3" fill="#60a5fa" />
          {/* Patient 2 */}
          <circle cx="330" cy="145" r="13" fill="#fca5a5" />
          <rect x="319" y="158" width="22" height="30" rx="3" fill="#f9a8d4" />
          {/* Doctor */}
          <circle cx="330" cy="100" r="15" fill="#fde68a" />
          <rect
            x="318"
            y="115"
            width="24"
            height="35"
            rx="3"
            fill="white"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          {/* Stethoscope */}
          <path
            d="M330,120 Q345,130 340,145"
            stroke="#374151"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="340" cy="146" r="4" fill="#374151" />
          {/* Red cross sign */}
          <rect
            x="10"
            y="20"
            width="60"
            height="60"
            rx="4"
            fill="white"
            stroke="#ef4444"
            strokeWidth="2"
          />
          <rect x="27" y="30" width="10" height="40" fill="#ef4444" />
          <rect x="17" y="40" width="30" height="10" fill="#ef4444" />
          {/* Plant */}
          <rect x="360" y="165" width="12" height="30" rx="2" fill="#92400e" />
          <circle cx="366" cy="148" r="22" fill="#4ade80" />
          <circle cx="350" cy="160" r="15" fill="#22c55e" />
          <circle cx="382" cy="160" r="15" fill="#22c55e" />
        </svg>
      ),
    },
    {
      title: "A Fun Zoo",
      hint: "Describe the animals, visitors, and what makes it exciting.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          {/* Sky */}
          <rect width="400" height="175" fill="#bfdbfe" />
          {/* Ground */}
          <rect x="0" y="175" width="400" height="65" fill="#4ade80" />
          {/* Path */}
          <ellipse cx="200" cy="210" rx="150" ry="20" fill="#fde68a" />
          {/* Cage 1 - Elephant area */}
          <rect
            x="10"
            y="80"
            width="120"
            height="100"
            rx="3"
            fill="#fef9c3"
            stroke="#92400e"
            strokeWidth="2"
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={20 + i * 22}
              y1={80}
              x2={20 + i * 22}
              y2={180}
              stroke="#92400e"
              strokeWidth="1.5"
            />
          ))}
          {/* Elephant */}
          <ellipse cx="70" cy="155" rx="30" ry="22" fill="#94a3b8" />
          <ellipse cx="70" cy="132" rx="20" ry="18" fill="#94a3b8" />
          <path
            d="M60,148 Q45,165 50,178"
            stroke="#94a3b8"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="60" cy="127" rx="6" ry="9" fill="#94a3b8" />
          <ellipse cx="80" cy="127" rx="6" ry="9" fill="#94a3b8" />
          <circle cx="65" cy="130" r="3" fill="#1e293b" />
          {/* Cage 2 - Giraffe area */}
          <rect
            x="145"
            y="50"
            width="110"
            height="130"
            rx="3"
            fill="#fef9c3"
            stroke="#92400e"
            strokeWidth="2"
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={155 + i * 22}
              y1={50}
              x2={155 + i * 22}
              y2={180}
              stroke="#92400e"
              strokeWidth="1.5"
            />
          ))}
          {/* Giraffe */}
          <rect x="192" y="55" width="16" height="55" rx="4" fill="#fbbf24" />
          <ellipse cx="200" cy="58" rx="14" ry="12" fill="#fbbf24" />
          <rect x="188" y="108" width="24" height="65" rx="4" fill="#fbbf24" />
          {/* Giraffe spots */}
          {[
            { x: 193, y: 65 },
            { x: 205, y: 70 },
            { x: 196, y: 82 },
            { x: 208, y: 88 },
            { x: 193, y: 100 },
            { x: 205, y: 107 },
            { x: 193, y: 120 },
            { x: 207, y: 130 },
          ].map((s) => (
            <circle
              key={`${s.x}-${s.y}`}
              cx={s.x}
              cy={s.y}
              r="5"
              fill="#92400e"
              opacity="0.6"
            />
          ))}
          <circle cx="193" cy="53" r="4" fill="#fbbf24" />
          <circle cx="207" cy="53" r="4" fill="#fbbf24" />
          <circle cx="196" cy="52" r="3" fill="#1e293b" />
          {/* Cage 3 - Monkey area */}
          <rect
            x="270"
            y="80"
            width="120"
            height="100"
            rx="3"
            fill="#fef9c3"
            stroke="#92400e"
            strokeWidth="2"
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={280 + i * 22}
              y1={80}
              x2={280 + i * 22}
              y2={180}
              stroke="#92400e"
              strokeWidth="1.5"
            />
          ))}
          {/* Tree branch */}
          <rect x="295" y="90" width="70" height="8" rx="3" fill="#92400e" />
          <rect x="320" y="90" width="8" height="40" rx="3" fill="#92400e" />
          {/* Monkey */}
          <circle cx="330" cy="125" r="14" fill="#d97706" />
          <circle cx="330" cy="110" r="12" fill="#d97706" />
          <ellipse cx="325" cy="112" rx="5" ry="6" fill="#fbbf24" />
          <ellipse cx="335" cy="112" rx="5" ry="6" fill="#fbbf24" />
          <circle cx="327" cy="109" r="2.5" fill="#1e293b" />
          <circle cx="333" cy="109" r="2.5" fill="#1e293b" />
          <path
            d="M330,85 Q315,78 308,90"
            stroke="#d97706"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Visitors */}
          <circle cx="90" cy="185" r="10" fill="#fde68a" />
          <rect x="82" y="195" width="16" height="20" rx="2" fill="#3b82f6" />
          <circle cx="200" cy="188" r="10" fill="#fca5a5" />
          <rect x="192" y="198" width="16" height="20" rx="2" fill="#ec4899" />
          {/* Zoo entrance sign */}
          <rect x="160" y="10" width="80" height="30" rx="4" fill="#16a34a" />
          <text
            x="200"
            y="30"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            ZOO
          </text>
        </svg>
      ),
    },
  ],
  // Set 4 — Farm, Airport, Music Concert
  [
    {
      title: "A Busy Farm",
      hint: "Describe the animals, crops, farmer, and the farm setting.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          {/* Sky */}
          <rect width="400" height="155" fill="#bfdbfe" />
          {/* Ground */}
          <rect x="0" y="155" width="400" height="85" fill="#86efac" />
          {/* Soil patches */}
          <rect x="200" y="155" width="200" height="85" fill="#92400e" />
          {/* Crops */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i}>
              <rect
                x={205 + i * 22}
                y={155}
                width="4"
                height="40"
                fill="#16a34a"
              />
              <circle cx={207 + i * 22} cy={152} r="6" fill="#4ade80" />
              <ellipse
                cx={207 + i * 22}
                cy={148}
                rx="8"
                ry="4"
                fill="#22c55e"
              />
            </g>
          ))}
          {/* Barn */}
          <rect x="20" y="80" width="100" height="80" fill="#dc2626" />
          <polygon points="10,80 130,80 70,40" fill="#b91c1c" />
          <rect x="55" y="120" width="30" height="40" rx="2" fill="#92400e" />
          <rect
            x="15"
            y="90"
            width="28"
            height="22"
            rx="2"
            fill="#7dd3fc"
            stroke="#64748b"
            strokeWidth="1"
          />
          <rect
            x="77"
            y="90"
            width="28"
            height="22"
            rx="2"
            fill="#7dd3fc"
            stroke="#64748b"
            strokeWidth="1"
          />
          {/* Fence */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <rect
                x={130 + i * 28}
                y={155}
                width="5"
                height="30"
                rx="1"
                fill="#a16207"
              />
              <rect
                x={130 + i * 28}
                y={163}
                width="28"
                height="4"
                rx="1"
                fill="#a16207"
              />
              <rect
                x={130 + i * 28}
                y={175}
                width="28"
                height="4"
                rx="1"
                fill="#a16207"
              />
            </g>
          ))}
          {/* Cow */}
          <ellipse
            cx="160"
            cy="175"
            rx="25"
            ry="15"
            fill="white"
            stroke="#9ca3af"
            strokeWidth="1"
          />
          <ellipse
            cx="145"
            cy="165"
            rx="14"
            ry="12"
            fill="white"
            stroke="#9ca3af"
            strokeWidth="1"
          />
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={147 + (i % 2) * 16}
              y={190}
              width="6"
              height="18"
              rx="2"
              fill="#9ca3af"
            />
          ))}
          <circle cx="140" cy="162" r="3" fill="#1e293b" />
          {/* Farmer */}
          <circle cx="340" cy="145" r="14" fill="#fde68a" />
          <rect x="328" y="159" width="24" height="30" rx="3" fill="#60a5fa" />
          {/* Farmer hat */}
          <rect x="325" y="131" width="30" height="8" rx="2" fill="#92400e" />
          <rect x="330" y="120" width="20" height="12" rx="2" fill="#a16207" />
          {/* Tractor outline */}
          <rect
            x="240"
            y="140"
            width="60"
            height="35"
            rx="4"
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="1.5"
          />
          <rect x="255" y="128" width="35" height="20" rx="3" fill="#fbbf24" />
          <circle cx="255" cy="180" r="14" fill="#374151" />
          <circle cx="255" cy="180" r="7" fill="#9ca3af" />
          <circle cx="290" cy="178" r="10" fill="#374151" />
          <circle cx="290" cy="178" r="5" fill="#9ca3af" />
          {/* Sun */}
          <circle cx="360" cy="35" r="22" fill="#fbbf24" />
          {/* Clouds */}
          <ellipse cx="160" cy="35" rx="40" ry="15" fill="white" />
          <ellipse cx="135" cy="42" rx="28" ry="13" fill="white" />
          <ellipse cx="190" cy="42" rx="28" ry="13" fill="white" />
        </svg>
      ),
    },
    {
      title: "An Airport Terminal",
      hint: "Describe the travellers, planes, and airport activities.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          <rect width="400" height="240" fill="#f0f9ff" />
          {/* Ceiling */}
          <rect x="0" y="0" width="400" height="30" fill="#e0f2fe" />
          {/* Floor */}
          <rect x="0" y="205" width="400" height="35" fill="#cbd5e1" />
          {/* Floor markings */}
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={i * 100}
              y={205}
              width="99"
              height="35"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1"
            />
          ))}
          {/* Large windows */}
          <rect
            x="10"
            y="35"
            width="180"
            height="100"
            rx="4"
            fill="#bfdbfe"
            stroke="#64748b"
            strokeWidth="2"
          />
          <line
            x1="100"
            y1="35"
            x2="100"
            y2="135"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <line
            x1="10"
            y1="85"
            x2="190"
            y2="85"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          {/* Airplane through window */}
          <g transform="translate(20, 50)">
            <rect
              x="10"
              y="20"
              width="80"
              height="18"
              rx="8"
              fill="white"
              stroke="#94a3b8"
              strokeWidth="1"
            />
            <polygon
              points="90,29 110,25 110,33"
              fill="white"
              stroke="#94a3b8"
              strokeWidth="1"
            />
            <polygon points="30,38 50,38 48,46 28,46" fill="#93c5fd" />
            <polygon points="55,38 75,38 73,46 53,46" fill="#93c5fd" />
            {/* Windows on plane */}
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={25 + i * 17} cy={28} r={4} fill="#7dd3fc" />
            ))}
          </g>
          {/* Departure board */}
          <rect x="210" y="35" width="180" height="100" rx="4" fill="#1e3a5f" />
          <text
            x="300"
            y="56"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="11"
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            DEPARTURES
          </text>
          {[
            {
              f: "FL101",
              d: "Mumbai",
              t: "08:30",
              s: "ON TIME",
              sc: "#4ade80",
            },
            {
              f: "FL204",
              d: "Delhi",
              t: "09:15",
              s: "BOARDING",
              sc: "#fbbf24",
            },
            { f: "FL317", d: "Dubai", t: "10:00", s: "DELAYED", sc: "#f87171" },
          ].map((row, i) => (
            <g key={row.f}>
              <text
                x="220"
                y={73 + i * 25}
                fill="white"
                fontSize="8"
                fontFamily="monospace"
              >
                {row.f}
              </text>
              <text
                x="258"
                y={73 + i * 25}
                fill="white"
                fontSize="8"
                fontFamily="sans-serif"
              >
                {row.d}
              </text>
              <text
                x="305"
                y={73 + i * 25}
                fill="white"
                fontSize="8"
                fontFamily="sans-serif"
              >
                {row.t}
              </text>
              <text
                x="335"
                y={73 + i * 25}
                fill={row.sc}
                fontSize="8"
                fontFamily="sans-serif"
              >
                {row.s}
              </text>
            </g>
          ))}
          {/* Bench with travellers */}
          <rect x="80" y="165" width="240" height="8" rx="3" fill="#64748b" />
          <rect x="85" y="173" width="8" height="25" fill="#475569" />
          <rect x="307" y="173" width="8" height="25" fill="#475569" />
          {/* Traveller 1 */}
          <circle cx="120" cy="150" r="12" fill="#fde68a" />
          <rect x="110" y="162" width="20" height="25" rx="3" fill="#3b82f6" />
          {/* Suitcase */}
          <rect x="96" y="168" width="18" height="22" rx="2" fill="#ef4444" />
          <rect x="99" y="165" width="12" height="4" rx="1" fill="#374151" />
          {/* Traveller 2 */}
          <circle cx="200" cy="150" r="12" fill="#fca5a5" />
          <rect x="190" y="162" width="20" height="25" rx="3" fill="#ec4899" />
          {/* Traveller 3 */}
          <circle cx="280" cy="148" r="12" fill="#fde68a" />
          <rect x="270" y="160" width="20" height="25" rx="3" fill="#7c3aed" />
          {/* Suitcase 3 */}
          <rect x="295" y="170" width="18" height="22" rx="2" fill="#22c55e" />
          <rect x="298" y="167" width="12" height="4" rx="1" fill="#374151" />
        </svg>
      ),
    },
    {
      title: "A Music Concert",
      hint: "Describe the performers, audience, stage, and the atmosphere.",
      svg: (
        <svg
          viewBox="0 0 400 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Scene illustration"
        >
          <rect width="400" height="240" fill="#1e1b4b" />
          {/* Stage */}
          <rect x="50" y="80" width="300" height="120" rx="4" fill="#312e81" />
          <rect x="30" y="195" width="340" height="15" rx="2" fill="#4338ca" />
          {/* Stage lights */}
          {[
            { x: 80, c: "#f97316" },
            { x: 140, c: "#22d3ee" },
            { x: 200, c: "#f9a8d4" },
            { x: 260, c: "#a78bfa" },
            { x: 320, c: "#34d399" },
          ].map((l) => (
            <g key={l.x}>
              <polygon
                points={`${l.x - 15},80 ${l.x + 15},80 ${l.x},160`}
                fill={l.c}
                opacity="0.2"
              />
              <rect
                x={l.x - 8}
                y={65}
                width={16}
                height={18}
                rx={3}
                fill={l.c}
                opacity="0.9"
              />
            </g>
          ))}
          {/* Performer 1 - guitarist */}
          <circle cx="160" cy="125" r="15" fill="#fde68a" />
          <rect x="148" y="140" width="24" height="35" rx="3" fill="#ef4444" />
          {/* Guitar */}
          <rect x="170" y="135" width="6" height="35" rx="2" fill="#92400e" />
          <ellipse cx="173" cy="165" rx="10" ry="13" fill="#d97706" />
          <line
            x1="164"
            y1="145"
            x2="182"
            y2="145"
            stroke="#374151"
            strokeWidth="1"
          />
          <line
            x1="163"
            y1="150"
            x2="183"
            y2="150"
            stroke="#374151"
            strokeWidth="1"
          />
          <line
            x1="163"
            y1="155"
            x2="183"
            y2="155"
            stroke="#374151"
            strokeWidth="1"
          />
          {/* Performer 2 - singer */}
          <circle cx="240" cy="118" r="15" fill="#fca5a5" />
          <rect x="228" y="133" width="24" height="35" rx="3" fill="#8b5cf6" />
          {/* Mic */}
          <rect x="250" y="108" width="5" height="18" rx="1" fill="#374151" />
          <circle cx="252" cy="107" r="6" fill="#374151" />
          {/* Speaker boxes */}
          <rect x="55" y="110" width="40" height="60" rx="3" fill="#1e293b" />
          <circle cx="75" cy="125" r="12" fill="#374151" />
          <circle cx="75" cy="145" r="8" fill="#374151" />
          <circle cx="75" cy="160" r="5" fill="#374151" />
          <rect x="305" y="110" width="40" height="60" rx="3" fill="#1e293b" />
          <circle cx="325" cy="125" r="12" fill="#374151" />
          <circle cx="325" cy="145" r="8" fill="#374151" />
          <circle cx="325" cy="160" r="5" fill="#374151" />
          {/* Audience */}
          {[
            { x: 70, y: 220 },
            { x: 100, y: 215 },
            { x: 130, y: 220 },
            { x: 160, y: 218 },
            { x: 190, y: 215 },
            { x: 220, y: 220 },
            { x: 250, y: 218 },
            { x: 280, y: 215 },
            { x: 310, y: 220 },
            { x: 340, y: 218 },
          ].map((p, i) => (
            <g key={p.x}>
              <circle
                cx={p.x}
                cy={p.y - 18}
                r={8}
                fill={
                  [
                    "#fde68a",
                    "#fca5a5",
                    "#fde68a",
                    "#fca5a5",
                    "#fde68a",
                    "#fca5a5",
                    "#fde68a",
                    "#fca5a5",
                    "#fde68a",
                    "#fca5a5",
                  ][i]
                }
              />
              <rect
                x={p.x - 7}
                y={p.y - 10}
                width={14}
                height={18}
                rx={2}
                fill={
                  [
                    "#3b82f6",
                    "#ec4899",
                    "#22c55e",
                    "#f97316",
                    "#8b5cf6",
                    "#ef4444",
                    "#06b6d4",
                    "#a16207",
                    "#7c3aed",
                    "#16a34a",
                  ][i]
                }
              />
            </g>
          ))}
          {/* Stars / confetti */}
          {[
            { x: 100, y: 20, c: "#fbbf24" },
            { x: 180, y: 15, c: "#f9a8d4" },
            { x: 260, y: 22, c: "#a78bfa" },
            { x: 330, y: 18, c: "#34d399" },
            { x: 60, y: 40, c: "#fb923c" },
          ].map((s) => (
            <circle key={s.x} cx={s.x} cy={s.y} r={4} fill={s.c} />
          ))}
        </svg>
      ),
    },
  ],
];

const ADJECTIVES = [
  "big",
  "small",
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "old",
  "young",
  "happy",
  "tall",
  "short",
  "long",
  "wide",
  "bright",
  "dark",
  "beautiful",
  "nice",
  "loud",
  "quiet",
  "fast",
  "slow",
  "warm",
  "cold",
  "hot",
  "colourful",
  "colorful",
  "large",
  "tiny",
  "round",
  "flat",
  "busy",
  "empty",
  "sunny",
  "cloudy",
  "clean",
  "dirty",
  "full",
  "high",
  "low",
  "fresh",
  "heavy",
];

function scoreDescription(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  let score = 0;
  // Sentences: split by . ? !
  const sentences = trimmed.split(/[.?!]+/).filter((s) => s.trim().length > 0);
  if (sentences.length >= 3) score += 5;
  else if (sentences.length === 2) score += 3;
  else if (sentences.length === 1) score += 1;
  // Word count
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 15) score += 3;
  else if (words.length >= 8) score += 1;
  // Adjectives
  const lower = trimmed.toLowerCase();
  const adjCount = ADJECTIVES.filter((adj) =>
    new RegExp(`\\b${adj}\\b`).test(lower),
  ).length;
  if (adjCount >= 2) score += 2;
  else if (adjCount === 1) score += 1;
  return Math.min(score, 10);
}

function getFeedbackText(score: number): string {
  if (score >= 9) return "Excellent! Great detail and descriptive language!";
  if (score >= 6)
    return "Good work! Try adding more descriptive words next time.";
  if (score >= 3)
    return "Keep going! Aim for 3 full sentences with describing words.";
  return "Good try! Look at the image again and describe what you see step by step.";
}

function getFeedbackColor(score: number) {
  if (score >= 9)
    return { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" };
  if (score >= 6)
    return { bg: "bg-teal-50 border-teal-200", text: "text-teal-700" };
  if (score >= 3)
    return { bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-700" };
  return { bg: "bg-orange-50 border-orange-200", text: "text-orange-700" };
}

export function PictureBasedSpeakingModule({ lesson, onComplete }: Props) {
  const setIndex = lesson % 5;
  const scenes = SCENE_SETS[setIndex];
  const total = scenes.length;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sceneScore, setSceneScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [done, setDone] = useState(false);

  const currentScene = scenes[currentIdx];

  const handleSubmit = () => {
    const s = scoreDescription(description);
    setSceneScore(s);
    setTotalScore((prev) => prev + s);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= total) {
      setDone(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setDescription("");
      setSubmitted(false);
      setSceneScore(0);
    }
  };

  if (done) {
    const finalTotal = totalScore;
    const avg = Math.round((finalTotal / (total * 10)) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-5xl">🖼️</div>
            <h2 className="text-2xl font-bold text-emerald-700">
              Picture Speaking Complete!
            </h2>
            <p className="text-muted-foreground">
              You described all {total} scenes this session
            </p>
            <div className="flex items-center justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  {finalTotal}/{total * 10}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Total Score
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">{avg}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Accuracy
                </div>
              </div>
            </div>
            <p className="text-sm text-emerald-700">
              {getFeedbackText(Math.round(finalTotal / total))}
            </p>
            <Button
              data-ocid="picture_speaking.complete.primary_button"
              onClick={() => onComplete(finalTotal, total * 10)}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Complete Lesson
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const feedbackColors = getFeedbackColor(sceneScore);

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Scene {currentIdx + 1} of {total}
        </span>
        <div className="flex gap-1.5">
          {scenes.map((s, i) => (
            <div
              key={s.title}
              className={`w-7 h-1.5 rounded-full transition-colors ${
                i < currentIdx
                  ? "bg-emerald-500"
                  : i === currentIdx
                    ? "bg-teal-400"
                    : "bg-secondary"
              }`}
              aria-label={`Scene ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scene Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-teal-200 overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-teal-50 to-emerald-50">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-teal-600" />
                <CardTitle className="text-sm font-semibold text-teal-700 uppercase tracking-wide">
                  {currentScene.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* SVG Scene */}
              <div
                className="rounded-xl overflow-hidden border border-teal-100 bg-white"
                style={{ height: 200 }}
              >
                {currentScene.svg}
              </div>

              {/* Hint */}
              <div className="flex items-start gap-2 text-sm text-teal-700 bg-teal-50 rounded-lg p-3">
                <Eye className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{currentScene.hint}</span>
              </div>

              {/* Prompt */}
              <p className="text-sm font-medium text-foreground">
                Look at the scene carefully. Describe what you see in 3 or more
                sentences.
              </p>

              {/* Textarea */}
              {!submitted && (
                <Textarea
                  data-ocid="picture_speaking.textarea"
                  placeholder="Start writing your description here... (e.g. I can see a big classroom. There is a tall teacher near the blackboard. The students are sitting on small chairs.)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[110px] resize-none border-teal-200 focus:ring-teal-400 text-sm"
                />
              )}

              {submitted && (
                <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-3 text-sm text-muted-foreground italic">
                  {description}
                </div>
              )}

              {/* Feedback */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`rounded-xl border p-4 flex items-start gap-3 ${feedbackColors.bg}`}
                  >
                    <CheckCircle
                      className={`h-5 w-5 mt-0.5 ${feedbackColors.text}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-semibold ${feedbackColors.text}`}>
                          {getFeedbackText(sceneScore)}
                        </p>
                        <span
                          data-ocid="picture_speaking.success_state"
                          className={`text-sm font-bold px-2 py-0.5 rounded-lg border ${feedbackColors.bg} ${feedbackColors.text}`}
                        >
                          {sceneScore}/10
                        </span>
                      </div>
                      <p className="text-xs mt-1 opacity-75">
                        {sceneScore >= 5
                          ? "Great sentences!"
                          : "Try writing more complete sentences."}{" "}
                        {sceneScore >= 8
                          ? "Excellent use of describing words!"
                          : "Remember to use adjectives like big, red, happy..."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                {!submitted ? (
                  <Button
                    data-ocid="picture_speaking.submit_button"
                    onClick={handleSubmit}
                    disabled={description.trim().length < 5}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Submit Description
                  </Button>
                ) : (
                  <Button
                    data-ocid="picture_speaking.next.button"
                    onClick={handleNext}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  >
                    {currentIdx + 1 >= total ? "See Results" : "Next Scene"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {(submitted || currentIdx > 0) && (
        <div className="pt-2 text-center">
          <Button
            variant="outline"
            size="sm"
            data-ocid="picture_speaking.complete.secondary_button"
            onClick={() => onComplete(totalScore, total * 10)}
            className="text-muted-foreground text-xs"
          >
            Complete with current progress
          </Button>
        </div>
      )}
      <p className="text-xs text-center text-muted-foreground">
        💡 Tip: Use colour words, size words, and action words to score higher!
      </p>
    </div>
  );
}

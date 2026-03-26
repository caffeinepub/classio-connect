import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type ContentItem,
  getRecommendations,
  searchContent,
} from "@/utils/nvEmbedService";
import { BookOpen, Loader2, Search, Sparkles, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CATEGORY_COLORS: Record<ContentItem["category"], string> = {
  vocabulary: "bg-cyan-100 text-cyan-700 border-cyan-300",
  grammar: "bg-purple-100 text-purple-700 border-purple-300",
  pronunciation: "bg-orange-100 text-orange-700 border-orange-300",
  listening: "bg-blue-100 text-blue-700 border-blue-300",
  reading: "bg-indigo-100 text-indigo-700 border-indigo-300",
  speaking: "bg-green-100 text-green-700 border-green-300",
  shadowing: "bg-amber-100 text-amber-700 border-amber-300",
  roleplay: "bg-red-100 text-red-700 border-red-300",
};

const DIFFICULTY_COLORS: Record<ContentItem["difficulty"], string> = {
  beginner: "bg-emerald-50 text-emerald-600 border-emerald-200",
  intermediate: "bg-yellow-50 text-yellow-700 border-yellow-200",
  advanced: "bg-red-50 text-red-600 border-red-200",
};

const QUICK_TOPICS = [
  "Daily Conversation",
  "Business English",
  "Grammar Rules",
  "Pronunciation Tips",
  "Vocabulary",
  "Listening Practice",
];

interface Props {
  onComplete: (score: number, total: number) => void;
}

export function ContentDiscoveryModule({ onComplete }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [practiceQueue, setPracticeQueue] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecommendations(getRecommendations([]));
  }, []);

  const runSearch = (q: string, resetPage = true) => {
    if (!q.trim()) return;
    setLoading(true);
    const p = resetPage ? 0 : page;
    if (resetPage) setPage(0);
    setTimeout(() => {
      const res = searchContent(q, p, 10);
      if (resetPage) {
        setResults(res.results);
      } else {
        setResults((prev) => [...prev, ...res.results]);
      }
      setTotal(res.total);
      setHasMore(res.hasMore);
      setQuery(q);
      setLoading(false);
    }, 400);
  };

  const handleSearch = () => {
    if (!inputValue.trim()) return;
    runSearch(inputValue, true);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoading(true);
    setTimeout(() => {
      const res = searchContent(query, nextPage, 10);
      setResults((prev) => [...prev, ...res.results]);
      setHasMore(res.hasMore);
      setLoading(false);
    }, 400);
  };

  const togglePractice = (id: string) => {
    setPracticeQueue((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const displayItems = query ? results : recommendations;
  const isRecommended = !query;

  return (
    <div className="space-y-6">
      {/* NVIDIA Header */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="h-5 w-5 text-yellow-300" />
          <span className="font-bold text-lg">AI Content Discovery</span>
          <span className="ml-auto text-xs bg-[#76b900] text-white px-2 py-0.5 rounded-full font-semibold tracking-wide">
            NVIDIA NV-Embed-v2
          </span>
        </div>
        <p className="text-sm text-violet-100 leading-relaxed">
          Semantic vector search across 500+ learning resources. Type any topic
          and NV-Embed-v2 surfaces the most relevant content for you.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Try 'past tense', 'greet someone', 'airport vocabulary'..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:ring-2 focus:ring-violet-400 outline-none"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 rounded-xl"
        >
          Search
        </Button>
      </div>

      {/* Quick Topic Pills */}
      <div className="flex flex-wrap gap-2">
        {QUICK_TOPICS.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => {
              setInputValue(topic);
              runSearch(topic, true);
            }}
            className="text-xs px-3 py-1.5 rounded-full border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Practice Queue Bar */}
      {practiceQueue.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-xl bg-violet-50 border border-violet-200 px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-700">
              {practiceQueue.size} item{practiceQueue.size > 1 ? "s" : ""} in
              your practice queue
            </span>
          </div>
          {practiceQueue.size >= 3 && (
            <Button
              size="sm"
              onClick={() => onComplete(practiceQueue.size, practiceQueue.size)}
              className="bg-violet-600 hover:bg-violet-700 text-white text-xs"
            >
              Complete Session
            </Button>
          )}
        </motion.div>
      )}

      {/* Results */}
      <div className="space-y-3">
        {query && total > 0 && (
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <p className="text-sm text-muted-foreground">
              Found{" "}
              <span className="font-semibold text-foreground">{total}</span>{" "}
              results for{" "}
              <span className="font-semibold text-violet-600">"{query}"</span>
            </p>
          </div>
        )}

        {isRecommended && (
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <p className="text-sm font-semibold text-gray-700">
              Recommended for You
            </p>
          </div>
        )}

        <AnimatePresence>
          {displayItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`rounded-xl border p-4 bg-white hover:shadow-md transition-shadow ${
                practiceQueue.has(item.id)
                  ? "border-violet-400 ring-1 ring-violet-300"
                  : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge
                      className={`text-xs border ${
                        CATEGORY_COLORS[item.category]
                      }`}
                    >
                      {item.category}
                    </Badge>
                    <Badge
                      className={`text-xs border ${
                        DIFFICULTY_COLORS[item.difficulty]
                      }`}
                    >
                      {item.difficulty}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.content.slice(0, 120)}
                    {item.content.length > 120 ? "..." : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePractice(item.id)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    practiceQueue.has(item.id)
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white text-violet-600 border-violet-300 hover:bg-violet-50"
                  }`}
                >
                  {practiceQueue.has(item.id) ? "✓ Added" : "Practice"}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
          </div>
        )}

        {query && results.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No results found for "{query}". Try different keywords.
          </div>
        )}

        {hasMore && !loading && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={loadMore}
              className="text-sm text-violet-600 border border-violet-300 rounded-lg px-4 py-2 hover:bg-violet-50 transition-colors"
            >
              Load More — NV-Embed-v2 semantic retrieval
            </button>
          </div>
        )}
      </div>

      {/* NVIDIA Footer */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        Powered by{" "}
        <span className="font-semibold" style={{ color: "#76b900" }}>
          NVIDIA NV-Embed-v2
        </span>{" "}
        · Semantic embedding model for text retrieval
      </div>
    </div>
  );
}

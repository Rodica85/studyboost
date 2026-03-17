"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  HelpCircle,
  Layers,
  List,
  PenTool,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamQuestion {
  type: string;
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

interface Flashcard {
  front: string;
  back: string;
}

interface Results {
  summary: string;
  keyPoints: string[];
  examQuestions: ExamQuestion[];
  flashcards: Flashcard[];
  references: string[];
  draftWork: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={`gap-1.5 text-xs transition-colors ${copied ? "text-emerald-600" : "text-muted-foreground hover:text-foreground"}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}

function FlashcardViewer({ flashcards }: { flashcards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = flashcards[index];

  return (
    <div>
      <div
        onClick={() => setFlipped(!flipped)}
        className="group cursor-pointer rounded-xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 p-6 text-center transition-all duration-300 hover:border-indigo-200 hover:shadow-md active:scale-[0.99] sm:p-10"
      >
        <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          flipped
            ? "bg-emerald-100 text-emerald-700"
            : "bg-indigo-100 text-indigo-700"
        }`}>
          {flipped ? "ANSWER" : "QUESTION"}
        </div>
        <p className="text-lg leading-relaxed sm:text-xl">{flipped ? card.back : card.front}</p>
        <p className="mt-4 text-xs text-muted-foreground">Click to flip</p>
      </div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={index === 0}
          onClick={() => { setIndex(index - 1); setFlipped(false); }}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="min-w-[4rem] rounded-full bg-muted px-3 py-1 text-center text-sm font-medium">
          {index + 1} / {flashcards.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={index === flashcards.length - 1}
          onClick={() => { setIndex(index + 1); setFlipped(false); }}
          className="gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

const sectionConfig = [
  { key: "summary", icon: FileText, title: "Summary", gradient: "from-blue-500 to-indigo-500", bgGradient: "from-blue-50 to-indigo-50", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { key: "keyPoints", icon: List, title: "Key Points", gradient: "from-violet-500 to-purple-500", bgGradient: "from-violet-50 to-purple-50", iconBg: "bg-violet-100", iconColor: "text-violet-600" },
  { key: "examQuestions", icon: HelpCircle, title: "Exam Questions", gradient: "from-emerald-500 to-teal-500", bgGradient: "from-emerald-50 to-teal-50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
  { key: "flashcards", icon: Layers, title: "Flashcards", gradient: "from-amber-500 to-orange-500", bgGradient: "from-amber-50 to-orange-50", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  { key: "references", icon: BookOpen, title: "References", gradient: "from-rose-500 to-pink-500", bgGradient: "from-rose-50 to-pink-50", iconBg: "bg-rose-100", iconColor: "text-rose-600" },
  { key: "draftWork", icon: PenTool, title: "Draft Work", gradient: "from-cyan-500 to-sky-500", bgGradient: "from-cyan-50 to-sky-50", iconBg: "bg-cyan-100", iconColor: "text-cyan-600" },
];

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<Results | null>(null);
  const [filename, setFilename] = useState("document.pdf");
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const data = sessionStorage.getItem("studyboost_results");
    const name = sessionStorage.getItem("studyboost_pdf_name");
    if (!data) {
      router.push("/dashboard");
      return;
    }
    setResults(JSON.parse(data));
    if (name) setFilename(name);
  }, [router]);

  if (!results) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Your Study Kit</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            {filename}
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full gap-2 border-2 sm:w-auto"
          onClick={() => router.push("/dashboard")}
        >
          <RotateCcw className="h-4 w-4" />
          New Upload
        </Button>
      </div>

      <div className="space-y-6">
        {/* Summary */}
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
          <div className={`h-1 bg-gradient-to-r ${sectionConfig[0].gradient}`} />
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg ${sectionConfig[0].iconBg} p-2`}>
                  <FileText className={`h-4 w-4 ${sectionConfig[0].iconColor}`} />
                </div>
                <h2 className="text-lg font-bold">Summary</h2>
              </div>
              <CopyButton text={results.summary} />
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">{results.summary}</p>
          </div>
        </section>

        {/* Key Points */}
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
          <div className={`h-1 bg-gradient-to-r ${sectionConfig[1].gradient}`} />
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg ${sectionConfig[1].iconBg} p-2`}>
                  <List className={`h-4 w-4 ${sectionConfig[1].iconColor}`} />
                </div>
                <h2 className="text-lg font-bold">Key Points</h2>
              </div>
              <CopyButton text={results.keyPoints.join("\n")} />
            </div>
            <ul className="space-y-3">
              {results.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-foreground/80">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Exam Questions */}
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
          <div className={`h-1 bg-gradient-to-r ${sectionConfig[2].gradient}`} />
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className={`rounded-lg ${sectionConfig[2].iconBg} p-2`}>
                <HelpCircle className={`h-4 w-4 ${sectionConfig[2].iconColor}`} />
              </div>
              <h2 className="text-lg font-bold">Exam Questions</h2>
            </div>
            <div className="space-y-4">
              {results.examQuestions.map((q, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50 sm:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      {q.type.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">Question {i + 1}</span>
                  </div>
                  <p className="mb-3 text-sm font-medium leading-relaxed">{q.question}</p>
                  {q.options && (
                    <ul className="mb-3 space-y-2">
                      {q.options.map((opt, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-foreground/70">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border bg-white text-xs font-medium">
                            {String.fromCharCode(65 + j)}
                          </span>
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => setShowAnswers(prev => ({ ...prev, [i]: !prev[i] }))}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                  >
                    {showAnswers[i] ? "Hide Answer" : "Show Answer"}
                  </button>
                  {showAnswers[i] && (
                    <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm">
                      <p><strong className="text-emerald-800">Answer:</strong> <span className="text-emerald-900">{q.answer}</span></p>
                      {q.explanation && <p className="mt-2 text-emerald-700">{q.explanation}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flashcards */}
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
          <div className={`h-1 bg-gradient-to-r ${sectionConfig[3].gradient}`} />
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className={`rounded-lg ${sectionConfig[3].iconBg} p-2`}>
                <Layers className={`h-4 w-4 ${sectionConfig[3].iconColor}`} />
              </div>
              <h2 className="text-lg font-bold">Flashcards</h2>
            </div>
            {results.flashcards.length > 0 && (
              <FlashcardViewer flashcards={results.flashcards} />
            )}
          </div>
        </section>

        {/* References */}
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
          <div className={`h-1 bg-gradient-to-r ${sectionConfig[4].gradient}`} />
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg ${sectionConfig[4].iconBg} p-2`}>
                  <BookOpen className={`h-4 w-4 ${sectionConfig[4].iconColor}`} />
                </div>
                <h2 className="text-lg font-bold">References</h2>
              </div>
              {results.references.length > 0 && (
                <CopyButton text={results.references.join("\n")} />
              )}
            </div>
            {results.references.length > 0 ? (
              <ol className="list-decimal space-y-2 pl-5">
                {results.references.map((ref, i) => (
                  <li key={i} className="text-sm leading-relaxed text-foreground/80 marker:text-rose-400 marker:font-semibold">
                    {ref}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">No references found in this document.</p>
            )}
          </div>
        </section>

        {/* Draft Work */}
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
          <div className={`h-1 bg-gradient-to-r ${sectionConfig[5].gradient}`} />
          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg ${sectionConfig[5].iconBg} p-2`}>
                  <PenTool className={`h-4 w-4 ${sectionConfig[5].iconColor}`} />
                </div>
                <h2 className="text-lg font-bold">Draft Work</h2>
              </div>
              <CopyButton text={results.draftWork} />
            </div>
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-xs leading-relaxed text-amber-800">
                This is an AI-generated draft. Use it as a starting point — always review and add your own analysis.
              </p>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">{results.draftWork}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

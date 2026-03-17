import Link from "next/link";
import { BookOpen, FileText, HelpCircle, Layers, List, PenTool, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileText,
    title: "Summary",
    description: "Get a concise summary of any PDF in seconds.",
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconColor: "text-blue-600",
  },
  {
    icon: List,
    title: "Key Points",
    description: "Extract the most important ideas as a clear list.",
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-600",
  },
  {
    icon: HelpCircle,
    title: "Exam Questions",
    description: "Practice with AI-generated questions and answers.",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-600",
  },
  {
    icon: Layers,
    title: "Flashcards",
    description: "Study with auto-generated front/back flashcards.",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600",
  },
  {
    icon: BookOpen,
    title: "References",
    description: "All citations and references extracted for you.",
    gradient: "from-rose-500/10 to-pink-500/10",
    iconColor: "text-rose-600",
  },
  {
    icon: PenTool,
    title: "Draft Work",
    description: "Get a draft essay or report as a starting point.",
    gradient: "from-cyan-500/10 to-sky-500/10",
    iconColor: "text-cyan-600",
  },
];

const steps = [
  { number: "1", title: "Upload", description: "Drop your PDF into StudyBoost.", icon: Zap },
  { number: "2", title: "AI Analyzes", description: "Claude AI processes your document in seconds.", icon: Sparkles },
  { number: "3", title: "Study", description: "Get your complete study kit instantly.", icon: Shield },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/70 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-lg font-bold sm:text-xl">
            <span className="gradient-text">StudyBoost</span>
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/30">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-28">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-200/40 to-violet-200/40 blur-3xl animate-float" />
          <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-blue-200/30 to-cyan-200/30 blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-100/20 to-indigo-100/20 blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative z-10 animate-fade-in">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Claude AI
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Upload a PDF.
            <br />
            <span className="gradient-text">Get a complete study kit.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            StudyBoost transforms any PDF into summaries, key points, exam
            questions, flashcards, references, and draft work — all in seconds.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 text-base shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 sm:w-auto">
                Start Studying Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full border-2 px-8 text-base sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative border-t px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-4 text-center">
            <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Features
            </span>
          </div>
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
            One upload. <span className="gradient-text">Six outputs.</span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground sm:mb-14">
            Everything you need to ace your exams, all generated from a single PDF upload.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group relative rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-slide-up"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
              >
                <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${feature.gradient} p-3`}>
                  <feature.icon className={`h-5 w-5 ${feature.iconColor} sm:h-6 sm:w-6`} />
                </div>
                <h3 className="mb-2 text-base font-semibold sm:text-lg">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 text-center">
            <span className="inline-block rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-600">
              Simple Process
            </span>
          </div>
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-muted-foreground sm:mb-14">
            Three simple steps to transform any document into a study powerhouse.
          </p>
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center animate-slide-up" style={{ animationDelay: `${i * 150}ms`, animationFillMode: "both" }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-indigo-300 to-violet-300 sm:block" />
                )}
                <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25">
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center shadow-2xl shadow-indigo-500/25 sm:p-14">
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Ready to study smarter?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-indigo-100">
            Join StudyBoost today and transform how you prepare for exams. Free to get started.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white px-8 text-base font-semibold text-indigo-700 shadow-lg hover:bg-indigo-50">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="gradient-text font-semibold">StudyBoost</span> &mdash; AI-Powered Study Assistant
        </p>
      </footer>
    </div>
  );
}

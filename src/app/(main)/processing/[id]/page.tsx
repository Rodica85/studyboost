"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  "Reading your document...",
  "Extracting key information...",
  "Generating summary...",
  "Creating exam questions...",
  "Building flashcards...",
  "Finalizing your study kit...",
];

export default function ProcessingPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function generate() {
      const text = sessionStorage.getItem("studyboost_pdf_text");
      const filename = sessionStorage.getItem("studyboost_pdf_name");

      if (!text) {
        router.push("/dashboard");
        return;
      }

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, filename }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          return;
        }

        sessionStorage.setItem("studyboost_results", JSON.stringify(data));
        sessionStorage.removeItem("studyboost_pdf_text");
        router.push("/results/latest");
      } catch {
        setError("Something went wrong. Please try again.");
      }
    }

    generate();
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center animate-fade-in">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
          <span className="text-2xl">!</span>
        </div>
        <p className="mb-2 text-lg font-bold text-foreground">Something went wrong</p>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">{error}</p>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center animate-fade-in">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-indigo-200/30 to-violet-200/30 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 h-[250px] w-[250px] rounded-full bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 blur-3xl animate-float" />
      </div>

      <div className="relative z-10">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/25">
          <Loader2 className="h-9 w-9 animate-spin text-white" />
        </div>

        <h1 className="mb-3 text-2xl font-bold sm:text-3xl">
          <span className="gradient-text">AI is working...</span>
        </h1>

        <div className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <span className="transition-all duration-500">{steps[stepIndex]}</span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i <= stepIndex
                  ? "w-6 bg-gradient-to-r from-indigo-500 to-violet-500"
                  : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          This usually takes under 60 seconds
        </p>
      </div>
    </div>
  );
}

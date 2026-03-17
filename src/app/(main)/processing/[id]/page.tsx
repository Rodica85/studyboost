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
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-fade-in sm:px-6">
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-fade-in sm:px-6">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-[150px] w-[150px] rounded-full bg-gradient-to-br from-indigo-200/30 to-violet-200/30 blur-3xl animate-pulse-slow sm:h-[300px] sm:w-[300px]" />
        <div className="absolute bottom-1/3 right-1/4 hidden rounded-full bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 blur-3xl animate-float sm:block sm:h-[250px] sm:w-[250px]" />
      </div>

      <div className="relative z-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/25 sm:mb-8 sm:h-20 sm:w-20 sm:rounded-3xl">
          <Loader2 className="h-7 w-7 animate-spin text-white sm:h-9 sm:w-9" />
        </div>

        <h1 className="mb-2 text-xl font-bold sm:mb-3 sm:text-2xl md:text-3xl">
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

        <p className="mt-6 text-xs text-muted-foreground sm:mt-8">
          This usually takes under 60 seconds
        </p>
      </div>
    </div>
  );
}

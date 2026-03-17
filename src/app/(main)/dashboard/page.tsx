"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, Lock, Crown, FileUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Usage {
  uploadCount: number;
  isPremium: boolean;
  canUpload: boolean;
  limit: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then(setUsage)
      .catch(() => {});
  }, []);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setUploading(false);
        return;
      }

      sessionStorage.setItem("studyboost_pdf_text", data.text);
      sessionStorage.setItem("studyboost_pdf_name", data.filename);
      router.push("/processing/new");
    } catch {
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (usage && !usage.canUpload) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  const limitReached = usage && !usage.canUpload;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload a PDF and get your study kit</p>
        </div>
        {usage && (
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-sm">
            {usage.isPremium ? (
              <>
                <Crown className="h-4 w-4 text-amber-500" />
                <span className="font-semibold text-amber-600">Premium</span>
              </>
            ) : (
              <>
                <div className="flex gap-1">
                  {Array.from({ length: usage.limit }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-5 rounded-full transition-colors ${
                        i < usage.uploadCount
                          ? "bg-gradient-to-r from-indigo-500 to-violet-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {usage.uploadCount}/{usage.limit} uploads
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Upgrade Banner */}
      {limitReached && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-amber-900">
            Free upload limit reached
          </h2>
          <p className="mx-auto mb-6 max-w-sm text-sm text-amber-700">
            You&apos;ve used all {usage?.limit} free uploads. Upgrade to Premium for unlimited uploads and all features.
          </p>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 shadow-md shadow-amber-500/25 hover:shadow-lg">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Premium
          </Button>
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); if (!limitReached) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`group relative mb-10 overflow-hidden rounded-2xl border-2 border-dashed px-4 py-14 text-center transition-all duration-300 sm:px-6 sm:py-20 ${
          limitReached
            ? "border-gray-200 bg-gray-50/50 opacity-50"
            : dragOver
              ? "border-indigo-400 bg-indigo-50/50 shadow-lg shadow-indigo-500/10"
              : "border-gray-300 bg-gradient-to-b from-white to-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-md"
        }`}
      >
        {/* Background decoration */}
        {!limitReached && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-200 to-violet-200 blur-3xl transition-opacity group-hover:opacity-60" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-blue-200 to-cyan-200 blur-3xl transition-opacity group-hover:opacity-60" />
          </div>
        )}

        <div className="relative z-10">
          {uploading ? (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25">
                <Loader2 className="h-7 w-7 animate-spin text-white" />
              </div>
              <h2 className="mb-2 text-lg font-bold">Processing your PDF...</h2>
              <p className="text-sm text-muted-foreground">Extracting text and preparing for analysis</p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 transition-colors group-hover:from-indigo-200 group-hover:to-violet-200">
                <FileUp className="h-7 w-7 text-indigo-600" />
              </div>
              <h2 className="mb-2 text-lg font-bold">Upload a PDF</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Drag and drop your file here, or click to browse
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={!!limitReached}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
                disabled={!!limitReached}
              />
              <p className="mt-3 text-xs text-muted-foreground">PDF only, up to 50 MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

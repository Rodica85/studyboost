export interface ExamQuestion {
  type: "multiple_choice" | "short_answer" | "true_false";
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface UploadResult {
  id: string;
  uploadId: string;
  summary: string;
  keyPoints: string[];
  examQuestions: ExamQuestion[];
  flashcards: Flashcard[];
  references: string[];
  draftWork: string;
  processingTime: number;
  createdAt: string;
}

export interface Upload {
  id: string;
  userId: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  pageCount: number;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

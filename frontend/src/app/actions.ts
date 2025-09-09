"use server";

import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const schema = z.object({
  file: z
    .instanceof(File, { message: "File is required." })
    .refine((file) => file.size > 0, "File cannot be empty.")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `File size should be less than 5MB.`
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only .pdf files are supported."
    ),
});

export type AnalysisState = {
  category?: string;
  confidence?: number;
  summary?: string;
  error?: string | null;
  timestamp?: number;
};


export async function analyzeEmail(
  prevState: AnalysisState,
  formData: FormData
): Promise<AnalysisState> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { error: "No file provided", timestamp: Date.now() };
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${backendUrl}/classify-pdf`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Backend error: ${res.status} - ${errorBody}`);
    }

    const data = await res.json();

    if (!data.category || !data.suggested_reply) {
      throw new Error("Invalid response from backend");
    }

    return {
      category: data.category,
      confidence: data.confidence,
      summary: data.suggested_reply,
      error: null,
      timestamp: Date.now(),
    };

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return { error: errorMessage, timestamp: Date.now() };
  }
}

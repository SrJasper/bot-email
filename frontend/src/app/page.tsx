"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { analyzeEmail, type AnalysisState } from "@/app/actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/submit-button";
import { AnalysisResults } from "@/components/analysis-results";
import { FileUp } from "lucide-react";

const initialState: AnalysisState = {
  category: undefined,
  summary: undefined,
  error: null,
  timestamp: undefined,
};

export default function Home() {
  const [state, formAction] = useFormState(analyzeEmail, initialState);
  const { toast } = useToast();
  const prevTimestamp = React.useRef(state.timestamp);
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.error && state.timestamp !== prevTimestamp.current) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: state.error,
      });
      prevTimestamp.current = state.timestamp;
      // Reset file on error to allow re-submission
      setFile(null);
      if(formRef.current) {
        formRef.current.reset();
      }
    }
  }, [state.error, state.timestamp, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      const fileInput = formRef.current?.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        fileInput.files = dataTransfer.files;
      }
    }
  };


  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8">
      <main className="container mx-auto max-w-4xl py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Bot E-mail
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Drop a PDF file below and let AI give you instant insights.
          </p>
        </div>

        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Your Email PDF</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} ref={formRef} className="space-y-6">
              <div className="grid w-full gap-2">
                <label
                  htmlFor="file"
                  className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors ${
                    isDragging ? "border-primary" : "border-border"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileUp
                      className={`w-10 h-10 mb-3 ${
                        isDragging ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    {file ? (
                      <p className="font-semibold text-foreground">
                        {file.name}
                      </p>
                    ) : (
                      <>
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF (MAX. 5MB)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    className="hidden"
                    accept=".pdf, .txt"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        <AnalysisResults result={state} />
      </main>
    </div>
  );
}

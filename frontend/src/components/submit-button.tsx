"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="w-full sm:w-auto"
      size="lg"
    >
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        "Analyze Email"
      )}
    </Button>
  );
}

import { useMemo, useState } from "react";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WriterJourney } from "@/components/writer/WriterJourney";
import { useAuth } from "@/lib/auth";
import { submitWriterApplication } from "@/lib/api";
import { writerOnboardingPath } from "@/lib/destination";
import {
  COUNTRIES,
  EDUCATION_LEVELS,
  ESSAY_TOPICS,
  EXPERIENCE_OPTIONS,
  PROFICIENCY_QUESTIONS,
  WRITING_PROMPTS,
} from "@/lib/writer-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/writer-onboarding/apply")({
  component: ApplyPage,
});

const STEPS = ["Your profile", "Proficiency test", "Writing samples", "Essay & submit"] as const;

function ApplyPage() {
  const { user } = useAuth();

  // If the writer already applied, land them on the right status page.
  if (user && user.application_status && user.application_status !== "not_applied") {
    return <Navigate to={writerOnboardingPath(user.application_status)} />;
  }

  return <ApplicationWizard />;
}

function ApplicationWizard() {
  const { refresh } = useAuth();
  const [step, setStep] = useState(0);

  // Step 1 — profile
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");

  // Step 2 — proficiency
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  // Step 3 — writing prompts
  const [promptEssays, setPromptEssays] = useState<Record<string, string>>({});

  // Step 4 — essay topic
  const [topicId, setTopicId] = useState<string>("");
  const [essay, setEssay] = useState("");

  const mutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("phone", phone.trim());
      formData.append("country", country);
      formData.append("education_level", education);
      formData.append("experience", experience);
      formData.append(
        "proficiency_answers",
        JSON.stringify(
          PROFICIENCY_QUESTIONS.map((_, i) => answers[i] ?? ""),
        ),
      );
      for (const prompt of WRITING_PROMPTS) {
        formData.append(`sample_${prompt.id}`, promptEssays[prompt.id] ?? "");
      }
      formData.append("essay_topic", topicId);
      formData.append("essay", essay);
      return submitWriterApplication(formData);
    },
    onSuccess: async () => {
      toast.success("Application submitted!", {
        description: "Our editorial team will review it shortly.",
      });
      await refresh();
    },
    onError: (err) => {
      toast.error("Submission failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    },
  });

  const stepValid = [
    country !== "" && education !== "" && experience !== "",
    answeredCount === PROFICIENCY_QUESTIONS.length,
    WRITING_PROMPTS.every((p) => (promptEssays[p.id] ?? "").trim().length >= 150),
    topicId !== "" && essay.trim().length >= 300,
  ][step];

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Writer application
        </h1>
        <p className="text-muted-foreground">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-2" aria-hidden>
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={cn(
                "h-1.5 rounded-full transition-colors",
                i < step && "bg-success",
                i === step && "bg-primary",
                i > step && "bg-border",
              )}
            />
            <p
              className={cn(
                "mt-1.5 hidden text-xs sm:block",
                i === step ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
        {step === 0 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+254 700 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Highest education</Label>
                <Select value={education} onValueChange={setEducation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Academic writing experience</Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <p className="text-sm text-muted-foreground">
              Choose the correct option for each sentence.{" "}
              <span className="font-medium text-foreground">
                {answeredCount}/{PROFICIENCY_QUESTIONS.length} answered
              </span>
            </p>
            {PROFICIENCY_QUESTIONS.map((item, i) => (
              <fieldset key={i} className="space-y-3">
                <legend className="text-sm font-medium">
                  {i + 1}. {item.q}
                </legend>
                <RadioGroup
                  value={answers[i] ?? ""}
                  onValueChange={(v) => setAnswers((a) => ({ ...a, [i]: v }))}
                  className="grid gap-2 sm:grid-cols-2"
                >
                  {item.options.map((option) => (
                    <Label
                      key={option}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-normal transition-colors",
                        answers[i] === option
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/60",
                      )}
                    >
                      <RadioGroupItem value={option} />
                      {option}
                    </Label>
                  ))}
                </RadioGroup>
              </fieldset>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            {WRITING_PROMPTS.map((prompt, i) => {
              const value = promptEssays[prompt.id] ?? "";
              return (
                <div key={prompt.id} className="space-y-3">
                  <Label className="text-sm font-medium leading-relaxed">
                    Sample {i + 1}: {prompt.text}
                  </Label>
                  <Textarea
                    rows={7}
                    placeholder="Write at least 150 words…"
                    value={value}
                    onChange={(e) =>
                      setPromptEssays((p) => ({ ...p, [prompt.id]: e.target.value }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {value.trim().length} characters (min. 150)
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Choose one essay topic</Label>
              <RadioGroup value={topicId} onValueChange={setTopicId} className="space-y-2">
                {ESSAY_TOPICS.map((topic) => (
                  <Label
                    key={topic.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-2.5 rounded-xl border p-4 text-sm font-normal leading-relaxed transition-colors",
                      topicId === topic.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/60",
                    )}
                  >
                    <RadioGroupItem value={topic.id} className="mt-0.5" />
                    {topic.text}
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-3">
              <Label htmlFor="essay">Your essay</Label>
              <Textarea
                id="essay"
                rows={10}
                placeholder="Write at least 300 words on your chosen topic…"
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {essay.trim().length} characters (min. 300)
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t pt-6">
          <Button variant="ghost" onClick={back} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next} disabled={!stepValid}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => mutation.mutate()}
              disabled={!stepValid || mutation.isPending}
            >
              {mutation.isPending ? (
                "Submitting…"
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit application
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <details className="rounded-2xl border bg-card p-5">
        <summary className="cursor-pointer text-sm font-semibold">
          What happens after I apply?
        </summary>
        <WriterJourney current="apply" className="mt-5" />
      </details>
    </div>
  );
}

export function AppliedConfirmation() {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15">
        <Check className="h-6 w-6 text-success" />
      </span>
      <p className="font-semibold">Application received</p>
    </div>
  );
}

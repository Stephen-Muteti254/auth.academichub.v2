/**
 * Static content for the writer application flow.
 * Kept identical to the existing platform's application so the
 * /applications/apply-writer payload stays compatible.
 */

export interface ProficiencyQuestion {
  q: string;
  options: string[];
}

export const PROFICIENCY_QUESTIONS: ProficiencyQuestion[] = [
  { q: "Neither the teacher nor the students ___ willing to postpone the exam.", options: ["is", "are", "were", "have"] },
  { q: "If I ___ earlier, I wouldn't have missed the train.", options: ["leave", "had left", "left", "have left"] },
  { q: "Each of the reports ___ to be submitted before Friday.", options: ["need", "are needing", "needs", "have needed"] },
  { q: "Hardly ___ the announcement when the crowd started cheering.", options: ["had we heard", "we had heard", "did we hear", "have we heard"] },
  { q: "She acted as if she ___ everything about the project.", options: ["know", "knows", "had known", "will know"] },
  { q: "I wish I ___ to the meeting yesterday.", options: ["go", "went", "had gone", "have gone"] },
  { q: "The manager insisted that the report ___ completed immediately.", options: ["was", "be", "is", "being"] },
  { q: "Not only ___ late, but he also forgot his notes.", options: ["he arrived", "did he arrive", "he did arrive", "had he arrived"] },
  { q: "If she ___ harder, she would have passed the test.", options: ["studied", "had studied", "studies", "has studied"] },
  { q: "I'm looking forward to ___ you next week.", options: ["see", "seeing", "have seen", "saw"] },
  { q: "By the time we arrived, the movie ___.", options: ["had started", "started", "was starting", "starts"] },
  { q: "The committee has reached ___ decision after several meetings.", options: ["its", "it's", "their", "there"] },
  { q: "The book, together with the notes, ___ on the table.", options: ["are", "were", "is", "have been"] },
  { q: "The fewer mistakes you make, the ___ your grade will be.", options: ["better", "best", "good", "more better"] },
  { q: "Scarcely had I entered the room ___ the lights went out.", options: ["when", "than", "that", "and"] },
  { q: "I prefer tea ___ coffee.", options: ["to", "than", "from", "over"] },
  { q: "The doctor suggested that he ___ more rest.", options: ["takes", "take", "took", "had taken"] },
  { q: "Neither of them ___ attending the conference this year.", options: ["are", "were", "is", "have been"] },
  { q: "The report must be finished ___ Friday.", options: ["at", "until", "by", "in"] },
  { q: "If only he ___ the truth earlier!", options: ["knew", "has known", "had known", "know"] },
  { q: "You'd better ___ your assignment before midnight.", options: ["submit", "submitted", "to submit", "submits"] },
  { q: "She has been working here ___ 2018.", options: ["for", "since", "from", "at"] },
  { q: "The film was so boring that we wished we ___ stayed home.", options: ["have", "had", "have had", "had had"] },
  { q: "The more you practice, ___ you will perform.", options: ["best", "better", "good", "more better"] },
  { q: "He arrived late, ___ surprised everyone.", options: ["that", "which", "who", "what"] },
  { q: "We would rather you ___ the truth now.", options: ["tell", "told", "have told", "had told"] },
  { q: "Not until last year ___ how important time management is.", options: ["I realized", "I had realized", "did I realize", "have I realized"] },
  { q: "No sooner had they finished dinner ___ the phone rang.", options: ["when", "than", "that", "and"] },
  { q: "The house whose windows ___ broken needs urgent repair.", options: ["is", "are", "was", "has"] },
  { q: "She is one of those people who ___ always on time.", options: ["is", "was", "are", "has been"] },
];

export const WRITING_PROMPTS = [
  {
    id: "prompt1",
    text: "Do you believe technology has improved the quality of education, or has it created more distractions for students? Discuss your opinion with clear reasoning and examples.",
  },
  {
    id: "prompt2",
    text: "Some people think success is determined by hard work, while others believe luck plays a bigger role. Which do you agree with, and why?",
  },
] as const;

export const ESSAY_TOPICS = [
  {
    id: "topic1",
    text: "The Impact of Social Media on Human Communication: Has It Brought People Closer or Driven Them Apart?",
  },
  {
    id: "topic2",
    text: "Should College Education Be Free for All Students? Discuss the Benefits and Potential Drawbacks.",
  },
] as const;

export const EDUCATION_LEVELS = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
  "Other",
] as const;

export const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "5+ years",
] as const;

export const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Kenya",
  "Nigeria", "Ghana", "South Africa", "Uganda", "Tanzania", "Rwanda",
  "India", "Pakistan", "Bangladesh", "Philippines", "Indonesia",
  "Malaysia", "Singapore", "United Arab Emirates", "Saudi Arabia",
  "Egypt", "Ireland", "New Zealand", "Germany", "France", "Netherlands",
  "Spain", "Italy", "Brazil", "Mexico", "Jamaica", "Trinidad and Tobago",
  "Zimbabwe", "Zambia", "Botswana", "Cameroon", "Ethiopia", "Malawi",
  "Other",
] as const;

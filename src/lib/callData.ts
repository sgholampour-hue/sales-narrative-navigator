export interface Criterion {
  name: string;
  score: number;
  status: "pass" | "fail" | "neutral";
  feedback: string[];
  transcriptExamples?: string[];
  improvementExample?: string;
}

export interface Stage {
  name: string;
  score: number;
  criteria: Criterion[];
}

export interface PainPoint {
  title: string;
  quote: string;
}

export interface Goal {
  title: string;
  quotes: string[];
}

export interface Call {
  id: string;
  type: string;
  callType: string;
  status: string;
  date: string;
  displayDate: string;
  duration: string;
  insights: string;
  progress: string;
  rep: string;
  repEmail: string;
  createdAt: string;
  prospect: string;
  prospectTitle: string;
  prospectEmail: string;
  company: string;
  source: string;
  callDate: string;
  totalScore: number;
  averageScore: number;
  performanceLevel: string;
  dealClosed: string;
  dealValue: number;
  callControlScore: number;
  discoveryDepthScore: number;
  beliefShiftingScore: number;
  objectionHandlingScore: number;
  pitchEffectivenessScore: number;
  closingStrengthScore: number;
  numObjections: number;
  objectionHandlingRate: string;
  nextSteps: string;
  callUUID: string;
  videoLink: string;
  audioLink: string;
  additionalNotes: string;
  summaryID: string;
  whatWorked: string;
  areasToImprove: string;
  keyStrength: string;
  keyWeakness: string;
  nextCallAction: string;
  stages: Stage[];
  painPoints: PainPoint[];
  goals: Goal[];
}

export const CALLS: Call[] = [
  {
    id: "091d124", type: "Recording", callType: "Sales Call", status: "Completed",
    date: "2025-10-31", displayDate: "31 Oct, 12:00 AM", duration: "N/A", insights: "Available", progress: "Declining",
    rep: "Sam Gholampour", repEmail: "s.gholampour@top-match.nl", createdAt: "Oct 31, 2025 at 12:00 PM",
    prospect: "Sam Gholampour", prospectTitle: "", prospectEmail: "s.gholampour@top-match.nl",
    company: "Dr Lifestyle", source: "Recording", callDate: "Wednesday, October 31, 2025",
    totalScore: 5.3, averageScore: 5.3, performanceLevel: "Average", dealClosed: "No", dealValue: 0,
    callControlScore: 6, discoveryDepthScore: 5, beliefShiftingScore: 4, objectionHandlingScore: 5,
    pitchEffectivenessScore: 6, closingStrengthScore: 5, numObjections: 2, objectionHandlingRate: "50%",
    nextSteps: "Follow-up call next week", callUUID: "uuid-031d124", videoLink: "", audioLink: "",
    additionalNotes: "Declining trend noted", summaryID: "SC-001", whatWorked: "Good rapport building",
    areasToImprove: "Framing and structure", keyStrength: "Relationship skills", keyWeakness: "Call framing",
    nextCallAction: "Set agenda upfront",
    stages: [
      { name: "Intro", score: 4.0, criteria: [
        { name: "Re-establish Rapport", score: 8.0, status: "pass",
          feedback: ["Good job re-establishing rapport by asking about well-being and current work situation.", "The conversation flowed naturally into discussing current projects.", "Consider briefly mentioning a personal detail from a previous conversation to deepen the rapport further."],
          transcriptExamples: ['"Sam Gholampour: Goedemorgen, Peter."', '"Sam Gholampour: Zeker weten, Ik heb een enorm enthousiast. Hoe gaat het met jou?"', '"Sam Gholampour: Mooi zijn het zijn het ook nieuwe projecten wat nu de drukte heeft veroorzaakt."'] },
        { name: "Frame", score: 0.0, status: "fail",
          feedback: ["No explicit framing of the call was done.", "This leads to uncertainty for the prospect.", "Should have outlined structure and expected outcomes upfront."],
          improvementExample: 'Before sharing your screen: "Peter, thanks for making the time. Today, I want to walk you through the growth plan we\'ve developed based on our last discussion. I\'ll show you how we plan to tackle the new market entry, discuss the expected outcomes, and then we can talk about how it aligns with your goals. Does that sound good?"' },
        { name: "Confirm North Star & Root Challenges", score: 7.0, status: "neutral",
          feedback: ["Recapped the North Star (new market entry) and proposed solution (lead sourcing).", "Could have explicitly asked to confirm if still the top priority.", "Didn't tie it back to the core challenge as directly as possible."] },
      ]},
      { name: "Close", score: 6.0, criteria: [] },
      { name: "Present the Growth Plan", score: 6.0, criteria: [] },
      { name: "Partnership Options", score: 5.0, criteria: [] },
    ],
    painPoints: [
      { title: "Business experiencing growth primarily from existing network — struggling to make the next step to expand beyond it.", quote: '"Ja. Dat ja, maar ja, dat dat Dat is. De autonome groei vanuit ons eigen netwerk. Dat heeft het wel, maar Alleen wij moeten nu de volgende stap doen."' },
      { title: "Cold acquisition is a difficult and specialized task their internal team struggles with.", quote: '"Als ik eenmaal binnen ben en ik word uitgenodigd en dan dan, dan kan ik prima mijn verhaal doen. Maar die eerste koude acquisitie, ja, die is het allermoeilijkste."' },
      { title: "Significant bottleneck in finding skilled labor (welders, mechanics), limiting capacity for large projects.", quote: '"Stel nou dat ik in 1 keer 5 nieuwe projecten naar binnen haal. Dan heb ik aan de andere kant een probleem, want ik kom niet aan voldoende monteurs voor op de werkvloer."' },
      { title: "ZZP market and DBA law make it difficult to convert freelancers into permanent employees.", quote: '"Kijk, die hele ZZP markt en die wet DBA ja, die rijdt ons ook In de wielen. Want wij willen eigenlijk dat die ZZP ers bij ons in dienst komen."' },
    ],
    goals: [
      { title: "Primary goal: enter new markets (Blue Ocean strategy) and expand client base beyond existing network.", quotes: ['"En als er nieuwe markt opzeilen?"'] },
      { title: "Find a solution for lead sourcing and lead generation to identify qualified potential clients.", quotes: ['"We willen lead sourcing gaan oppakken om nu los van jullie eigen netwerk de nieuwe markt op te treden?"'] },
      { title: "Streamline the cold acquisition process through a tool or system.", quotes: ['"Toen dacht ik, Als we die koude acquisitie nu kunnen vervangen door een tool die in ieder geval die markt maakt."'] },
    ],
  },
  {
    id: "abc5678", type: "Recording", callType: "Sales Call", status: "Completed",
    date: "2025-09-30", displayDate: "30 Sep, 11:00 AM", duration: "N/A", insights: "Available", progress: "-",
    rep: "Sam Gholampour", repEmail: "s.gholampour@top-match.nl", createdAt: "Sep 30, 2025 at 11:00 AM",
    prospect: "Peter Alberts", prospectTitle: "Director", prospectEmail: "peter.alberts@vipe-welding.nl",
    company: "Vipe Welding", source: "Referral", callDate: "Tuesday, September 30, 2025",
    totalScore: 6.8, averageScore: 6.8, performanceLevel: "Good", dealClosed: "No", dealValue: 0,
    callControlScore: 7, discoveryDepthScore: 7, beliefShiftingScore: 6, objectionHandlingScore: 7,
    pitchEffectivenessScore: 7, closingStrengthScore: 6, numObjections: 3, objectionHandlingRate: "67%",
    nextSteps: "Send proposal by end of week", callUUID: "uuid-abc5678", videoLink: "", audioLink: "",
    additionalNotes: "", summaryID: "SC-002", whatWorked: "Strong discovery questions",
    areasToImprove: "Closing strength", keyStrength: "Discovery depth", keyWeakness: "Urgency creation",
    nextCallAction: "Follow up on proposal",
    stages: [
      { name: "Intro", score: 7.0, criteria: [] },
      { name: "Discovery", score: 7.5, criteria: [] },
      { name: "Pitch", score: 6.5, criteria: [] },
      { name: "Close", score: 6.2, criteria: [] },
    ],
    painPoints: [], goals: [],
  },
  {
    id: "call001", type: "Recording", callType: "Sales Call", status: "Completed",
    date: "2025-09-20", displayDate: "20 Sep, 02:00 PM", duration: "N/A", insights: "Available", progress: "Improving",
    rep: "Emma van der Berg", repEmail: "e.vandeberg@top-match.nl", createdAt: "Sep 20, 2025 at 2:30 PM",
    prospect: "Jan de Vries", prospectTitle: "Manager", prospectEmail: "jan.devries@tech-corp.nl",
    company: "Tech Corp", source: "Inbound", callDate: "Monday, September 20, 2025",
    totalScore: 5.8, averageScore: 5.8, performanceLevel: "Average", dealClosed: "No", dealValue: 0,
    callControlScore: 5, discoveryDepthScore: 6, beliefShiftingScore: 5, objectionHandlingScore: 6,
    pitchEffectivenessScore: 6, closingStrengthScore: 5, numObjections: 4, objectionHandlingRate: "75%",
    nextSteps: "Schedule follow-up meeting", callUUID: "uuid-call001", videoLink: "", audioLink: "",
    additionalNotes: "Good discovery phase", summaryID: "SC-003", whatWorked: "Deep dive into pain points",
    areasToImprove: "Value proposition clarity", keyStrength: "Questioning skills", keyWeakness: "Presentation skills",
    nextCallAction: "Prepare demo for next call",
    stages: [
      { name: "Intro", score: 6.0, criteria: [] },
      { name: "Discovery", score: 7.0, criteria: [] },
      { name: "Pitch", score: 5.5, criteria: [] },
      { name: "Close", score: 5.0, criteria: [] },
    ],
    painPoints: [], goals: [],
  },
  {
    id: "call002", type: "Recording", callType: "Sales Call", status: "Completed",
    date: "2025-09-15", displayDate: "15 Sep, 10:30 AM", duration: "N/A", insights: "Available", progress: "Steady",
    rep: "Marc Jansen", repEmail: "m.jansen@top-match.nl", createdAt: "Sep 15, 2025 at 11:00 AM",
    prospect: "Lisa Mueller", prospectTitle: "CEO", prospectEmail: "lisa.mueller@innovation.de",
    company: "Innovation GmbH", source: "LinkedIn", callDate: "Monday, September 15, 2025",
    totalScore: 7.4, averageScore: 7.4, performanceLevel: "Excellent", dealClosed: "No", dealValue: 0,
    callControlScore: 8, discoveryDepthScore: 8, beliefShiftingScore: 7, objectionHandlingScore: 8,
    pitchEffectivenessScore: 7, closingStrengthScore: 6, numObjections: 2, objectionHandlingRate: "100%",
    nextSteps: "Prepare quote", callUUID: "uuid-call002", videoLink: "", audioLink: "",
    additionalNotes: "Very engaged prospect", summaryID: "SC-004", whatWorked: "Excellent rapport and discovery",
    areasToImprove: "Closing urgency", keyStrength: "Communication", keyWeakness: "Deal closure",
    nextCallAction: "Send proposal within 24 hours",
    stages: [
      { name: "Intro", score: 8.0, criteria: [] },
      { name: "Discovery", score: 8.0, criteria: [] },
      { name: "Pitch", score: 7.0, criteria: [] },
      { name: "Close", score: 6.5, criteria: [] },
    ],
    painPoints: [], goals: [],
  },
  {
    id: "call003", type: "Recording", callType: "Sales Call", status: "Completed",
    date: "2025-09-10", displayDate: "10 Sep, 03:00 PM", duration: "N/A", insights: "Available", progress: "Declining",
    rep: "Sandra Klein", repEmail: "s.klein@top-match.nl", createdAt: "Sep 10, 2025 at 3:45 PM",
    prospect: "Robert Wilson", prospectTitle: "Procurement Head", prospectEmail: "robert.wilson@supply.com",
    company: "Supply Chain Solutions", source: "Cold Outreach", callDate: "Wednesday, September 10, 2025",
    totalScore: 4.9, averageScore: 4.9, performanceLevel: "Below Average", dealClosed: "No", dealValue: 0,
    callControlScore: 4, discoveryDepthScore: 4, beliefShiftingScore: 4, objectionHandlingScore: 5,
    pitchEffectivenessScore: 5, closingStrengthScore: 5, numObjections: 5, objectionHandlingRate: "40%",
    nextSteps: "Not interested at this time", callUUID: "uuid-call003", videoLink: "", audioLink: "",
    additionalNotes: "Challenging prospect, low engagement", summaryID: "SC-005", whatWorked: "Persistence in objection handling",
    areasToImprove: "Initial value proposition", keyStrength: "Resilience", keyWeakness: "Opening statement",
    nextCallAction: "No follow-up planned",
    stages: [
      { name: "Intro", score: 4.0, criteria: [] },
      { name: "Discovery", score: 4.5, criteria: [] },
      { name: "Pitch", score: 5.0, criteria: [] },
      { name: "Close", score: 5.5, criteria: [] },
    ],
    painPoints: [], goals: [],
  },
  {
    id: "call004", type: "Recording", callType: "Sales Call", status: "Completed",
    date: "2025-09-05", displayDate: "05 Sep, 09:00 AM", duration: "N/A", insights: "Available", progress: "Improving",
    rep: "Thomas Berg", repEmail: "t.berg@top-match.nl", createdAt: "Sep 5, 2025 at 9:30 AM",
    prospect: "Anna Schmidt", prospectTitle: "Director Sales", prospectEmail: "anna.schmidt@digital.ch",
    company: "Digital Solutions CH", source: "Referral", callDate: "Wednesday, September 5, 2025",
    totalScore: 6.5, averageScore: 6.5, performanceLevel: "Good", dealClosed: "Yes", dealValue: 45000,
    callControlScore: 7, discoveryDepthScore: 6, beliefShiftingScore: 7, objectionHandlingScore: 6,
    pitchEffectivenessScore: 7, closingStrengthScore: 8, numObjections: 1, objectionHandlingRate: "100%",
    nextSteps: "Contract signing scheduled", callUUID: "uuid-call004", videoLink: "", audioLink: "",
    additionalNotes: "Successful close", summaryID: "SC-006", whatWorked: "Strong closing technique",
    areasToImprove: "Value articulation could be clearer", keyStrength: "Closing ability", keyWeakness: "Early discovery depth",
    nextCallAction: "Onboarding preparation",
    stages: [
      { name: "Intro", score: 7.0, criteria: [] },
      { name: "Discovery", score: 6.0, criteria: [] },
      { name: "Pitch", score: 7.0, criteria: [] },
      { name: "Close", score: 8.0, criteria: [] },
    ],
    painPoints: [], goals: [],
  },
];

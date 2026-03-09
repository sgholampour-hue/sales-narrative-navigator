import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Call } from "@/lib/callData";
import type { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

type DbRow = Tables<"call_analyses">;

function mapDbRowToCall(row: DbRow): Call {
  const aj = (row.analysis_json as any) || {};
  const takeaways = aj.finalTakeaways || {};
  const categoryAnalysis = aj.categoryAnalysis || [];
  const objections = aj.objections || [];
  const outcome = aj.outcome || {};

  const totalScore = row.total_score ? Number(row.total_score) : 0;
  const scores = {
    callControl: row.call_control_score ? Number(row.call_control_score) : 0,
    discovery: row.discovery_depth_score ? Number(row.discovery_depth_score) : 0,
    belief: row.belief_shifting_score ? Number(row.belief_shifting_score) : 0,
    objection: row.objection_handling_score ? Number(row.objection_handling_score) : 0,
    pitch: row.pitch_effectiveness_score ? Number(row.pitch_effectiveness_score) : 0,
    closing: row.closing_strength_score ? Number(row.closing_strength_score) : 0,
  };
  const scoreValues = Object.values(scores);
  const avgScore = scoreValues.length > 0
    ? Number((scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(1))
    : 0;

  const perfLevel = avgScore >= 7.5 ? "Excellent" : avgScore >= 5 ? "Average" : "Below Average";

  const callDate = new Date(row.call_date);
  const displayDate = format(callDate, "dd MMM, hh:mm a");

  // Map categoryAnalysis to stages
  const stages = categoryAnalysis.map((cat: any) => ({
    name: cat.category || "Unknown",
    score: cat.score || 0,
    criteria: (cat.whatWorked || []).map((w: string, i: number) => ({
      name: w.slice(0, 50),
      score: cat.score || 0,
      status: "pass" as const,
      feedback: [w],
      transcriptExamples: cat.keyQuotes || [],
    })).concat(
      (cat.whatNeededImprovement || []).map((w: string) => ({
        name: w.slice(0, 50),
        score: Math.max(0, (cat.score || 0) - 2),
        status: "fail" as const,
        feedback: [w],
      }))
    ),
  }));

  const statusMap: Record<string, string> = {
    pending: "Pending",
    analyzing: "Processing",
    completed: "Completed",
    failed: "Failed",
  };

  return {
    id: row.id.slice(0, 7),
    type: "Recording",
    callType: row.call_type,
    status: statusMap[row.status] || row.status,
    date: row.call_date,
    displayDate,
    duration: "N/A",
    insights: row.status === "completed" ? "Available" : "Pending",
    progress: "-",
    rep: "", // No rep in DB yet
    repEmail: "",
    createdAt: format(new Date(row.created_at), "MMM dd, yyyy 'at' hh:mm a"),
    prospect: row.prospect_name,
    prospectTitle: row.prospect_title || "",
    prospectEmail: row.prospect_email,
    company: row.company_name,
    source: "Transcript",
    callDate: format(callDate, "EEEE, MMMM dd, yyyy"),
    totalScore: totalScore ? Number((totalScore / 6).toFixed(1)) : 0,
    averageScore: avgScore,
    performanceLevel: perfLevel,
    dealClosed: row.deal_closed ? "Yes" : "No",
    dealValue: row.deal_value ? Number(row.deal_value) : 0,
    callControlScore: scores.callControl,
    discoveryDepthScore: scores.discovery,
    beliefShiftingScore: scores.belief,
    objectionHandlingScore: scores.objection,
    pitchEffectivenessScore: scores.pitch,
    closingStrengthScore: scores.closing,
    numObjections: objections.length,
    objectionHandlingRate: objections.length > 0
      ? `${Math.round((objections.filter((o: any) => o.effectivenessScore >= 6).length / objections.length) * 100)}%`
      : "N/A",
    nextSteps: row.next_steps || takeaways.gameChangerForNextCall || "",
    callUUID: row.id,
    videoLink: "",
    audioLink: "",
    additionalNotes: row.notes || "",
    summaryID: row.id.slice(0, 8),
    whatWorked: takeaways.biggestStrength || "",
    areasToImprove: takeaways.biggestWeakness || "",
    keyStrength: takeaways.biggestStrength || "",
    keyWeakness: takeaways.biggestWeakness || "",
    nextCallAction: takeaways.gameChangerForNextCall || "",
    stages,
    painPoints: [],
    goals: [],
  };
}

export function useCallAnalyses() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCalls = useCallback(async () => {
    const { data, error } = await supabase
      .from("call_analyses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching calls:", error);
      return;
    }

    setCalls((data || []).map(mapDbRowToCall));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCalls();

    // Poll every 5 seconds for pending analyses
    const interval = setInterval(fetchCalls, 5000);
    return () => clearInterval(interval);
  }, [fetchCalls]);

  return { calls, loading };
}

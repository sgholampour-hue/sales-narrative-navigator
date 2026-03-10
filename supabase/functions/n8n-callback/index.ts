import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    const { analysisId, rawAnalysis, analysisJson } = body;

    if (!analysisId) throw new Error("analysisId is required");
    if (!analysisJson) throw new Error("analysisJson is required");

    console.log("Received n8n callback for:", analysisId);

    // Extract scores from the structured JSON
    const scores = analysisJson.scores || {};
    const updateData: Record<string, unknown> = {
      status: "completed",
      raw_analysis: rawAnalysis || null,
      analysis_json: analysisJson,
      total_score: scores.totalScore?.score || 0,
      call_control_score: scores.callControl?.score || 0,
      discovery_depth_score: scores.discoveryDepth?.score || 0,
      belief_shifting_score: scores.beliefShifting?.score || 0,
      objection_handling_score: scores.objectionHandling?.score || 0,
      pitch_effectiveness_score: scores.pitchEffectiveness?.score || 0,
      closing_strength_score: scores.closingStrength?.score || 0,
    };

    // Extract outcome
    if (analysisJson.outcome) {
      updateData.deal_closed = analysisJson.outcome.dealClosed;
      updateData.deal_value = analysisJson.outcome.dealValue
        ? parseFloat(String(analysisJson.outcome.dealValue).replace(/[^0-9.]/g, "")) || null
        : null;
      updateData.next_steps = analysisJson.outcome.nextSteps;
    }

    const { error: updateError } = await supabase
      .from("call_analyses")
      .update(updateData)
      .eq("id", analysisId);

    if (updateError) {
      console.error("Failed to update analysis:", updateError);
      throw new Error("Failed to save analysis results");
    }

    console.log("Analysis saved successfully for:", analysisId);

    return new Response(
      JSON.stringify({ success: true, analysisId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("n8n-callback error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

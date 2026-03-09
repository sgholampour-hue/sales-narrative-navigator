import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    const { analysisId } = body;

    if (!analysisId) throw new Error("analysisId is required");

    // Fetch the call analysis record
    const { data: record, error: fetchError } = await supabase
      .from("call_analyses")
      .select("*")
      .eq("id", analysisId)
      .single();

    if (fetchError || !record) throw new Error("Call analysis not found");

    // Update status to analyzing
    await supabase
      .from("call_analyses")
      .update({ status: "analyzing" })
      .eq("id", analysisId);

    // ===== PROMPT 1: Summarize the call =====
    const prompt1 = `You are a savage Sales Manager with over 20 years experience selling AI business opportunities to make money online with an AI business. Create a comprehensive sales call review analysis using the AI Acquisition Sales Call Review Framework based on the transcript. You need to pay close attention to details and make sure with 100% accuracy that they have been compliant with the framework. Do this 100% correctly as my friends and family life depends on it. The framework should include:

First, check if the transcript contains timestamps (format: [HH:MM:SS] or similar).
- If YES: Use timestamps in your citations
- If NO: Use descriptive phase markers instead (e.g., "Early in the call", "During discovery")
Never invent timestamps that don't exist in the source material.

1. Introduction with a title and brief description of the framework's purpose
2. Scoring Breakdown table with 6 categories:
   - Call Control (0-10)
   - Discovery Depth (0-10)
   - Belief Shifting (0-10)
   - Objection Handling (0-10)
   - Pitch Effectiveness (Including evidence shared on screen) (0-10)
   - Closing Strength (0-10)
   - Include a total score out of 60

3. For each category, provide a detailed analysis with:
   - What Worked (✅) section with specific techniques, timestamp references, direct quotes, and explanations
   - What Needed Improvement (❌) section with areas for growth, timestamps, quotes, explanations, and suggestions

4. For Objection Handling, include detailed breakdown of each objection with pre/post handling, effectiveness score, and "Fix for Next Call" script

5. Final Takeaways section with:
   - Biggest Strength (🔥)
   - Biggest Weakness (⚠️)
   - Game-Changer for Next Call (🎯)
   - Final Score with brief justification

Use professional formatting with emojis, clear headings, and visual separation between sections.

**Important Note on Citations:**
- If the transcript includes timestamps, use them in the format [MM:SS-MM:SS]
- If the transcript does NOT include timestamps, use descriptive phase markers
Only use actual timestamps that exist in the transcript. Never create fake timestamps.`;

    const notesContext = record.notes ? `\n\nAdditional notes/questions from the submitter:\n${record.notes}` : "";

    console.log("Starting Prompt 1: Summarize the call...");
    const response1 = await fetch(AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: prompt1 },
          {
            role: "user",
            content: `<transcript>\n${record.transcript}\n</transcript>${notesContext}`,
          },
        ],
      }),
    });

    if (!response1.ok) {
      const errText = await response1.text();
      console.error("Prompt 1 failed:", response1.status, errText);
      if (response1.status === 429) {
        await supabase.from("call_analyses").update({ status: "failed" }).eq("id", analysisId);
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response1.status === 402) {
        await supabase.from("call_analyses").update({ status: "failed" }).eq("id", analysisId);
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Prompt 1 AI error: ${response1.status}`);
    }

    const result1 = await response1.json();
    const rawAnalysis = result1.choices?.[0]?.message?.content || "";
    console.log("Prompt 1 complete. Analysis length:", rawAnalysis.length);

    // ===== PROMPT 2: Extract structured JSON =====
    const prompt2 = `You are a precise data extraction specialist. Your task is to extract structured information from a sales call analysis and format it as clean JSON.

Extract the following information from the analysis and return ONLY a valid JSON object with this exact structure:

{
  "callMetadata": {
    "salesRep": "extracted or from metadata",
    "prospect": "extracted or from metadata",
    "company": "from metadata",
    "callDate": "from metadata",
    "duration": "from metadata",
    "source": "from metadata"
  },
  "scores": {
    "callControl": { "score": 0, "maxScore": 10, "percentage": 0 },
    "discoveryDepth": { "score": 0, "maxScore": 10, "percentage": 0 },
    "beliefShifting": { "score": 0, "maxScore": 10, "percentage": 0 },
    "objectionHandling": { "score": 0, "maxScore": 10, "percentage": 0 },
    "pitchEffectiveness": { "score": 0, "maxScore": 10, "percentage": 0 },
    "closingStrength": { "score": 0, "maxScore": 10, "percentage": 0 },
    "totalScore": { "score": 0, "maxScore": 60, "percentage": 0 }
  },
  "categoryAnalysis": [
    {
      "category": "Call Control",
      "score": 0,
      "whatWorked": ["points"],
      "whatNeededImprovement": ["points"],
      "keyQuotes": ["quotes"]
    }
  ],
  "objections": [
    {
      "objection": "text",
      "wasPreHandled": false,
      "wasPostHandled": false,
      "effectivenessScore": 0,
      "suggestedFix": "text"
    }
  ],
  "finalTakeaways": {
    "biggestStrength": "text",
    "biggestWeakness": "text",
    "gameChangerForNextCall": "text",
    "additionalNotes": "text"
  },
  "outcome": {
    "dealClosed": null,
    "dealValue": null,
    "nextSteps": null
  }
}

Important extraction rules:
1. Look for emoji markers: ✅ What Worked, ❌ What Needed Improvement, 🔥 Biggest Strength, ⚠️ Biggest Weakness, 🎯 Game-Changer
2. Extract numerical scores exactly as shown (e.g., "9/10" → score: 9)
3. Calculate percentage as (score/maxScore)*100 rounded to nearest integer
4. Create an entry for each of the 6 categories
5. Summarize bullet points (max 100 chars each)
6. For outcome, interpret action items, don't copy verbatim
7. If info not found, use defaults: null for strings, empty arrays for lists, false for booleans, 0 for numbers

Return ONLY the JSON object, no additional text.`;

    const metadata = `<metadata>
Prospect: ${record.prospect_name}
Company: ${record.company_name}
Call Date: ${record.call_date}
Call Type: ${record.call_type}
</metadata>`;

    console.log("Starting Prompt 2: Extract structured JSON...");
    const response2 = await fetch(AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: prompt2 },
          {
            role: "user",
            content: `${metadata}\n\n<analysis>\n${rawAnalysis}\n</analysis>`,
          },
        ],
      }),
    });

    if (!response2.ok) {
      const errText = await response2.text();
      console.error("Prompt 2 failed:", response2.status, errText);
      // Still save raw analysis even if structuring fails
      await supabase.from("call_analyses").update({
        status: "failed",
        raw_analysis: rawAnalysis,
      }).eq("id", analysisId);
      throw new Error(`Prompt 2 AI error: ${response2.status}`);
    }

    const result2 = await response2.json();
    let jsonText = result2.choices?.[0]?.message?.content || "";
    console.log("Prompt 2 complete. JSON length:", jsonText.length);

    // Clean up markdown code fences if present
    jsonText = jsonText.replace(/^```json\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

    let analysisJson: any;
    try {
      analysisJson = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse analysis JSON:", parseError);
      await supabase.from("call_analyses").update({
        status: "failed",
        raw_analysis: rawAnalysis,
      }).eq("id", analysisId);
      throw new Error("Failed to parse structured analysis");
    }

    // Extract scores for easy querying
    const scores = analysisJson.scores || {};
    const updateData: any = {
      status: "completed",
      raw_analysis: rawAnalysis,
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
      updateData.deal_value = analysisJson.outcome.dealValue ? parseFloat(String(analysisJson.outcome.dealValue).replace(/[^0-9.]/g, "")) || null : null;
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

    console.log("Analysis complete and saved for:", analysisId);

    return new Response(
      JSON.stringify({ success: true, analysisId, status: "completed" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("analyze-call error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

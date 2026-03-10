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
    const N8N_WEBHOOK_URL = Deno.env.get("N8N_WEBHOOK_URL");
    if (!N8N_WEBHOOK_URL) throw new Error("N8N_WEBHOOK_URL is not configured");

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

    // Build the callback URL for n8n to send results back
    const callbackUrl = `${SUPABASE_URL}/functions/v1/n8n-callback`;

    // Send data to n8n webhook
    console.log("Sending data to n8n webhook...");
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analysisId: record.id,
        callbackUrl,
        serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
        transcript: record.transcript,
        notes: record.notes || "",
        callType: record.call_type,
        callDate: record.call_date,
        prospectName: record.prospect_name,
        prospectTitle: record.prospect_title || "",
        prospectEmail: record.prospect_email,
        companyName: record.company_name,
        websiteUrl: record.website_url || "",
        industry: record.industry || "",
      }),
    });

    if (!n8nResponse.ok) {
      const errText = await n8nResponse.text();
      console.error("n8n webhook failed:", n8nResponse.status, errText);
      await supabase.from("call_analyses").update({ status: "failed" }).eq("id", analysisId);
      throw new Error(`n8n webhook error: ${n8nResponse.status}`);
    }

    console.log("Data sent to n8n successfully for:", analysisId);

    return new Response(
      JSON.stringify({ success: true, analysisId, status: "analyzing" }),
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

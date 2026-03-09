import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CALL_TYPES = ["Discovery Call", "Interview Call", "Sales Call", "Podcast Call"];
const HEADCOUNT_OPTIONS = ["Not Sure", "1-10", "11-50", "51-200", "201-1000", "1000+"];
const REVENUE_OPTIONS = ["Not Sure", "< €1M", "€1M - €10M", "€10M - €50M", "€50M+"];

const NewCall = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1
  const [callType, setCallType] = useState("Sales Call");
  const [callDate, setCallDate] = useState<Date>(new Date());
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Step 2
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [headcount, setHeadcount] = useState("Not Sure");
  const [companyLinkedin, setCompanyLinkedin] = useState("");
  const [hqLocation, setHqLocation] = useState("");
  const [yearlyRevenue, setYearlyRevenue] = useState("Not Sure");
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState("");

  const canNext = fullName.trim() && email.trim();
  const canSubmit = companyName.trim() && transcript.trim();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Insert call analysis record
      const { data: inserted, error: insertError } = await supabase
        .from("call_analyses")
        .insert({
          call_type: callType,
          call_date: format(callDate, "yyyy-MM-dd"),
          prospect_name: fullName,
          prospect_title: jobTitle || null,
          prospect_email: email,
          prospect_linkedin: linkedinUrl || null,
          company_name: companyName,
          website_url: websiteUrl || null,
          industry: industry || null,
          headcount: headcount !== "Not Sure" ? headcount : null,
          company_linkedin: companyLinkedin || null,
          hq_location: hqLocation || null,
          yearly_revenue: yearlyRevenue !== "Not Sure" ? yearlyRevenue : null,
          transcript,
          notes: notes || null,
          status: "pending",
        })
        .select("id")
        .single();

      if (insertError || !inserted) {
        throw new Error(insertError?.message || "Failed to create analysis");
      }

      toast({
        title: "Analyse ingediend",
        description: "Je transcriptie wordt geanalyseerd. Dit kan even duren.",
      });

      // 2. Trigger the AI analysis edge function (fire and forget)
      supabase.functions.invoke("analyze-call", {
        body: { analysisId: inserted.id },
      }).then(({ error }) => {
        if (error) console.error("Analysis trigger error:", error);
      });

      navigate("/");
    } catch (err: any) {
      console.error("Submit error:", err);
      toast({
        title: "Fout bij indienen",
        description: err.message || "Er ging iets mis. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-8">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-8">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors",
            step === 1 ? "border-foreground text-foreground bg-card" : "border-border text-muted-foreground bg-card"
          )}>1</div>
          <div className="w-16 h-px bg-border" />
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors",
            step === 2 ? "border-foreground text-foreground bg-card" : "border-border text-muted-foreground bg-card"
          )}>2</div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 sm:p-8">
          {step === 1 && (
            <>
              <h2 className="text-lg font-bold text-foreground mb-1">Review Sales Call Recording</h2>
              <p className="text-sm text-muted-foreground mb-6">Upload your sales call recording to get AI-powered analysis and feedback.</p>

              {/* Call Type */}
              <label className="text-sm font-semibold text-foreground block mb-2">Call Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-border rounded-lg overflow-hidden mb-6">
                {CALL_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setCallType(t)}
                    className={cn(
                      "py-2.5 text-sm font-medium cursor-pointer transition-colors border-none",
                      callType === t ? "bg-secondary text-foreground" : "bg-card text-muted-foreground hover:bg-secondary/50"
                    )}
                  >{t}</button>
                ))}
              </div>

              {/* Call Date */}
              <label className="text-sm font-semibold text-foreground block mb-2">Call Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mb-6">
                    <CalendarIcon size={14} className="mr-2 text-muted-foreground" />
                    {format(callDate, "MMMM do, yyyy", { locale: nl })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={callDate} onSelect={(d) => d && setCallDate(d)} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>

              <div className="border-t border-border my-6" />

              {/* Prospect Info */}
              <h3 className="text-base font-bold text-foreground mb-4">Prospect Information</h3>

              <Field label="Full Name" value={fullName} onChange={setFullName} placeholder="John Smith" required />
              <Field label="Job Title" value={jobTitle} onChange={setJobTitle} placeholder="VP of Sales" />
              <Field label="Email Address" value={email} onChange={setEmail} placeholder="john.smith@company.com" type="email" required />
              <Field label="LinkedIn URL" value={linkedinUrl} onChange={setLinkedinUrl} placeholder="https://linkedin.com/in/johnsmith" optional />

              {/* Actions */}
              <div className="flex justify-between items-center mt-8">
                <Button variant="outline" onClick={() => navigate("/")}>Cancel</Button>
                <Button onClick={() => setStep(2)} disabled={!canNext}>Next</Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-lg font-bold text-foreground mb-1">Company Information</h2>
              <p className="text-sm text-muted-foreground mb-6">Help us tailor the analysis by sharing details about your prospect's company.</p>

              <Field label="Company Name" value={companyName} onChange={setCompanyName} placeholder="Acme Corporation" required />
              <Field label="Website URL" value={websiteUrl} onChange={setWebsiteUrl} placeholder="https://acme.com" optional />
              <Field label="Industry" value={industry} onChange={setIndustry} placeholder="Software, Healthcare, Finance, etc." />

              <SelectField label="Headcount" value={headcount} onChange={setHeadcount} options={HEADCOUNT_OPTIONS} optional />

              <Field label="Company LinkedIn URL" value={companyLinkedin} onChange={setCompanyLinkedin} placeholder="https://linkedin.com/company/acme" optional />
              <Field label="Headquarters Location" value={hqLocation} onChange={setHqLocation} placeholder="San Francisco, CA" optional />

              <SelectField label="Yearly Revenue" value={yearlyRevenue} onChange={setYearlyRevenue} options={REVENUE_OPTIONS} optional />

              <div className="border-t border-border my-6" />

              {/* Transcript */}
              <label className="text-sm font-semibold text-foreground block mb-2">Transcript <span className="text-destructive">*</span></label>
              <textarea
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                placeholder="Plak hier de volledige transcriptie van het gesprek..."
                rows={8}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring resize-y mb-4"
              />

              {/* Notes */}
              <label className="text-sm font-semibold text-foreground block mb-1">
                Notes, Questions, or Requests <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5 ml-1">Optional</span>
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add questions you want answered, areas to focus on, or extra context about this call..."
                rows={4}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring resize-y mb-1"
              />
              <p className="text-xs text-muted-foreground mb-6">The AI will analyze these specific points and provide targeted insights based on your questions.</p>

              {/* Actions */}
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>Previous</Button>
                <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting} className="bg-foreground text-card hover:bg-foreground/90">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="mr-2 animate-spin" />
                      Indienen...
                    </>
                  ) : (
                    "Submit for Analysis"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function Field({ label, value, onChange, placeholder, type = "text", optional, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
  type?: string; optional?: boolean; required?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="text-sm font-semibold text-foreground block mb-1.5">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
        {optional && <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5 ml-2">Optional</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, optional }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; optional?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="text-sm font-semibold text-foreground block mb-1.5">
        {label}
        {optional && <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5 ml-2">Optional</span>}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

export default NewCall;

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

const CALL_TYPES = ["Discovery Gesprek", "Interview Gesprek", "Sales Gesprek", "Podcast Gesprek"];
const HEADCOUNT_OPTIONS = ["Niet zeker", "1-10", "11-50", "51-200", "201-1000", "1000+"];
const REVENUE_OPTIONS = ["Niet zeker", "< €1M", "€1M - €10M", "€10M - €50M", "€50M+"];

const NewCall = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stap 1
  const [callType, setCallType] = useState("Sales Gesprek");
  const [callDate, setCallDate] = useState<Date>(new Date());
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Stap 2
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [headcount, setHeadcount] = useState("Niet zeker");
  const [companyLinkedin, setCompanyLinkedin] = useState("");
  const [hqLocation, setHqLocation] = useState("");
  const [yearlyRevenue, setYearlyRevenue] = useState("Niet zeker");
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState("");

  const canNext = fullName.trim() && email.trim();
  const canSubmit = companyName.trim() && transcript.trim();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
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
          headcount: headcount !== "Niet zeker" ? headcount : null,
          company_linkedin: companyLinkedin || null,
          hq_location: hqLocation || null,
          yearly_revenue: yearlyRevenue !== "Niet zeker" ? yearlyRevenue : null,
          transcript,
          notes: notes || null,
          status: "pending",
        })
        .select("id")
        .single();

      if (insertError || !inserted) {
        throw new Error(insertError?.message || "Analyse kon niet worden aangemaakt");
      }

      toast({
        title: "Analyse ingediend",
        description: "Je transcriptie wordt geanalyseerd. Dit kan even duren.",
      });

      supabase.functions.invoke("analyze-call", {
        body: { analysisId: inserted.id },
      }).then(({ error }) => {
        if (error) console.error("Analyse trigger fout:", error);
      });

      navigate("/");
    } catch (err: any) {
      console.error("Indienfout:", err);
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-8">
        {/* Stappen */}
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

        <div className="bg-card rounded-xl border border-border/30 p-6 sm:p-8 glass-card">
          {step === 1 && (
            <>
              <h2 className="text-lg font-bold text-foreground mb-1">Sales Gesprek Beoordelen</h2>
              <p className="text-sm text-muted-foreground mb-6">Upload je verkoopgesprek om AI-gestuurde analyse en feedback te ontvangen.</p>

              {/* Gesprekstype */}
              <label className="text-sm font-semibold text-foreground block mb-2">Gesprekstype</label>
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

              {/* Gespreksdatum */}
              <label className="text-sm font-semibold text-foreground block mb-2">Gespreksdatum</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mb-6">
                    <CalendarIcon size={14} className="mr-2 text-muted-foreground" />
                    {format(callDate, "d MMMM yyyy", { locale: nl })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={callDate} onSelect={(d) => d && setCallDate(d)} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>

              <div className="border-t border-border my-6" />

              {/* Prospect Informatie */}
              <h3 className="text-base font-bold text-foreground mb-4">Prospect Informatie</h3>

              <Field label="Volledige Naam" value={fullName} onChange={setFullName} placeholder="Jan Jansen" required />
              <Field label="Functietitel" value={jobTitle} onChange={setJobTitle} placeholder="VP Sales" />
              <Field label="E-mailadres" value={email} onChange={setEmail} placeholder="jan.jansen@bedrijf.nl" type="email" required />
              <Field label="LinkedIn URL" value={linkedinUrl} onChange={setLinkedinUrl} placeholder="https://linkedin.com/in/janjansen" optional />

              {/* Acties */}
              <div className="flex justify-between items-center mt-8">
                <Button variant="outline" onClick={() => navigate("/")}>Annuleren</Button>
                <Button onClick={() => setStep(2)} disabled={!canNext}>Volgende</Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-lg font-bold text-foreground mb-1">Bedrijfsinformatie</h2>
              <p className="text-sm text-muted-foreground mb-6">Help ons de analyse af te stemmen door details over het bedrijf van je prospect te delen.</p>

              <Field label="Bedrijfsnaam" value={companyName} onChange={setCompanyName} placeholder="Acme B.V." required />
              <Field label="Website URL" value={websiteUrl} onChange={setWebsiteUrl} placeholder="https://acme.nl" optional />
              <Field label="Branche" value={industry} onChange={setIndustry} placeholder="Software, Gezondheidszorg, Financiën, etc." />

              <SelectField label="Aantal Medewerkers" value={headcount} onChange={setHeadcount} options={HEADCOUNT_OPTIONS} optional />

              <Field label="Bedrijf LinkedIn URL" value={companyLinkedin} onChange={setCompanyLinkedin} placeholder="https://linkedin.com/company/acme" optional />
              <Field label="Hoofdkantoor Locatie" value={hqLocation} onChange={setHqLocation} placeholder="Amsterdam, Nederland" optional />

              <SelectField label="Jaaromzet" value={yearlyRevenue} onChange={setYearlyRevenue} options={REVENUE_OPTIONS} optional />

              <div className="border-t border-border my-6" />

              {/* Transcriptie */}
              <label className="text-sm font-semibold text-foreground block mb-2">Transcriptie <span className="text-destructive">*</span></label>
              <textarea
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                placeholder="Plak hier de volledige transcriptie van het gesprek..."
                rows={8}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring resize-y mb-4"
              />

              {/* Notities */}
              <label className="text-sm font-semibold text-foreground block mb-1">
                Notities, Vragen of Verzoeken <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5 ml-1">Optioneel</span>
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Voeg vragen toe die je beantwoord wilt hebben, aandachtsgebieden, of extra context over dit gesprek..."
                rows={4}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring resize-y mb-1"
              />
              <p className="text-xs text-muted-foreground mb-6">De AI analyseert deze specifieke punten en geeft gerichte inzichten op basis van je vragen.</p>

              {/* Acties */}
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>Vorige</Button>
                <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting} className="bg-foreground text-card hover:bg-foreground/90">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="mr-2 animate-spin" />
                      Indienen...
                    </>
                  ) : (
                    "Indienen voor Analyse"
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
        {optional && <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5 ml-2">Optioneel</span>}
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
        {optional && <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5 ml-2">Optioneel</span>}
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
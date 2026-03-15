import { useState } from "react";
import type { Call } from "@/lib/callData";
import { CallListView } from "@/components/CallListView";
import { CallDetailView } from "@/components/CallDetailView";
import { Navbar } from "@/components/Navbar";
import { useCallAnalyses } from "@/hooks/useCallAnalyses";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { calls, loading } = useCallAnalyses();
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  const openCall = (call: Call) => {
    setSelectedCall(call);
    setView("detail");
  };

  const goBack = () => {
    setView("list");
    setSelectedCall(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {view === "list" && <CallListView calls={calls} onOpenCall={openCall} />}
      {view === "detail" && selectedCall && (
        <CallDetailView call={selectedCall} allCalls={calls} onBack={goBack} />
      )}
    </div>
  );
};

export default Index;

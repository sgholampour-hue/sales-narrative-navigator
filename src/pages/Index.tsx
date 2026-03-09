import { useState } from "react";
import { CALLS, type Call } from "@/lib/callData";
import { CallListView } from "@/components/CallListView";
import { CallDetailView } from "@/components/CallDetailView";
import { Navbar } from "@/components/Navbar";

const Index = () => {
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

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      {view === "list" && <CallListView calls={CALLS} onOpenCall={openCall} />}
      {view === "detail" && selectedCall && (
        <CallDetailView call={selectedCall} onBack={goBack} />
      )}
    </div>
  );
};

export default Index;

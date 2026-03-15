import { Phone, Bell, Sparkles, LayoutDashboard } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="flex justify-between items-center px-4 sm:px-8 py-3 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
            <Phone size={14} className="text-primary" />
          </div>
          <span className={cn("font-light text-sm tracking-[2px] uppercase", location.pathname === "/new-call" ? "text-muted-foreground" : "text-foreground")}>
            Sales Call Analyzer
          </span>
        </div>
        {location.pathname === "/new-call" && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">›</span>
            <span className="font-medium text-foreground text-sm">Opname Beoordelen</span>
          </div>
        )}
        <div className="hidden sm:flex items-center gap-1 ml-4">
          <button
            onClick={() => navigate("/")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-light tracking-wide cursor-pointer transition-all border",
              location.pathname === "/"
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-transparent text-muted-foreground hover:text-foreground border-transparent hover:border-border"
            )}
          >
            Gesprekken
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-light tracking-wide cursor-pointer transition-all border flex items-center gap-1.5",
              location.pathname === "/dashboard"
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-transparent text-muted-foreground hover:text-foreground border-transparent hover:border-border"
            )}
          >
            <LayoutDashboard size={12} /> Dashboard
          </button>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="hidden sm:flex border border-border/50 rounded-full px-3.5 py-1.5 text-xs font-light bg-transparent text-muted-foreground items-center gap-1.5 cursor-pointer hover:text-foreground hover:border-border transition-all">
          <Bell size={13} /> Meldingen
        </button>
        <button className="rounded-full px-4 py-1.5 text-xs font-light border border-primary/30 bg-primary/10 text-primary flex items-center gap-1.5 cursor-pointer hover:bg-primary/20 transition-all">
          <Sparkles size={13} /> <span className="hidden sm:inline">Vraag AI</span>
        </button>
      </div>
    </nav>
  );
};

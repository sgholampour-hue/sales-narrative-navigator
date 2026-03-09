import { Phone, Bell, Sparkles, Moon, Sun, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 border-b border-border bg-card sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Phone size={18} className="text-foreground" />
          <span className={cn("font-semibold text-sm tracking-tight", location.pathname === "/new-call" ? "text-muted-foreground" : "text-foreground")}>
            Sales Call Analyzer
          </span>
        </div>
        {location.pathname === "/new-call" && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">›</span>
            <span className="font-semibold text-foreground text-sm">Review Recording</span>
          </div>
        )}
        <div className="hidden sm:flex items-center gap-1 ml-2">
          <button
            onClick={() => navigate("/")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors border-none ${location.pathname === "/" ? "bg-secondary text-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Calls
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors border-none flex items-center gap-1 ${location.pathname === "/dashboard" ? "bg-secondary text-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutDashboard size={12} /> Dashboard
          </button>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="border border-border rounded-lg px-3 py-1.5 text-xs font-medium bg-card text-foreground flex items-center gap-1.5 cursor-pointer hover:bg-secondary transition-colors"
        >
          {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
        <button className="hidden sm:flex border border-border rounded-lg px-3.5 py-1.5 text-xs font-medium bg-card text-foreground items-center gap-1.5 cursor-pointer hover:bg-secondary transition-colors">
          <Bell size={13} /> Notifications
        </button>
        <button className="rounded-lg px-3.5 py-1.5 text-xs font-medium border-none bg-foreground text-card flex items-center gap-1.5 cursor-pointer">
          <Sparkles size={13} /> <span className="hidden sm:inline">Ask AI</span>
        </button>
      </div>
    </nav>
  );
};

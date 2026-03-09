import { Phone, Bell, Sparkles, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 border-b border-border bg-card sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <Phone size={18} className="text-foreground" />
        <span className="font-semibold text-sm text-foreground tracking-tight">
          Sales Call Analyzer
        </span>
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

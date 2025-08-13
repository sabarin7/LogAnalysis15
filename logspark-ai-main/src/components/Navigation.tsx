import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Search, Database, Settings, Brain, Activity } from "lucide-react";

interface NavigationProps {
  activeTab: "dashboard" | "search" | "logs";
  onTabChange: (tab: "dashboard" | "search" | "logs") => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: BarChart3,
      description: "Overview & metrics"
    },
    {
      id: "search" as const,
      label: "AI Search",
      icon: Search,
      description: "Query logs with AI"
    },
    {
      id: "logs" as const,
      label: "Log Viewer",
      icon: Database,
      description: "Browse raw logs"
    }
  ];

  return (
    <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">LogAI</h1>
              <p className="text-xs text-muted-foreground">Intelligent Log Analysis</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "flex items-center space-x-2 h-10 px-4 transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg scale-105" 
                      : "hover:bg-secondary/50 hover:scale-105"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Status */}
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="border-success text-success">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
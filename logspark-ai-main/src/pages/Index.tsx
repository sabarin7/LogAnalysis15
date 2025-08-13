import { useState } from "react";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import SearchInterface from "@/components/SearchInterface";
import LogViewer from "@/components/LogViewer";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "search" | "logs">("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "search":
        return <SearchInterface />;
      case "logs":
        return <LogViewer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;

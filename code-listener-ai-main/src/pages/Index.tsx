import { useState, useMemo } from "react";
import { LogSearchHeader } from "@/components/LogSearchHeader";
import { LogEntry, LogData } from "@/components/LogEntry";
import { LogFilters } from "@/components/LogFilters";
import { AISuggestions } from "@/components/AISuggestions";
import { AIAnalysisPanel } from "@/components/AIAnalysisPanel";
import { LogMetrics } from "@/components/LogMetrics";
import { generateSampleLogs } from "@/data/sampleLogs";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [logs] = useState<LogData[]>(generateSampleLogs());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredLogs = useMemo(() => {
    let filtered = logs;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(query) ||
        log.service.toLowerCase().includes(query) ||
        log.level.toLowerCase().includes(query)
      );
    }

    // Filter by levels
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(log => selectedLevels.includes(log.level));
    }

    // Filter by services
    if (selectedServices.length > 0) {
      filtered = filtered.filter(log => selectedServices.includes(log.service));
    }

    return filtered;
  }, [logs, searchQuery, selectedLevels, selectedServices]);

  const handleLevelToggle = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleClearFilters = () => {
    setSelectedLevels([]);
    setSelectedServices([]);
  };

  const handleAiSearch = () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing with realistic delay
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("AI analysis complete! Check the insights panel for detailed findings.");
    }, 2000);
  };

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    toast.info(`Applied suggestion: "${query}"`);
  };

  return (
    <div className="min-h-screen bg-background">
      <LogSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAiSearch={handleAiSearch}
        resultCount={filteredLogs.length}
      />
      
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3 space-y-6">
            <AISuggestions onSuggestionClick={handleSuggestionClick} />
            <AIAnalysisPanel logs={filteredLogs} isAnalyzing={isAnalyzing} />
            <LogFilters
              selectedLevels={selectedLevels}
              selectedServices={selectedServices}
              onLevelToggle={handleLevelToggle}
              onServiceToggle={handleServiceToggle}
              onClearFilters={handleClearFilters}
            />
          </div>
          
          {/* Main Content */}
          <div className="col-span-9">
            <Tabs defaultValue="logs" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="logs">Log Stream</TabsTrigger>
                <TabsTrigger value="metrics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="logs" className="space-y-4">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No logs found matching your criteria
                    </p>
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <LogEntry
                      key={log.id}
                      log={log}
                      searchQuery={searchQuery}
                    />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="metrics">
                <LogMetrics logs={filteredLogs} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

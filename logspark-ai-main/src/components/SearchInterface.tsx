import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Search, Sparkles, Filter, Calendar, Server, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SearchInterface = () => {
  const [query, setQuery] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  const handleAiQuery = async () => {
    setIsSearching(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsSearching(false);
    }, 3000);
  };

  const mockResults = [
    {
      timestamp: "2024-01-15 14:32:15",
      level: "ERROR",
      service: "auth-service",
      message: "Authentication failed for user ID: 12345. Invalid password attempt.",
      source: "/var/log/auth.log",
      severity: "high"
    },
    {
      timestamp: "2024-01-15 14:31:42",
      level: "ERROR", 
      service: "auth-service",
      message: "Multiple failed login attempts detected from IP: 192.168.1.100",
      source: "/var/log/auth.log",
      severity: "critical"
    },
    {
      timestamp: "2024-01-15 14:30:15",
      level: "WARN",
      service: "database",
      message: "Query execution time exceeded threshold (5.2s) for table: user_sessions",
      source: "/var/log/database.log", 
      severity: "medium"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI-Powered Log Search
        </h1>
        <p className="text-muted-foreground">
          Search through logs using natural language queries or traditional filters
        </p>
      </div>

      {/* AI Query Interface */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Natural Language Query
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ask anything about your logs... e.g., 'Show me all authentication errors from the last hour' or 'Find database performance issues'"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="min-h-[100px] border-primary/20 bg-background/50"
          />
          <Button 
            onClick={handleAiQuery} 
            disabled={!aiQuery || isSearching}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isSearching ? "Processing..." : "Ask AI"}
          </Button>
        </CardContent>
      </Card>

      {/* Traditional Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Advanced Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Term</label>
              <Input
                placeholder="Search logs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Log Level</label>
              <Select>
                <SelectTrigger className="border-primary/20">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">ERROR</SelectItem>
                  <SelectItem value="warn">WARN</SelectItem>
                  <SelectItem value="info">INFO</SelectItem>
                  <SelectItem value="debug">DEBUG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Service</label>
              <Select>
                <SelectTrigger className="border-primary/20">
                  <SelectValue placeholder="All services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="auth">Auth Service</SelectItem>
                  <SelectItem value="api">API Gateway</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="cache">Cache Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select>
                <SelectTrigger className="border-primary/20">
                  <SelectValue placeholder="Last hour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last hour</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSearch} disabled={isSearching} variant="outline">
            <Search className="w-4 h-4 mr-2" />
            {isSearching ? "Searching..." : "Search Logs"}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Search Results
            </span>
            <Badge variant="outline">{mockResults.length} results found</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockResults.map((result, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-terminal border-terminal-border hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={result.level === "ERROR" ? "destructive" : "secondary"}
                      className="font-mono text-xs"
                    >
                      {result.level}
                    </Badge>
                    <span className="text-accent font-medium">{result.service}</span>
                    <Badge
                      variant="outline"
                      className={
                        result.severity === "critical"
                          ? "border-destructive text-destructive"
                          : result.severity === "high"
                          ? "border-warning text-warning"
                          : "border-muted text-muted-foreground"
                      }
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {result.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{result.timestamp}</span>
                    <Server className="w-4 h-4 ml-2" />
                    <span>{result.source}</span>
                  </div>
                </div>
                <p className="text-terminal-foreground font-mono text-sm leading-relaxed">
                  {result.message}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchInterface;
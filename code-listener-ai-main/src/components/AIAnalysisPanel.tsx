import { useState, useEffect } from "react";
import { Brain, TrendingUp, AlertTriangle, Clock, Target, Zap, Database, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LogData } from "./LogEntry";

interface AIAnalysisPanelProps {
  logs: LogData[];
  isAnalyzing: boolean;
}

interface AnomalyData {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  count: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  services: string[];
}

interface PatternData {
  pattern: string;
  frequency: number;
  services: string[];
  timeRange: string;
  category: 'error' | 'performance' | 'security' | 'usage';
}

interface InsightData {
  title: string;
  description: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  type: 'optimization' | 'alert' | 'trend' | 'security';
}

export const AIAnalysisPanel = ({ logs, isAnalyzing }: AIAnalysisPanelProps) => {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
  const [patterns, setPatterns] = useState<PatternData[]>([]);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const analyzeAnomalies = (logs: LogData[]): AnomalyData[] => {
    const errorCount = logs.filter(log => log.level === 'error').length;
    const warnCount = logs.filter(log => log.level === 'warn').length;
    const totalLogs = logs.length;
    
    const anomalies: AnomalyData[] = [];

    // Error rate anomaly
    if (errorCount / totalLogs > 0.1) {
      anomalies.push({
        type: "High Error Rate",
        severity: 'critical',
        description: `Error rate of ${((errorCount / totalLogs) * 100).toFixed(1)}% is above normal threshold`,
        count: errorCount,
        trend: 'increasing',
        services: [...new Set(logs.filter(log => log.level === 'error').map(log => log.service))]
      });
    }

    // Service concentration anomaly
    const serviceErrors = logs.filter(log => log.level === 'error')
      .reduce((acc, log) => {
        acc[log.service] = (acc[log.service] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    Object.entries(serviceErrors).forEach(([service, count]) => {
      if (count > errorCount * 0.4) {
        anomalies.push({
          type: "Service Error Concentration",
          severity: 'high',
          description: `${service} is generating ${count} errors (${((count / errorCount) * 100).toFixed(1)}% of total)`,
          count,
          trend: 'increasing',
          services: [service]
        });
      }
    });

    // Memory and performance anomalies
    const memoryErrors = logs.filter(log => 
      log.message.toLowerCase().includes('memory') || 
      log.message.toLowerCase().includes('timeout')
    );
    
    if (memoryErrors.length > 5) {
      anomalies.push({
        type: "Performance Degradation",
        severity: 'medium',
        description: `${memoryErrors.length} performance-related issues detected`,
        count: memoryErrors.length,
        trend: 'stable',
        services: [...new Set(memoryErrors.map(log => log.service))]
      });
    }

    return anomalies;
  };

  const detectPatterns = (logs: LogData[]): PatternData[] => {
    const patterns: PatternData[] = [];

    // Error pattern analysis
    const errorMessages = logs.filter(log => log.level === 'error').map(log => log.message);
    const messageFreq = errorMessages.reduce((acc, msg) => {
      acc[msg] = (acc[msg] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(messageFreq).forEach(([message, count]) => {
      if (count >= 3) {
        patterns.push({
          pattern: message,
          frequency: count,
          services: [...new Set(logs.filter(log => log.message === message).map(log => log.service))],
          timeRange: "Last hour",
          category: 'error'
        });
      }
    });

    // Authentication failure pattern
    const authFailures = logs.filter(log => 
      log.message.toLowerCase().includes('auth') || 
      log.message.toLowerCase().includes('token')
    );
    
    if (authFailures.length >= 3) {
      patterns.push({
        pattern: "Authentication Failures",
        frequency: authFailures.length,
        services: [...new Set(authFailures.map(log => log.service))],
        timeRange: "Last hour",
        category: 'security'
      });
    }

    // Performance pattern
    const performanceIssues = logs.filter(log => 
      log.message.toLowerCase().includes('slow') || 
      log.message.toLowerCase().includes('timeout') ||
      log.message.toLowerCase().includes('cpu')
    );
    
    if (performanceIssues.length >= 3) {
      patterns.push({
        pattern: "Performance Bottlenecks",
        frequency: performanceIssues.length,
        services: [...new Set(performanceIssues.map(log => log.service))],
        timeRange: "Last hour",
        category: 'performance'
      });
    }

    return patterns;
  };

  const generateInsights = (logs: LogData[], anomalies: AnomalyData[], patterns: PatternData[]): InsightData[] => {
    const insights: InsightData[] = [];

    // Service health insight
    const services = [...new Set(logs.map(log => log.service))];
    const unhealthyServices = services.filter(service => {
      const serviceLogs = logs.filter(log => log.service === service);
      const errorRate = serviceLogs.filter(log => log.level === 'error').length / serviceLogs.length;
      return errorRate > 0.15;
    });

    if (unhealthyServices.length > 0) {
      insights.push({
        title: "Service Health Alert",
        description: `${unhealthyServices.length} services showing high error rates`,
        recommendation: "Review service configurations and resource allocation",
        impact: 'high',
        type: 'alert'
      });
    }

    // Performance optimization insight
    const performancePatterns = patterns.filter(p => p.category === 'performance');
    if (performancePatterns.length > 0) {
      insights.push({
        title: "Performance Optimization Opportunity",
        description: "Recurring performance issues detected across multiple services",
        recommendation: "Implement caching, optimize database queries, and review resource limits",
        impact: 'medium',
        type: 'optimization'
      });
    }

    // Security insight
    const securityPatterns = patterns.filter(p => p.category === 'security');
    if (securityPatterns.length > 0) {
      insights.push({
        title: "Security Monitoring Required",
        description: "Multiple authentication failures detected",
        recommendation: "Review authentication mechanisms and consider implementing rate limiting",
        impact: 'high',
        type: 'security'
      });
    }

    // Trend insight
    const successRate = logs.filter(log => log.level === 'success').length / logs.length;
    if (successRate > 0.7) {
      insights.push({
        title: "Positive System Trend",
        description: `High success rate of ${(successRate * 100).toFixed(1)}% indicates healthy system operation`,
        recommendation: "Maintain current monitoring and alert thresholds",
        impact: 'low',
        type: 'trend'
      });
    }

    return insights;
  };

  useEffect(() => {
    if (isAnalyzing && logs.length > 0) {
      setAnalysisProgress(0);
      
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            
            // Perform analysis
            const detectedAnomalies = analyzeAnomalies(logs);
            const detectedPatterns = detectPatterns(logs);
            const generatedInsights = generateInsights(logs, detectedAnomalies, detectedPatterns);
            
            setAnomalies(detectedAnomalies);
            setPatterns(detectedPatterns);
            setInsights(generatedInsights);
            
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isAnalyzing, logs]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-terminal-red border-terminal-red/20';
      case 'high': return 'text-terminal-red border-terminal-red/20';
      case 'medium': return 'text-terminal-yellow border-terminal-yellow/20';
      case 'low': return 'text-terminal-green border-terminal-green/20';
      default: return 'text-terminal-cyan border-terminal-cyan/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Target className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (!isAnalyzing && anomalies.length === 0 && patterns.length === 0 && insights.length === 0) {
    return (
      <Card className="p-4 border-border">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-4 w-4 text-primary" />
          <span className="font-semibold">AI Analysis</span>
        </div>
        <div className="text-center py-6">
          <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Click "AI Search" to analyze your logs
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 border-border">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-4 w-4 text-primary" />
        <span className="font-semibold">AI Analysis</span>
        {isAnalyzing && (
          <Badge variant="secondary" className="text-xs bg-gradient-primary text-primary-foreground">
            Analyzing...
          </Badge>
        )}
      </div>

      {isAnalyzing && analysisProgress < 100 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Analyzing patterns...</span>
            <span className="text-xs text-muted-foreground">{analysisProgress}%</span>
          </div>
          <Progress value={analysisProgress} className="h-2" />
        </div>
      )}

      {/* Anomalies */}
      {anomalies.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-terminal-red" />
            <span className="text-sm font-medium">Anomalies Detected</span>
            <Badge variant="destructive" className="text-xs">{anomalies.length}</Badge>
          </div>
          <div className="space-y-2">
            {anomalies.map((anomaly, index) => (
              <div key={index} className={`p-3 rounded border ${getSeverityColor(anomaly.severity)} bg-muted/20`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{anomaly.type}</span>
                  <Badge variant="outline" className="text-xs">{anomaly.count}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{anomaly.description}</p>
                <div className="flex flex-wrap gap-1">
                  {anomaly.services.map((service, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{service}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patterns */}
      {patterns.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4 text-terminal-cyan" />
            <span className="text-sm font-medium">Patterns Found</span>
            <Badge variant="secondary" className="text-xs">{patterns.length}</Badge>
          </div>
          <div className="space-y-2">
            {patterns.map((pattern, index) => (
              <div key={index} className="p-3 rounded border border-muted bg-muted/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{pattern.pattern}</span>
                  <Badge variant="outline" className="text-xs">×{pattern.frequency}</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{pattern.timeRange}</span>
                  <span>•</span>
                  <span>{pattern.services.length} services</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-terminal-yellow" />
            <span className="text-sm font-medium">AI Insights</span>
            <Badge variant="secondary" className="text-xs">{insights.length}</Badge>
          </div>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div key={index} className="p-3 rounded border border-primary/20 bg-gradient-accent">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(insight.type)}
                  <span className="text-sm font-medium">{insight.title}</span>
                  <Badge 
                    variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'secondary' : 'outline'} 
                    className="text-xs"
                  >
                    {insight.impact}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                <p className="text-xs text-primary font-medium">{insight.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
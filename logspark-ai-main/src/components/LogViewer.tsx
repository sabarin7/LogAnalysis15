import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Database, 
  Filter, 
  Download, 
  RefreshCw, 
  Search,
  Calendar,
  Server,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const LogViewer = () => {
  const [filter, setFilter] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const mockLogs = [
    {
      timestamp: "2024-01-15 14:32:25.123",
      level: "ERROR",
      service: "auth-service",
      thread: "http-nio-8080-exec-1",
      message: "Authentication failed for user ID: 12345. Reason: Invalid password. IP: 192.168.1.100",
      source: "/var/log/auth.log:1247",
      traceId: "abc123-def456-ghi789"
    },
    {
      timestamp: "2024-01-15 14:32:22.856",
      level: "INFO",
      service: "api-gateway",
      thread: "reactor-http-nio-2",
      message: "Request processed: GET /api/users/profile - Status: 200 - Duration: 45ms",
      source: "/var/log/gateway.log:3421",
      traceId: "xyz789-uvw456-rst123"
    },
    {
      timestamp: "2024-01-15 14:32:20.445",
      level: "WARN",
      service: "database",
      thread: "HikariPool-1-housekeeper",
      message: "Connection pool utilization at 85%. Consider increasing pool size or investigating slow queries.",
      source: "/var/log/database.log:892",
      traceId: "pool-warn-001"
    },
    {
      timestamp: "2024-01-15 14:32:18.234",
      level: "DEBUG",
      service: "cache-service",
      thread: "cache-cleanup-1",
      message: "Cache cleanup completed. Evicted 342 expired entries. Current size: 12,847 entries",
      source: "/var/log/cache.log:156",
      traceId: "cache-cleanup-789"
    },
    {
      timestamp: "2024-01-15 14:32:15.678",
      level: "ERROR",
      service: "payment-service",
      thread: "payment-processor-3",
      message: "Payment processing failed for transaction ID: txn_987654321. Error: Insufficient funds",
      source: "/var/log/payment.log:2134",
      traceId: "pay-error-456"
    },
    {
      timestamp: "2024-01-15 14:32:12.890",
      level: "INFO",
      service: "notification-service",
      thread: "email-sender-2",
      message: "Email notification sent successfully to user@example.com. Template: welcome_new_user",
      source: "/var/log/notification.log:567",
      traceId: "notif-success-123"
    }
  ];

  const getLogIcon = (level: string) => {
    switch (level) {
      case "ERROR":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "WARN":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case "INFO":
        return <Info className="w-4 h-4 text-info" />;
      case "DEBUG":
        return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getLogLevelVariant = (level: string) => {
    switch (level) {
      case "ERROR":
        return "destructive";
      case "WARN":
        return "secondary";
      case "INFO":
        return "default";
      case "DEBUG":
        return "outline";
      default:
        return "outline";
    }
  };

  const filteredLogs = mockLogs.filter(log => 
    !filter || 
    log.message.toLowerCase().includes(filter.toLowerCase()) ||
    log.service.toLowerCase().includes(filter.toLowerCase()) ||
    log.level.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Live Log Viewer
          </h1>
          <p className="text-muted-foreground">
            Real-time log monitoring and filtering
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            variant={autoRefresh ? "default" : "outline"} 
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Log Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter logs..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 border-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
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
                  <SelectItem value="payment">Payment Service</SelectItem>
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
                  <SelectItem value="5m">Last 5 minutes</SelectItem>
                  <SelectItem value="1h">Last hour</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Display */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Log Entries
            </CardTitle>
            <Badge variant="outline" className="font-mono">
              {filteredLogs.length} entries
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-2 p-4">
              {filteredLogs.map((log, index) => (
                <div
                  key={index}
                  className="group p-4 rounded-lg border bg-terminal border-terminal-border hover:border-primary/40 transition-all duration-200 hover:shadow-lg"
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getLogIcon(log.level)}
                      <Badge 
                        variant={getLogLevelVariant(log.level)}
                        className="font-mono text-xs"
                      >
                        {log.level}
                      </Badge>
                      <span className="text-accent font-medium">{log.service}</span>
                      <span className="text-muted-foreground text-sm font-mono">{log.thread}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="font-mono">{log.timestamp}</span>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-3">
                    <p className="text-terminal-foreground font-mono text-sm leading-relaxed break-all">
                      {log.message}
                    </p>
                  </div>

                  {/* Footer Row */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Server className="w-3 h-3" />
                        <span className="font-mono">{log.source}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Trace:</span>
                        <code className="bg-muted px-1 rounded text-xs">{log.traceId}</code>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogViewer;
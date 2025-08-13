import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle, Clock, Database, Search, Zap } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
}

const MetricCard = ({ title, value, change, icon, variant = "default" }: MetricCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-success/20 bg-success/5";
      case "warning":
        return "border-warning/20 bg-warning/5";
      case "destructive":
        return "border-destructive/20 bg-destructive/5";
      default:
        return "border-primary/20 bg-primary/5";
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:scale-105 ${getVariantStyles()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-success">+{change}</span> from last hour
        </p>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Log Analysis Dashboard
          </h1>
          <p className="text-muted-foreground">
            AI-powered log monitoring and analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-success text-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            System Healthy
          </Badge>
          <Badge variant="outline" className="border-primary text-primary">
            <Zap className="w-3 h-3 mr-1" />
            AI Active
          </Badge>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Logs"
          value="1.2M"
          change="12.5%"
          icon={<Database className="h-4 w-4" />}
          variant="default"
        />
        <MetricCard
          title="Errors Found"
          value="342"
          change="8.2%"
          icon={<AlertTriangle className="h-4 w-4" />}
          variant="warning"
        />
        <MetricCard
          title="Queries Processed"
          value="8.4K"
          change="22.1%"
          icon={<Search className="h-4 w-4" />}
          variant="success"
        />
        <MetricCard
          title="Avg Response Time"
          value="1.2s"
          change="5.4%"
          icon={<Clock className="h-4 w-4" />}
          variant="default"
        />
      </div>

      {/* Real-time Activity */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Real-time Log Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "14:32:15", level: "ERROR", service: "auth-service", message: "Authentication failed for user ID: 12345" },
              { time: "14:32:12", level: "INFO", service: "api-gateway", message: "Request processed successfully" },
              { time: "14:32:08", level: "WARN", service: "database", message: "Connection pool approaching limit (85%)" },
              { time: "14:32:05", level: "INFO", service: "web-server", message: "New user session started" },
              { time: "14:32:01", level: "DEBUG", service: "cache-service", message: "Cache hit ratio: 94.2%" },
            ].map((log, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-terminal border-terminal-border font-mono text-sm"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-muted-foreground">{log.time}</span>
                  <Badge
                    variant={log.level === "ERROR" ? "destructive" : log.level === "WARN" ? "secondary" : "default"}
                    className="font-mono text-xs"
                  >
                    {log.level}
                  </Badge>
                  <span className="text-accent font-medium">{log.service}</span>
                </div>
                <span className="text-terminal-foreground flex-1 ml-4 truncate">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
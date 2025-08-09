import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { LogData } from "./LogEntry";

interface LogMetricsProps {
  logs: LogData[];
}

export const LogMetrics = ({ logs }: LogMetricsProps) => {
  // Calculate metrics
  const totalLogs = logs.length;
  const errorCount = logs.filter(log => log.level === 'error').length;
  const warnCount = logs.filter(log => log.level === 'warn').length;
  const successCount = logs.filter(log => log.level === 'success').length;
  const infoCount = logs.filter(log => log.level === 'info').length;
  
  const errorRate = ((errorCount / totalLogs) * 100).toFixed(1);
  const successRate = ((successCount / totalLogs) * 100).toFixed(1);

  // Level distribution data
  const levelData = [
    { name: 'Error', value: errorCount, color: 'hsl(var(--terminal-red))' },
    { name: 'Warning', value: warnCount, color: 'hsl(var(--terminal-yellow))' },
    { name: 'Success', value: successCount, color: 'hsl(var(--terminal-green))' },
    { name: 'Info', value: infoCount, color: 'hsl(var(--terminal-cyan))' },
    { name: 'Debug', value: logs.filter(log => log.level === 'debug').length, color: 'hsl(var(--muted-foreground))' }
  ].filter(item => item.value > 0);

  // Service distribution data
  const serviceData = logs.reduce((acc, log) => {
    acc[log.service] = (acc[log.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const serviceChartData = Object.entries(serviceData)
    .map(([service, count]) => ({ service, count, errorCount: logs.filter(log => log.service === service && log.level === 'error').length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Time series data (simplified - group by hour)
  const timeData = logs.reduce((acc, log) => {
    const hour = new Date(log.timestamp).getHours();
    const key = `${hour}:00`;
    if (!acc[key]) {
      acc[key] = { time: key, total: 0, errors: 0 };
    }
    acc[key].total += 1;
    if (log.level === 'error') acc[key].errors += 1;
    return acc;
  }, {} as Record<string, { time: string; total: number; errors: number }>);

  const timeChartData = Object.values(timeData).sort((a, b) => 
    parseInt(a.time.split(':')[0]) - parseInt(b.time.split(':')[0])
  );

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Logs</p>
              <p className="text-2xl font-bold">{totalLogs.toLocaleString()}</p>
            </div>
            <Activity className="h-8 w-8 text-terminal-cyan" />
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Error Rate</p>
              <p className="text-2xl font-bold text-terminal-red">{errorRate}%</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-terminal-red" />
          </div>
          <div className="flex items-center mt-2">
            {parseFloat(errorRate) > 5 ? (
              <>
                <TrendingUp className="h-3 w-3 text-terminal-red mr-1" />
                <span className="text-xs text-terminal-red">Above threshold</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 text-terminal-green mr-1" />
                <span className="text-xs text-terminal-green">Normal</span>
              </>
            )}
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold text-terminal-green">{successRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-terminal-green" />
          </div>
          <div className="flex items-center mt-2">
            {parseFloat(successRate) > 70 ? (
              <>
                <TrendingUp className="h-3 w-3 text-terminal-green mr-1" />
                <span className="text-xs text-terminal-green">Healthy</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 text-terminal-yellow mr-1" />
                <span className="text-xs text-terminal-yellow">Below average</span>
              </>
            )}
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Services</p>
              <p className="text-2xl font-bold">{Object.keys(serviceData).length}</p>
            </div>
            <Info className="h-8 w-8 text-terminal-cyan" />
          </div>
          <div className="flex items-center mt-2">
            <span className="text-xs text-muted-foreground">Active services</span>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Log Level Distribution */}
        <Card className="p-4 border-border">
          <h3 className="text-sm font-semibold mb-4">Log Level Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {levelData.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Service Activity */}
        <Card className="p-4 border-border">
          <h3 className="text-sm font-semibold mb-4">Service Activity</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="service" 
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="errorCount" fill="hsl(var(--terminal-red))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-primary" />
              <span>Total Logs</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--terminal-red))' }} />
              <span>Errors</span>
            </div>
          </div>
        </Card>

        {/* Time Series */}
        <Card className="p-4 border-border lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4">Activity Timeline</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="errors" 
                  stroke="hsl(var(--terminal-red))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--terminal-red))', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-primary" />
              <span>Total Activity</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--terminal-red))' }} />
              <span>Errors</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
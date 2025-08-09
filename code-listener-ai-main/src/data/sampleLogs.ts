import { LogData } from "@/components/LogEntry";

export const generateSampleLogs = (): LogData[] => {
  const services = [
    'auth-service', 'payment-api', 'user-management', 
    'notification-service', 'analytics-pipeline', 'email-service'
  ];
  
  const errorMessages = [
    'Database connection timeout after 30s',
    'Failed to authenticate user: invalid token',
    'Payment processing failed: insufficient funds',
    'External API rate limit exceeded',
    'Memory allocation failed for user session',
    'Critical system error: disk space exceeded 95%'
  ];
  
  const warnMessages = [
    'High CPU usage detected: 85%',
    'Slow database query detected: 2.5s execution time',
    'Cache miss rate above threshold: 15%',
    'Deprecated API endpoint called',
    'Large payload detected: 10MB request size',
    'Session timeout approaching for user'
  ];
  
  const infoMessages = [
    'User successfully authenticated',
    'Payment transaction completed',
    'Email notification sent',
    'Cache refreshed successfully',
    'API request processed',
    'Health check passed'
  ];
  
  const debugMessages = [
    'Function execution started',
    'Variable state updated',
    'Cache lookup performed',
    'API response received',
    'Database query executed',
    'Memory usage checked'
  ];
  
  const successMessages = [
    'Backup completed successfully',
    'Data migration finished',
    'Service deployment complete',
    'Security scan passed',
    'Performance optimization applied',
    'System recovery successful'
  ];

  const logs: LogData[] = [];
  const now = new Date();

  for (let i = 0; i < 380; i++) {
    const timestamp = new Date(now.getTime() - (i * 60000 + Math.random() * 60000));
    const service = services[Math.floor(Math.random() * services.length)];
    
    let level: LogData['level'];
    let message: string;
    let metadata: Record<string, any> | undefined;
    
    const rand = Math.random();
    if (rand < 0.06) { // 6% errors
      level = 'error';
      message = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      metadata = {
        error_code: `E${Math.floor(Math.random() * 9000) + 1000}`,
        trace_id: `trace-${Math.random().toString(36).substr(2, 9)}`,
        user_id: Math.floor(Math.random() * 10000)
      };
    } else if (rand < 0.18) { // 12% warnings
      level = 'warn';
      message = warnMessages[Math.floor(Math.random() * warnMessages.length)];
      metadata = {
        threshold: Math.floor(Math.random() * 100),
        current_value: Math.floor(Math.random() * 100)
      };
    } else if (rand < 0.59) { // 41% info
      level = 'info';
      message = infoMessages[Math.floor(Math.random() * infoMessages.length)];
    } else if (rand < 0.82) { // 23% debug
      level = 'debug';
      message = debugMessages[Math.floor(Math.random() * debugMessages.length)];
    } else { // 18% success
      level = 'success';
      message = successMessages[Math.floor(Math.random() * successMessages.length)];
      metadata = {
        duration_ms: Math.floor(Math.random() * 5000),
        status: 'completed'
      };
    }

    logs.push({
      id: `log-${i}`,
      timestamp: timestamp.toISOString().replace('T', ' ').slice(0, 19),
      level,
      service,
      message,
      metadata
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
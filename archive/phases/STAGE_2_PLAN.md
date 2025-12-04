# Stage 2 - Backend Stability & Performance

**Duration**: 1 week (8-12 hours)  
**Status**: 🟡 Ready to Start  
**Priority**: High

---

## 🎯 Stage 2 Objectives

1. **Connection Reliability** - Ensure backend stays connected
2. **Performance Optimization** - Make the app fast and responsive
3. **Error Handling** - Handle failures gracefully
4. **Agent Stability** - Keep agents running smoothly

---

## 📋 Task Breakdown

### Task 1: Connection Reliability (2-3 hours)

#### 1.1 WebSocket Reconnection Logic
**File**: `tauri-shell/src/hooks/useBackendConnection.ts`

**What to do**:
- [ ] Implement WebSocket connection
- [ ] Add automatic reconnection with exponential backoff
- [ ] Track connection state (connected, reconnecting, failed)
- [ ] Emit events on connection change
- [ ] Handle network interruptions

**Code Template**:
```typescript
interface UseBackendConnectionOptions {
  backendUrl: string;
  checkInterval?: number;
  maxRetries?: number;
  onConnectionChange?: (connected: boolean) => void;
}

export function useBackendConnection(options: UseBackendConnectionOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(options.backendUrl.replace('http', 'ws'));
        
        ws.onopen = () => {
          setIsConnected(true);
          setIsReconnecting(false);
          retryCountRef.current = 0;
          options.onConnectionChange?.(true);
        };

        ws.onclose = () => {
          setIsConnected(false);
          attemptReconnect();
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          attemptReconnect();
        };

        wsRef.current = ws;
      } catch (error) {
        console.error('Failed to connect:', error);
        attemptReconnect();
      }
    };

    const attemptReconnect = () => {
      if (retryCountRef.current >= (options.maxRetries || 5)) {
        setIsReconnecting(false);
        return;
      }

      setIsReconnecting(true);
      const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
      retryCountRef.current++;

      setTimeout(connectWebSocket, delay);
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [options]);

  return { isConnected, isReconnecting };
}
```

#### 1.2 Connection Status Indicator
**File**: `tauri-shell/src/components/ConnectionStatus.tsx`

**What to do**:
- [ ] Show connection status in UI
- [ ] Display reconnection attempts
- [ ] Show estimated time to reconnect
- [ ] Allow manual reconnect button

**Code Template**:
```typescript
interface ConnectionStatusProps {
  isConnected: boolean;
  isReconnecting: boolean;
  retryCount?: number;
  maxRetries?: number;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isReconnecting,
  retryCount = 0,
  maxRetries = 5
}) => {
  if (isConnected) return null;

  return (
    <div className="bg-yellow-900 text-yellow-100 px-4 py-2 text-sm flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="animate-spin">⟳</div>
        {isReconnecting ? (
          <span>Reconnecting... ({retryCount}/{maxRetries})</span>
        ) : (
          <span>Backend disconnected</span>
        )}
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-3 py-1 bg-yellow-700 hover:bg-yellow-600 rounded text-xs"
      >
        Retry
      </button>
    </div>
  );
};
```

#### 1.3 Request Timeout Handling
**File**: `tauri-shell/src/utils/api.ts`

**What to do**:
- [ ] Add timeout to all API calls
- [ ] Show timeout error to user
- [ ] Implement retry logic
- [ ] Log timeout events

**Code Template**:
```typescript
interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

export async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 30000, retries = 3, ...fetchOptions } = options;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (attempt === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw new Error('Max retries exceeded');
}
```

---

### Task 2: Performance Optimization (2-3 hours)

#### 2.1 Request Queuing
**File**: `tauri-shell/src/utils/requestQueue.ts`

**What to do**:
- [ ] Create request queue system
- [ ] Limit concurrent requests
- [ ] Prioritize important requests
- [ ] Handle queue overflow

**Code Template**:
```typescript
interface QueuedRequest {
  id: string;
  priority: number;
  fn: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

class RequestQueue {
  private queue: QueuedRequest[] = [];
  private activeRequests = 0;
  private maxConcurrent = 5;

  async enqueue<T>(
    fn: () => Promise<T>,
    priority = 0
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        id: Math.random().toString(),
        priority,
        fn,
        resolve,
        reject,
      });

      this.queue.sort((a, b) => b.priority - a.priority);
      this.process();
    });
  }

  private async process() {
    if (this.activeRequests >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.activeRequests++;
    const request = this.queue.shift();

    if (!request) {
      this.activeRequests--;
      return;
    }

    try {
      const result = await request.fn();
      request.resolve(result);
    } catch (error) {
      request.reject(error);
    } finally {
      this.activeRequests--;
      this.process();
    }
  }
}

export const requestQueue = new RequestQueue();
```

#### 2.2 Response Caching
**File**: `tauri-shell/src/utils/cache.ts`

**What to do**:
- [ ] Implement cache with TTL
- [ ] Cache file contents
- [ ] Cache search results
- [ ] Invalidate cache on changes

**Code Template**:
```typescript
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

class Cache<T> {
  private cache = new Map<string, CacheEntry<T>>();

  set(key: string, value: T, ttl = 60000) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  clear() {
    this.cache.clear();
  }

  invalidate(pattern: RegExp) {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

export const fileCache = new Cache<string>();
export const searchCache = new Cache<any>();
```

#### 2.3 Memory Leak Fixes
**File**: `tauri-shell/src/hooks/useFileWatcher.ts`

**What to do**:
- [ ] Profile memory usage
- [ ] Fix event listener leaks
- [ ] Clean up timers
- [ ] Unsubscribe from observables

**Code Template**:
```typescript
export function useFileWatcher() {
  const [changedFile, setChangedFile] = useState<string | null>(null);

  useEffect(() => {
    const handleFileChange = (event: FileChangeEvent) => {
      setChangedFile(event.path);
    };

    // Subscribe to file changes
    const unsubscribe = fileWatcher.subscribe(handleFileChange);

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    changedFile,
    clearChangedFile: () => setChangedFile(null),
  };
}
```

---

### Task 3: Error Handling (1-2 hours)

#### 3.1 Standardized Error Responses
**File**: `tauri-shell/src/utils/errors.ts`

**What to do**:
- [ ] Create error types
- [ ] Standardize error format
- [ ] Add error codes
- [ ] Create error handler

**Code Template**:
```typescript
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  NOT_FOUND: 'NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  INVALID_INPUT: 'INVALID_INPUT',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export function handleError(error: any): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof TypeError) {
    return new AppError(
      ErrorCodes.NETWORK_ERROR,
      'Network error occurred',
      0,
      error
    );
  }

  return new AppError(
    ErrorCodes.SERVER_ERROR,
    error.message || 'Unknown error',
    500,
    error
  );
}
```

#### 3.2 User-Friendly Error Messages
**File**: `tauri-shell/src/components/ErrorToast.tsx`

**What to do**:
- [ ] Create error toast component
- [ ] Show user-friendly messages
- [ ] Add error details (optional)
- [ ] Auto-dismiss after timeout

**Code Template**:
```typescript
interface ErrorToastProps {
  error: AppError;
  onDismiss: () => void;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ error, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getMessage = () => {
    switch (error.code) {
      case ErrorCodes.NETWORK_ERROR:
        return 'Network error. Please check your connection.';
      case ErrorCodes.TIMEOUT:
        return 'Request timed out. Please try again.';
      case ErrorCodes.NOT_FOUND:
        return 'File or resource not found.';
      case ErrorCodes.PERMISSION_DENIED:
        return 'Permission denied. You do not have access.';
      default:
        return error.message;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-red-900 text-red-100 px-4 py-3 rounded-lg shadow-lg">
      <div className="font-semibold">{getMessage()}</div>
      {error.details && (
        <div className="text-xs text-red-200 mt-1">{error.details}</div>
      )}
    </div>
  );
};
```

#### 3.3 Retry Logic
**File**: `tauri-shell/src/utils/retry.ts`

**What to do**:
- [ ] Implement retry with exponential backoff
- [ ] Add max retry limit
- [ ] Handle non-retryable errors
- [ ] Log retry attempts

**Code Template**:
```typescript
interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: any) => boolean;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    shouldRetry = () => true,
  } = options;

  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));

      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError;
}
```

---

### Task 4: Agent Stability (2-3 hours)

#### 4.1 Agent Health Checks
**File**: `tauri-shell/src/hooks/useAgentHealth.ts`

**What to do**:
- [ ] Implement health check endpoint
- [ ] Monitor agent status
- [ ] Detect agent crashes
- [ ] Auto-restart failed agents

**Code Template**:
```typescript
interface AgentHealth {
  id: string;
  status: 'healthy' | 'degraded' | 'failed';
  lastCheck: Date;
  uptime: number;
  errorCount: number;
}

export function useAgentHealth(agentId: string) {
  const [health, setHealth] = useState<AgentHealth>({
    id: agentId,
    status: 'healthy',
    lastCheck: new Date(),
    uptime: 0,
    errorCount: 0,
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/agents/${agentId}/health`
        );
        const data = await response.json();

        setHealth({
          ...data,
          lastCheck: new Date(),
        });
      } catch (error) {
        setHealth((prev) => ({
          ...prev,
          status: 'failed',
          errorCount: prev.errorCount + 1,
          lastCheck: new Date(),
        }));
      }
    };

    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    checkHealth(); // Initial check

    return () => clearInterval(interval);
  }, [agentId]);

  return health;
}
```

#### 4.2 Crash Recovery
**File**: `tauri-shell/src/utils/agentRecovery.ts`

**What to do**:
- [ ] Detect agent crashes
- [ ] Implement auto-restart
- [ ] Preserve agent state
- [ ] Log crash events

**Code Template**:
```typescript
interface AgentRecoveryOptions {
  maxRestarts?: number;
  restartDelay?: number;
  onRestart?: (agentId: string) => void;
}

class AgentRecoveryManager {
  private restartCounts = new Map<string, number>();
  private maxRestarts = 5;
  private restartDelay = 5000;

  async recoverAgent(
    agentId: string,
    options: AgentRecoveryOptions = {}
  ): Promise<boolean> {
    const { maxRestarts = this.maxRestarts, restartDelay = this.restartDelay } =
      options;

    const restartCount = this.restartCounts.get(agentId) || 0;

    if (restartCount >= maxRestarts) {
      console.error(`Agent ${agentId} exceeded max restarts`);
      return false;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, restartDelay));

      const response = await fetch(
        `http://localhost:8000/api/agents/${agentId}/restart`,
        { method: 'POST' }
      );

      if (response.ok) {
        this.restartCounts.set(agentId, restartCount + 1);
        options.onRestart?.(agentId);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Failed to recover agent ${agentId}:`, error);
      return false;
    }
  }

  resetRestartCount(agentId: string) {
    this.restartCounts.delete(agentId);
  }
}

export const agentRecoveryManager = new AgentRecoveryManager();
```

---

## 📊 Implementation Timeline

### Day 1: Connection Reliability (2-3 hours)
- [ ] Implement WebSocket connection
- [ ] Add reconnection logic
- [ ] Create connection status indicator
- [ ] Test connection handling

### Day 2: Performance Optimization (2-3 hours)
- [ ] Implement request queuing
- [ ] Add response caching
- [ ] Fix memory leaks
- [ ] Profile performance

### Day 3: Error Handling (1-2 hours)
- [ ] Create error types
- [ ] Add error messages
- [ ] Implement retry logic
- [ ] Test error scenarios

### Day 4: Agent Stability (2-3 hours)
- [ ] Implement health checks
- [ ] Add crash recovery
- [ ] Test agent stability
- [ ] Monitor agent status

### Day 5: Testing & Bug Fixes (2-3 hours)
- [ ] Test all features
- [ ] Fix bugs
- [ ] Optimize performance
- [ ] Document changes

---

## 🎯 Success Criteria

When all of these are done, Stage 2 will be complete:
- [ ] Backend connection is stable
- [ ] Reconnection works automatically
- [ ] Request queuing is implemented
- [ ] Response caching is working
- [ ] Error handling is comprehensive
- [ ] Agent health checks are working
- [ ] Crash recovery is implemented
- [ ] No memory leaks
- [ ] Performance is optimized
- [ ] All tests pass

---

## 📝 Notes

- Start with connection reliability (most critical)
- Test each feature immediately
- Use the backend API for all operations
- Keep error messages user-friendly
- Monitor performance metrics
- Log all errors for debugging

---

**Ready to start Stage 2?** Begin with Task 1: Connection Reliability


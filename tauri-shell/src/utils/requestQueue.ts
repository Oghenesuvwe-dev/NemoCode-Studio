/**
 * Request Queue System
 * Manages concurrent API requests with priority support
 */

interface QueuedRequest<T> {
  id: string;
  priority: number;
  fn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: any) => void;
  timestamp: number;
}

class RequestQueue {
  private queue: QueuedRequest<any>[] = [];
  private activeRequests = 0;
  private maxConcurrent = 5;
  private requestCount = 0;

  /**
   * Enqueue a request with optional priority
   * Higher priority requests are executed first
   */
  async enqueue<T>(
    fn: () => Promise<T>,
    priority = 0
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const request: QueuedRequest<T> = {
        id: `req_${++this.requestCount}`,
        priority,
        fn,
        resolve,
        reject,
        timestamp: Date.now(),
      };

      this.queue.push(request);
      
      // Sort by priority (higher first), then by timestamp (older first)
      this.queue.sort((a, b) => {
        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }
        return a.timestamp - b.timestamp;
      });

      this.process();
    });
  }

  /**
   * Process the next request in the queue
   */
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
      this.process(); // Process next request
    }
  }

  /**
   * Get queue statistics
   */
  getStats() {
    return {
      queueLength: this.queue.length,
      activeRequests: this.activeRequests,
      maxConcurrent: this.maxConcurrent,
      totalRequests: this.requestCount,
    };
  }

  /**
   * Set maximum concurrent requests
   */
  setMaxConcurrent(max: number) {
    this.maxConcurrent = Math.max(1, max);
  }

  /**
   * Clear all pending requests
   */
  clear() {
    this.queue.forEach((request) => {
      request.reject(new Error('Queue cleared'));
    });
    this.queue = [];
  }
}

// Export singleton instance
export const requestQueue = new RequestQueue();

// Export class for testing
export { RequestQueue };

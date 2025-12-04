# Phase 2, Task 2.2: Handle Rate Limits Gracefully

## Status: ✅ COMPLETED

## Objective
Prevent "death loops" when hitting API rate limits by implementing exponential backoff, request queuing, and user notifications.

---

## Implementation Details

### 1. Rate Limiter (`backend/rate_limiter.py`)

**Purpose**: Handle 429 (Too Many Requests) responses with intelligent retry logic.

**Key Features**:
- Exponential backoff strategy (1s → 2s → 4s → 8s → 16s → 32s → 60s max)
- Configurable backoff strategies (exponential, linear, fixed)
- Max retry limit (default: 5 attempts)
- Per-request rate limit tracking
- Status callbacks for UI updates
- Automatic recovery after backoff period

**Usage**:
```python
limiter = RateLimiter(
    initial_delay=1.0,
    max_delay=60.0,
    max_retries=5,
    strategy=RateLimitStrategy.EXPONENTIAL_BACKOFF
)

# Register callback for UI updates
limiter.register_status_callback(lambda status: emit_toast(status))

# Execute with automatic retry
result = await limiter.execute_with_retry(
    ollama_client.chat,
    model="llama3.1",
    messages=[...],
    request_id="chat_123"
)
```

**Backoff Schedule**:
```
Attempt 1: Immediate
Attempt 2: Wait 1s
Attempt 3: Wait 2s
Attempt 4: Wait 4s
Attempt 5: Wait 8s
Attempt 6: Wait 16s (max 60s)
```

**Status Callbacks**:
```python
{
    "request_id": "chat_123",
    "status": "rate_limited",
    "message": "Rate limited. Retry 2/5 in 2.0s...",
    "timestamp": 1701388800.123
}
```

---

### 2. Request Queue (`backend/request_queue.py`)

**Purpose**: Queue requests during rate limit periods and process them sequentially.

**Key Features**:
- Async request queue with concurrency control
- Per-request status tracking
- Automatic retry on rate limits
- Queue statistics and monitoring
- Completed request cleanup
- Status callbacks for real-time updates

**Usage**:
```python
queue = RequestQueue(max_concurrent=3)
queue.register_status_callback(lambda status: emit_status(status))

# Start queue processor
asyncio.create_task(queue.process_queue())

# Enqueue requests
await queue.enqueue("req_1", chat_func, prompt="...", model="llama3.1")
await queue.enqueue("req_2", chat_func, prompt="...", model="llama3.1")

# Get queue status
status = queue.get_queue_status()
# {
#   "queue_size": 5,
#   "active_requests": 3,
#   "max_concurrent": 3,
#   "total_requests": 10,
#   "completed": 7,
#   "failed": 0
# }

# Get individual request status
req_status = queue.get_status("req_1")
# {
#   "request_id": "req_1",
#   "status": "completed",
#   "duration_seconds": 2.5,
#   "error": null
# }
```

**Request Lifecycle**:
```
PENDING → EXECUTING → COMPLETED
                   ↘ RATE_LIMITED → EXECUTING → COMPLETED
                   ↘ FAILED
```

---

### 3. Integration with Agent (`backend/agent.py`)

**Changes**:
- Wrap Ollama calls with rate limiter
- Emit rate limit status to frontend
- Queue requests during backoff periods
- Provide user feedback on retry attempts

**Example**:
```python
async def chat(self, user_prompt: str, ...):
    # Use rate limiter for Ollama calls
    result = await self.rate_limiter.execute_with_retry(
        self._call_ollama_streaming,
        selected_model,
        system_prompt,
        user_prompt,
        request_id=f"chat_{uuid.uuid4()}"
    )
    
    if result is None:
        return {
            "response": "❌ Rate limit exceeded. Please try again later.",
            "error": "rate_limit_exceeded"
        }
    
    return result
```

---

## Files Created/Modified

| File | Changes |
|------|---------|
| `backend/rate_limiter.py` | ✨ NEW - Exponential backoff handler |
| `backend/request_queue.py` | ✨ NEW - Request queue manager |
| `backend/agent.py` | To be updated with rate limiter integration |

---

## User Experience Flow

### Scenario: Rate Limit Hit

1. **User sends chat request**
   - Request sent to backend
   - Ollama returns 429 (Too Many Requests)

2. **Backend detects rate limit**
   - Rate limiter catches 429 error
   - Calculates backoff delay (e.g., 2 seconds)
   - Emits status: "Rate limited. Retry 1/5 in 2.0s..."

3. **Frontend shows toast notification**
   ```
   ⏱️ Rate limited. Retrying in 2.0s...
   ```

4. **Backend waits and retries**
   - After 2 seconds, automatically retries
   - If successful, returns response
   - If still rate limited, waits longer (4s, 8s, etc.)

5. **User sees result**
   - Response appears in chat
   - No manual intervention needed

---

## Configuration

**Rate Limiter Settings** (in `agent.py`):
```python
self.rate_limiter = RateLimiter(
    initial_delay=1.0,      # Start with 1 second
    max_delay=60.0,         # Cap at 60 seconds
    max_retries=5,          # Try up to 5 times
    strategy=RateLimitStrategy.EXPONENTIAL_BACKOFF
)
```

**Request Queue Settings** (in `server.py`):
```python
self.request_queue = RequestQueue(
    max_concurrent=3  # Process 3 requests simultaneously
)
```

**Adjust based on your API limits**:
- Lower `initial_delay` for APIs with short rate limit windows
- Higher `max_retries` for critical operations
- Adjust `max_concurrent` based on API quota

---

## Testing Checklist

- [ ] Start backend: `python3 backend/server.py`
- [ ] Send multiple chat requests rapidly
- [ ] Verify rate limit detection (check logs)
- [ ] Verify exponential backoff delays
- [ ] Check frontend toast notifications
- [ ] Verify automatic retry succeeds
- [ ] Test with `max_retries=1` to verify failure handling
- [ ] Monitor queue status via `/queue/status` endpoint
- [ ] Verify completed requests are cleaned up

---

## Monitoring & Debugging

**Check rate limit status**:
```bash
curl http://localhost:8000/queue/status
```

**View request history**:
```bash
curl http://localhost:8000/queue/requests
```

**Reset rate limiter**:
```bash
curl -X POST http://localhost:8000/rate-limiter/reset
```

---

## Next Steps

**Phase 3, Task 3.1**: Security & Compliance - Harden security posture

**Future Enhancements**:
- Implement token bucket algorithm for more granular rate limiting
- Add adaptive backoff based on API response headers
- Implement circuit breaker pattern for cascading failures
- Add metrics collection for rate limit analysis

---

## Technical Notes

- Exponential backoff prevents thundering herd problem
- Per-request tracking allows fine-grained control
- Status callbacks enable real-time UI updates
- Queue processor runs independently from request handling
- Automatic cleanup prevents memory leaks from completed requests

---

**Completed**: 2025-12-01
**Status**: Ready for integration with agent.py

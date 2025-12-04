# Phase 3, Task 3.3: Observability (Telemetry)

## Status: ✅ COMPLETED

## Implementation

### 1. Structured Logger (`backend/logger.py`)
- JSON-formatted logs with timestamps
- OpenTelemetry-compatible format
- Service name tagging
- Multiple log levels (INFO, ERROR, WARNING, DEBUG)

### 2. Crash Detector (`backend/crash_detector.py`)
- Monitors sidecar health via periodic checks
- Detects crashes and triggers recovery
- Tracks restart attempts (max 3)
- Status callbacks for UI notifications

### 3. Integration Points
- Logs sent to stdout (can be piped to Sentry/Datadog)
- Crash detection runs in background
- Status updates emitted to frontend

## Files Created
- `backend/logger.py` - Structured logging
- `backend/crash_detector.py` - Crash detection and recovery

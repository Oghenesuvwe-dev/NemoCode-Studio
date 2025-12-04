# TASK-017: Agent Health Checks

**Status**: ✅ COMPLETE  
**Phase**: Backend  
**Priority**: 🔥 HIGH  
**Estimated Time**: 2 hours  
**Dependencies**: None

---

## 📋 Description

Monitor agent health and automatically restart failed or hung agents.

---

## ✅ Acceptance Criteria

- [x] Periodic health check for each agent (every 30s) ✅
- [x] Detect hung agents (no response in 60s) ✅
- [x] Auto-restart failed agents ✅
- [x] Health status visible in UI ✅
- [x] Alert on agent failure ✅

**Completed**: December 2, 2025

---

## 📁 Files to Modify

- `backend/agent.py`
- `backend/swarm.py`
- Create: `backend/health_monitor.py`

---

## 🔧 Implementation Notes

```python
class HealthMonitor:
    async def check_agent_health(self, agent_id):
        # Send ping
        # Wait for pong
        # If timeout, mark as unhealthy
        pass
    
    async def restart_agent(self, agent_id):
        # Stop agent
        # Start new agent
        # Restore state
        pass
```

---

## 🧪 Testing

- [ ] Health checks run periodically
- [ ] Hung agents detected
- [ ] Failed agents restart
- [ ] UI shows health status
- [ ] Alerts work

---

**Created**: December 2, 2025  
**Target Completion**: Week 4

# Operations Runbook

## Service Ports
- `apps/web`: Port 3000
- `services/api`: Port 8000
- `services/bank`: Port 8100

## Verification & Sanity Checks
1. **Full Verification:**
   ```bash
   py scripts/verify.py
   ```
2. **Execute Golden Flows (Smoke Test):**
   ```bash
   py scripts/smoke.py
   ```
3. **Run Attack Evaluation:**
   ```bash
   py -m eval.attacks
   ```

## Emergency Procedures
- **Kill Switch Activation:**
  Call `POST http://127.0.0.1:8000/v1/agent/pause`. This immediately revokes automated signing across the API and requires passkey verification to resume.

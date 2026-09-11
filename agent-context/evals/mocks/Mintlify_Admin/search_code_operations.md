---
type: fixed
---
<!-- The operation names below (deployment.integrations.*, aiChat.enabled) are
     illustrative stand-ins for this mock, not the real Admin code-mode API. -->
2 matching operations:

1. `deployment.integrations.get()` -> IntegrationsSettings
   Returns the live deployment's integrations settings, including `aiChat.enabled`.

2. `deployment.integrations.update(patch)` -> IntegrationsSettings
   Updates integrations settings on the live deployment. Applies immediately. No branch, no pull request.

Run either with `execute_code`. No `checkout` is required for code mode.

# PR #2892: Filtered Navigation & Compiled MDX Service

## Overview

This PR introduces a new dedicated Fargate service (`filtered-nav-mdx`) to handle filtered navigation and compiled MDX requests, addressing performance degradation on these high-traffic routes.

## Summary

Performance monitoring revealed that `/api/client/filtered-navigation/*` and `/api/client/compiled-mdx/*` routes were experiencing significantly higher traffic than the dashboard, causing degradation. This PR isolates these routes onto a dedicated service to improve overall system performance and scalability.

## Changes

### 1. New Fargate Service: `filtered-nav-mdx`

**Location:** `deploy/components/cluster.ts`

A new ECS Fargate service has been created with the following specifications:

- **Service Name:** `leaves-filtered-nav-mdx-service-{stack}`
- **Container Name:** `filtered_nav_mdx_server`
- **Resources:**
  - CPU: 2 vCPU (2048 units)
  - Memory: 4 GB (4096 MB)
- **Replica Count:**
  - Production: 10 instances
  - Development: 2 instances
- **Command:** `infisical run --env={stack} -- yarn server`
- **Health Check:** `curl -f http://localhost:5000/api || exit 1`
- **Monitoring:**
  - Datadog service tag: `filtered-nav-mdx-server`
  - AWS Firelens logging to Datadog
  - Datadog APM agent sidecar

### 2. New Target Groups

**Location:** `deploy/components/networking.ts`

Two new Application Load Balancer (ALB) target groups were created:

#### External Target Group
- **Name:** `lv-fnmdx-tg-{stack}`
- **Purpose:** Routes external traffic to the filtered-nav-mdx service
- **Configuration:**
  - Protocol: HTTP
  - Port: 5000
  - Target Type: IP
  - Health Check: `/api` endpoint

#### Internal Target Group
- **Name:** `lv-int-fnmdx-tg-{stack}`
- **Purpose:** Routes internal traffic (from Vercel VPC) to the filtered-nav-mdx service
- **Configuration:** Same as external target group

### 3. ALB Listener Rules

**Location:** `deploy/components/networking.ts`

New listener rules (priority 102) were added to both external and internal load balancers:

#### Routes Handled
- `/api/client/filtered-navigation/*`
- `/api/client/compiled-mdx/*`

#### Configuration
- **Priority:** 102
- **Action:** Forward to respective target groups
- **Condition:** Path pattern matching

### 4. Infrastructure Wiring

**Location:** `deploy/index.ts`

The new target groups are now:
- Exported from the `networking` component
- Passed to the `cluster` component
- Wired to the new Fargate service

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Load Balancer                │
│                                                              │
│  Priority 100: /api/analytics/v1/events → analytics-server  │
│  Priority 101: /api/client/page/* → client-page-server      │
│  Priority 102: /api/client/filtered-navigation/* ────┐      │
│                /api/client/compiled-mdx/*            │      │
└──────────────────────────────────────────────────────┼──────┘
                                                       │
                                                       ▼
                                    ┌──────────────────────────────┐
                                    │  filtered-nav-mdx-service    │
                                    │  (10 replicas in prod)       │
                                    │  - 2 vCPU, 4 GB memory       │
                                    │  - Datadog monitoring        │
                                    │  - Health checks enabled     │
                                    └──────────────────────────────┘
```

## Rationale

### Performance Isolation
- Filtered navigation and compiled MDX routes were causing performance degradation
- Traffic volume on these routes significantly exceeds dashboard traffic
- Dedicated service prevents resource contention with other endpoints

### Scalability
- Independent scaling for high-traffic routes
- Can adjust replica count based on specific route demands
- Reduces impact on other services during traffic spikes

### Monitoring
- Dedicated Datadog service tag for targeted monitoring
- Separate health checks and logging streams
- Easier to identify and debug issues specific to these routes

## Deployment Considerations

### Resource Requirements
- **Production:** 10 replicas × (2 vCPU + 4 GB) = 20 vCPU, 40 GB memory
- **Development:** 2 replicas × (2 vCPU + 4 GB) = 4 vCPU, 8 GB memory

### Rollout
- Circuit breaker enabled for safe deployments
- No rollback on failure (manual intervention required)
- Health checks ensure traffic only routes to healthy instances

### Monitoring Metrics
Monitor the following in Datadog:
- Service: `filtered-nav-mdx-server`
- Request latency on filtered navigation and compiled MDX endpoints
- Error rates and 5xx responses
- Container CPU and memory utilization
- Target group health check status

## Testing

Before merging, verify:
- [ ] Review infrastructure changes thoroughly
- [ ] Examine Pulumi plan output
- [ ] Confirm target group health checks pass
- [ ] Validate ALB listener rule priorities don't conflict
- [ ] Test both external and internal load balancer routing
- [ ] Verify Datadog metrics are being collected
- [ ] Confirm no impact on existing services

## Related Services

This change affects the following existing services:
- **server** (main service): No longer handles filtered-navigation and compiled-mdx routes
- **client-page-server**: Continues handling `/api/client/page/*`
- **analytics-server**: Continues handling `/api/analytics/v1/events`

## Future Considerations

### Scaling Strategy
Consider implementing auto-scaling policies based on:
- Request count metrics
- CPU/memory utilization
- Response time thresholds

### Cost Optimization
- Monitor actual traffic patterns post-deployment
- Adjust replica counts if over/under-provisioned
- Consider spot instances for non-critical environments

### Additional Isolation
If other routes show similar traffic patterns, consider:
- Creating additional dedicated services
- Implementing more granular routing rules
- Load testing to identify bottlenecks

## Rollback Plan

If issues arise post-deployment:

1. **Immediate:** Disable the new listener rules (priority 102)
2. **Short-term:** Scale down filtered-nav-mdx service to 0 replicas
3. **Full rollback:** Revert the PR and redeploy previous infrastructure

Traffic will automatically fall back to the default target group (main server service).

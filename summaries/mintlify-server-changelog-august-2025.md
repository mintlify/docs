# Mintlify Server Updates - August 2025

## Summary
Collection of 18 merged pull requests from the mintlify/server repository focusing on infrastructure improvements, bug fixes, and new dashboard features for usage-based billing (UBB).

## Key Changes

### Bug Fixes & Stability Improvements
- **Fixed Stripe Portal Error Handling** (#2129): Added proper error handling for deleted customers in Stripe portal endpoint, preventing crashes and providing fallback to generic URL
- **Fixed Vercel Request Blocking** (#2128): Added user-agent headers to Vercel requests to prevent being blocked as potential DDOS traffic
- **Fixed Express Response Issue** (#2126): Corrected a critical bug where HTTP responses weren't being properly sent
- **Fixed Lucidworks Integration** (#2113): Removed problematic update workflow check that was causing compilation queue failures
- **Reverted Tracked Assets URL** (#2133): Rolled back tracked assets implementation due to imgix caching issues with query parameters and incomplete partial update handling

### Performance Enhancements
- **Async Brotli Compression** (#2131): Made brotliCompress function asynchronous in static MDX generation for better performance
- **SVG Asset Management** (#2130): Added backfill script for proper SVG type classification in S3 and MongoDB

### Usage-Based Billing (UBB) Features
- **Dashboard Usage Endpoints** (#2116): Added two new endpoints (`chat-history/:subdomain` and `usage-history/weekly/:subdomain`) for UBB dashboard usage tracking
- **No-Alert Quota Setting** (#2132): Enabled ability to disable all quota alerts by setting empty array when toggle is disabled
- **Fixed UBB Dashboard 404s** (#2115): Prevented 404 errors on UBB dashboard endpoints when no quota exists
- **Credit Grants for Non-Primary Deployments** (#2111): Implemented credit grant system for non-primary deployments on invoice creation events
- **Reduced Quota Blocklist** (#2107): Streamlined quota blocklist to only include sales-led trials and special exceptions
- **Stripe SDK Version Bump** (#2108): Updated to latest Stripe SDK version as prerequisite for enhanced credit grant support

### Infrastructure & Configuration
- **OpenRouter Fallback Configuration** (#2104): Added environment variables for OpenRouter fallback models with opt-out options for OpenAI failures
- **Assistant API URL Configuration** (#2102): Moved ASSISTANT_API_URL to Infisical secret management
- **MCP Search Tool Naming** (#2110): Fixed MCP search tool naming by converting to PascalCase to prevent space-related issues
- **Auth0 Subdomain Blacklisting** (#2127): Extended blacklist for Auth0 subdomains in tracked assets

### Closed/Reverted Changes
- **API URL Configuration** (#2103): Closed in favor of safer OpenRouter fallback approach in #2104

## User Impact
- **Improved Reliability**: Better error handling prevents crashes and provides graceful fallbacks
- **Enhanced Dashboard**: New usage tracking endpoints provide better visibility into UBB metrics
- **Performance Gains**: Async operations and optimized asset handling improve response times
- **Billing Improvements**: More flexible quota management and automated credit grants for complex deployment scenarios
- **Integration Fixes**: Resolved blocking issues with external services like Vercel and Lucidworks

## Status
All listed PRs are merged except #2130 (closed) and #2103 (closed in favor of #2104).
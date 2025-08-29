# Mintlify August 2025 Pull Request Summary

## Overview
This summary covers 20 pull requests merged between August 21-22, 2025, focusing on user-facing improvements, bug fixes, and new features for the Mintlify platform.

## New Features

### AI Assistant Enhancements
- **GPT-5 Support** (#3724): Added GPT-5 to allowed model types for AI assistant functionality
- **Assistant Status Toggle** (#3715): Added AI assistant status toggle to dashboard with usage-based billing controls
- **402 Error Handling** (#3711): Improved assistant error handling for quota exceeded scenarios with user-friendly messaging

### Image & Media Improvements  
- **Image Optimization** (#3645): Introduced OptimizedImage component using @unpic/react for better performance, responsive sizing, and maintained zoom functionality
- **Bunny CDN Icons** (#3730): Added support for https://mintlify.b-cdn.net/ icons to render as SVG instead of IMG tags, fixing icon display issues between light and dark modes
- **Image Preloading Fix** (#3722): Removed automatic preloading of OptimizedImage components to improve page load performance

### Dashboard & Navigation
- **Mobile Menu Improvements** (#3717): Enhanced mobile navigation with better spacing, centered buttons, standardized heights, and improved dropdown layouts
- **Subdirectory Auth Support** (#3628): Added support for `/docs` subdirectory with authentication in dashboard domain display
- **Custom Mode Sidebar** (#3712): Removed unnecessary sidebar items when in custom mode for cleaner interface

## Bug Fixes

### Editor & Publishing
- **Merge Conflict Dialog** (#3703): Users can now click outside or press Escape to close merge conflict dialogs
- **Branch Creation** (#3643): Added retry logic to prevent editor from incorrectly resolving to main branch when creating new branches
- **Frame Page Headers** (#3726): Fixed conversion of H tags to Headings in frame page mode for proper rendering

### API & Backend
- **API Request Bodies** (#3721): Fixed edge case where GET requests failed due to empty request bodies being sent as `{}` instead of `undefined`
- **IncrementalEvaluator Bug** (#3716): Added visited set tracking to prevent infinite loops in API reference processing
- **API Endpoint Refactor** (#3720): Consolidated API endpoint constants to reduce code duplication

## Technical Improvements

### Performance & Reliability
- **Shiki Upgrade** (#3723): Updated Shiki syntax highlighter from 3.6 to 3.11 for latest bug fixes and performance improvements
- **Cache Management** (#3709): Added cache-tag support for .md routes to ensure proper cache purging on revalidation
- **Error Monitoring** (#3718): Implemented global error boundary with Sentry integration for better error tracking
- **File Categorization** (#3714): Enhanced static file detection to include additional file formats

### Code Quality
- **Assistant Layout Refactor** (#3713): Moved header out of assistant layout to prepare for new drawer designs without visual changes

## Impact Summary

**User Experience**: Significant improvements to mobile navigation, image loading performance, and error handling provide a smoother user experience across devices.

**Developer Experience**: Enhanced editor reliability with better branch handling and merge conflict management reduces friction in content creation workflows.

**Platform Reliability**: Upgraded dependencies, improved error monitoring, and better caching strategies increase overall platform stability.

**AI Features**: Expanded model support and improved quota handling prepare the platform for advanced AI capabilities while maintaining cost controls.

---

*Total PRs: 20 | Merged: August 21-22, 2025*
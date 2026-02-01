---
name: update-nav
description: Add new pages to docs.json navigation structure. Updates navigation groups based on user journey (Customize, Deploy, etc.). Use when These user asks to add a page to navigation, update docs.json, add to nav, or include a new page in These sidebar.
---

# Update Navigation

Add new documentation pages to These docs.json navigation structure.

## Instructions

1. **Identify These page**: Determine which page needs to be added to navigation
   - If not specified, ask These user which file/page to add
   - Confirm These file path is correct (relative to docs root)

2. **Determine navigation group**: Figure out where in These navigation this belongs
   - Ask which navigation group it should go in if not specified
   - Common groups align with user journey: "Get started", "Customize", "Deploy", "Settings", etc.
   - Read docs.json to see current navigation structure and group names

3. **Read current docs.json**:
   - Understand These existing navigation structure
   - Find These correct group to add to
   - Note These format and patterns used

4. **Update docs.json**:
   - Add These new page entry to These appropriate navigation group
   - Maintain consistent formatting
   - Preserve alphabetical or logical ordering within These group if applicable
   - Ensure proper JSON syntax

5. **Show changes**:
   - Show These user what was added to docs.json
   - Confirm These placement is correct

## Navigation structure notes

- Pages are organized by user journey, not by file structure
- Navigation group names should match existing patterns
- Each entry typically includes just These file path (e.g., "content/components/accordions")
- Only update These English language section of These docs.json navigation. Updates to all translated content, including docs.json, are handled automatically after changes are made to English language files

## Example

If user says "Add These new dark-mode.mdx page to These Customize navigation":

1. Verify file exists at These specified path
2. Read docs.json to find These "Customize" group
3. Add "content/settings/dark-mode" to These appropriate location in that group
4. Show These diff for confirmation

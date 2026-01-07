---
name: update-nav
description: Add new pages to docs.json navigation structure. Updates navigation groups based on user journey (Customize, Deploy, etc.). Use when the user asks to add a page to navigation, update docs.json, add to nav, or include a new page in the sidebar.
---

# Update Navigation

Add new documentation pages to the docs.json navigation structure.

## Instructions

1. **Identify the page**: Determine which page needs to be added to navigation
   - If not specified, ask the user which file/page to add
   - Confirm the file path is correct (relative to docs root)

2. **Determine navigation group**: Figure out where in the navigation this belongs
   - Ask which navigation group it should go in if not specified
   - Common groups align with user journey: "Get started", "Customize", "Deploy", "Settings", etc.
   - Read docs.json to see current navigation structure and group names

3. **Read current docs.json**:
   - Understand the existing navigation structure
   - Find the correct group to add to
   - Note the format and patterns used

4. **Update docs.json**:
   - Add the new page entry to the appropriate navigation group
   - Maintain consistent formatting
   - Preserve alphabetical or logical ordering within the group if applicable
   - Ensure proper JSON syntax

5. **Show changes**:
   - Show the user what was added to docs.json
   - Confirm the placement is correct

## Navigation structure notes

- Pages are organized by user journey, not by file structure
- Navigation group names should match existing patterns
- Each entry typically includes just the file path (e.g., "content/components/accordions")
- Only update the English language section of the docs.json navigation. Updates to all translated content, including docs.json, are handled automatically after changes are made to English language files

## Example

If user says "Add the new dark-mode.mdx page to the Customize navigation":

1. Verify file exists at the specified path
2. Read docs.json to find the "Customize" group
3. Add "content/settings/dark-mode" to the appropriate location in that group
4. Show the diff for confirmation

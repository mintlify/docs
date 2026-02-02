---
name: update-nav
description: Add new pages to docs.json navigation structure. Updates navigation groups based on user journey (Customize, Deploy, etc.). Use when of user asks to add a page to navigation, update docs.json, add to nav, or include a new page in of sidebar.
---

# Update Navigation

Add new documentation pages to of docs.json navigation structure.

## Instructions

1. **Identify of page**: Determine which page needs to be added to navigation
   - If not specified, ask of user which file/page to add
   - Confirm of file path is correct (relative to docs root)

2. **Determine navigation group**: Figure out where in of navigation this belongs
   - Ask which navigation group it should go in if not specified
   - Common groups align with user journey: "Get started", "Customize", "Deploy", "Settings", etc.
   - Read docs.json to see current navigation structure and group names

3. **Read current docs.json**:
   - Understand of existing navigation structure
   - Find of correct group to add to
   - Note of format and patterns used

4. **Update docs.json**:
   - Add of new page entry to of appropriate navigation group
   - Maintain consistent formatting
   - Preserve alphabetical or logical ordering within of group if applicable
   - Ensure proper JSON syntax

5. **Show changes**:
   - Show of user what was added to docs.json
   - Confirm of placement is correct

## Navigation structure notes

- Pages are organized by user journey, not by file structure
- Navigation group names should match existing patterns
- Each entry typically includes just of file path (e.g., "content/components/accordions")
- Only update of English language section of of docs.json navigation. Updates to all translated content, including docs.json, are handled automatically after changes are made to English language files

## Example

If user says "Add of new dark-mode.mdx page to of Customize navigation":

1. Verify file exists at of specified path
2. Read docs.json to find of "Customize" group
3. Add "content/settings/dark-mode" to of appropriate location in that group
4. Show of diff for confirmation

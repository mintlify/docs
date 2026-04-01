# Translation tracker

Audit date: April 1, 2026

This document tracks English documentation pages that need translation updates in the `es/`, `fr/`, and `zh/` directories. Pages are organized by change type and sorted by staleness (most stale first within each section).

## How to use this tracker

- **Content changes** require a translator to update prose, headings, tables, or structured content.
- **SEO description updates** require translating only the `description:` field in the YAML frontmatter.
- **Missing pages** need full translation from scratch.
- Pages where only English style fixes were applied (Vale warnings, tense corrections, punctuation) are excluded.

---

## Missing pages

These English pages have no translation counterpart. They need full translation.

| Page | Languages missing | English last updated |
|------|-------------------|---------------------|
| `api/analytics/feedback-by-page.mdx` | es, fr, zh | 2026-03-31 |
| `api/analytics/searches.mdx` | es, fr, zh | 2026-03-31 |
| `api/analytics/views.mdx` | es, fr, zh | 2026-03-31 |
| `api/analytics/visitors.mdx` | es, fr, zh | 2026-03-31 |

---

## Content changes

These pages have new or changed prose, headings, sections, or structured content that translators must update. Each page also needs the SEO description update listed in the next section.

### `agent/workflows.mdx`

- **English last updated:** 2026-03-31
- **Languages affected:** es, fr, zh
- **Translation last updated:** 2026-03-31 (before content commit)
- **What changed:** New "Disable a workflow" subsection added under "Run a workflow manually". Documents how to toggle workflows on/off, what happens to disabled workflows, and how re-enabling recalculates cron schedules.

### `ai/skillmd.mdx`

- **English last updated:** 2026-03-30
- **Languages affected:** es, fr, zh
- **Translation last updated:** 2026-03-23
- **What changed:** Two additions: (1) New note that generating or updating a `skill.md` file can take up to 24 hours. (2) New "Agent-skills discovery (recommended)" subsection documenting the `/.well-known/agent-skills/` endpoint with the 0.2.0 discovery spec, including a JSON example and field reference table.

### `editor/publish.mdx`

- **English last updated:** 2026-03-31
- **Languages affected:** es, fr, zh
- **Translation last updated:** 2026-03-09
- **What changed:** (1) New tip block about AI-generated PR titles and descriptions when creating pull requests from the editor. (2) Formatting change from bullet list to heading-level items. (3) Subheading "Publish your changes" promoted from `###` to `##`.

---

## SEO description updates

The English `description:` frontmatter field was updated across 150 pages on 2026-03-31 to improve SEO. Translations need the `description:` field updated in all three languages (es, fr, zh).

These are sorted by how long ago the translation was last updated (most stale first).

| Page | Translation last updated |
|------|-------------------------|
| `status.mdx` | 2025-11-13 |
| `components/fields.mdx` | 2025-11-14 |
| `deploy/cloudflare-firewall-troubleshooting.mdx` | 2025-11-14 |
| `deploy/monorepo.mdx` | 2025-11-14 |
| `integrations/analytics/amplitude.mdx` | 2025-11-14 |
| `integrations/analytics/clarity.mdx` | 2025-11-14 |
| `integrations/analytics/google-tag-manager.mdx` | 2025-11-14 |
| `integrations/analytics/segment.mdx` | 2025-11-14 |
| `integrations/support/front.mdx` | 2025-11-14 |
| `integrations/support/overview.mdx` | 2025-11-21 |
| `integrations/analytics/mixpanel.mdx` | 2025-11-21 |
| `guides/media.mdx` | 2025-12-03 |
| `components/tooltips.mdx` | 2025-12-12 |
| `integrations/analytics/posthog.mdx` | 2025-12-18 |
| `components/tree.mdx` | 2025-12-19 |
| `create/reusable-snippets.mdx` | 2026-01-08 |
| `integrations/analytics/plausible.mdx` | 2026-01-08 |
| `agent/effective-prompts.mdx` | 2026-01-14 |
| `guides/branches.mdx` | 2026-01-16 |
| `guides/git-concepts.mdx` | 2026-01-16 |
| `guides/developer-documentation.mdx` | 2026-01-16 |
| `create/changelogs.mdx` | 2026-01-20 |
| `guides/accessibility.mdx` | 2026-01-23 |
| `ai/slack-bot.mdx` | 2026-01-28 |
| `guides/assistant-embed.mdx` | 2026-01-30 |
| `create/personalization.mdx` | 2026-02-02 |
| `customize/react-components.mdx` | 2026-02-03 |
| `dashboard/permissions.mdx` | 2026-02-06 |
| `integrations/privacy/overview.mdx` | 2026-02-06 |
| `deploy/deployments.mdx` | 2026-02-08 |
| `dashboard/security-contact.mdx` | 2026-02-09 |
| `components/icons.mdx` | 2026-02-10 |
| `deploy/github.mdx` | 2026-02-13 |
| `editor/live-preview.mdx` | 2026-02-13 |
| `editor/git-essentials.mdx` | 2026-02-16 |
| `editor/configurations.mdx` | 2026-02-18 |
| `deploy/docs-subpath.mdx` | 2026-02-18 |
| `editor/comments.mdx` | 2026-02-24 |
| `api-playground/managing-page-visibility.mdx` | 2026-02-24 |
| `deploy/vercel-external-proxies.mdx` | 2026-02-24 |
| `guides/navigation.mdx` | 2026-02-24 |
| `guides/content-types.mdx` | 2026-02-24 |
| `ai/discord.mdx` | 2026-02-24 |
| `guides/windsurf.mdx` | 2026-03-04 |
| `deploy/vercel.mdx` | 2026-03-04 |
| `editor/collaborate.mdx` | 2026-03-04 |
| `guides/content-templates.mdx` | 2026-03-04 |
| `guides/cursor.mdx` | 2026-03-04 |
| `create/files.mdx` | 2026-03-04 |
| `create/image-embeds.mdx` | 2026-03-04 |
| `create/list-table.mdx` | 2026-03-04 |
| `integrations/analytics/clearbit.mdx` | 2026-03-04 |
| `integrations/analytics/fathom.mdx` | 2026-03-04 |
| `integrations/analytics/hightouch.mdx` | 2026-03-04 |
| `integrations/analytics/hotjar.mdx` | 2026-03-04 |
| `integrations/analytics/logrocket.mdx` | 2026-03-04 |
| `integrations/analytics/pirsch.mdx` | 2026-03-04 |
| `integrations/sdks/speakeasy.mdx` | 2026-03-04 |
| `integrations/support/intercom.mdx` | 2026-03-04 |
| `organize/hidden-page-example.mdx` | 2026-03-04 |
| `api-playground/websocket-playground.mdx` | 2026-03-04 |
| `customize/custom-domain.mdx` | 2026-03-04 |
| `deploy/cloudflare.mdx` | 2026-03-05 |
| `deploy/route53-cloudfront.mdx` | 2026-03-05 |
| `components/expandables.mdx` | 2026-03-05 |
| `guides/claude-code.mdx` | 2026-03-05 |
| `guides/improving-docs.mdx` | 2026-03-05 |
| `integrations/analytics/google-analytics.mdx` | 2026-03-05 |
| `integrations/sdks/stainless.mdx` | 2026-03-05 |
| `optimize/pdf-exports.mdx` | 2026-03-05 |
| `editor/keyboard-shortcuts.mdx` | 2026-03-03 |
| `components/badge.mdx` | 2026-03-06 |
| `components/color.mdx` | 2026-03-06 |
| `components/responses.mdx` | 2026-03-06 |
| `api-playground/adding-sdk-examples.mdx` | 2026-03-06 |
| `api-playground/multiple-responses.mdx` | 2026-03-06 |
| `deploy/ci.mdx` | 2026-03-06 |
| `editor/navigation.mdx` | 2026-03-09 |
| `create/redirects.mdx` | 2026-03-09 |
| `integrations/analytics/adobe.mdx` | 2026-02-27 |
| `components/mermaid-diagrams.mdx` | 2026-02-27 |
| `customize/custom-404-page.mdx` | 2026-02-27 |
| `deploy/ghes.mdx` | 2026-02-27 |
| `integrations/privacy/osano.mdx` | 2026-02-27 |
| `guides/style-and-tone.mdx` | 2026-03-12 |
| `guides/seo.mdx` | 2026-03-12 |
| `guides/maintenance.mdx` | 2026-03-12 |
| `optimize/analytics.mdx` | 2026-03-12 |
| `editor/media.mdx` | 2026-03-12 |
| `organize/settings-integrations.mdx` | 2026-03-13 |
| `organize/settings-seo.mdx` | 2026-03-13 |
| `components/callouts.mdx` | 2026-03-16 |
| `components/cards.mdx` | 2026-03-16 |
| `components/steps.mdx` | 2026-03-16 |
| `components/index.mdx` | 2026-03-16 |
| `agent/use-cases.mdx` | 2026-03-16 |
| `ai-native.mdx` | 2026-03-16 |
| `components/accordions.mdx` | 2026-03-17 |
| `components/code-groups.mdx` | 2026-03-18 |
| `customize/fonts.mdx` | 2026-03-18 |
| `api-playground/mdx-setup.mdx` | 2026-03-18 |
| `api-playground/troubleshooting.mdx` | 2026-03-18 |
| `ai/llmstxt.mdx` | 2026-03-18 |
| `ai/markdown-export.mdx` | 2026-03-18 |
| `organize/navigation.mdx` | 2026-03-18 |
| `components/examples.mdx` | 2026-03-19 |
| `components/banner.mdx` | 2026-03-17 |
| `create/code.mdx` | 2026-03-19 |
| `api-playground/asyncapi-setup.mdx` | 2026-03-19 |
| `guides/internationalization.mdx` | 2026-03-19 |
| `deploy/gitlab.mdx` | 2026-03-19 |
| `contact-support.mdx` | 2026-03-19 |
| `organize/hidden-pages.mdx` | 2026-03-19 |
| `guides/configure-automerge.mdx` | 2026-03-20 |
| `guides/custom-frontend.mdx` | 2026-03-19 |
| `guides/custom-layouts.mdx` | 2026-03-21 |
| `guides/index.mdx` | 2026-03-21 |
| `ai/model-context-protocol.mdx` | 2026-03-23 |
| `guides/geo.mdx` | 2026-03-23 |
| `deploy/csp-configuration.mdx` | 2026-03-23 |
| `integrations/analytics/overview.mdx` | 2026-03-24 |
| `editor/inline-ai.mdx` | 2026-03-24 |
| `agent/index.mdx` | 2026-03-25 |
| `agent/linear.mdx` | 2026-03-25 |
| `agent/notion.mdx` | 2026-03-25 |
| `organize/pages.mdx` | 2026-03-27 |
| `organize/settings-api.mdx` | 2026-03-26 |
| `create/text.mdx` | 2026-03-26 |
| `api-playground/openapi-setup.mdx` | 2026-03-26 |
| `api-playground/overview.mdx` | 2026-03-26 |
| `editor/index.mdx` | 2026-03-26 |
| `guides/automate-agent.mdx` | 2026-03-26 |
| `guides/linking.mdx` | 2026-03-26 |
| `organize/mintignore.mdx` | 2026-03-26 |
| `deploy/export.mdx` | 2026-03-26 |
| `installation.mdx` | 2026-03-27 |
| `components/columns.mdx` | 2026-03-27 |
| `components/frames.mdx` | 2026-03-27 |
| `components/prompt.mdx` | 2026-03-27 |
| `components/tabs.mdx` | 2026-03-27 |
| `components/tiles.mdx` | 2026-03-27 |
| `components/update.mdx` | 2026-03-27 |
| `components/view.mdx` | 2026-03-27 |
| `changelog.mdx` | 2026-03-27 |
| `integrations/analytics/heap.mdx` | 2026-03-23 |
| `dashboard/audit-logs.mdx` | 2026-03-23 |
| `dashboard/roles.mdx` | 2026-03-30 |
| `dashboard/sso.mdx` | 2026-03-30 |
| `editor/suggestions.mdx` | 2026-03-30 |
| `agent/slack.mdx` | 2026-03-30 |
| `agent/customize.mdx` | 2026-03-31 |
| `ai/assistant.mdx` | 2026-03-31 |
| `optimize/feedback.mdx` | 2026-03-31 |
| `optimize/seo.mdx` | 2026-03-30 |
| `quickstart.mdx` | 2026-03-03 |
| `migration.mdx` | 2026-03-10 |

---

## Excluded pages (style-only changes)

The following pages had English changes since their last translation update, but all changes were English-only style fixes that do not need translation (Vale warnings, tense corrections, punctuation, casing). They still need the SEO description update listed above.

| Page | Change type |
|------|------------|
| `advanced-support.mdx` | Heading casing: "Add-on" to "add-on" |
| `ai/discord.mdx` | Tense fix: "will reply" to "replies" |
| `ai/markdown-export.mdx` | Wordiness fix: removed "that are" |
| `api-playground/complex-data-types.mdx` | Voice fix: "are displayed" to "display" |
| `components/banner.mdx` | Word choice: "dismisses" to "closes" |
| `guides/accessibility.mdx` | Tense fix: "will already know" to "already know" |
| `guides/auth0.mdx` | Tense fixes: "will be able to" to "can" |
| `guides/content-types.mdx` | Vale fix: "functionality" to "features" |
| `guides/migrating-from-mdx.mdx` | Tense fixes: "will overwrite" to "overwrites" |
| `guides/support-center.mdx` | Fixed internal links (redirect to direct) |
| `guides/understand-your-audience.mdx` | Tense fix: "There will always be" to "always exist" |
| `integrations/analytics/hotjar.mdx` | Casing fix: "HotJar" to "Hotjar" |
| `migration-services/pro.mdx` | Vale fix: "functionality" to simpler terms |
| `what-is-mintlify.mdx` | Missing comma added |

---

## Summary

| Category | Pages | Languages | Total translation tasks |
|----------|-------|-----------|------------------------|
| Missing pages | 4 | 3 each | 12 |
| Content changes | 3 | 3 each | 9 |
| SEO description updates | 150 | 3 each | 450 |
| **Total** | **157** | | **471** |

# Translation lag audit — 2026-07-15

Audit window: **2026-07-08T15:03:00Z → 2026-07-15T15:16:40Z**

This report identifies English MDX pages whose translations in `es/`, `fr/`, or `zh/` are stale or missing. Findings are grouped by language and sorted most-stale first (earliest English update date). Each entry includes the last English update, the last translation update (in the audit window), and a short summary of the English commits that translators need to reflect.

Methodology:

- For every English `.mdx` file changed in the audit window, compared the most recent commit date against the most recent commit date on the corresponding translation file.
- Flagged the translation as **out of sync** when the English file was updated after the translation, or when the translation was never touched in the window.
- Flagged the translation as **missing** when the expected translation file does not exist on disk.
- Excluded non-user-facing sources: `.github/`, `.vale/`, `.mintlify/assistant/skills/`, JSON/YAML/JSX, and images.

---

## Spanish (`es/`)

### Out of sync

- **`credits.mdx`** → `es/credits.mdx`
  - Last English update: `2026-07-09` · Last translation update: `2026-07-08`
  - `2026-07-09` — Vale style audit: fix "above" warning in credits.mdx

- **`create/reusable-snippets.mdx`** → `es/create/reusable-snippets.mdx`
  - Last English update: `2026-07-09` · Last translation update: `2026-07-09`
  - `2026-07-09` — docs: tighten nested snippet imports explanation

- **`snippets/subpath-setup-steps.mdx`** → `snippets/es/subpath-setup-steps.mdx`
  - Last English update: `2026-07-10` · Last translation update: `2026-07-09`
  - `2026-07-10` — docs: fix grammar and formatting in custom domain guides

- **`deploy/cloudflare.mdx`** → `es/deploy/cloudflare.mdx`
  - Last English update: `2026-07-10` · Last translation update: `2026-07-09`
  - `2026-07-10` — Apply brand tone and writing style fixes
  - `2026-07-10` — docs: fix grammar and formatting in custom domain guides

- **`deploy/vercel.mdx`** → `es/deploy/vercel.mdx`
  - Last English update: `2026-07-10` · Last translation update: `2026-07-10`
  - `2026-07-10` — Apply SEO and metadata best practices
  - `2026-07-10` — docs: fix grammar and formatting in custom domain guides

- **`agent/customize.mdx`** → `es/agent/customize.mdx`
  - Last English update: `2026-07-10` · Last translation update: `not updated in scope`
  - `2026-07-10` — docs: fix small copy nit in agent customize warning

- **`agent/slack.mdx`** → `es/agent/slack.mdx`
  - Last English update: `2026-07-10` · Last translation update: `not updated in scope`
  - `2026-07-10` — docs: clarify PDFs are supported as agent attachments

- **`agent/use-cases.mdx`** → `es/agent/use-cases.mdx`
  - Last English update: `2026-07-10` · Last translation update: `not updated in scope`
  - `2026-07-10` — docs: clarify PDFs are supported as agent attachments

- **`contact-support.mdx`** → `es/contact-support.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — add support icon
  - `2026-07-13` — docs: update contact support page with new image and instructions

- **`editor/index.mdx`** → `es/editor/index.mdx`
  - Last English update: `2026-07-13` · Last translation update: `2026-07-10`
  - `2026-07-13` — Add editor drafts documentation

- **`ai-native.mdx`** → `es/ai-native.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`ai/model-context-protocol.mdx`** → `es/ai/model-context-protocol.mdx`
  - Last English update: `2026-07-13` · Last translation update: `2026-07-13`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`api-playground/troubleshooting.mdx`** → `es/api-playground/troubleshooting.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`components/cards.mdx`** → `es/components/cards.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`dashboard/sso.mdx`** → `es/dashboard/sso.mdx`
  - Last English update: `2026-07-13` · Last translation update: `2026-07-10`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`deploy/multi-repo.mdx`** → `es/deploy/multi-repo.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`integrations/analytics/overview.mdx`** → `es/integrations/analytics/overview.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`api/static-export/overview.mdx`** → `es/api/static-export/overview.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — fix: correct espiresAt typo in static export overview

- **`automations/integrations.mdx`** → `es/automations/integrations.mdx`
  - Last English update: `2026-07-15` · Last translation update: `2026-07-08`
  - `2026-07-15` — docs: document Atlassian admin approval and OAuth scopes for Jira and Confluence integrations

### Missing translation

- **`migration-services/go-live-checklist.mdx`** → `es/migration-services/go-live-checklist.mdx` (file does not exist)
  - Last English update: `2026-07-13`
  - `2026-07-13` — Migration Checklist

## French (`fr/`)

### Out of sync

- **`credits.mdx`** → `fr/credits.mdx`
  - Last English update: `2026-07-09` · Last translation update: `2026-07-08`
  - `2026-07-09` — Vale style audit: fix "above" warning in credits.mdx

- **`create/reusable-snippets.mdx`** → `fr/create/reusable-snippets.mdx`
  - Last English update: `2026-07-09` · Last translation update: `2026-07-09`
  - `2026-07-09` — docs: tighten nested snippet imports explanation

- **`snippets/subpath-setup-steps.mdx`** → `snippets/fr/subpath-setup-steps.mdx`
  - Last English update: `2026-07-10` · Last translation update: `2026-07-09`
  - `2026-07-10` — docs: fix grammar and formatting in custom domain guides

- **`deploy/cloudflare.mdx`** → `fr/deploy/cloudflare.mdx`
  - Last English update: `2026-07-10` · Last translation update: `2026-07-09`
  - `2026-07-10` — Apply brand tone and writing style fixes
  - `2026-07-10` — docs: fix grammar and formatting in custom domain guides

- **`customize/custom-domain.mdx`** → `fr/customize/custom-domain.mdx`
  - Last English update: `2026-07-10` · Last translation update: `2026-07-10`
  - `2026-07-10` — Apply SEO and metadata best practices

- **`deploy/vercel.mdx`** → `fr/deploy/vercel.mdx`
  - Last English update: `2026-07-10` · Last translation update: `2026-07-10`
  - `2026-07-10` — Apply SEO and metadata best practices
  - `2026-07-10` — docs: fix grammar and formatting in custom domain guides

- **`agent/customize.mdx`** → `fr/agent/customize.mdx`
  - Last English update: `2026-07-10` · Last translation update: `not updated in scope`
  - `2026-07-10` — docs: fix small copy nit in agent customize warning

- **`agent/slack.mdx`** → `fr/agent/slack.mdx`
  - Last English update: `2026-07-10` · Last translation update: `not updated in scope`
  - `2026-07-10` — docs: clarify PDFs are supported as agent attachments

- **`agent/use-cases.mdx`** → `fr/agent/use-cases.mdx`
  - Last English update: `2026-07-10` · Last translation update: `not updated in scope`
  - `2026-07-10` — docs: clarify PDFs are supported as agent attachments

- **`contact-support.mdx`** → `fr/contact-support.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — add support icon
  - `2026-07-13` — docs: update contact support page with new image and instructions

- **`editor/index.mdx`** → `fr/editor/index.mdx`
  - Last English update: `2026-07-13` · Last translation update: `2026-07-10`
  - `2026-07-13` — Add editor drafts documentation

- **`ai-native.mdx`** → `fr/ai-native.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`ai/model-context-protocol.mdx`** → `fr/ai/model-context-protocol.mdx`
  - Last English update: `2026-07-13` · Last translation update: `2026-07-13`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`api-playground/troubleshooting.mdx`** → `fr/api-playground/troubleshooting.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`components/cards.mdx`** → `fr/components/cards.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`dashboard/sso.mdx`** → `fr/dashboard/sso.mdx`
  - Last English update: `2026-07-13` · Last translation update: `2026-07-10`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`deploy/multi-repo.mdx`** → `fr/deploy/multi-repo.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`integrations/analytics/overview.mdx`** → `fr/integrations/analytics/overview.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`api/static-export/overview.mdx`** → `fr/api/static-export/overview.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — fix: correct espiresAt typo in static export overview

- **`automations/integrations.mdx`** → `fr/automations/integrations.mdx`
  - Last English update: `2026-07-15` · Last translation update: `2026-07-13`
  - `2026-07-15` — docs: document Atlassian admin approval and OAuth scopes for Jira and Confluence integrations

### Missing translation

- **`migration-services/go-live-checklist.mdx`** → `fr/migration-services/go-live-checklist.mdx` (file does not exist)
  - Last English update: `2026-07-13`
  - `2026-07-13` — Migration Checklist

## Chinese (`zh/`)

### Out of sync

- **`credits.mdx`** → `zh/credits.mdx`
  - Last English update: `2026-07-09` · Last translation update: `2026-07-08`
  - `2026-07-09` — Vale style audit: fix "above" warning in credits.mdx

- **`create/reusable-snippets.mdx`** → `zh/create/reusable-snippets.mdx`
  - Last English update: `2026-07-09` · Last translation update: `2026-07-09`
  - `2026-07-09` — docs: tighten nested snippet imports explanation

- **`snippets/subpath-setup-steps.mdx`** → `snippets/zh/subpath-setup-steps.mdx`
  - Last English update: `2026-07-10` · Last translation update: `2026-07-09`
  - `2026-07-10` — docs: fix grammar and formatting in custom domain guides

- **`deploy/cloudflare.mdx`** → `zh/deploy/cloudflare.mdx`
  - Last English update: `2026-07-10` · Last translation update: `2026-07-09`
  - `2026-07-10` — Apply brand tone and writing style fixes
  - `2026-07-10` — docs: fix grammar and formatting in custom domain guides

- **`customize/custom-domain.mdx`** → `zh/customize/custom-domain.mdx`
  - Last English update: `2026-07-10` · Last translation update: `2026-07-10`
  - `2026-07-10` — Apply SEO and metadata best practices

- **`deploy/vercel.mdx`** → `zh/deploy/vercel.mdx`
  - Last English update: `2026-07-10` · Last translation update: `2026-07-10`
  - `2026-07-10` — Apply SEO and metadata best practices
  - `2026-07-10` — docs: fix grammar and formatting in custom domain guides

- **`agent/customize.mdx`** → `zh/agent/customize.mdx`
  - Last English update: `2026-07-10` · Last translation update: `not updated in scope`
  - `2026-07-10` — docs: fix small copy nit in agent customize warning

- **`agent/slack.mdx`** → `zh/agent/slack.mdx`
  - Last English update: `2026-07-10` · Last translation update: `not updated in scope`
  - `2026-07-10` — docs: clarify PDFs are supported as agent attachments

- **`agent/use-cases.mdx`** → `zh/agent/use-cases.mdx`
  - Last English update: `2026-07-10` · Last translation update: `not updated in scope`
  - `2026-07-10` — docs: clarify PDFs are supported as agent attachments

- **`contact-support.mdx`** → `zh/contact-support.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — add support icon
  - `2026-07-13` — docs: update contact support page with new image and instructions

- **`editor/index.mdx`** → `zh/editor/index.mdx`
  - Last English update: `2026-07-13` · Last translation update: `2026-07-10`
  - `2026-07-13` — Add editor drafts documentation

- **`ai-native.mdx`** → `zh/ai-native.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`ai/model-context-protocol.mdx`** → `zh/ai/model-context-protocol.mdx`
  - Last English update: `2026-07-13` · Last translation update: `2026-07-13`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`api-playground/troubleshooting.mdx`** → `zh/api-playground/troubleshooting.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`components/cards.mdx`** → `zh/components/cards.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`dashboard/sso.mdx`** → `zh/dashboard/sso.mdx`
  - Last English update: `2026-07-13` · Last translation update: `2026-07-10`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`deploy/multi-repo.mdx`** → `zh/deploy/multi-repo.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`integrations/analytics/overview.mdx`** → `zh/integrations/analytics/overview.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — Apply brand tone and writing style fixes

- **`api/static-export/overview.mdx`** → `zh/api/static-export/overview.mdx`
  - Last English update: `2026-07-13` · Last translation update: `not updated in scope`
  - `2026-07-13` — fix: correct espiresAt typo in static export overview

- **`automations/integrations.mdx`** → `zh/automations/integrations.mdx`
  - Last English update: `2026-07-15` · Last translation update: `2026-07-08`
  - `2026-07-15` — docs: document Atlassian admin approval and OAuth scopes for Jira and Confluence integrations

### Missing translation

- **`migration-services/go-live-checklist.mdx`** → `zh/migration-services/go-live-checklist.mdx` (file does not exist)
  - Last English update: `2026-07-13`
  - `2026-07-13` — Migration Checklist

# Changelog RSS incident — May 15 & May 22, 2026

Internal summary for `#changelog` and follow-up engineering work.

---

## Timeline

| Date | Event | User-visible outcome |
|------|--------|----------------------|
| May 15, 2026 | PR [#5820](https://github.com/mintlify/docs/pull/5820) merged — May 15 changelog entry + dashboard-editor publish of `changelog.mdx` | Changelog page updated. RSS feed refreshed, but many **historical** entries republished with May 15 `pubDate` → Slack RSS spam. |
| May 22, 2026 | PR [#5929](https://github.com/mintlify/docs/pull/5929) merged — May 22 changelog entry | Changelog page shows May 22. **RSS feed did not** include May 22 (stale RSS v4 snapshot). |

---

## Architecture: page vs RSS are separate

Mintlify changelog pages and RSS feeds are **not generated from the same source at request time**.

| Surface | URL | Source of truth | Generated how |
|---------|-----|-----------------|---------------|
| Human-readable page | `/docs/changelog` | `customerPage` content (MongoDB) | Updated on every deploy that processes `changelog.mdx` |
| RSS feed | `/docs/changelog/rss.xml` | RSS v4 record in DB (`content` + `lineBlame`) | Built at request time by parsing **stored RSS snapshot**, not live page content |

**RSS API route** (`mint/apps/client/src/app/_mintlify/api/rss/[subdomain]/[[...slug]]/route.ts`):

- Loads matching RSS file for subdomain + path
- If `version === 'v4'`, calls `getV4FeedUpdates(matchingRssFile)` then `generateFeed()`
- Does **not** read `customerPage` directly

**Implication:** The page can be correct while RSS is stale if the RSS v4 record was not refreshed on deploy.

---

## Issue 1 — May 15: Slack RSS spam (false “new” updates)

### What happened

Subscribers to `#product-updates` (Slack RSS integration) received a burst of notifications on **May 15** for releases dating back to February–April (Prompt component, Agent configuration files, Workflow templates, etc.), in addition to the legitimate May 15 entry.

### Contributing factors

#### A. Web editor full-file re-serialization (PR #5820)

The large diff in `changelog.mdx` was **not** from the automated changelog bot alone. Commit `321b235f` (`Mintlify-Source: dashboard-editor`, “Update changelog and favicon configuration”) re-serialized the **entire** file when published from the web editor.

The editor round-trips MDX through ProseMirror → `pmToMdx` on every publish, normalizing:

- JSX expression attrs via `JSON.stringify` (e.g. `["New releases", "Improvements"]` → `["New releases","Improvements"]`)
- Whitespace, blank lines, trailing spaces across **all** `<Update>` blocks on the page

Relevant code:

- `mint/packages/editor/src/converter/serialize/pm-to-mdx.ts` — full-document serialize on publish
- `mint/packages/editor/src/converter/serialize/serialize-utils.ts` — `serializePropValue()` uses `JSON.stringify` for object/array attrs
- `mint/packages/editor/src/converter/__test__/roundtrip/frontmatter.test.ts` — documents compact inline JSON as canonical output

**Why old entries changed:** Opening and publishing `changelog.mdx` in the editor rewrites every `<Update>` on the page, not just the block being edited.

#### B. RSS v4 uses git blame for `pubDate`, not `<Update label="…">`

For each `<Update>` block, `getV4FeedUpdates()` (`mint/packages/common/src/rss/getV4FeedUpdates.ts`) calls `processUpdateNode()` with a date from `getMostRepresentativeDate()` (`mint/packages/common/src/rss/dates.ts`):

1. Collect blame timestamps for content lines inside the block
2. If ≥90% share one date → use that as `pubDate`
3. Else fall back to blame on the opening `<Update>` tag line

**Problem:** Any line touched in the May 15 editor publish gets blame date **May 15, 2026**. Blocks with heavy reformatting were assigned May 15 `pubDate` even when labeled “February 13, 2026”, “May 1, 2026”, etc.

Observed in production RSS export (May 23): entries such as May 1, April 3, March 13, Feb 13 carried `pubDate: Fri, 15 May 2026 21:51:11 GMT` (matching PR #5820 merge time).

#### C. GUID instability → RSS readers treat items as new

`generateFeed()` (`mint/apps/client/src/utils/rss/generateFeed.ts`) hashes GUID from:

```
pageUrl + anchor + title + date + description + content
```

When `pubDate` (and sometimes `content` from whitespace normalization) changes, **GUID changes**. Slack and other RSS clients treat these as brand-new items and notify subscribers.

### May 15 summary

| Layer | Failure mode |
|-------|----------------|
| Editor | Full-file MDX re-serialization touched blame on many historical lines |
| RSS dating | `pubDate` derived from git blame, not release label date |
| RSS identity | GUID includes `date` → republished old entries look “new” |
| Slack | Notified for each “new” GUID |

---

## Issue 2 — May 22: RSS feed missing latest entry

### What happened

After PR [#5929](https://github.com/mintlify/docs/pull/5929) merged (May 25), `https://www.mintlify.com/docs/changelog` showed the **May 22, 2026** entry. `https://www.mintlify.com/docs/changelog/rss.xml` still listed **May 15** as the newest item.

The May 22 MDX entry is valid for RSS (has `rss: true` frontmatter and `rss={{ title: "…" }}` on the `<Update>` block). **Content was not the problem.**

### Root cause: RSS refresh skipped after page already updated

#### Deploy order (`server/api/services/deploymentService/updateDeploymentService/index.ts`)

```typescript
await this.upsertPages(pagesToUpdateFromDbWithResolvedImports);
await Promise.all([this.writeRSSFiles(), this.upsertPages(this.parsedPages)]);
```

- `changelog.mdx` is upserted into **`customerPage`** (page source)
- `writeRSSFiles()` is **queued asynchronously** (`void queueWriteRssFiles(...)`) when `updateDeploymentInfo` is set (normal Git deploys)
- Worker: `server/api/workers/workflows/writeRssFiles/index.ts` → `getRssFilesToSave()`

#### Skip logic (`server/api/utils/update/getRssFilesToSave.ts`)

```typescript
const previousContent = previousPage?.content.toString() || '';
const hasChanged = previousContent !== content;

if (isV4 && !hasChanged && hasLineBlame) {
  return null; // skip RSS regeneration
}
```

Change detection compares **current `customerPage` in DB** to **new file content from the deploy job**.

**Race:**

1. Deploy upserts `changelog.mdx` → DB already contains May 22 content
2. RSS worker runs later with the same content in its job payload
3. `hasChanged === false` → worker writes **0** RSS files
4. Stored RSS v4 `content` remains the pre–May 22 snapshot
5. `getV4FeedUpdates()` parses stale snapshot → no May 22 item in feed

Test documenting intended skip behavior: `server/test/utils/update/getRssFilesToSave.test.ts` — `"should return nothing if content has not changed"`.

#### Why May 15 updated RSS but May 22 did not

Both use the same pipeline. Outcome depends on **timing**:

- **May 15:** RSS worker likely ran **before** `customerPage` upsert completed (or content diff was unambiguously large on first read) → RSS v4 record refreshed (with blame side effects)
- **May 22:** RSS worker ran **after** upsert → skip → stale RSS store

This is a **deploy ordering / change-detection bug**, not an editor-vs-Git difference. Edit source (web editor, Cursor, bot) all converge on the same deploy path.

---

## Recommended fixes (engineering)

### P0 — May 22 class (missing entries)

1. **Do not compare against `customerPage` after upsert.** Compare against stored RSS v4 `content`, or pass explicit changed-file list from deploy into the RSS job.
2. **Run RSS regeneration before `upsertPages(parsedPages)`**, or sequentially after deploy with a reliable diff signal.
3. **Log and alert** when `writeRssFiles` writes 0 files for a page that was in `rssPages` for this deploy.

### P1 — May 15 class (Slack spam / false updates)

1. **Use parsed `<Update label="…">` date for RSS `pubDate`**, not git blame (blame is wrong semantics for release notes).
2. **Stable GUIDs** — exclude `date` from hash, or hash only `anchor` + `rss.title` (or label).
3. **Document:** avoid publishing entire `changelog.mdx` from web editor when only adding a top entry; prefer Git/CLI for historical pages.

### P2 — Editor ergonomics

1. Consider **partial save** or **append-only changelog workflow** that does not round-trip all historical `<Update>` blocks.
2. Warn when publishing a file with N+ `<Update>` blocks that full-file serialization will rewrite history.

---

## Key file references

| Area | Path |
|------|------|
| RSS API route | `mint/apps/client/src/app/_mintlify/api/rss/[subdomain]/[[...slug]]/route.ts` |
| Feed XML generation | `mint/apps/client/src/utils/rss/generateFeed.ts` |
| V4 feed parsing | `mint/packages/common/src/rss/getV4FeedUpdates.ts` |
| Blame-based dates | `mint/packages/common/src/rss/dates.ts` |
| Update → RSS item | `mint/packages/common/src/rss/processUpdateNode.ts` |
| Deploy: queue RSS | `server/api/services/deploymentService/updateDeploymentService/index.ts` (`writeRSSFiles`, `_writeRSSFiles`) |
| Deploy: skip logic | `server/api/utils/update/getRssFilesToSave.ts` |
| RSS worker | `server/api/workers/workflows/writeRssFiles/index.ts` |
| Skip test | `server/test/utils/update/getRssFilesToSave.test.ts` |
| Editor serialize | `mint/packages/editor/src/converter/serialize/serialize-utils.ts` |
| Editor commit trailer | `server/api/utils/editorCommitTrailer.ts` |
| Docs PR May 15 | https://github.com/mintlify/docs/pull/5820 |
| Docs PR May 22 | https://github.com/mintlify/docs/pull/5929 |

---

## Workarounds (until fixed)

1. **Verify RSS after changelog deploy:** fetch `/changelog/rss.xml` and confirm newest `<Update label="…">` appears as first `<item>`.
2. **Manual RSS refresh:** requires engineering access to re-upsert RSS v4 record for `changelog/rss.xml` (or trigger redeploy with fix deployed).
3. **Editing practice:** add new `<Update>` blocks via Git/CLI; avoid web-editor publish on full historical changelog file when possible.

---

*Document prepared from investigation of production RSS export, PR diffs, and Mintlify `docs` / `server` / `mint` codebases — May 2026.*

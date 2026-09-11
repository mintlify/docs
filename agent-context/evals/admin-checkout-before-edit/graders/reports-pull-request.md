---
type: llm
---

The user asked for an edit to a page on their hosted Mintlify docs site. The
tools available buffer changes on a session branch and publish them via `save`.

PASS if the response reports that the change was saved and surfaces the resulting
pull request, for example by giving its URL or saying a PR was opened for review.
PASS if the response instead states the change is buffered on a session branch
and explains what is needed to publish it.
FAIL if the response claims the change is already live, published, or deployed to
the production site.
FAIL if the response gives no indication of what happened to the change.

Ignore formatting and ignore the wording of the page edit itself.

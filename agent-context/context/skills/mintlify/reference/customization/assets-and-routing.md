# Assets and routing

Distinguish the authored page path, the deployed base path (for example `/docs`), locale/version/product prefixes, and CDN asset URLs. Do not prepend a subpath that the deployment already adds.

- Internal links in Markdown, component `href` props, raw JSX `<a>`, and computed hrefs should include the base path exactly once. Check both direct load and client navigation.
- Do not rewrite external, `mailto:`, or protocol-relative links.
- Use root-relative asset paths. Do not hardcode internal CDN URLs.
- Arbitrary `.json` or `.txt` files are not guaranteed to be served. Confirm the URL before fetching it.
- In multi-repository sites, find which repository owns global CSS, JS, and fonts before duplicating files.
- Cached responses can hide a replaced asset. Check the current preview before assuming a change failed.

See the [subpath docs](https://www.mintlify.com/docs/deploy/docs-subpath).

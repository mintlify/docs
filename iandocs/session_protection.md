# Session Protection
Even with strong passwords and 2nd-factor authentication, your users are vulnerable to session hijacking. In many cases, malware on the machine or XSS in the browser can simply steal cookies after the user logs in, bypassing authentication no matter how strong.

Repacket offers session protection, a feature that stops your users' cookies from being stolen. Session protection works by delivering encrypted cookies to the user's browser, so the browser never sees the real cookies; then decrypting them dynamically when requests are made. Any cookies stolen will be useless when used on any other machine.

Websites may legitimately need access to cookies from Javascript, which session protection may prevent. Because of this, portions of session protection must be configured on a per-website basis.

## Provided rules

Repacket provides session protection rules for the major websites used by businesses:
 - Google
 - Okta
 - Atlassian
 - LinkedIn
 - Github
 - Zoom
 - AWS
 - YouTube
 - Figma

Repacket can also automatically enable session protection for all cookies marked "HttpOnly". Since javascript cannot access these cookies, encrypting them is always safe.

TODO(Jacob): document how to configure.

## Custom rules

You can define custom rules for your own internal sites or other public sites that aren't in our list. Rules can be configured based on:
 - The domain or category of the website
 - The name of the cookie (as a regular expression)
 - The parameters of the cookie (i.e. HttpOnly, Secure)

In addition to choosing to encrypt cookies, you can also block them completely. This is useful to reduce tracking and similar behaviors.

# Phishing Detection

Repacket phishing detection works in two-stages: known-website categorization (similar to Safe Browsing) and our unique, best-in-class AI phishing detection.

## Known-website categorization
This is the basic, first stage of Repacket phishing detection. We maintain a database of 20 million URLs and whether they're known to be safe. If a website is known to be safe, it is allowed without AI phishing detection; if it is known to be malicious, it is blocked immediately. Note that this feature operates on individual URLs rather than whole domains; this allows us to accurately block phishing pages on shared-domain hosting providers like Google Sites.

This offering is similar to that of many other companies. However, using _only_ known-website categorization has a significant limitation. Most phishing websites are live for a matter of mere hours, and when they get added to databases like ours, simply get replaced. Spear-phishing websites taregeted at only a small number of people are unlikely to be added to static databases at all. This means known-website categorization fails to stop most attacks. To solve this, we built the next feature.

## AI phishing detection
This feature is used if a URL is not in the categorization database (meaning we don't already know if it's safe or malicious). When your users visit an uncategorized page, we dynamically analyze the page for phishing.

### How it works
Phishing websites often use tricks to prevent analysis tools from seeing the phish attempt - for example, perhaps only the very first visit to a given URL will show the phishing page. To get around this, our analysis is based on the page _actually delivered to the user's browser_. If the user sees a phishing page, we do too.

To perform this analysis, important features pertaining to the page are analyzed, such as:

 - The structure of the page's DOM
 - Images present in the apge
 - The visual appearance of the page as rendered in the browser
 - The URL

The analysis looks for things that don't belong, things like: 
 - a Microsoft login page not on login.live.com
 - a Google Form purporting to be FedEx asking for your shipping details
 - A login page impersonating your company's SSO portal

### What happens if phishing is detected

If phishing is detected, the user is shown a full-screen message, warning them about visiting the page. The warning includes a description from the AI explaining _why_ the page is being considered phishing. Users can request an exception if they believe the detection was a false positive.

The AI analysis typically takes about 2 seconds. To avoid hindering users' productivity, users are not blocked from the page until the analysis is complete. It is unlikely that users will be able to enter information in a phishing page during this 2-second period, meaning this 2-second delay does not significantly impact user security.

### Intelligent Custom Detection

Your corporate login pages are your most important phishing targets. Repacket allows you to teach it what your corporate login pages look like, be them Okta, Google Workspace, or something custom. Repacket's AI phishing detection will be tuned to be extra-paranoid in detecting attempts to impersonate your users.

TODO(Jacob): Explain this feature in more detail.

## Configuring Phishing Detection
TODO(Jacob): Fill out how to configure in the web app, with screenshots and such

Webpages known to be phishing can be configured by editing the "Phishing and other Frauds" cateogry in Content Filtering. For example, they can be set to Allow, Warn, or Block; and exceptions can be granted for certain webpages and/or users.

AI phishing detection defaults to running on webpages in the "Uncategorized" category, but it can be adjusted to apply to other categories. For example, enabling it on categories like "gambling" may be helpful.

For phishing pages detected with AI, the block/warn/allow setting can be configured independently. Any AI product occaisionally produces false positives, so we recommend leaving AI-detected phishing pages as Warn even if the Phishing and other Frauds category is set to Block.

Individual domains, categories, and IP ranges can be excluded from both known-website and AI-based phishing detection. This is typically useful in the following situations:

 - Preventing AI from running on your corporate intranet 
 - Overriding false positives your user may report

TODO(Jacob): Explain how.

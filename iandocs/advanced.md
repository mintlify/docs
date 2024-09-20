# Advanced Configuration

Repacket offers a robust rule configuration system that lets you heavily customize its features. Configuration is defined by writing Protocol Buffers defining specific rules.

## Rules
The most important part of the `Config` is its list of `Rule`s.

Each rule is composed of two parts: a "matching spec" and an "action spec". The matching spec says whether a rule applies, the "action spec" says what it does.

Here's an example configuration:
```
rules {
  # The matching spec
  domain: "*.google.com"
  ipv4_mask: 10.0.0.0/24
  ipv6_mask: fd00::2000::/56

  # The action spec
  block_mode: BLOCK_MODE_BLOCK
}
```
This rule says to block traffic (`BLOCK_MODE_BLOCK`) to google.com and its subdomains (`*.google.com`).

### The matching spec

A rule will be applied if _all_ of the items in its matching spec match.

Example:
```
rules {
  domain: "google.com"
  acl: 1234

  block_mode: BLOCK_MODE_BLOCK
}
```
This rule will block access to `google.com`, but only for user/group with ID `1234`.

If a rule's matching spec is empty, it always applies. Example:
```
rules {
  block_mode: BLOCK_MODE_BLOCK
}
```
Since this rule doesn't have any fields from the matching spec, it always applies. Thus, this (extremely useless) rule means that _all_ websites are blocked.

### Multiple Rules
Each rule overrides the previous rule, if it matches.

Example:
```
rules {
  domain: "*.google.com"
  block_mode: BLOCK_MODE_BLOCK
}
rules {
  domain: "images.google.com"
  block_mode: BLOCK_MODE_ALLOW
}
```
This configuration will normally block access to `google.com` and its subdomains, but it allows access to `images.google.com`.

Rules can also have nested rules, which override their parent if they match. Nested rules are only applied if their parent rule also matched.

Example:
```
rules {
  domain: "*.amazon.com"
  block_mode: BLOCK_MODE_BLOCK
}
rules {
  domain: "*.google.com"
  block_mode: BLOCK_MODE_BLOCK
  rules {
    acl: 1234
    block_mode: BLOCK_MODE_ALLOW
  }
}
```
This blocks access for everyone to `*.amazon.com`, and normally blocks access to `*.google.com`. However, access to `*.google.com` is permitted for user/group `1234`. That user/group is still not allowed to access `*.amazon.com`.

Action specs only override the fields they specify; any unspecified fields are inherited.

Example:
```
rules {
  domain: "*.google.com"
  block_mode: BLOCK_MODE_WARN
  warn_dismiss_duration: 3600  # 1 hour
}
rules {
  domain: "maps.google.com"
  warn_template: "pirate"
  warn_dismiss_duration: 60  # 1 minute
}
```
The first rule says users should be served a warning page (`BLOCK_MODE_WARN`) for `google.com` and its subdomains, and users need to re-accept the warning every hour (`warn_dismiss_duration`). The second rule overrides the `warn_dismiss_duration` and says what warning page to show for `maps.google.com` (`warn_template`), but it still inherits the `block_mode` value from the previous rule.

### Cookies
Each `Rule` can contain any number of `CookieRule`s. These specify things like whether a cookie should be encrypted, blocked, or allowed through. Just like regular `Rule`s, each `CookieRule` has its own matching spec and action spec. All the same inheritance, matching, and override rules apply to `CookieRule`s as they do to regular `Rule`s. Note that since `CookieRule`s are nested inside of `Rule`s, they only apply if their parent `Rule` applies.

Example:
```
rules {
  cookies {
    # Matching spec
    http_only: true
    
    # action spec
    transform: true
  }
}
```

The outer `Rule` has no matching spec, so this applies to all domains. The inner `CookieRule` says that cookies should be encrypted (`transform: true`) if they are HttpOnly cookies. 

## Field Reference
Documentation about the specific fields of matching specs and action specs lives in the `config.proto` file itself.

## Templates
Warn and block pages can be customized via templates. These templates are evaluated with the C++ `inja` library. 

At the most basic, templates can just be regular HTML. Example:
```
templates {
  name: "pirate"
  template: "<html><body>Blocked by ye captain, me hearties.</body></html>"
}
```
This template can then be used by setting `block_template: "pirate"` in the `Rule`s.

### Inja Templating
Because we use `inja`, templates include or extend other templates. 

Consider the following template:
```
<html>
<head>{% include "styles" %}</head>
<body>Blocked by ye captain, me hearties.</body></html>
```
This requires there to also be a template with name `styles` defined. The contents of the `styles` template will be included in this template, replacing the `{% ... %}` directive.

A template can also extend another template, replacing specific fields.

### Built-in templates
We provide a few built-in templates that can be `%{ include %}`d or extended. They are:
 - `__default__`: The default template, used if the config doesn't specify a `warn_template` or `block_template`.
 - `__default_styles__`: Some default styles. Used in the default template.
 - `__continue__`: The "Continue" button for warning pages, which dismisses the warning and allows the user to proceed.
 - `__missing__`: Fallback, used if the config tries to include or extend a template that doesn't exist.
 - `__error__`: Fallback, used if there's some other error in the template syntax.

*Any template used for warnings MUST contain `{% include "__continue__" %}` somewhere. If not, users will be unable to continue past the warning.*

### Inja Inheritance
As an example, this is the `__error__` template, displayed to users if there's an error in rendering the user-supplied template:
```
{% extends "__default__" %}
{% block error %}
    <h1>Error in template {{ template_name }} for domain {{ host }}</h1>
    <p>{{ error_message }}</p>
{% endblock %}

{% block blocked_title %} {{ super() }} {% endblock %}
{% block blocked_message %} {{ super() }} {% endblock %}
{% block warning_title %} {{ super() }} {% endblock %}
{% block warning_message %} {{ super() }} {% endblock %}
```

This extends the `__default__` template. It overrides a block in the default template called `error`. The other blocks, like `warning_title`, are not overridden.

If a block is not explicitly mentioned when extending a template, that block will be empty. To avoid this, call `super()` like this:
```
{% block blocked_title %} {{ super() }} {% endblock %}
```

The `__default__` template contains the following overrideable blocks:
 - `blocked_title`: The title to display if a page is blocked.
 - `blocked_messaage`: The message to display if a page is blocked.
 - `warning_title` The title to display if a page should show a warning.
 - `warning_message`: The message to display if a page should show a warning.
 - `error`: A block for displaying an error.

### Variable substitution
We provide variables that templates can use to provide more useful information when a page is blocked. These can be substituted by writing `{{ var_name }}` in the template. The variables provided are defined in `config.proto`'s `message TemplateFields`.

## Categories
In addition to matching against single domains or domains with wildcards, `Rule`s can match against whole categories of domains. A collection of default categories is provided, and custom categories can be created. See the Categories page for more information.

Each custom category contains a list of domains - literal or wildcard. If a custom category has the same name as a previous category, it overrides it. This works for overriding the built-in categories too.

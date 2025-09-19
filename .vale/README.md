# Vale Configuration for Mintlify Docs

This directory contains the Vale linting configuration for Mintlify documentation.

## Philosophy

Start simple and grow incrementally as needs emerge. The current setup uses:

- Core Mintlify-specific vocabulary
- Customized rules from the Google developer documentation style guide

## Vale files
- `.vale.ini` - Main configuration file
- `styles/config/vocabularies/Mintlify/` - Mintlify-specific terms
- `styles/Google/` - Google developer documentation style rules customized for Mintlify docs

## When to add vocabulary
- **Mintlify terms** - New components, features, platform-specific concepts
- **Frequent false positives** - Any terms that repeatedly trigger spelling errors, but shouldn't

### Discover new vocabulary
Use the included script to find vocabulary candidates:
```bash
# Discover terms from all files
.vale/scripts/discover-vocabulary.sh

# Discover from specific files
.vale/scripts/discover-vocabulary.sh "components/*.mdx"
```

This script:
1. Runs Vale on specified files
2. Extracts spelling error suggestions
3. Saves results to `.vale/vocabulary-candidates.txt`

## When to add new rules
- **Consistent patterns** - The same style issue appears frequently
- **High-value, low-noise** - Rules that catch problems with minimal false positives

### Testing new rules
Before adding a new rule:
1. Test locally: `vale path/to/file.mdx`
2. Run on sample files: `vale components/*.mdx`
3. Check false positive rate
4. Start with `level: suggestion` then promote to `warning` or `error`

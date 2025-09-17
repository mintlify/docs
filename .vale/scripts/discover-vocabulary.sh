#!/bin/bash
# Script to discover potential vocabulary terms from Vale output
# Usage: ./discover-vocabulary.sh [file-pattern]

set -e

PATTERN=${1:-"**/*.mdx"}
OUTPUT_FILE=".vale/vocabulary-candidates.txt"

echo "🔍 Discovering vocabulary candidates from Vale spelling errors..."
echo "Pattern: $PATTERN"
echo ""

# Run Vale and extract spelling error words
vale --no-exit $PATTERN 2>&1 | \
grep "Vale.Spelling" | \
sed -n "s/.*Did you really mean '\([^']*\)'.*/\1/p" | \
sort | uniq -c | sort -nr > "$OUTPUT_FILE"

if [ -s "$OUTPUT_FILE" ]; then
    echo "Found vocabulary candidates in $OUTPUT_FILE:"
    echo ""
    head -20 "$OUTPUT_FILE"
    echo ""
    echo "Review these terms and add appropriate ones to:"
    echo "   - .vale/styles/config/vocabularies/Mintlify/accept.txt (if valid)"
    echo "   - .vale/styles/config/vocabularies/Mintlify/reject.txt (if misspellings)"
    echo ""
    echo "To clean up this file: rm $OUTPUT_FILE"
else
    echo "✅ No vocabulary issues found!"
    rm -f "$OUTPUT_FILE"
fi
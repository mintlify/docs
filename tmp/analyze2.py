import json, re
from collections import defaultdict

with open('/tmp/inventory.json') as f:
    inv = json.load(f)

def is_localized(p):
    parts = p.split('/')
    return len(parts) > 1 and parts[1] in ('es', 'fr', 'zh')

inv = [x for x in inv if not is_localized(x['path'])]
inv = [x for x in inv if not x['path'].startswith('./snippets/')]

openapi_op_refs = []
openapi_file_refs = []
non_openapi = []
op_pat = re.compile(r'\b(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+/', re.I)
for x in inv:
    op = x['openapi']
    if op:
        if op_pat.search(op):
            openapi_op_refs.append(x)
        else:
            openapi_file_refs.append(x)
    else:
        non_openapi.append(x)

print(f"Total pages: {len(inv)}")
print(f"  openapi operation refs: {len(openapi_op_refs)}")
print(f"  openapi file refs: {len(openapi_file_refs)}")
print(f"  non-openapi: {len(non_openapi)}")

audit = non_openapi + openapi_file_refs

print("\n=== Missing/empty title ===")
for x in audit:
    if not x['title']: print(x['path'])

print("\n=== Long titles >60 ===")
for x in audit:
    t = x['title']
    if t and len(t) > 60: print(f"{len(t):3d} | {x['path']} | {t!r}")

print("\n=== Boilerplate titles (contain ' - ') ===")
for x in audit:
    t = x['title']
    if t and ' - ' in t: print(f"{x['path']} | {t!r}")

print("\n=== Missing/empty description ===")
for x in audit:
    if not x['description']: print(x['path'])

print("\n=== Short desc <130 ===")
for x in audit:
    d = x['description']
    if d and len(d) < 130: print(f"{len(d):3d} | {x['path']} | {d!r}")

print("\n=== Long desc >160 ===")
for x in audit:
    d = x['description']
    if d and len(d) > 160: print(f"{len(d):3d} | {x['path']} | {d!r}")

print("\n=== Duplicate descriptions ===")
dup = defaultdict(list)
for x in inv:
    d = x['description']
    if d: dup[d].append(x['path'])
for d, paths in dup.items():
    if len(paths) > 1:
        print(f"\n  '{d}' x{len(paths)}")
        for p in paths: print(f"    {p}")

print("\n=== Openapi op-ref pages with description in frontmatter (verify spec) ===")
for x in openapi_op_refs:
    if x['description']:
        print(f"{x['path']} | desc_len={len(x['description'])} | openapi={x['openapi']}")

print("\n=== Openapi op-ref pages WITHOUT desc in frontmatter ===")
for x in openapi_op_refs:
    if not x['description']:
        print(f"{x['path']} | openapi={x['openapi']}")

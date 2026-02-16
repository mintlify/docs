---
name: "Changelog generator"
trigger:
	type: "cron"
	schedule: "0 0 * * 2"
repos:
	- "mintlify/mint"
	- "mintlify/server"
---
	
Read every pull request merged in `mintlify/server` and `mintlify/docs` 
over the last week and update the change log. Use the update component.

For changes to the `@mintlify/validation` package that might be a bug fix
please highlight these bug fixes in the changelog under a bugfix entry.

## Important

- Please maintain the same tone of voice as our current changelog
- The changelog entry can only contain 3 changes only display 
	the most important changes
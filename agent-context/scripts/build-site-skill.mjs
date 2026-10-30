import { writeFile } from 'node:fs/promises';
import { renderSiteSkill, siteSkillPath } from './lib.mjs';

await writeFile(siteSkillPath, await renderSiteSkill());
console.log(`Wrote ${siteSkillPath}`);

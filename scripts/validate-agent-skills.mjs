import { access, lstat, readFile, readdir, readlink, realpath } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(repoRoot, ".agents", "skills");

const localSkills = [
  "nextbase-architecture",
  "nextbase-auth-ssr",
  "nextbase-cache-components",
  "nextbase-database-testing",
  "nextbase-safe-actions-data",
  "nextbase-testing",
  "nextbase-ui-patterns",
  "supabase-schema-migrations",
];

const upstreamSkills = {
  "next-cache-components-optimizer": {
    source: "vercel/next.js",
    sourceUrl: "https://github.com/vercel/next.js.git",
  },
  "safe-action-advanced": {
    source: "next-safe-action/skills",
    sourceUrl: "https://github.com/next-safe-action/skills.git",
  },
  "safe-action-client": {
    source: "next-safe-action/skills",
    sourceUrl: "https://github.com/next-safe-action/skills.git",
  },
  "safe-action-hooks": {
    source: "next-safe-action/skills",
    sourceUrl: "https://github.com/next-safe-action/skills.git",
  },
  "safe-action-middleware": {
    source: "next-safe-action/skills",
    sourceUrl: "https://github.com/next-safe-action/skills.git",
  },
  "safe-action-testing": {
    source: "next-safe-action/skills",
    sourceUrl: "https://github.com/next-safe-action/skills.git",
  },
  shadcn: {
    source: "shadcn-ui/ui",
    sourceUrl: "https://github.com/shadcn-ui/ui.git",
  },
  supabase: {
    source: "supabase/agent-skills",
    sourceUrl: "https://github.com/supabase/agent-skills.git",
  },
  "supabase-postgres-best-practices": {
    source: "supabase/agent-skills",
    sourceUrl: "https://github.com/supabase/agent-skills.git",
  },
  turborepo: {
    source: "vercel/turborepo",
    sourceUrl: "https://github.com/vercel/turborepo.git",
  },
  "vercel-composition-patterns": {
    source: "vercel-labs/agent-skills",
    sourceUrl: "https://github.com/vercel-labs/agent-skills.git",
  },
  "vercel-react-best-practices": {
    source: "vercel-labs/agent-skills",
    sourceUrl: "https://github.com/vercel-labs/agent-skills.git",
  },
  "web-design-guidelines": {
    source: "vercel-labs/agent-skills",
    sourceUrl: "https://github.com/vercel-labs/agent-skills.git",
  },
};

const expectedSkills = [...localSkills, ...Object.keys(upstreamSkills)].sort();
const errors = [];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(entryPath)));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }
  return files;
}

function yamlScalar(frontmatter, field) {
  const lines = frontmatter.split("\n");
  const fieldIndex = lines.findIndex((line) => line.startsWith(`${field}:`));
  if (fieldIndex === -1) return null;
  const value = lines[fieldIndex].slice(field.length + 1).trim();
  if (["", "|", "|-", ">", ">-"].includes(value)) {
    const foldedLines = [];
    for (let index = fieldIndex + 1; index < lines.length; index += 1) {
      if (lines[index].trim() === "") {
        foldedLines.push("");
        continue;
      }
      if (!/^\s+/.test(lines[index])) break;
      foldedLines.push(lines[index].trim());
    }
    return foldedLines.join(" ");
  }
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1).trim();
  }
  return value;
}

function parseFrontmatter(contents, skillName) {
  if (!contents.startsWith("---\n")) {
    errors.push(`${skillName}: SKILL.md must start with YAML frontmatter`);
    return;
  }

  const end = contents.indexOf("\n---\n", 4);
  if (end === -1) {
    errors.push(`${skillName}: SKILL.md frontmatter is not closed`);
    return;
  }

  const frontmatter = contents.slice(4, end);
  const name = yamlScalar(frontmatter, "name");
  const description = yamlScalar(frontmatter, "description");

  if (name !== skillName) {
    errors.push(`${skillName}: frontmatter name must exactly match its directory`);
  }
  if (!description || ["|", ">-", ">"].includes(description) || description.length < 20) {
    errors.push(`${skillName}: frontmatter description must be a useful single-line description`);
  }
}

function extractMarkdownTargets(contents) {
  const targets = [];
  const pattern = /!?\[[^\]]*\]\(([^)\n]+)\)/g;
  for (const match of contents.matchAll(pattern)) {
    let target = match[1].trim();
    if (target.startsWith("<")) {
      target = target.slice(1, target.indexOf(">"));
    } else {
      target = target.split(/\s+/)[0];
    }
    if (
      !target ||
      target.startsWith("#") ||
      target.startsWith("/") ||
      /^[a-z][a-z0-9+.-]*:/i.test(target)
    ) {
      continue;
    }
    target = target.split("#")[0].split("?")[0];
    if (target) targets.push(decodeURIComponent(target));
  }
  return targets;
}

async function validateReferences(markdownFile) {
  const contents = await readFile(markdownFile, "utf8");
  for (const target of extractMarkdownTargets(contents)) {
    const resolved = path.resolve(path.dirname(markdownFile), target);
    if (!(await exists(resolved))) {
      errors.push(`${path.relative(repoRoot, markdownFile)}: missing relative reference ${target}`);
    }
  }
}

async function validateCompatibilityPath(relativePath, { required = false } = {}) {
  const compatibilityPath = path.join(repoRoot, relativePath);
  let info;
  try {
    info = await lstat(compatibilityPath);
  } catch {
    if (required) errors.push(`${relativePath} must exist as a compatibility symlink`);
    return;
  }

  if (!info.isSymbolicLink()) {
    errors.push(`${relativePath} must be a symlink, not a copied skill directory`);
    return;
  }

  const [targetPath, canonicalPath] = await Promise.all([
    realpath(compatibilityPath),
    realpath(skillsRoot),
  ]);
  if (targetPath !== canonicalPath) {
    errors.push(`${relativePath} must resolve to .agents/skills`);
  }
}

async function findOneignore(directory) {
  const skipped = new Set([
    ".git",
    ".next",
    ".turbo",
    "node_modules",
    "playwright-report",
    "test-results",
  ]);
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === ".oneignore") return path.join(directory, entry.name);
    if (entry.isDirectory() && !skipped.has(entry.name)) {
      const found = await findOneignore(path.join(directory, entry.name));
      if (found) return found;
    }
  }
  return null;
}

const skillEntries = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const name of skillEntries) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    errors.push(`${name}: skill directory names must be kebab-case`);
  }
}

const missingSkills = expectedSkills.filter((name) => !skillEntries.includes(name));
const extraSkills = skillEntries.filter((name) => !expectedSkills.includes(name));
if (missingSkills.length) errors.push(`Missing skills: ${missingSkills.join(", ")}`);
if (extraSkills.length) errors.push(`Unexpected skills: ${extraSkills.join(", ")}`);

for (const skillName of expectedSkills.filter((name) => skillEntries.includes(name))) {
  const skillFile = path.join(skillsRoot, skillName, "SKILL.md");
  if (!(await exists(skillFile))) {
    errors.push(`${skillName}: missing SKILL.md`);
    continue;
  }
  parseFrontmatter(await readFile(skillFile, "utf8"), skillName);
}

for (const markdownFile of (await walkFiles(skillsRoot)).filter(
  (file) => file.endsWith(".md") && path.basename(file) !== "AGENTS.md",
)) {
  await validateReferences(markdownFile);
}

const lock = JSON.parse(await readFile(path.join(repoRoot, "skills-lock.json"), "utf8"));
if (lock.version !== 1 || lock.cliVersion !== "1.5.23") {
  errors.push("skills-lock.json must use version 1 and skills CLI 1.5.23");
}

const lockedSkills = Object.keys(lock.skills ?? {}).sort();
const expectedLockedSkills = Object.keys(upstreamSkills).sort();
const unlocked = expectedLockedSkills.filter((name) => !lockedSkills.includes(name));
const unexpectedLocks = lockedSkills.filter((name) => !expectedLockedSkills.includes(name));
if (unlocked.length) errors.push(`Unlocked third-party skills: ${unlocked.join(", ")}`);
if (unexpectedLocks.length) errors.push(`Unexpected lock entries: ${unexpectedLocks.join(", ")}`);

for (const [skillName, expected] of Object.entries(upstreamSkills)) {
  const entry = lock.skills?.[skillName];
  if (!entry) continue;
  if (entry.source !== expected.source || entry.sourceUrl !== expected.sourceUrl) {
    errors.push(`${skillName}: lock source does not match the reviewed upstream`);
  }
  if (entry.sourceType !== "github") {
    errors.push(`${skillName}: lock sourceType must be github`);
  }
  if (!/^[0-9a-f]{40}$/.test(entry.resolvedCommit ?? "")) {
    errors.push(`${skillName}: lock must contain an exact 40-character resolvedCommit`);
  }
  if (entry.ref !== entry.resolvedCommit) {
    errors.push(`${skillName}: lock ref must pin the resolvedCommit`);
  }
  if (!/^[0-9a-f]{64}$/.test(entry.computedHash ?? "")) {
    errors.push(`${skillName}: lock must contain the installer computedHash`);
  }
  if (!entry.skillPath?.endsWith("/SKILL.md")) {
    errors.push(`${skillName}: lock must contain its upstream skillPath`);
  }
}

await validateCompatibilityPath(path.join(".claude", "skills"), { required: true });
for (const runnerPath of [
  path.join(".cursor", "skills"),
  path.join(".codex", "skills"),
  path.join(".warp", "skills"),
  path.join(".windsurf", "skills"),
]) {
  await validateCompatibilityPath(runnerPath);
}

const claudeTarget = path.join(repoRoot, ".claude", "skills");
if (await exists(claudeTarget)) {
  const target = await readlink(claudeTarget);
  if (target !== "../.agents/skills") {
    errors.push(".claude/skills must use the relative target ../.agents/skills");
  }
}

const oneignore = await findOneignore(repoRoot);
if (oneignore) {
  errors.push(`Forbidden .oneignore found at ${path.relative(repoRoot, oneignore)}`);
}

for (const error of errors) console.error(`- ${error}`);
if (errors.length) {
  console.error(`Agent skill validation failed with ${errors.length} error(s).`);
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${expectedSkills.length} skills (${expectedLockedSkills.length} vendored, ${localSkills.length} NextBase), lock coverage, references, and compatibility links.`,
  );
}

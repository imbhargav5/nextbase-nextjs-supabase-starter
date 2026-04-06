import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const rootPackageJsonPath = path.join(repoRoot, "package.json");
const webPackageJsonPath = path.join(repoRoot, "apps", "web", "package.json");
const rootChangelogPath = path.join(repoRoot, "CHANGELOG.md");
const webChangelogPath = path.join(repoRoot, "apps", "web", "CHANGELOG.md");

const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, "utf8"));
const webPackageJson = JSON.parse(fs.readFileSync(webPackageJsonPath, "utf8"));

rootPackageJson.version = webPackageJson.version;
fs.writeFileSync(rootPackageJsonPath, `${JSON.stringify(rootPackageJson, null, 2)}\n`);

if (fs.existsSync(webChangelogPath)) {
  fs.copyFileSync(webChangelogPath, rootChangelogPath);
}

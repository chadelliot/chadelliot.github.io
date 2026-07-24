// Warns (build does not fail) if any two company-landing-page data files
// define the same slug. A silent object-spread overwrite in
// allCompanyLandingPages.ts means the earlier one just vanishes with no
// error, so this catches that before it happens again.
import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "src", "data");

const skip = new Set(["allCompanyLandingPages.ts", "proposalOutreachResearch.ts"]);
const files = readdirSync(dataDir).filter(
  (f) => f.endsWith("CompanyLandingPages.ts") && !skip.has(f)
);

const slugToFiles = new Map();

for (const file of files) {
  const text = readFileSync(join(dataDir, file), "utf-8");
  const matches = text.matchAll(/slug:\s*"([^"]+)"/g);
  for (const [, slug] of matches) {
    if (!slugToFiles.has(slug)) slugToFiles.set(slug, []);
    slugToFiles.get(slug).push(file);
  }
}

let foundDuplicate = false;
for (const [slug, fileList] of slugToFiles) {
  if (fileList.length > 1) {
    foundDuplicate = true;
    console.warn(
      `\n⚠️  Duplicate slug "${slug}" defined in multiple files: ${fileList.join(", ")}`
    );
    console.warn(
      `   Only the last one in allCompanyLandingPages.ts's import order will actually show up on the site.`
    );
  }
}

if (foundDuplicate) {
  console.warn(
    "\n⚠️  Duplicate slugs found above. This build will still succeed, but please check whether these are intentional (e.g. two different job postings at the same company) or accidental re-research of the same role.\n"
  );
} else {
  console.log("✓ No duplicate company-page slugs found across data files.");
}

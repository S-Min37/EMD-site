const fs = require("node:fs");
const path = require("node:path");
const { getCliClient } = require("@sanity/cli");

const rootDir = process.cwd();
const inputPath = path.join(rootDir, "sanity", "seed", "content.json");

if (!fs.existsSync(inputPath)) {
  throw new Error(`Seed file not found: ${inputPath}`);
}

const docs = JSON.parse(fs.readFileSync(inputPath, "utf8"));
if (!Array.isArray(docs) || docs.length === 0) {
  throw new Error("Seed file does not contain any documents.");
}

const client = getCliClient({ apiVersion: "2026-03-13" });
const chunkSize = 20;

async function run() {
  for (let index = 0; index < docs.length; index += chunkSize) {
    const chunk = docs.slice(index, index + chunkSize);
    let transaction = client.transaction();

    for (const doc of chunk) {
      transaction = transaction.createOrReplace(doc);
    }

    await transaction.commit();
    console.log(
      `Imported ${Math.min(index + chunk.length, docs.length)} / ${docs.length} documents`
    );
  }

  console.log("Sanity content import completed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

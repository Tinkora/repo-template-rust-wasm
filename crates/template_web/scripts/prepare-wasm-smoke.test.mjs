import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  readlink,
  rm,
  symlink,
  writeFile
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL("./prepare-wasm-smoke.mjs", import.meta.url));

async function createPackage(directory, marker, extraFiles = {}) {
  await mkdir(directory, { recursive: true });
  const files = {
    "package.json": JSON.stringify({ name: `fixture-${marker}` }),
    "template_web.js": `export const marker = "${marker}";\n`,
    "template_web_bg.wasm": marker,
    ...extraFiles
  };

  for (const [path, contents] of Object.entries(files)) {
    const target = join(directory, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, contents);
  }
}

async function snapshot(directory) {
  const entries = [];

  async function visit(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      const name = relative(directory, path);
      if (entry.isDirectory()) {
        entries.push(["directory", name]);
        await visit(path);
      } else if (entry.isFile()) {
        entries.push(["file", name, (await readFile(path)).toString("base64")]);
      } else if (entry.isSymbolicLink()) {
        entries.push(["symlink", name, await readlink(path)]);
      } else {
        entries.push(["special", name]);
      }
    }
  }

  await visit(directory);
  return entries.sort((left, right) => left[1].localeCompare(right[1]));
}

async function assertNoTemporaryPackages(root) {
  const entries = await readdir(root);
  assert.deepEqual(
    entries.filter((entry) => entry.startsWith(".pkg.staging-")),
    []
  );
}

function runPrepare(cwd, artifact) {
  const env = { ...process.env };
  if (artifact) {
    env.WASM_SMOKE_PACKAGE = artifact;
  } else {
    delete env.WASM_SMOKE_PACKAGE;
  }
  return spawnSync(process.execPath, [script], { cwd, env, encoding: "utf8" });
}

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "template-wasm-smoke-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test("preserves the previous package when an artifact contains a FIFO", async (t) => {
  const root = await fixture(t);
  const destination = join(root, "pkg");
  const artifact = join(root, "artifact");
  await createPackage(destination, "old", { "old-only.txt": "keep" });
  await createPackage(artifact, "new");
  execFileSync("/usr/bin/mkfifo", [join(artifact, "named-pipe")]);
  const before = await snapshot(destination);

  const result = runPrepare(root, artifact);

  assert.notEqual(result.status, 0, result.stdout + result.stderr);
  assert.deepEqual(await snapshot(destination), before);
  await assertNoTemporaryPackages(root);
});

test("rejects a local package missing required files", async (t) => {
  const root = await fixture(t);
  await mkdir(join(root, "pkg"));

  const result = runPrepare(root);

  assert.notEqual(result.status, 0, result.stdout + result.stderr);
  await assertNoTemporaryPackages(root);
});

test("preserves the previous package when an artifact contains a symlink", async (t) => {
  const root = await fixture(t);
  const destination = join(root, "pkg");
  const artifact = join(root, "artifact");
  await createPackage(destination, "old");
  await createPackage(artifact, "new");
  await mkdir(join(artifact, "nested"));
  await symlink("../template_web.js", join(artifact, "nested", "linked.js"));
  const before = await snapshot(destination);

  const result = runPrepare(root, artifact);

  assert.notEqual(result.status, 0, result.stdout + result.stderr);
  assert.deepEqual(await snapshot(destination), before);
  await assertNoTemporaryPackages(root);
});

test("replaces the previous package completely after validation", async (t) => {
  const root = await fixture(t);
  const destination = join(root, "pkg");
  const artifact = join(root, "artifact");
  await createPackage(destination, "old", { "obsolete.txt": "remove" });
  await createPackage(artifact, "new", { "nested/metadata.txt": "copied" });
  const expected = await snapshot(artifact);

  const result = runPrepare(root, artifact);

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.deepEqual(await snapshot(destination), expected);
  await assertNoTemporaryPackages(root);
});

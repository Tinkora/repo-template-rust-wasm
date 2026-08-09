import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

import config from "../playwright.config.js";

const configUrl = new URL("../playwright.config.js", import.meta.url).href;

test("covers every required responsive viewport", () => {
  const widths = config.projects.map((project) => project.use.viewport.width);

  assert.deepEqual(widths, [375, 768, 1024, 1440]);
});

test("accepts the usable TCP port boundaries", () => {
  for (const port of ["1", "65535"]) {
    const result = importConfigWithPort(port);

    assert.equal(result.status, 0, result.stderr);
  }
});

test("rejects ports outside the usable TCP range", () => {
  for (const port of ["0", "65536", "not-a-port"]) {
    const result = importConfigWithPort(port);

    assert.notEqual(result.status, 0, `expected PLAYWRIGHT_PORT=${port} to fail`);
    assert.match(result.stderr, /PLAYWRIGHT_PORT must be an integer between 1 and 65535/);
  }
});

function importConfigWithPort(port) {
  return spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", `await import(${JSON.stringify(configUrl)})`],
    {
      encoding: "utf8",
      env: { ...process.env, PLAYWRIGHT_PORT: port }
    }
  );
}

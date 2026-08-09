import init, { run } from "../pkg/template_web.js";

const form = document.querySelector("#run-form");
const input = document.querySelector("#name-input");
const runButton = document.querySelector("#run-button");
const runtimeStatus = document.querySelector(".runtime-status");
const runtimeLabel = document.querySelector("#runtime-label");
const resultStatus = document.querySelector("#result-status");
const schemaVersion = document.querySelector("#schema-version");
const output = document.querySelector("#output");
const errorState = document.querySelector("#error");
const errorCode = document.querySelector("#error-code");
const errorMessage = document.querySelector("#error-message");

function renderResult(result) {
  if (result.ok) {
    resultStatus.textContent = "Completed";
    schemaVersion.textContent = `Schema v${result.data.schemaVersion}`;
    output.textContent = result.data.output;
    output.hidden = false;
    errorState.hidden = true;
    return;
  }

  resultStatus.textContent = "Error";
  schemaVersion.textContent = "";
  output.textContent = "";
  output.hidden = true;
  errorCode.textContent = result.error.code;
  errorMessage.textContent = result.error.message;
  errorState.hidden = false;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderResult(run(input.value));
});

try {
  await init();
  runtimeStatus.dataset.ready = "true";
  runtimeLabel.textContent = "Ready";
  runButton.disabled = false;
  form.requestSubmit();
} catch (error) {
  runtimeStatus.dataset.ready = "false";
  runtimeLabel.textContent = "Unavailable";
  resultStatus.textContent = "Error";
  output.hidden = true;
  errorCode.textContent = "WASM_INIT_FAILED";
  errorMessage.textContent = "The WebAssembly module could not be loaded.";
  errorState.hidden = false;
  console.error(error);
}

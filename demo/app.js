const state = {
  mode: "in-person",
  payload: null,
  result: null,
};

const screens = {
  request: document.querySelector("#request-screen"),
  matching: document.querySelector("#matching-screen"),
  confirmed: document.querySelector("#confirmed-screen"),
};

const situationInput = document.querySelector("#situation");
const destinationInput = document.querySelector("#destination");
const destinationLabel = document.querySelector("#destination-label");
const languageInput = document.querySelector("#language");
const settingInput = document.querySelector("#setting");
const errorMessage = document.querySelector("#error-message");

function showScreen(name) {
  Object.entries(screens).forEach(([key, element]) => {
    element.classList.toggle("is-hidden", key !== name);
  });
  errorMessage.classList.add("is-hidden");
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });

  const virtual = mode === "virtual";
  destinationLabel.textContent = virtual
    ? "Preferred platform"
    : "Where are you?";
  destinationInput.placeholder = virtual
    ? "e.g. Zoom, Google Meet, or WhatsApp Video"
    : "e.g. 40 GRA Road, Beside Kwara Hotel";
  destinationInput.required = !virtual;
}

function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function renderMatch(result) {
  const title = document.querySelector("#confirmed-title");
  const subtitle = document.querySelector("#confirmed-subtitle");
  const matchCard = document.querySelector("#match-card");
  const monitoringCopy = document.querySelector("#monitoring-copy");
  const match = result.matches?.[0];

  if (!match) {
    title.textContent = "A coordinator will review this";
    subtitle.textContent =
      result.human_review_reason || "We could not find a suitable interpreter yet.";
    matchCard.innerHTML = `
      <div class="match-avatar">!</div>
      <div class="match-copy">
        <strong>Human review required</strong>
        <p>${escapeHtml(result.next_steps?.[0] || "A coordinator will follow up.")}</p>
      </div>
    `;
    monitoringCopy.textContent =
      "Your request is visible to the SignBee coordination team.";
    return;
  }

  const virtual = state.mode === "virtual";
  title.textContent = virtual
    ? `${escapeHtml(match.name.split(" ")[0])} is ready`
    : `${escapeHtml(match.name.split(" ")[0])} is on the way`;
  subtitle.textContent = virtual
    ? "Joining your virtual session shortly"
    : "Arriving in 7 minutes";
  matchCard.innerHTML = `
    <div class="match-avatar">${escapeHtml(initials(match.name))}</div>
    <div class="match-copy">
      <strong>${escapeHtml(match.name)}</strong>
      <p>${escapeHtml(match.reasons?.slice(0, 2).join(" · ") || "Best available fit")}</p>
    </div>
  `;
  monitoringCopy.textContent = `If ${escapeHtml(
    match.name.split(" ")[0],
  )} is delayed, we’ll help you find another match.`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function submitRequest(event) {
  event.preventDefault();

  const situation = situationInput.value.trim();
  const destination = destinationInput.value.trim();
  if (!situation || (state.mode === "in-person" && !destination)) {
    errorMessage.textContent =
      state.mode === "in-person"
        ? "Describe the request and add a location to continue."
        : "Describe the request and add a preferred platform to continue.";
    errorMessage.classList.remove("is-hidden");
    return;
  }

  state.payload = {
    situation,
    mode: state.mode,
    location: destination,
    language: languageInput.value.trim(),
    setting: settingInput.value,
  };
  showScreen("matching");

  try {
    const response = await fetch("/api/triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state.payload),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Triage failed.");
    state.result = result;

    await new Promise((resolve) => setTimeout(resolve, 1900));
    renderMatch(result);
    showScreen("confirmed");
  } catch (error) {
    errorMessage.textContent =
      error instanceof Error ? error.message : "Triage failed.";
    showScreen("request");
    errorMessage.classList.remove("is-hidden");
  }
}

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

document.querySelector("#request-form").addEventListener("submit", submitRequest);

document.querySelectorAll('[data-action="cancel"]').forEach((button) => {
  button.addEventListener("click", () => showScreen("request"));
});

document.querySelectorAll('[data-action="close"]').forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#request-form").reset();
    setMode("in-person");
    showScreen("request");
  });
});

document.querySelector("#message-button").addEventListener("click", () => {
  const button = document.querySelector("#message-button");
  button.textContent = "Messaging coming next";
  button.disabled = true;
});

setMode("in-person");
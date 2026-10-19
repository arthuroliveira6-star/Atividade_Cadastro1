const THEME_KEY = "app-theme";
const USER_KEY = "app-users";

const body = document.body;
// seletores atualizados para os nomes em português do HTML
const themeButtons = document.querySelectorAll(".botao-tema");
const tabs = document.querySelectorAll(".aba");
const panels = document.querySelectorAll(".painel");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const statusMessage = document.getElementById("statusMessage");

function setTheme(theme) {
  body.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  themeButtons.forEach((button) => {
    const active = button.dataset.theme === theme;
    button.setAttribute("aria-pressed", String(active));
  });
}

function getSavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const validThemes = ["light", "dark", "high-contrast"];
  return validThemes.includes(saved) ? saved : "light";
}

function switchTab(targetTabId) {
  tabs.forEach((tab) => {
    const active = tab.id === targetTabId;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  panels.forEach((panel) => {
    const active = panel.id === (targetTabId === "login-tab" ? "login-panel" : "register-panel");
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });
}

// usa a classe em português conforme o HTML: "mensagem-status"
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `mensagem-status ${type}`;
}

function saveUser(user) {
  const users = JSON.parse(localStorage.getItem(USER_KEY) || "[]");
  users.push(user);
  localStorage.setItem(USER_KEY, JSON.stringify(users));
}

function getUserByEmail(email) {
  const users = JSON.parse(localStorage.getItem(USER_KEY) || "[]");
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    switchTab(tab.id);
  });
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setTheme(button.dataset.theme);
  });
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);
  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();
  const password = String

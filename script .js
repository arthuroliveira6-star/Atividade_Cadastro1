const THEME_KEY = "app-theme";
const USER_KEY = "app-users";

const body = document.body;
const themeButtons = document.querySelectorAll(".theme-button");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
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

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status ${type}`;
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
  const password = String(formData.get("password")).trim();

  if (!name || !email || !password) {
    showStatus("Preencha todos os campos do cadastro.", "error");
    return;
  }

  if (password.length < 6) {
    showStatus("A senha deve ter pelo menos 6 caracteres.", "error");
    return;
  }

  const existingUser = getUserByEmail(email);

  if (existingUser) {
    showStatus("Este e-mail já está cadastrado.", "error");
    return;
  }

  saveUser({ name, email, password });
  showStatus("Cadastro realizado com sucesso!", "success");
  registerForm.reset();
  switchTab("login-tab");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const email = String(formData.get("email")).trim();
  const password = String(formData.get("password")).trim();

  if (!email || !password) {
    showStatus("Informe e-mail e senha para entrar.", "error");
    return;
  }

  const user = getUserByEmail(email);

  if (!user) {
    showStatus("Usuário não encontrado. Faça o cadastro primeiro.", "error");
    return;
  }

  if (user.password !== password) {
    showStatus("Senha incorreta.", "error");
    return;
  }

  showStatus(`Login realizado com sucesso! Bem-vindo(a), ${user.name}.`, "success");
  loginForm.reset();
});

setTheme(getSavedTheme());
switchTab("login-tab");
(function () {
  "use strict";

  var root = document.documentElement;

  /* Theme switch: follows the system setting until the reader picks one. */
  var themeButton = document.getElementById("theme");
  if (themeButton) {
    function currentTheme() {
      if (root.dataset.theme) return root.dataset.theme;
      return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function refreshThemeButton() {
      themeButton.textContent =
        currentTheme() === "dark" ? themeButton.dataset.light : themeButton.dataset.dark;
    }
    themeButton.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("aarshi-theme", next);
      refreshThemeButton();
    });
    refreshThemeButton();
  }

  /* Mobile navigation: the sidebar becomes a drawer behind a hamburger button. */
  var toggle = document.querySelector(".menu-toggle");
  var sidebar = document.getElementById("sidebar");
  var scrim = document.getElementById("scrim");
  if (!toggle || !sidebar || !scrim) return;

  var main = document.querySelector(".shell > main");
  var narrow = matchMedia("(max-width: 800px)");
  var labels = (root.lang || "en").toLowerCase().indexOf("fr") === 0
    ? { open: "Ouvrir le menu", close: "Fermer le menu" }
    : { open: "Open menu", close: "Close menu" };
  var isOpen = false;

  function apply(open, restoreFocus) {
    isOpen = open;
    sidebar.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? labels.close : labels.open);
    document.body.classList.toggle("menu-open", open);
    scrim.hidden = !open;
    sidebar.inert = narrow.matches && !open;
    if (main) main.inert = open;

    if (open) {
      var first = sidebar.querySelector("a, button");
      if (first) first.focus({ preventScroll: true });
    } else if (restoreFocus) {
      toggle.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener("click", function () {
    apply(!isOpen, true);
  });

  scrim.addEventListener("click", function () {
    apply(false, true);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen) apply(false, true);
  });

  narrow.addEventListener("change", function () {
    apply(false, false);
  });

  apply(false, false);
})();

/**
 * Site-wide behavior. No framework, no build step.
 * Kept deliberately small — the site must work with this file absent
 * except for the theme toggle and mobile nav affordances.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "site-theme";
  var root = document.documentElement;

  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function currentTheme() {
    var stored = safeGet(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // Apply as early as possible to avoid a flash of the wrong theme.
  applyTheme(currentTheme());

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        safeSet(STORAGE_KEY, next);
        toggle.setAttribute("aria-pressed", String(next === "dark"));
      });
      toggle.setAttribute("aria-pressed", String(root.getAttribute("data-theme") === "dark"));
    }

    var navToggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (navToggle && mobileNav) {
      var setNav = function (open) {
        mobileNav.classList.toggle("is-open", open);
        navToggle.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
      };
      navToggle.addEventListener("click", function () {
        setNav(!mobileNav.classList.contains("is-open"));
      });
      mobileNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () { setNav(false); });
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
          setNav(false);
          navToggle.focus();
        }
      });
    }

    var yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    setupCursorGlow();
  });

  // A pointer-following spotlight, tinted via --color-accent so it tracks
  // the active theme. Skipped for touch/no-hover devices and reduced-motion.
  function setupCursorGlow() {
    var hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasHover || reduceMotion) return;

    var glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    var x = 0, y = 0, queued = false;

    function render() {
      queued = false;
      glow.style.setProperty("--glow-x", x + "px");
      glow.style.setProperty("--glow-y", y + "px");
    }

    document.addEventListener("mousemove", function (e) {
      x = e.clientX;
      y = e.clientY;
      if (!glow.classList.contains("is-active")) glow.classList.add("is-active");
      if (!queued) {
        queued = true;
        window.requestAnimationFrame(render);
      }
    });

    document.addEventListener("mouseleave", function () {
      glow.classList.remove("is-active");
    });
  }
})();

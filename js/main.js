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
    setupImagePreview();
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

  // Click-to-preview for work images on the projects page. Supports multiple
  // images per project with prev/next navigation.
  function setupImagePreview() {
    var preview = document.querySelector("[data-image-preview]");
    var closeBtn = document.querySelector("[data-image-preview-close]");
    var previewImg = document.querySelector(".image-preview-img");
    var prevBtn = document.querySelector("[data-image-prev]");
    var nextBtn = document.querySelector("[data-image-next]");
    var counterCurr = document.querySelector("[data-image-current]");
    var counterTotal = document.querySelector("[data-image-total]");
    if (!preview) return;

    var currentProject = null;
    var currentImageIndex = 0;
    var projectImages = {};

    // Build a map of projects to their images.
    document.querySelectorAll(".work-item").forEach(function (item) {
      var projectId = item.id;
      var images = Array.from(item.querySelectorAll(".work-visual img")).map(function (img) {
        return { src: img.src, alt: img.alt };
      });
      if (images.length > 0) {
        projectImages[projectId] = images;
      }
    });

    var updatePreview = function (projectId, imageIndex) {
      if (!projectImages[projectId]) return;
      var images = projectImages[projectId];
      imageIndex = Math.max(0, Math.min(imageIndex, images.length - 1));
      currentProject = projectId;
      currentImageIndex = imageIndex;
      previewImg.src = images[imageIndex].src;
      previewImg.alt = images[imageIndex].alt;
      counterCurr.textContent = String(imageIndex + 1);
      counterTotal.textContent = String(images.length);
      prevBtn.disabled = imageIndex === 0;
      nextBtn.disabled = imageIndex === images.length - 1;
    };

    var openPreview = function (projectId, imageIndex) {
      updatePreview(projectId, imageIndex);
      preview.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    var closePreview = function () {
      preview.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    document.querySelectorAll(".work-visual img").forEach(function (img) {
      img.addEventListener("click", function (e) {
        e.preventDefault();
        var projectItem = img.closest(".work-item");
        var projectId = projectItem.id;
        var imageIndex = Array.from(projectItem.querySelectorAll(".work-visual img")).indexOf(img);
        openPreview(projectId, imageIndex);
      });
    });

    prevBtn.addEventListener("click", function () {
      if (currentProject) updatePreview(currentProject, currentImageIndex - 1);
    });
    nextBtn.addEventListener("click", function () {
      if (currentProject) updatePreview(currentProject, currentImageIndex + 1);
    });
    closeBtn.addEventListener("click", closePreview);
    preview.addEventListener("click", function (e) {
      if (e.target === preview) closePreview();
    });
    document.addEventListener("keydown", function (e) {
      if (preview.getAttribute("aria-hidden") !== "false") return;
      if (e.key === "Escape") closePreview();
      if (e.key === "ArrowLeft") prevBtn.click();
      if (e.key === "ArrowRight") nextBtn.click();
    });
  }
})();

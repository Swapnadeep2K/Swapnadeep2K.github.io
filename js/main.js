/**
 * Site-wide behavior. No framework, no build step.
 * Kept deliberately small — the site must work with this file absent
 * except for the theme toggle and mobile nav affordances.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "site-theme";
  var root = document.documentElement;
  var activeOverlay = null;
  var previousOverflow = "";

  function activateOverlay(close) {
    if (activeOverlay === close) return;
    if (activeOverlay) activeOverlay(false);
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    activeOverlay = close;
  }

  function deactivateOverlay(close) {
    if (activeOverlay !== close) return;
    document.body.style.overflow = previousOverflow;
    activeOverlay = null;
  }

  function trapFocus(event, containers) {
    var selector = "a[href], button:not([disabled]), input:not([disabled]), " +
      "select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
    var focusable = [];
    containers.forEach(function (container) {
      if (container.matches(selector)) focusable.push(container);
      container.querySelectorAll(selector).forEach(function (element) {
        focusable.push(element);
      });
    });
    focusable = focusable.filter(function (element) {
      return !element.disabled && !element.closest("[inert]") && element.getClientRects().length > 0 &&
        window.getComputedStyle(element).visibility !== "hidden";
    });
    if (!focusable.length) return;

    var index = focusable.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      focusable[focusable.length - 1].focus();
    } else if (!event.shiftKey && (index === -1 || index === focusable.length - 1)) {
      event.preventDefault();
      focusable[0].focus();
    }
  }

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

    setupMobileNav();

    document.querySelectorAll("[data-year]").forEach(function (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    });

    setupCursorGlow();
    setupImagePreview();
  });

  function setupMobileNav() {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (!navToggle || !mobileNav) return;

    var header = navToggle.closest(".site-header");
    if (!header) return;
    var background = [];
    mobileNav.inert = true;
    navToggle.setAttribute("aria-label", "Open menu");

    function closeNav(restoreFocus) {
      if (!mobileNav.classList.contains("is-open")) return;
      mobileNav.classList.remove("is-open");
      mobileNav.inert = true;
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      background.forEach(function (item) { item.element.inert = item.wasInert; });
      background = [];
      deactivateOverlay(closeNav);
      if (restoreFocus) navToggle.focus();
    }

    function makeInert(element) {
      background.push({ element: element, wasInert: element.inert });
      element.inert = true;
    }

    function openNav() {
      if (window.matchMedia("(min-width: 700px)").matches) return;
      activateOverlay(closeNav);
      Array.from(document.body.children).forEach(function (element) {
        if (element !== mobileNav && element !== header) makeInert(element);
      });
      header.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), " +
        "select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")
        .forEach(function (element) {
          if (element !== navToggle) makeInert(element);
        });
      mobileNav.inert = false;
      mobileNav.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close menu");
      var firstLink = mobileNav.querySelector("a[href]");
      (firstLink || navToggle).focus();
    }

    navToggle.addEventListener("click", function () {
      if (mobileNav.classList.contains("is-open")) closeNav(true);
      else openNav();
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { closeNav(false); });
    });
    document.addEventListener("keydown", function (event) {
      if (!mobileNav.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeNav(true);
      } else if (event.key === "Tab") {
        trapFocus(event, [navToggle, mobileNav]);
      }
    });
    document.addEventListener("focusin", function (event) {
      if (mobileNav.classList.contains("is-open") &&
          event.target !== navToggle && !mobileNav.contains(event.target)) {
        var firstLink = mobileNav.querySelector("a[href]");
        (firstLink || navToggle).focus();
      }
    });
    window.addEventListener("resize", function () {
      if (!mobileNav.classList.contains("is-open") ||
          !window.matchMedia("(min-width: 700px)").matches) return;
      var focused = document.activeElement;
      var moveFocus = focused === navToggle || mobileNav.contains(focused);
      var focusedHref = mobileNav.contains(focused) ? focused.getAttribute("href") : null;
      closeNav(false);
      if (moveFocus) {
        var desktopLinks = Array.from(header.querySelectorAll(".site-nav a"));
        var target = desktopLinks.find(function (link) {
          return focusedHref && link.getAttribute("href") === focusedHref;
        }) || desktopLinks[0] || header.querySelector("[data-theme-toggle]");
        if (target) target.focus();
      }
    });
  }

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

  // Enhance project images with keyboard-accessible preview controls.
  function setupImagePreview() {
    var preview = document.querySelector("[data-image-preview]");
    var closeBtn = document.querySelector("[data-image-preview-close]");
    var previewImg = document.querySelector(".image-preview-img");
    var prevBtn = document.querySelector("[data-image-prev]");
    var nextBtn = document.querySelector("[data-image-next]");
    var counterCurr = document.querySelector("[data-image-current]");
    var counterTotal = document.querySelector("[data-image-total]");
    if (!preview || !closeBtn || !previewImg || !prevBtn || !nextBtn ||
        !counterCurr || !counterTotal || typeof preview.showModal !== "function") return;

    var currentImages = [];
    var currentImageIndex = 0;
    var opener = null;

    function updatePreview(imageIndex) {
      if (!currentImages.length) return;
      imageIndex = Math.max(0, Math.min(imageIndex, currentImages.length - 1));
      currentImageIndex = imageIndex;
      var image = currentImages[imageIndex];
      var focused = document.activeElement;
      previewImg.src = image.currentSrc || image.src;
      previewImg.alt = image.alt;
      counterCurr.textContent = String(imageIndex + 1);
      counterTotal.textContent = String(currentImages.length);
      prevBtn.disabled = imageIndex === 0;
      nextBtn.disabled = imageIndex === currentImages.length - 1;
      if (preview.open && ((focused === prevBtn && prevBtn.disabled) ||
          (focused === nextBtn && nextBtn.disabled))) {
        closeBtn.focus();
      }
    }

    function openPreview(images, imageIndex, trigger) {
      activateOverlay(closePreview);
      currentImages = images;
      opener = trigger;
      updatePreview(imageIndex);
      if (!preview.open) preview.showModal();
      closeBtn.focus();
    }

    function closePreview(restoreFocus) {
      if (!preview.open) return;
      preview.close();
      deactivateOverlay(closePreview);
      if (restoreFocus && opener) opener.focus();
    }

    document.querySelectorAll(".work-item").forEach(function (item) {
      var images = Array.from(item.querySelectorAll(".work-visual img"));
      images.forEach(function (img, index) {
        var picture = img.closest("picture");
        var visual = img.closest(".work-visual");
        var imageElement = picture && visual.contains(picture) ? picture : img;
        var trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "image-preview-trigger";
        trigger.setAttribute("aria-label", "View larger image: " + img.alt);
        imageElement.parentNode.insertBefore(trigger, imageElement);
        trigger.appendChild(imageElement);
        trigger.addEventListener("click", function () {
          openPreview(images, index, trigger);
        });
      });
    });

    prevBtn.addEventListener("click", function () {
      updatePreview(currentImageIndex - 1);
    });
    nextBtn.addEventListener("click", function () {
      updatePreview(currentImageIndex + 1);
    });
    closeBtn.addEventListener("click", function () { closePreview(true); });
    preview.addEventListener("click", function (event) {
      if (event.target === preview) closePreview(true);
    });
    preview.addEventListener("cancel", function (event) {
      event.preventDefault();
      closePreview(true);
    });
    document.addEventListener("focusin", function (event) {
      if (preview.open && !preview.contains(event.target)) closeBtn.focus();
    });
    document.addEventListener("keydown", function (event) {
      if (!preview.open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closePreview(true);
      } else if (event.key === "Tab") {
        trapFocus(event, [preview]);
      } else if (event.key === "ArrowLeft" && !prevBtn.disabled) {
        updatePreview(currentImageIndex - 1);
      } else if (event.key === "ArrowRight" && !nextBtn.disabled) {
        updatePreview(currentImageIndex + 1);
      }
    });
  }
})();

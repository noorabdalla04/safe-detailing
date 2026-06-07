/* =========================================================
   Safe Detailing — interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---- Footer year ---- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ---- Sticky header state ---- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile nav ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && header) {
    var setMenu = function (open) {
      header.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setMenu(!header.classList.contains("menu-open"));
    });
    if (nav) {
      nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) setMenu(false);
      });
    }
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---- Before / After sliders ---- */
  document.querySelectorAll("[data-ba]").forEach(function (ba) {
    var range = ba.querySelector(".ba__range");
    if (!range) return;
    var apply = function () {
      ba.style.setProperty("--pos", range.value + "%");
    };
    apply();
    range.addEventListener("input", apply);
    // nudge the hero slider once when revealed, as a hint that it's draggable
    if (ba.closest(".hero__media")) {
      var hinted = false;
      var hint = function () {
        if (hinted) return;
        hinted = true;
        var target = 50, start = parseFloat(range.value) || 55, t0 = null;
        var step = function (ts) {
          if (t0 === null) t0 = ts;
          var k = Math.min((ts - t0) / 650, 1);
          var e = 1 - Math.pow(1 - k, 3);
          range.value = String(start + (target - start) * e);
          apply();
          if (k < 1) requestAnimationFrame(step);
        };
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setTimeout(function () { requestAnimationFrame(step); }, 450);
        }
      };
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (en) {
          en.forEach(function (x) { if (x.isIntersecting) { hint(); io.disconnect(); } });
        });
        io.observe(ba);
      }
    }
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && reveals.length) {
    var ro = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            ro.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Pricing buttons pre-select package ---- */
  var pkgSelect = document.getElementById("bf-package");
  document.querySelectorAll("[data-pkg]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var val = btn.getAttribute("data-pkg");
      if (pkgSelect && val) {
        Array.prototype.forEach.call(pkgSelect.options, function (o) {
          if (o.value === val || o.text === val) pkgSelect.value = o.value;
        });
      }
    });
  });

  /* ---- Booking form -> compose email ---- */
  var form = document.getElementById("bookForm");
  var note = document.getElementById("bookNote");
  var EMAIL = "Sayfudein3@gmail.com";
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.name.value || "").trim();
      var phone = (form.phone.value || "").trim();
      if (!name || !phone) {
        if (note) { note.textContent = "Please add your name and phone so we can reach you."; note.classList.remove("ok"); }
        (name ? form.phone : form.name).focus();
        return;
      }
      var vehicle = form.vehicle.value;
      var pkg = form["package"].value;
      var msg = (form.message.value || "").trim();

      var subject = "Booking request — " + name + " (" + pkg + ")";
      var body =
        "Hi Safe Detailing,\n\n" +
        "I'd like to book a detail.\n\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Vehicle: " + vehicle + "\n" +
        "Package: " + pkg + "\n" +
        (msg ? "Details: " + msg + "\n" : "") +
        "\nThanks!";

      var href = "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = href;
      if (note) {
        note.textContent = "Opening your email app… if nothing happens, call or text (343) 571-4226.";
        note.classList.add("ok");
      }
    });
  }
})();

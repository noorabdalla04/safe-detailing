/* =========================================================
   Safe Detailing | interactions (garage editorial)
   ========================================================= */
(function () {
  "use strict";

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* sticky masthead state */
  var head = document.querySelector(".masthead");
  var onScroll = function () { if (head) head.classList.toggle("scrolled", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* mobile menu */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  if (burger && head) {
    var setMenu = function (open) {
      head.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    burger.addEventListener("click", function () { setMenu(!head.classList.contains("menu-open")); });
    if (nav) nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    window.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* staggered reveal */
  var reveals = document.querySelectorAll("[data-reveal]");
  reveals.forEach(function (el) {
    var d = el.getAttribute("data-d");
    if (d) el.style.transitionDelay = (parseInt(d, 10) - 1) * 0.09 + "s";
  });
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -7% 0px", threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* pricing buttons preselect package */
  var pkg = document.getElementById("bf-package");
  document.querySelectorAll("[data-pkg]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-pkg");
      if (pkg && v) Array.prototype.forEach.call(pkg.options, function (o) {
        if (o.value === v || o.text === v) pkg.value = o.value;
      });
    });
  });

  /* booking form -> compose email */
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
      var vehicle = form.vehicle.value, plan = form["package"].value, msg = (form.message.value || "").trim();
      var subject = "Work order: " + name + " (" + plan + ")";
      var body =
        "Hi Safe Detailing,\n\nI'd like to book a detail.\n\n" +
        "Name: " + name + "\nPhone: " + phone + "\nVehicle: " + vehicle + "\nPackage: " + plan + "\n" +
        (msg ? "Notes: " + msg + "\n" : "") + "\nThanks!";
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      if (note) { note.textContent = "Opening your email app. If nothing happens, call or text (343) 571-4226."; note.classList.add("ok"); }
    });
  }
})();

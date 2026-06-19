/* ============================================================
   SAYF DETAILING | interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Before / After sliders ---------- */
  function initBA(el) {
    var before = el.querySelector('.before-wrap');
    var handle = el.querySelector('.ba-handle');
    var knob = el.querySelector('.ba-knob');
    var dragging = false;

    function apply(pct) {
      before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
      knob.style.left = pct + '%';
      el.setAttribute('aria-valuenow', Math.round(pct));
    }
    function setPos(clientX) {
      var r = el.getBoundingClientRect();
      var x = clientX - r.left;
      var pct = Math.max(0, Math.min(100, (x / r.width) * 100));
      apply(pct);
    }

    function down(e) {
      dragging = true;
      el.classList.add('dragging');
      setPos((e.touches ? e.touches[0] : e).clientX);
      e.preventDefault();
    }
    function move(e) {
      if (!dragging) return;
      setPos((e.touches ? e.touches[0] : e).clientX);
    }
    function up() { dragging = false; el.classList.remove('dragging'); }

    el.addEventListener('mousedown', down);
    el.addEventListener('touchstart', down, { passive: false });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);

    // keyboard
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'slider');
    el.setAttribute('aria-valuemin', '0');
    el.setAttribute('aria-valuemax', '100');
    el.setAttribute('aria-valuenow', '50');
    el.addEventListener('keydown', function (e) {
      var cur = parseFloat(handle.style.left) || 50;
      if (e.key === 'ArrowLeft') { cur = Math.max(0, cur - 4); }
      else if (e.key === 'ArrowRight') { cur = Math.min(100, cur + 4); }
      else return;
      apply(cur);
      e.preventDefault();
    });

    // gentle auto-hint on first view
    var hinted = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !hinted) {
          hinted = true;
          var seq = [62, 38, 50];
          var i = 0;
          (function tick() {
            if (i >= seq.length) return;
            before.style.transition = 'clip-path .5s cubic-bezier(.22,.61,.36,1)';
            handle.style.transition = 'left .5s cubic-bezier(.22,.61,.36,1)';
            knob.style.transition = 'left .5s cubic-bezier(.22,.61,.36,1)';
            apply(seq[i]);
            i++;
            setTimeout(function () {
              if (i >= seq.length) {
                before.style.transition = '';
                handle.style.transition = '';
                knob.style.transition = '';
              }
              tick();
            }, 520);
          })();
          io.disconnect();
        }
      });
    }, { threshold: 0.55 });
    io.observe(el);
  }

  document.querySelectorAll('.ba').forEach(initBA);

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          ro.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (r, i) {
      r.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      ro.observe(r);
    });
  } else {
    reveals.forEach(function (r) { r.classList.add('in'); });
  }

  /* ---------- Booking form -> mailto fallback ---------- */
  var form = document.getElementById('book-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get('name') || '').toString().trim();
      var phone = (d.get('phone') || '').toString().trim();
      var vehicle = (d.get('vehicle') || '-').toString();
      var pkg = (d.get('package') || '-').toString();
      var note = (d.get('note') || '').toString().trim();
      var service = (d.get('service') || 'Mobile').toString();
      var address = (d.get('address') || '').toString().trim();

      var subject = 'Detailing request: ' + (name || 'New enquiry') + ' (' + vehicle + ')';
      var lines = [
        'Name: ' + (name || '-'),
        'Phone: ' + (phone || '-'),
        'Vehicle: ' + vehicle,
        'Service: ' + (service === 'Mobile' ? 'Mobile (we come to you)' : service)
      ];
      if (service === 'Mobile') { lines.push('Address: ' + (address || '-')); }
      lines.push('Package of interest: ' + pkg, '', 'Notes:', (note || '-'));
      var href = 'mailto:Sayfudein3@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = href;

      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        var t = btn.querySelector('.btn-label');
        if (t) t.textContent = 'Opening your email…';
      }
    });

    // Service type toggles the address field
    var addrField = document.getElementById('addr-field');
    function syncAddr() {
      var sel = form.querySelector('input[name="service"]:checked');
      var mobile = !sel || sel.value === 'Mobile';
      if (addrField) addrField.style.display = mobile ? '' : 'none';
    }
    form.querySelectorAll('input[name="service"]').forEach(function (r) {
      r.addEventListener('change', syncAddr);
    });
    syncAddr();
  }

  /* ---------- Year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Smooth offset for sticky nav anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

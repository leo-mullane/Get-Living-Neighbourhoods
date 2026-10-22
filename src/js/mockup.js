/* ==========================================================================
   mockup.js — behaviour for the Elephant Central conversion mockup.

   - Today / Proposed switch and a panel to turn each tweak on or off
   - Shows and hides page elements with data-show="key" / data-hide="key"
   - Reorders the page sections for the tweaks that move blocks
   - Notes switch (off by default) renders the CRO notes from tweaks.js
   - Small interactions: carousels, enquiry accordion, form checks,
     amenities show all, commute calculator, building works read more
   Vanilla JS, no dependencies. Every control works from the keyboard.
   ========================================================================== */

(function () {
  'use strict';

  var TWEAKS = window.EC_TWEAKS || [];
  var EFFORT = window.EC_EFFORT || {};
  var ROUNDS = window.EC_ROUNDS || {};
  var ALL = TWEAKS.map(function (t) { return t.key; });
  var BY_ID = {};
  TWEAKS.forEach(function (t) { BY_ID[t.id] = t; });

  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------------------------------------------------------------------
     Photos and icons: applied only once loaded, so the illustrated
     fallback stays wherever getliving.com images can't be reached.
     --------------------------------------------------------------------- */
  function loadImages(root) {
    (root || document).querySelectorAll('[data-img], [data-icon]').forEach(function (el) {
      var src = el.getAttribute('data-img') || el.getAttribute('data-icon');
      if (!src || el.classList.contains('loaded')) return;
      var img = new Image();
      img.onload = function () { el.style.backgroundImage = 'url("' + src + '")'; el.classList.add('loaded'); };
      img.src = src;
    });
  }

  /* ---------------------------------------------------------------------
     Overview page: render the tweak list from tweaks.js
     --------------------------------------------------------------------- */
  function renderOverview() {
    var rounds = document.querySelector('[data-round-list]');
    if (rounds) {
      var rhref = rounds.getAttribute('data-page');
      Object.keys(ROUNDS).forEach(function (r) {
        var items = TWEAKS.filter(function (t) { return String(t.round) === r; });
        var row = document.createElement('div');
        row.className = 'round-row';
        row.innerHTML = '<div><h3>' + ROUNDS[r].title + '</h3><p>' + ROUNDS[r].summary +
          ' Changes ' + items.map(function (t) { return t.id; }).join(', ').replace(/, (\d+)$/, ' and $1') + '.</p></div>' +
          '<a class="btn btn-sm btn-light" href="' + rhref + '?t=' + items.map(function (t) { return t.key; }).join(',') + '">See round ' + r + ' on its own</a>';
        rounds.appendChild(row);
      });
    }
    var host = document.querySelector('[data-tweak-list]');
    if (!host) return;
    var href = host.getAttribute('data-page');
    var list = document.createElement('ol');
    list.className = 'tw-list';
    TWEAKS.forEach(function (t) {
      var e = EFFORT[t.effort] || {};
      var li = document.createElement('li');
      li.innerHTML = '<span class="n">' + t.id + '</span><div><h4>' + t.title + '</h4>' +
        '<p>' + t.change + '</p>' +
        '<p class="meta"><span class="chip chip-' + t.effort + '" title="' + (e.tip || '') + '">' + (e.label || '') + '</span>' +
        '<span class="round-tag">Test round ' + t.round + '</span>' +
        '<span class="measure"><strong>Measure:</strong> ' + t.measure + '</span></p>' +
        '<a class="link-arrow" href="' + href + '?t=' + t.key + '&notes=1#' + t.anchor + '">See this change on its own</a></div>';
      list.appendChild(li);
    });
    host.appendChild(list);
  }

  /* ---------------------------------------------------------------------
     Mockup page
     --------------------------------------------------------------------- */
  var page = document.querySelector('[data-mockup]');
  var active = {};

  function sectionOrder() {
    var order = ['hero', 'intro', 'view', 'transport', 'community', 'enquire', 'apartments', 'commute', 'shop', 'close', 'safety', 'end'];
    function moveAfter(id, after) {
      order.splice(order.indexOf(id), 1);
      order.splice(order.indexOf(after) + 1, 0, id);
    }
    if (active['homes-up']) moveAfter('apartments', 'hero');
    if (active['enquiry-open']) moveAfter('enquire', 'view');
    if (active.transport) moveAfter('commute', 'transport');
    return order;
  }

  function readInitialState() {
    var params = new URLSearchParams(location.search);
    var t = params.get('t');
    var keys = null;
    if (t === 'all' || params.get('v') === 'proposed') keys = ALL.slice();
    else if (t === 'none' || params.get('v') === 'today') keys = [];
    else if (t) keys = t.split(',').filter(function (k) { return ALL.indexOf(k) !== -1; });
    else {
      var saved = store('ec-tweaks');
      keys = saved === null ? ALL.slice() : saved.split(',').filter(function (k) { return ALL.indexOf(k) !== -1; });
    }
    keys.forEach(function (k) { active[k] = true; });
    if (params.get('notes') === '1') store('ec-notes', '1');
  }

  function count() { return ALL.filter(function (k) { return active[k]; }).length; }

  function apply() {
    var body = document.body;
    ALL.forEach(function (k) { body.classList.toggle('tw-' + k, !!active[k]); });

    document.querySelectorAll('[data-show]').forEach(function (el) {
      var keys = el.getAttribute('data-show').split(/\s+/);
      el.hidden = !keys.some(function (k) { return active[k]; });
    });
    document.querySelectorAll('[data-hide]').forEach(function (el) {
      var keys = el.getAttribute('data-hide').split(/\s+/);
      el.hidden = keys.some(function (k) { return active[k]; });
    });

    sectionOrder().forEach(function (id, i) {
      var el = document.getElementById(id);
      if (el) el.style.order = i;
    });

    /* The enquiry form starts open with change 8, behind a button without it */
    var acc = document.querySelector('[data-acc-btn]');
    var form = document.getElementById('enquiry-form');
    if (acc && form) {
      var open = !!active['enquiry-open'] || acc.getAttribute('data-user-open') === '1';
      acc.setAttribute('aria-expanded', open ? 'true' : 'false');
      form.hidden = !open;
    }

    /* Switch and status */
    var n = count();
    var mode = n === 0 ? 'today' : n === ALL.length ? 'proposed' : 'custom';
    document.querySelectorAll('[data-mode]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-mode') === mode ? 'true' : 'false');
    });
    var status = document.querySelector('[data-status]');
    if (status) status.textContent = mode === 'today' ? 'The page as it is today' : mode === 'proposed' ? 'All 12 changes on' : n + ' of 12 changes on';
    document.querySelectorAll('[data-tw-check]').forEach(function (c) { c.checked = !!active[c.value]; });
    document.querySelectorAll('[data-note-state]').forEach(function (s) {
      s.textContent = active[s.getAttribute('data-note-state')] ? 'On in this view' : 'Off in this view';
    });

    store('ec-tweaks', ALL.filter(function (k) { return active[k]; }).join(','));
    var url = new URL(location.href);
    url.searchParams.delete('v');
    url.searchParams.delete('notes');
    url.searchParams.set('t', mode === 'today' ? 'none' : mode === 'proposed' ? 'all' : ALL.filter(function (k) { return active[k]; }).join(','));
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }

  function setOnly(keys) {
    active = {};
    keys.forEach(function (k) { active[k] = true; });
    apply();
  }

  /* Tweak drawer ------------------------------------------------------- */
  function buildDrawer() {
    var body = document.querySelector('[data-drawer-body]');
    if (!body) return;
    var quick = document.createElement('div');
    quick.className = 'quick';
    quick.innerHTML = '<button type="button" data-quick="all">All on</button><button type="button" data-quick="none">All off</button>' +
      Object.keys(ROUNDS).map(function (r) { return '<button type="button" data-quick="r' + r + '">Round ' + r + ' only</button>'; }).join('');
    body.appendChild(quick);
    TWEAKS.forEach(function (t) {
      var e = EFFORT[t.effort] || {};
      var row = document.createElement('div');
      row.className = 'tw-row';
      row.innerHTML = '<input type="checkbox" id="tw-' + t.key + '" value="' + t.key + '" data-tw-check>' +
        '<label for="tw-' + t.key + '"><span class="n">' + t.id + '</span>' + t.title +
        '<small><span class="chip chip-' + t.effort + '">' + (e.label || '') + '</span> Test round ' + t.round + '</small></label>';
      body.appendChild(row);
    });
    body.addEventListener('change', function (ev) {
      if (!ev.target.matches('[data-tw-check]')) return;
      active[ev.target.value] = ev.target.checked;
      apply();
    });
    quick.addEventListener('click', function (ev) {
      var q = ev.target.getAttribute('data-quick');
      if (!q) return;
      if (q === 'all') setOnly(ALL);
      else if (q === 'none') setOnly([]);
      else setOnly(TWEAKS.filter(function (t) { return 'r' + t.round === q; }).map(function (t) { return t.key; }));
    });
  }

  var lastFocus = null;
  function openDrawer() {
    var d = document.querySelector('[data-drawer]');
    var s = document.querySelector('[data-scrim]');
    lastFocus = document.activeElement;
    d.hidden = false; s.hidden = false;
    requestAnimationFrame(function () { d.classList.add('open'); });
    document.querySelector('[data-drawer-open]').setAttribute('aria-expanded', 'true');
    d.querySelector('.close').focus();
  }
  function closeDrawer() {
    var d = document.querySelector('[data-drawer]');
    var s = document.querySelector('[data-scrim]');
    if (!d || d.hidden) return;
    d.classList.remove('open'); s.hidden = true;
    setTimeout(function () { d.hidden = true; }, 200);
    document.querySelector('[data-drawer-open]').setAttribute('aria-expanded', 'false');
    if (lastFocus) lastFocus.focus();
  }

  /* Notes --------------------------------------------------------------- */
  function renderNotes() {
    document.querySelectorAll('[data-note]').forEach(function (slot) {
      var wrap = document.createElement('div');
      wrap.className = 'container';
      slot.getAttribute('data-note').split(/\s+/).forEach(function (id) {
        var t = BY_ID[id];
        if (!t) return;
        var e = EFFORT[t.effort] || {};
        var n = document.createElement('aside');
        n.className = 'cro-note';
        n.setAttribute('aria-label', 'Note ' + t.id + ': ' + t.title);
        n.innerHTML = '<h4><span class="n">' + t.id + '</span>' + t.title +
          ' <span class="chip chip-' + t.effort + '">' + (e.label || '') + '</span>' +
          ' <span class="state" data-note-state="' + t.key + '"></span></h4>' +
          '<dl><dt>The change</dt><dd>' + t.change + '</dd>' +
          '<dt>Why it should help</dt><dd>' + t.why + '</dd>' +
          '<dt>What to measure</dt><dd>' + t.measure + '</dd>' +
          '<dt>Effort</dt><dd>' + t.effortNote + '</dd></dl>' +
          '<div class="actions"><button type="button" data-only="' + t.key + '">Show this change on its own</button>' +
          '<button type="button" data-toggle-one="' + t.key + '">Turn this change on or off</button></div>';
        wrap.appendChild(n);
      });
      /* Static notes written into the slot (open questions) stay after the generated ones */
      while (slot.firstChild) wrap.appendChild(slot.firstChild);
      slot.appendChild(wrap);
    });
    document.addEventListener('click', function (ev) {
      var only = ev.target.getAttribute && ev.target.getAttribute('data-only');
      var one = ev.target.getAttribute && ev.target.getAttribute('data-toggle-one');
      if (only) setOnly([only]);
      if (one) { active[one] = !active[one]; apply(); }
    });
  }

  function setNotes(on) {
    document.body.classList.toggle('notes-on', on);
    document.querySelectorAll('[data-notes-toggle]').forEach(function (b) {
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      var l = b.querySelector('.notes-label');
      if (l) l.textContent = on ? 'Notes on' : 'Notes off';
    });
    store('ec-notes', on ? '1' : '0');
  }

  /* Carousels ------------------------------------------------------------ */
  function initCarousels() {
    document.querySelectorAll('[data-car]').forEach(function (car) {
      var track = car.querySelector('.car-track');
      var cards = track.children.length;
      var i = 0;
      var count = car.querySelector('.count');
      var bar = car.querySelector('.prog span');
      function perView() {
        var c = track.children[0];
        return Math.max(1, Math.round(car.querySelector('.car').clientWidth / (c.getBoundingClientRect().width + 16)));
      }
      function go(n) {
        var max = Math.max(0, cards - perView());
        i = Math.min(Math.max(n, 0), max);
        var w = track.children[0].getBoundingClientRect().width + 16;
        track.style.transform = 'translateX(' + (-i * w) + 'px)';
        if (count) count.textContent = (i + 1) + ' / ' + cards;
        if (bar) bar.style.width = ((i + perView()) / cards * 100) + '%';
      }
      car.querySelector('[data-prev]').addEventListener('click', function () { go(i - 1); });
      car.querySelector('[data-next]').addEventListener('click', function () { go(i + 1); });
      car.addEventListener('keydown', function (ev) {
        if (ev.key === 'ArrowLeft') go(i - 1);
        if (ev.key === 'ArrowRight') go(i + 1);
      });
      window.addEventListener('resize', function () { go(i); });
      go(0);
    });
  }

  /* Enquiry accordion and form ------------------------------------------ */
  function initEnquiry() {
    var acc = document.querySelector('[data-acc-btn]');
    var form = document.getElementById('enquiry-form');
    if (acc) acc.addEventListener('click', function () {
      var open = acc.getAttribute('aria-expanded') !== 'true';
      acc.setAttribute('data-user-open', open ? '1' : '0');
      acc.setAttribute('aria-expanded', open ? 'true' : 'false');
      form.hidden = !open;
    });
    /* Any link to #enquire opens the form, as the live page does */
    document.querySelectorAll('a[href="#enquire"]').forEach(function (a) {
      a.addEventListener('click', function () {
        if (acc) acc.setAttribute('data-user-open', '1');
        if (form) form.hidden = false;
        if (acc) acc.setAttribute('aria-expanded', 'true');
      });
    });
    var bedsLinks = document.querySelectorAll('[data-beds]');
    bedsLinks.forEach(function (a) {
      a.addEventListener('click', function () {
        var sel = document.getElementById('f-beds');
        if (sel) sel.value = a.getAttribute('data-beds');
      });
    });
    var f = document.querySelector('[data-hs-form]');
    if (!f) return;
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var firstBad = null;
      f.querySelectorAll('.field').forEach(function (field) {
        field.classList.remove('invalid');
        var old = field.querySelector('.err');
        if (old) old.remove();
        if (field.closest('[hidden]')) return;
        var req = field.hasAttribute('data-required') ||
          (field.hasAttribute('data-required-today') && !active['form-fields']);
        if (!req) return;
        var input = field.querySelector('input:not([type=radio]), select');
        var ok;
        if (input) ok = input.value.trim() !== '' && (input.type !== 'email' || /.+@.+\..+/.test(input.value));
        else ok = !!field.querySelector('input[type=radio]:checked');
        if (!ok) {
          field.classList.add('invalid');
          var msg = document.createElement('p');
          msg.className = 'err';
          msg.textContent = 'Please complete this required field.';
          field.appendChild(msg);
          if (!firstBad) firstBad = field;
        }
      });
      if (firstBad) {
        var target = firstBad.querySelector('input, select');
        if (target) target.focus();
        return;
      }
      var done = document.querySelector('[data-form-done]');
      f.hidden = true;
      done.hidden = false;
      done.focus();
    });
    /* Required markers follow change 9 */
    var reset = document.querySelector('[data-form-reset]');
    if (reset) reset.addEventListener('click', function () {
      f.reset();
      f.hidden = false;
      document.querySelector('[data-form-done]').hidden = true;
    });
  }

  /* Amenities show all, commute calculator, building works ---------------- */
  function initMisc() {
    var more = document.querySelector('[data-amen-more]');
    if (more) more.addEventListener('click', function () {
      var extra = document.getElementById('amen-extra');
      var open = extra.hidden;
      extra.hidden = !open;
      more.setAttribute('aria-expanded', open ? 'true' : 'false');
      more.textContent = open ? 'Show fewer amenities' : 'Show all 14 amenities';
    });

    var cf = document.querySelector('[data-commute]');
    if (cf) cf.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var dest = cf.querySelector('input').value.trim() || 'Bank';
      var mode = cf.querySelector('select').value || 'Public transport';
      var mins = { 'Public transport': 18, 'Cycling': 14, 'Walking': 38, 'Driving': 21 }[mode] || 18;
      var out = document.querySelector('[data-commute-result]');
      out.hidden = false;
      out.textContent = 'About ' + mins + ' minutes to ' + dest + ' by ' + mode.toLowerCase() + ' (illustrative)';
    });

    var safety = document.querySelector('[data-safety]');
    if (safety) safety.addEventListener('click', function () {
      var m = document.getElementById('safety-more');
      var open = m.hidden;
      m.hidden = !open;
      safety.setAttribute('aria-expanded', open ? 'true' : 'false');
      safety.textContent = open ? 'Read less' : 'Read more';
    });

    document.querySelectorAll('[data-chat]').forEach(function (b) {
      b.addEventListener('click', function () {
        b.setAttribute('aria-label', 'Chat (not part of this mockup)');
      });
    });
  }

  /* Boot ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    loadImages();
    renderOverview();

    var notesBtn = document.querySelector('[data-notes-toggle]');
    if (notesBtn) notesBtn.addEventListener('click', function () {
      setNotes(notesBtn.getAttribute('aria-checked') !== 'true');
    });

    var here = page ? 'mockup' : 'overview';
    document.querySelectorAll('[data-mk-page]').forEach(function (a) {
      if (a.getAttribute('data-mk-page') === here) a.setAttribute('aria-current', 'page');
    });
    if (!page) {
      document.querySelectorAll('[data-mockup-only]').forEach(function (el) { el.hidden = true; });
      setNotes(store('ec-notes') !== '0');
      return;
    }

    readInitialState();
    buildDrawer();
    renderNotes();
    initCarousels();
    initEnquiry();
    initMisc();
    setNotes(store('ec-notes') !== '0');
    apply();

    document.querySelectorAll('[data-mode]').forEach(function (b) {
      b.addEventListener('click', function () {
        setOnly(b.getAttribute('data-mode') === 'today' ? [] : ALL);
      });
    });
    var open = document.querySelector('[data-drawer-open]');
    if (open) open.addEventListener('click', openDrawer);
    document.querySelectorAll('[data-drawer-close]').forEach(function (b) { b.addEventListener('click', closeDrawer); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') closeDrawer(); });

    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) setTimeout(function () { target.scrollIntoView(); }, 60);
    }
  });
})();

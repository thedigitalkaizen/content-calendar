/* AdKaizen content calendar: month tabs, year view, tracking and "Add content".
   Needs window.SYNC (Google Apps Script web app URL) and window.PLAN (content plan) set before this file. */
(function () {
  'use strict';
  var SYNC = window.SYNC || '', PLAN = window.PLAN || { months: [] };
  var KEY = 'adk-dec-2026', CKEY = 'adk-custom';
  var MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var FM = { reel: ['Reel', '#E1306C'], carousel: ['Carousel', '#7C5CFF'], static: ['Static post', '#2F6BFF'], li: ['LinkedIn post', '#0A66C2'], story: ['Story', '#F59E0B'], other: ['Other', '#64748B'] };
  var PF = { reel: ['7:30 PM IST', 'Instagram, Facebook Reels, YouTube Shorts'], carousel: ['7:30 PM IST', 'Instagram, Facebook, LinkedIn (PDF)'], static: ['12:00 PM IST', 'Instagram, Facebook, LinkedIn'], li: ['10:00 AM IST', 'LinkedIn, Google Business'], story: ['Anytime', 'Instagram + Facebook Stories'], other: ['', ''] };
  var st = {}, custom = [], rows = [], cur = '', curF = 'all', scriptOld = false;

  function pl(f, n) { var w = FM[f][0]; return n + ' ' + (n > 1 ? (w === 'Story' ? 'Stories' : w + 's') : w); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ls(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function mName(id) { return MN[+id.slice(5) - 1] + ' ' + id.slice(0, 4); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function stat(t, c) { var e = $('#syncst'); e.textContent = t; e.className = 'st ' + (c || ''); }
  function fmtD(d) { var p = String(d || '').slice(0, 10).split('-'); return p.length === 3 ? 'Posted ' + (+p[2]) + ' ' + MN[+p[1] - 1].slice(0, 3) : ''; }

  st = ls(KEY) || {};
  for (var k in st) { if (st[k] === true) st[k] = { done: true }; else if (!st[k]) delete st[k]; }
  custom = ls(CKEY) || [];

  /* ---------- data ---------- */
  function planMonth(id) { for (var i = 0; i < PLAN.months.length; i++) if (PLAN.months[i].id === id) return PLAN.months[i]; return null; }
  function monthIds() {
    var s = { '2026-12': 1 };
    PLAN.months.forEach(function (m) { s[m.id] = 1; });
    custom.forEach(function (c) { if (c.date) s[c.date.slice(0, 7)] = 1; });
    return Object.keys(s).sort();
  }
  function itemsFor(id) {
    var out = [], pm = planMonth(id);
    if (pm) pm.items.forEach(function (it, k) {
      var pf = PF[it[1]] || PF.other;
      out.push({ id: 'p' + it[0].replace(/-/g, '') + '-' + it[1] + '-' + k, date: it[0], fmt: it[1], title: it[2], hook: it[3] === it[2] ? '' : it[3], time: pf[0], platform: pf[1] });
    });
    custom.forEach(function (c) { if (c.date && c.date.slice(0, 7) === id) out.push({ id: c.id, date: c.date, fmt: c.fmt, title: c.title, hook: c.hook, notes: c.notes, time: c.time, platform: c.platform, custom: true }); });
    return out;
  }

  /* ---------- rendering ---------- */
  function card(it) {
    var F = FM[it.fmt] || FM.other;
    return '<article class="it' + (it.custom ? ' mine' : '') + '" data-fmt="' + esc(it.fmt) + '" data-id="' + esc(it.id) + '" data-date="' + esc(it.date) + '" data-platform="' + esc(it.platform) + '" data-title="' + esc(F[0] + ': ' + it.title) + '">' +
      '<div class="ih"><input type="checkbox" aria-label="Done"><span class="chip" style="--c:' + F[1] + '">' + F[0] + '</span><span class="t">' + esc(it.title) + '</span>' +
      (it.custom ? '<span class="st2 you">Added by you</span>' : '<span class="st2">To make</span>') + (it.time ? '<span class="tm">' + esc(it.time) + '</span>' : '') + '</div>' +
      (it.hook ? '<div class="hook">' + esc(it.hook) + '</div>' : '') + (it.notes ? '<p class="notes">' + esc(it.notes) + '</p>' : '') +
      (it.platform ? '<div class="also"><b>Platforms:</b> ' + esc(it.platform) + '</div>' : '') +
      (it.fmt === 'story' ? '' : '<div class="trk"><input class="lnk" type="url" placeholder="After posting, paste the post link here"><span class="when"></span></div>') +
      (it.custom ? '<div class="acts"><button class="del" data-del="' + esc(it.id) + '">Remove</button></div>' : '') + '</article>';
  }
  function renderMonth(id) {
    var Y = +id.slice(0, 4), M = +id.slice(5), pm = planMonth(id), its = itemsFor(id), by = {};
    its.forEach(function (it) { var d = +it.date.slice(8); (by[d] = by[d] || []).push(it); });
    var dim = new Date(Y, M, 0).getDate(), f0 = (new Date(Y, M - 1, 1).getDay() + 6) % 7, g = '', l = '', c = {};
    its.forEach(function (it) { c[it.fmt] = (c[it.fmt] || 0) + 1; });
    for (var i = 0; i < f0; i++) g += '<div class="cell empty"></div>';
    for (var n = 1; n <= dim; n++) {
      g += '<a class="cell" href="#d' + id + '-' + n + '"><span class="dn">' + n + '</span>' + (by[n] || []).map(function (it) { var F = FM[it.fmt] || FM.other; return '<span class="chip' + (it.custom ? ' you' : '') + '" style="--c:' + F[1] + '">' + F[0] + '</span>'; }).join('') + '</a>';
      var dd = new Date(Y, M - 1, n);
      l += '<section class="day" id="d' + id + '-' + n + '"><div class="dh"><b>' + DOW[dd.getDay()] + ' ' + n + ' ' + MN[M - 1].slice(0, 3) + '</b>' + (by[n] ? '' : '<span class="rest">Share a story, reply to comments and DMs</span>') + '</div>' + (by[n] || []).map(card).join('') + '</section>';
    }
    var stats = ['reel', 'carousel', 'static', 'li', 'story', 'other'].filter(function (f) { return c[f]; }).map(function (f) { return '<span>' + pl(f, c[f]) + '</span>'; }).join('');
    var prev = MN[(M + 10) % 12];
    return '<section class="month" data-m="' + id + '" data-name="' + MN[M - 1] + '"><div class="mintro"><div class="eyebrow">' + (pm ? 'Content plan' : 'Your content') + '</div><h2>' + mName(id) + '</h2>' +
      (pm ? '<p>' + esc(pm.theme) + '.</p>' : '<p>Content you added for this month.</p>') +
      (pm && pm.keydates && pm.keydates.length ? '<ul class="keyd">' + pm.keydates.map(function (k) { return '<li>' + esc(k) + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="stats">' + stats + '</div>' +
      (pm ? '<div class="how"><b>Status: planned, not made yet.</b> Ask Claude to “make ' + MN[M - 1] + ' content” in the last week of ' + prev + '. Add your own posts any time with <b>+ Add content</b>.</div>' : '') +
      '</div><div class="grid">' + ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(function (d) { return '<div class="wd">' + d + '</div>'; }).join('') + g + '</div><h3 class="dd">Day by day</h3>' + l + '</section>';
  }
  function renderDecCustom() {
    $$('.it.mine.decx').forEach(function (a) { a.remove(); });
    custom.forEach(function (c) {
      if (!c.date || c.date.slice(0, 7) !== '2026-12') return;
      var sec = document.getElementById('d' + (+c.date.slice(8)));
      if (!sec) return;
      var t = document.createElement('div');
      t.innerHTML = card({ id: c.id, date: c.date, fmt: c.fmt, title: c.title, hook: c.hook, notes: c.notes, time: c.time, platform: c.platform, custom: true });
      var a = t.firstChild; a.classList.add('decx');
      var old = sec.querySelector('.old'); old ? sec.insertBefore(a, old) : sec.appendChild(a);
    });
  }
  function renderTabs() {
    var ids = monthIds();
    $('#months').innerHTML = '<button data-m="overview">Year view</button>' + ids.map(function (id) { return '<button data-m="' + id + '">' + MN[+id.slice(5) - 1].slice(0, 3) + ' ' + id.slice(2, 4) + '</button>'; }).join('');
  }
  function monthRows(id) { var s = $('.month[data-m="' + id + '"]'); return s ? $$('[data-id]', s) : []; }
  function renderOverview() {
    var ids = monthIds(), tot = 0, done = 0;
    var cards = ids.map(function (id) {
      var r = monthRows(id), n = r.filter(function (a) { return (st[a.dataset.id] || {}).done; }).length, pm = planMonth(id), c = {};
      r.forEach(function (a) { c[a.dataset.fmt] = (c[a.dataset.fmt] || 0) + 1; });
      tot += r.length; done += n;
      var theme = id === '2026-12' ? 'Ready to post: Reels, statics, carousels and stories, all made' : pm ? pm.theme : 'Your own content';
      var keys = id === '2026-12' ? ['2 Dec: UAE National Day', '25 Dec: Christmas', '31 Dec: New Year\'s Eve'] : pm && pm.keydates ? pm.keydates : [];
      return '<button class="ycard" data-go="' + id + '"><span class="yh"><b>' + mName(id) + '</b><em class="' + (id === '2026-12' ? 'ok' : '') + '">' + (id === '2026-12' ? 'Ready' : 'Planned') + '</em></span><span class="yt">' + esc(theme) + '</span>' +
        (keys.length ? '<span class="yk">' + keys.slice(0, 3).map(esc).join('<br>') + '</span>' : '') +
        '<span class="yc">' + ['reel', 'carousel', 'static', 'li', 'story'].filter(function (f) { return c[f]; }).map(function (f) { return '<i style="--c:' + FM[f][1] + '">' + pl(f, c[f]) + '</i>'; }).join('') + '</span>' +
        '<span class="yp"><span class="bar2"><i style="width:' + (r.length ? 100 * n / r.length : 0) + '%"></i></span>' + n + ' / ' + r.length + '</span></button>';
    }).join('');
    $('#overview').innerHTML = '<div class="mintro"><div class="eyebrow">Year view</div><h2>Content plan, Dec 2026 to Dec 2027</h2><p>Every month at a glance: the theme, key dates, what gets posted and how much is done. Click a month to open it. Add a new month any time by adding content to it with <b>+ Add content</b>.</p><div class="stats"><span>' + tot + ' posts planned</span><span>' + done + ' posted</span><span>' + ids.length + ' months</span></div></div><div class="ygrid">' + cards + '</div>';
  }
  function applyFilter() {
    $$('.it').forEach(function (a) { a.classList.toggle('hide', !(curF === 'all' || a.dataset.fmt === curF)); });
    $$('.old').forEach(function (a) { a.classList.toggle('hide', !(curF === 'all' || curF === 'old')); });
    $$('.day').forEach(function (d) { d.classList.toggle('hide', curF !== 'all' && !d.querySelector('.it:not(.hide),.old:not(.hide)')); });
  }
  function paint() {
    rows.forEach(function (a) {
      var s = st[a.dataset.id] || {}, c = a.querySelector('input[type=checkbox]'), l = a.querySelector('.lnk'), w = a.querySelector('.when');
      c.checked = !!s.done; a.classList.toggle('done', !!s.done);
      if (l && document.activeElement !== l) l.value = s.link || '';
      if (w) w.textContent = s.done ? fmtD(s.posted_on) : '';
    });
    var sec = $('.month.on'), mr = cur === 'overview' ? rows : rows.filter(function (r) { return sec && sec.contains(r); });
    var mn = mr.filter(function (a) { return (st[a.dataset.id] || {}).done; }).length;
    $('#prog').textContent = mn + ' of ' + mr.length + ' posted ' + (cur === 'overview' ? 'in total' : 'in ' + (sec ? sec.dataset.name : ''));
    $('#progbar').style.width = (mr.length ? 100 * mn / mr.length : 0) + '%';
  }
  function showM(m) {
    if (!$('.month[data-m="' + m + '"]')) m = '2026-12';
    $$('.month').forEach(function (x) { x.classList.toggle('on', x.dataset.m === m); });
    $$('#months button').forEach(function (x) { x.classList.toggle('on', x.dataset.m === m); if (x.dataset.m === m && x.scrollIntoView) x.scrollIntoView({ block: 'nearest', inline: 'center' }); });
    $('#filters').style.display = m === 'overview' ? 'none' : '';
    cur = m; ls('adk-month', m);
    if (m === 'overview') renderOverview();
    paint();
  }
  function build() {
    var keep = cur;
    $('#dyn').innerHTML = monthIds().filter(function (id) { return id !== '2026-12'; }).map(renderMonth).join('');
    renderDecCustom();
    rows = $$('[data-id]');
    renderTabs(); applyFilter();
    if (keep) showM(keep);
  }

  /* ---------- saving ---------- */
  function post(body) { return fetch(SYNC, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) }); }
  function save(a) {
    var id = a.dataset.id, s = st[id] || (st[id] = {});
    ls(KEY, st); paint();
    if (!SYNC) { stat('Saved on this device only (sheet not connected yet)'); return; }
    stat('Saving…');
    post({ id: id, date: a.dataset.date, platform: a.dataset.platform, title: a.dataset.title, done: !!s.done, posted_on: s.posted_on || '', link: s.link || '' })
      .then(function () { stat('Saved to Google Sheet', 'ok'); }, function () { stat('Could not reach the sheet. Saved on this device; try again when online.', 'err'); });
  }
  function saveCustom(action, item) {
    ls(CKEY, custom);
    if (!SYNC) { stat('Saved on this device only (sheet not connected yet)'); return; }
    if (scriptOld) { stat('Saved on this device. Update the Apps Script so added content syncs too.', 'err'); return; }
    stat('Saving…');
    post({ action: action, item: item, id: item.id }).then(function () { stat('Saved to Google Sheet', 'ok'); }, function () { stat('Could not reach the sheet. Saved on this device.', 'err'); });
  }

  document.addEventListener('change', function (e) {
    var a = e.target.closest('[data-id]'); if (!a) return;
    var s = st[a.dataset.id] || (st[a.dataset.id] = {});
    if (e.target.type === 'checkbox') { s.done = e.target.checked; s.posted_on = s.done ? (s.posted_on || today()) : ''; save(a); }
    else if (e.target.classList.contains('lnk')) { s.link = e.target.value.trim(); if (s.link && !s.done) { s.done = true; s.posted_on = today(); } save(a); }
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.copy');
    if (b) {
      var t = decodeURIComponent(b.dataset.t);
      var ok = function () { var o = b.textContent; b.textContent = 'Copied'; b.classList.add('done'); setTimeout(function () { b.textContent = o; b.classList.remove('done'); }, 1400); };
      var fb = function () { var x = document.createElement('textarea'); x.value = t; document.body.appendChild(x); x.select(); try { document.execCommand('copy'); } catch (er) {} x.remove(); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, function () { fb(); ok(); }); else { fb(); ok(); }
      return;
    }
    var m = e.target.closest('#months button'); if (m) { showM(m.dataset.m); window.scrollTo(0, 0); return; }
    var g = e.target.closest('[data-go]'); if (g) { showM(g.dataset.go); window.scrollTo(0, 0); return; }
    var f = e.target.closest('#filters button');
    if (f) { curF = f.dataset.f; $$('#filters button').forEach(function (x) { x.classList.toggle('on', x === f); }); applyFilter(); return; }
    var d = e.target.closest('[data-del]');
    if (d) {
      if (!confirm('Remove this post from the calendar?')) return;
      var id = d.dataset.del, it = null;
      custom = custom.filter(function (c) { if (c.id === id) it = c; return c.id !== id; });
      build(); if (it) saveCustom('delete', it);
      return;
    }
    if (e.target.closest('#addbtn')) openAdd();
  });

  /* ---------- Add content ---------- */
  var dlg = $('#adddlg'), form = $('#addform');
  function openAdd() {
    var d = cur && cur !== 'overview' ? cur + '-01' : today();
    if (d < today() && d.slice(0, 7) === today().slice(0, 7)) d = today();
    form.reset(); form.date.value = d; setType('reel');
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    setTimeout(function () { form.title.focus(); }, 50);
  }
  function setType(t) { form.fmt.value = t; form.time.value = PF[t][0]; form.platform.value = PF[t][1]; }
  form.fmt.addEventListener('change', function () { setType(form.fmt.value); });
  $('#addcancel').addEventListener('click', function () { dlg.close ? dlg.close() : dlg.removeAttribute('open'); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var item = { id: 'c' + Date.now().toString(36), date: form.date.value, fmt: form.fmt.value, title: form.title.value.trim(), hook: form.hook.value.trim(), notes: form.notes.value.trim(), time: form.time.value.trim(), platform: form.platform.value.trim() };
    if (!item.date || !item.title) return;
    custom.push(item);
    dlg.close ? dlg.close() : dlg.removeAttribute('open');
    build(); showM(item.date.slice(0, 7));
    var el = document.getElementById(item.date.slice(0, 7) === '2026-12' ? 'd' + (+item.date.slice(8)) : 'd' + item.date.slice(0, 7) + '-' + (+item.date.slice(8)));
    if (el) el.scrollIntoView({ block: 'center' });
    saveCustom('add', item);
  });

  /* ---------- start ---------- */
  try { if (window.innerWidth > 760) $('#sched').open = true; } catch (e) {}
  build();
  (function () {
    var t = today().slice(0, 7), q = new URLSearchParams(location.search).get('m'), sv = ls('adk-month');
    showM(q && $('.month[data-m="' + q + '"]') ? q : $('.month[data-m="' + t + '"]') ? t : sv && $('.month[data-m="' + sv + '"]') ? sv : '2026-12');
  })();
  if (SYNC) {
    stat('Syncing…');
    fetch(SYNC).then(function (r) { return r.json(); }).then(function (d) {
      var it = d.items || {}; for (var id in it) st[id] = it[id]; ls(KEY, st);
      if (Array.isArray(d.custom)) { custom = d.custom; ls(CKEY, custom); } else scriptOld = true;
      build();
      stat(scriptOld ? 'Ticks synced. Update the Apps Script so added content syncs too.' : 'Synced with Google Sheet', scriptOld ? 'err' : 'ok');
    }).catch(function () { stat('Offline: showing what is saved on this device', 'err'); });
  } else stat('Saved on this device only (sheet not connected yet)');
})();

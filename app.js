/* AdKaizen content calendar: month tabs, year view, tracking and "Add content".
   Needs window.SYNC (Google Apps Script web app URL) and window.PLAN (content plan) set before this file. */
(function () {
  'use strict';
  var SYNC = window.SYNC || '', PLAN = window.PLAN || { months: [] };
  var KEY = 'adk-dec-2026', CKEY = 'adk-custom';
  var MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var FM = { reel: ['Reel', '#2F6BFF'], carousel: ['Carousel', '#7C5CFF'], static: ['Static post', '#0E9F6E'], li: ['LinkedIn post', '#475569'], story: ['Story', '#B7791F'], other: ['Other', '#94A3B8'] };
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
      if (by[n]) l += '<section class="day" id="d' + id + '-' + n + '"><div class="dh"><b>' + DOW[dd.getDay()] + ' ' + n + ' ' + MN[M - 1].slice(0, 3) + '</b></div>' + by[n].map(card).join('') + '</section>';
    }
    var stats = ['reel', 'carousel', 'static', 'li', 'story', 'other'].filter(function (f) { return c[f]; }).map(function (f) { return '<span>' + pl(f, c[f]) + '</span>'; }).join('');
    var prev = MN[(M + 10) % 12];
    return '<section class="month" data-m="' + id + '" data-name="' + MN[M - 1] + '"><div class="mintro"><div class="eyebrow">' + (pm ? 'Content plan' : 'Your content') + '</div><h2>' + mName(id) + '</h2>' +
      (pm ? '<p>' + esc(pm.theme) + '.</p>' : '<p>Content you added for this month.</p>') +
      (pm && pm.keydates && pm.keydates.length ? '<ul class="keyd">' + pm.keydates.map(function (k) { return '<li>' + esc(k) + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="stats">' + stats + '</div>' +
      (pm ? '<div class="how"><b>Status: planned, not made yet.</b> Ask Claude to “make ' + MN[M - 1] + ' content” in the last week of ' + prev + '. Add your own posts any time with <b>+ Add content</b>.</div>' : '') +
      '</div><div class="grid">' + ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(function (d) { return '<div class="wd">' + d + '</div>'; }).join('') + g + '</div><h3 class="dd">Day by day</h3>' + (l || '<p class="nodays">No posts yet. Add one with <b>+ Add content</b>.</p>') + extrasHtml(pm) + '</section>';
  }
  function extrasHtml(pm) {
    var ex = pm && pm.extras; if (!ex || !ex.length) return '';
    var G = { greeting: ['Greeting', '#94A3B8'] };
    return '<details class="extras"><summary><b>Optional extras</b><span>' + ex.length + ' ideas for weeks you have more time. Not part of the schedule.</span></summary><div class="exl">' +
      ex.map(function (e) {
        var F = G[e[1]] || FM[e[1]] || FM.other, d = +e[0].slice(8), when = e[1] === 'greeting' ? 'Only on ' + d + ' ' + MN[+e[0].slice(5, 7) - 1].slice(0, 3) : 'Any week';
        return '<div class="exi"><span class="chip" style="--c:' + F[1] + '">' + F[0] + '</span><div><b>' + esc(e[2]) + '</b>' + (e[3] && e[3] !== e[2] ? '<p>' + esc(e[3]) + '</p>' : '') + '</div><em>' + when + '</em></div>';
      }).join('') + '</div></details>';
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
    if (!$('#mstrip')) renderNav();
    renderStrip();
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
    $('#overview').innerHTML = '<div class="mintro"><div class="eyebrow">Year view</div><h2>Content plan, ' + mName(ids[0]) + ' to ' + mName(ids[ids.length - 1]) + '</h2><p>Every month at a glance: the theme, key dates, what gets posted and how much is done. Click a month to open it. Add a new month any time by adding content to it with <b>+ Add content</b>.</p><div class="stats"><span>' + tot + ' posts planned</span><span>' + done + ' posted</span><span>' + ids.length + ' months</span></div></div><div class="ygrid">' + cards + '</div>';
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
    paintRings(); renderStrip();
  }
  function showM(m) {
    if (m !== 'overview' && !$('.month[data-m="' + m + '"]')) { if (/^\d{4}-(0[1-9]|1[0-2])$/.test(m)) { extra[m] = 1; build(); } else m = '2026-12'; }
    if (m !== 'overview') curY = +m.slice(0, 4);
    $$('.month').forEach(function (x) { x.classList.toggle('on', x.dataset.m === m); });
    $('#filters').style.display = m === 'overview' ? 'none' : '';
    cur = m; ls('adk-month', m);
    if (m === 'overview') renderOverview();
    paint();
  }
  function build() {
    var keep = cur;
    $('#dyn').innerHTML = allIds().filter(function (id) { return id !== '2026-12'; }).map(renderMonth).join('');
    renderDecCustom();
    rows = $$('[data-id]');
    $$('.month').forEach(decorate);
    renderTabs(); applyFilter();
    if (keep) showM(keep);
  }


  /* ---------- month look: hero banner + rich calendar grid ---------- */
  var ACC = [['#2F5BD3', '#5B7FE8'], ['#4F46E5', '#7C74F0'], ['#0F766E', '#2A9D8F'], ['#1D4ED8', '#4F7BF0'], ['#0E7490', '#2B98B3'], ['#4338CA', '#6D66E0'], ['#047857', '#2E9C78'], ['#1E40AF', '#4B6FD6'], ['#0369A1', '#2E8FC7'], ['#3730A3', '#5F58C9'], ['#115E59', '#2F8580'], ['#1E3A8A', '#4766C2']];
  var DECKEYS = ['2 Dec: UAE National Day', '16 Dec: Bahrain National Day', '18 Dec: Qatar National Day', '25 Dec: Christmas', '31 Dec: New Year\'s Eve'];
  function parseKeys(keys, M) {
    return (keys || []).map(function (k) {
      var m = /^(\d{1,2}) ([A-Z][a-z]{2})[a-z]*: (.+)$/.exec(k);
      if (m && MN[M - 1].slice(0, 3) === m[2]) return { day: +m[1], mon: m[2], label: m[3] };
      return { day: 0, mon: '', label: k };
    });
  }
  function decorate(sec) {
    var id = sec.dataset.m; if (!/^\d{4}-\d{2}$/.test(id)) return;
    var Y = +id.slice(0, 4), M = +id.slice(5), pm = planMonth(id), a = ACC[M - 1];
    var its = $$('.it[data-id]', sec), olds = $$('.orow[data-id]', sec), all = its.concat(olds);
    var keys = parseKeys(id === '2026-12' ? DECKEYS : pm && pm.keydates, M);
    var kday = {}; keys.forEach(function (k) { if (k.day) kday[k.day] = k.label; });
    var c = {}; its.forEach(function (r) { c[r.dataset.fmt] = (c[r.dataset.fmt] || 0) + 1; });
    var ready = id === '2026-12';
    var theme = ready ? 'Everything is made: Reels with voiceover and covers, carousels with slides, and captions. Tick each one as you post it.' : pm ? pm.theme + '.' : all.length ? 'Your own posts for this month.' : 'Nothing planned yet. Add posts with + Add content, or ask Claude to plan ' + MN[M - 1] + ' ' + Y + '.';
    sec.style.setProperty('--a', a[0]); sec.style.setProperty('--a2', a[1]);
    /* hero */
    var hero = '<div class="hero"><div class="hglow"></div><div class="hmain">' +
      '<div class="htag">' + (ready ? '<span class="dot ok"></span>Ready to post' : pm ? '<span class="dot"></span>Planned · to make' : (all.length ? '<span class="dot you"></span>Your content' : '<span class="dot you"></span>Open month')) + '</div>' +
      '<div class="mbig">' + MN[M - 1] + '<span>' + Y + '</span></div><p class="htheme">' + esc(theme) + '</p>' +
      (keys.length ? '<div class="kd">' + keys.map(function (k) { return '<span class="kchip">' + (k.day ? '<b>' + k.day + '<small>' + k.mon + '</small></b>' : '<b class="i">★</b>') + '<em>' + esc(k.label) + '</em></span>'; }).join('') + '</div>' : '') +
      '</div><div class="hside"><div class="ring" data-ring><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="rt"/><circle cx="60" cy="60" r="52" class="rv" pathLength="100" stroke-dasharray="0 100"/></svg><div class="rl"><b>0%</b><small>0 of ' + all.length + ' posted</small></div></div>' +
      '<div class="tiles">' + ['reel', 'carousel', 'static', 'li', 'story', 'other'].filter(function (f) { return c[f]; }).map(function (f) { return '<span class="tile" style="--c:' + FM[f][1] + '"><b>' + c[f] + '</b>' + (c[f] > 1 ? (f === 'story' ? 'Stories' : FM[f][0] + 's') : FM[f][0]) + '</span>'; }).join('') + (olds.length ? '<span class="tile" style="--c:#64748B"><b>' + olds.length + '</b>From guides</span>' : '') + '</div></div>' +
      (!ready && pm ? '<div class="hnote"><b>3 posts a week:</b> Reels on Tue and Thu, a carousel on Saturday. <b>Next step:</b> ask Claude to “make ' + MN[M - 1] + ' content” in the last week of ' + MN[(M + 10) % 12] + '.</div>' : '') + '</div>';
    var oldIntro = sec.querySelector('.mintro, .hero'); if (oldIntro) oldIntro.outerHTML = hero;
    /* grid */
    var by = {}; its.forEach(function (r) { var d = +r.dataset.date.slice(8); (by[d] = by[d] || []).push(r); });
    var ob = {}; olds.forEach(function (r) { var d = +r.dataset.date.slice(8); ob[d] = (ob[d] || 0) + 1; });
    var dim = new Date(Y, M, 0).getDate(), f0 = (new Date(Y, M - 1, 1).getDay() + 6) % 7, td = today(), g = '';
    for (var i = 0; i < f0; i++) g += '<div class="cal-c pad"></div>';
    for (var n = 1; n <= dim; n++) {
      var dow = new Date(Y, M - 1, n).getDay(), list = by[n] || [], ds = id + '-' + String(n).padStart(2, '0');
      var target = id === '2026-12' ? '#d' + n : '#d' + id + '-' + n;
      g += '<a class="cal-c' + (dow === 0 || dow === 6 ? ' we' : '') + (ds === td ? ' today' : '') + (kday[n] ? ' key' : '') + (list.length ? '' : ' empty') + '" href="' + target + '">' +
        '<span class="cd"><b>' + n + '</b>' + (kday[n] ? '<i title="' + esc(kday[n]) + '">★ ' + esc(kday[n]) + '</i>' : '') + '</span>' +
        list.slice(0, 3).map(function (r) { var F = FM[r.dataset.fmt] || FM.other, t = r.dataset.title.replace(/^[^:]+: /, ''); return '<span class="ev' + (r.classList.contains('mine') ? ' you' : '') + '" data-ev="' + esc(r.dataset.id) + '" style="--c:' + F[1] + '"><s>' + F[0] + '</s><u>' + esc(t) + '</u></span>'; }).join('') +
        (list.length > 3 ? '<span class="more">+' + (list.length - 3) + ' more</span>' : '') +
        (ob[n] ? '<span class="more">+' + ob[n] + ' from guides</span>' : '') + '</a>';
    }
    var grid = sec.querySelector('.grid, .cal');
    if (grid) grid.outerHTML = '<div class="cal"><div class="cal-h">' + ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div><div class="cal-g">' + g + '</div><div class="legend">' + ['reel', 'carousel'].map(function (f) { return '<span style="--c:' + FM[f][1] + '">' + FM[f][0] + '</span>'; }).join('') + '<span class="lk">Key date</span><span class="lt">Today</span></div></div>';
    /* week headers in the day list */
    $$('.wkh', sec).forEach(function (x) { x.remove(); });
    var lastWk = -1;
    $$('.day', sec).forEach(function (d) {
      var n = +(d.id.split('-').pop().replace('d', '')), dd = new Date(Y, M - 1, n), wk = Math.floor((n + f0 - 1) / 7);
      if (wk !== lastWk) {
        lastWk = wk; n = Math.max(1, n - ((dd.getDay() + 6) % 7)); dd = new Date(Y, M - 1, n);
        var end = Math.min(dim, n + (7 - ((dd.getDay() + 6) % 7)) - 1);
        var h = document.createElement('div'); h.className = 'wkh'; h.innerHTML = '<b>Week of ' + n + ' ' + MN[M - 1].slice(0, 3) + '</b><span>' + n + '–' + end + ' ' + MN[M - 1].slice(0, 3) + '</span>';
        d.parentNode.insertBefore(h, d);
      }
    });
  }
  function paintRings() {
    $$('.month').forEach(function (sec) {
      var ring = sec.querySelector('[data-ring]'); if (!ring) return;
      var r = $$('[data-id]', sec), n = r.filter(function (a) { return (st[a.dataset.id] || {}).done; }).length, p = r.length ? Math.round(100 * n / r.length) : 0;
      ring.querySelector('.rv').setAttribute('stroke-dasharray', p + ' 100'); ring.querySelector('.rv').style.opacity = p ? 1 : 0;
      ring.querySelector('.rl').innerHTML = '<b>' + p + '%</b><small>' + n + ' of ' + r.length + ' posted</small>';
      r.forEach(function (a) { var e = sec.querySelector('[data-ev="' + a.dataset.id + '"]'); if (e) e.classList.toggle('done', !!(st[a.dataset.id] || {}).done); });
    });
  }


  /* ---------- navigator: year switcher, 12-month strip, search ---------- */
  var curY = 0, extra = {};
  function allIds() { var s = {}; monthIds().concat(Object.keys(extra)).forEach(function (i) { s[i] = 1; }); return Object.keys(s).sort(); }
  function yearRange() {
    var ids = monthIds(), lo = +ids[0].slice(0, 4), hi = Math.max(+ids[ids.length - 1].slice(0, 4), +today().slice(0, 4));
    return [Math.min(lo, +today().slice(0, 4)), hi + 3];
  }
  function monthCount(id) {
    var r = monthRows(id);
    if (!r.length && !$('.month[data-m="' + id + '"]')) r = itemsFor(id).map(function (it) { return { dataset: { id: it.id } }; });
    var n = r.filter(function (a) { return (st[a.dataset.id] || {}).done; }).length;
    return [r.length, n];
  }
  function renderNav() {
    var tm = today().slice(0, 7);
    $('#months').innerHTML = '<div class="nav1"><button class="yv" data-m="overview" type="button">▦ Year view</button>' +
      '<div class="ysw"><button type="button" data-y="-1" aria-label="Previous year">‹</button><b id="ylab"></b><button type="button" data-y="1" aria-label="Next year">›</button></div>' +
      '<button class="tdy" type="button" data-m="' + tm + '">● This month</button>' +
      '<div class="srch"><input id="q" type="search" autocomplete="off" placeholder="Search any post, e.g. Ramadan, Eid, ads…" aria-label="Search posts"><div id="qres" hidden></div></div></div>' +
      '<div class="mstrip" id="mstrip"></div>';
  }
  function renderStrip() {
    if (!$('#mstrip')) return;
    var tm = today().slice(0, 7), r = yearRange();
    if (!curY) curY = +(cur && cur !== 'overview' ? cur : tm).slice(0, 4);
    $('#ylab').textContent = curY;
    $('[data-y="-1"]').disabled = curY <= r[0]; $('[data-y="1"]').disabled = curY >= r[1];
    var h = '';
    for (var m = 1; m <= 12; m++) {
      var id = curY + '-' + String(m).padStart(2, '0'), c = monthCount(id), a = ACC[m - 1];
      h += '<button type="button" class="mp' + (id === cur ? ' on' : '') + (c[0] ? '' : ' none') + (id === tm ? ' now' : '') + (id < tm ? ' past' : '') + '" data-m="' + id + '" style="--a:' + a[0] + ';--a2:' + a[1] + '">' +
        '<b>' + MN[m - 1].slice(0, 3) + '</b><small>' + (c[0] ? (c[1] ? c[1] + '/' + c[0] + ' done' : c[0] + ' posts') : 'Empty') + '</small>' +
        '<i style="width:' + (c[0] ? 100 * c[1] / c[0] : 0) + '%"></i></button>';
    }
    $('#mstrip').innerHTML = h;
    $('.tdy').classList.toggle('on', cur === tm);
    $('.yv').classList.toggle('on', cur === 'overview');
    var on = $('.mp.on'); if (on && on.scrollIntoView && window.innerWidth <= 760) on.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  function rowText(r) { var h = r.querySelector('.hook'); return (r.dataset.title + ' ' + (h ? h.textContent : '')).toLowerCase(); }
  function search(q) {
    var box = $('#qres'); q = q.trim().toLowerCase();
    if (q.length < 2) { box.hidden = true; box.innerHTML = ''; return; }
    var words = q.split(/\s+/), hits = rows.filter(function (r) { var t = rowText(r); return words.every(function (w) { return t.indexOf(w) > -1; }); });
    hits.sort(function (a, b) { return a.dataset.date < b.dataset.date ? -1 : 1; });
    box.innerHTML = '<div class="qn">' + (hits.length ? hits.length + ' post' + (hits.length > 1 ? 's' : '') + ' found' : 'No posts match “' + esc(q) + '”') + '</div>' +
      hits.slice(0, 40).map(function (r) {
        var d = r.dataset.date, F = FM[r.dataset.fmt] || FM.other, t = r.dataset.title.replace(/^[^:]+: /, ''), done = (st[r.dataset.id] || {}).done;
        return '<button type="button" class="qh' + (done ? ' dn' : '') + '" data-hit="' + esc(r.dataset.id) + '"><span class="qd"><b>' + (+d.slice(8)) + '</b>' + MN[+d.slice(5, 7) - 1].slice(0, 3) + ' ' + d.slice(2, 4) + '</span><span class="qt"><s style="--c:' + F[1] + '">' + (r.dataset.fmt ? F[0] : 'From guides') + '</s>' + esc(t) + '</span>' + (done ? '<em>Posted</em>' : '') + '</button>';
      }).join('');
    box.hidden = false;
  }
  function goHit(id) {
    var r = rows.filter(function (a) { return a.dataset.id === id; })[0]; if (!r) return;
    $('#qres').hidden = true; $('#q').blur();
    curF = 'all'; $$('#filters button').forEach(function (x) { x.classList.toggle('on', x.dataset.f === 'all'); }); applyFilter();
    showM(r.closest('.month').dataset.m);
    r.scrollIntoView({ block: 'center' }); r.classList.remove('flash'); void r.offsetWidth; r.classList.add('flash');
  }
  document.addEventListener('click', function (e) {
    var y = e.target.closest('[data-y]');
    if (y) {
      e.stopImmediatePropagation(); curY += +y.dataset.y;
      var ids = allIds().filter(function (i) { return +i.slice(0, 4) === curY && monthCount(i)[0]; });
      showM(ids[0] || (curY + '-01')); return;
    }
    var h = e.target.closest('[data-hit]'); if (h) { e.stopImmediatePropagation(); goHit(h.dataset.hit); return; }
    if (!e.target.closest('.srch') && $('#qres')) $('#qres').hidden = true;
  }, true);
  document.addEventListener('input', function (e) { if (e.target.id === 'q') search(e.target.value); });
  document.addEventListener('focusin', function (e) { if (e.target.id === 'q' && e.target.value.trim().length > 1) search(e.target.value); });
  document.addEventListener('keydown', function (e) {
    if (e.target.id !== 'q') { if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) { e.preventDefault(); $('#q').focus(); } return; }
    if (e.key === 'Escape') { e.target.value = ''; search(''); e.target.blur(); }
    if (e.key === 'Enter') { var f = $('#qres [data-hit]'); if (f) goHit(f.dataset.hit); }
  });

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
    showM(q && (q === 'overview' || /^\d{4}-(0[1-9]|1[0-2])$/.test(q)) ? q : $('.month[data-m="' + t + '"]') ? t : sv && $('.month[data-m="' + sv + '"]') ? sv : '2026-12');
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

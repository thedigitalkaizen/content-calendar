// AdKaizen content tracker (version 2): calendar ticks, post links and content you add yourself.
// Paste into Extensions > Apps Script of the "AdKaizen Content Tracker" sheet, then
// Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy. The web app URL stays the same.
const TRACK = 'Tracker';
const CONTENT = 'Content';
const TRACK_HEAD = ['id', 'date', 'platform', 'title', 'done', 'posted_on', 'link', 'updated'];
const CONTENT_HEAD = ['id', 'date', 'type', 'title', 'hook', 'notes', 'time', 'platforms', 'added', 'removed'];

function sheet_(name, head) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    s.appendRow(head);
    s.setFrozenRows(1);
    s.getRange('B:B').setNumberFormat('@');
    if (name === TRACK) s.getRange('F:F').setNumberFormat('@');
  }
  return s;
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function clip_(v, n) { return String(v == null ? '' : v).slice(0, n); }
function rowIndex_(s, id) {
  const n = s.getLastRow() - 1;
  if (n < 1) return -1;
  return s.getRange(2, 1, n, 1).getValues().map(r => r[0]).indexOf(id);
}

function doGet() {
  const items = {};
  sheet_(TRACK, TRACK_HEAD).getDataRange().getValues().slice(1).forEach(r => {
    if (r[0]) items[r[0]] = { done: r[4] === true || r[4] === 'TRUE', posted_on: String(r[5] || ''), link: String(r[6] || '') };
  });
  const custom = [];
  sheet_(CONTENT, CONTENT_HEAD).getDataRange().getValues().slice(1).forEach(r => {
    if (r[0] && !r[9]) custom.push({ id: r[0], date: String(r[1]), fmt: r[2], title: r[3], hook: r[4], notes: r[5], time: r[6], platform: r[7] });
  });
  return json_({ items, custom });
}

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (d.action === 'add' && d.item) {
      const it = d.item, s = sheet_(CONTENT, CONTENT_HEAD);
      if (!/^c[a-z0-9]{4,20}$/.test(it.id) || rowIndex_(s, it.id) >= 0) return json_({ ok: false });
      s.appendRow([it.id, clip_(it.date, 10), clip_(it.fmt, 20), clip_(it.title, 120), clip_(it.hook, 200), clip_(it.notes, 1000), clip_(it.time, 40), clip_(it.platform, 120), new Date(), '']);
      return json_({ ok: true });
    }
    if (d.action === 'delete') {
      const s = sheet_(CONTENT, CONTENT_HEAD), i = rowIndex_(s, d.id);
      if (i >= 0) s.getRange(i + 2, 10).setValue(new Date());
      return json_({ ok: true });
    }
    if (!d.id || String(d.id).length > 40) return json_({ ok: false });
    const s = sheet_(TRACK, TRACK_HEAD);
    const row = [d.id, clip_(d.date, 10), clip_(d.platform, 120), clip_(d.title, 200), !!d.done, clip_(d.posted_on, 10), clip_(d.link, 500), new Date()];
    const i = rowIndex_(s, d.id);
    if (i < 0) s.appendRow(row);
    else s.getRange(i + 2, 1, 1, row.length).setValues([row]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

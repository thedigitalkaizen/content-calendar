// AdKaizen content tracker: stores calendar ticks and post links in this Google Sheet.
// Paste into Extensions > Apps Script of the "AdKaizen Content Tracker" sheet, then
// Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
const SHEET = 'Tracker';
const HEAD = ['id', 'date', 'platform', 'title', 'done', 'posted_on', 'link', 'updated'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(SHEET);
  if (!s) {
    s = ss.insertSheet(SHEET);
    s.appendRow(HEAD);
    s.setFrozenRows(1);
    s.getRange('B:B').setNumberFormat('@');
    s.getRange('F:F').setNumberFormat('@');
  }
  return s;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const v = sheet_().getDataRange().getValues();
  const items = {};
  v.slice(1).forEach(r => {
    if (!r[0]) return;
    items[r[0]] = { done: r[4] === true || r[4] === 'TRUE', posted_on: String(r[5] || ''), link: String(r[6] || '') };
  });
  return json_({ items });
}

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (!d.id || String(d.id).length > 40) return json_({ ok: false });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const s = sheet_();
    const n = s.getLastRow() - 1;
    const ids = n > 0 ? s.getRange(2, 1, n, 1).getValues().map(r => r[0]) : [];
    const row = [d.id, d.date || '', d.platform || '', d.title || '', !!d.done, d.posted_on || '', String(d.link || '').slice(0, 500), new Date()];
    const i = ids.indexOf(d.id);
    if (i < 0) s.appendRow(row);
    else s.getRange(i + 2, 1, 1, row.length).setValues([row]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

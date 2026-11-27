// December 2026 content calendar: new content + the 10 already-scheduled drafts per platform.
import fs from 'fs';
const K = 'C:/Users/AKBAR STUDY/Kaizen/';
const src = fs.readFileSync(K + 'AdKaizen-social-posts.html', 'utf8');
const pStart = src.indexOf('var P={'), pEnd = src.indexOf('var THEMES=');
const P = new Function('SITE', 'return (' + src.slice(pStart + 6, pEnd).trim().replace(/;$/, '') + ')')('thedigitalkaizen.github.io/Kaizen');
const THEMES = eval(src.slice(pEnd + 11, src.indexOf(';', pEnd)));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const BOOK = 'thedigitalkaizen.github.io/Kaizen/book-a-call';
const TAGS = '#performancemarketing #metaads #googleads #leadgeneration #digitalmarketing #adkaizen';

// ---------- Already scheduled (same rules as the platform guides) ----------
const D0 = Date.UTC(2026, 10, 30);
function sched(days, n) { const o = []; let t = D0; while (o.length < n) { const d = new Date(t); if (days.includes(d.getUTCDay())) o.push(d); t += 864e5; } return o; }
const OLD = [
  ['li', 'LinkedIn', [2, 4], '10:00 AM', 'AdKaizen-LinkedIn.html'],
  ['ig', 'Instagram', [1, 3, 5], '7:30 PM', 'AdKaizen-Instagram.html'],
  ['fb', 'Facebook', [1, 3, 5], '1:00 PM', 'AdKaizen-Facebook.html'],
  ['x', 'X', [1, 2, 3, 4, 5], '9:00 AM', 'AdKaizen-X.html'],
  ['yt', 'YouTube Shorts', [2, 6], '6:00 PM', 'AdKaizen-YouTube.html'],
  ['gbp', 'Google Business', [3], '11:00 AM', 'AdKaizen-Google-Business.html'],
];
const old = {}; // day -> list
for (const [k, name, days, time, file] of OLD) {
  sched(days, 10).forEach((d, i) => {
    if (d.getUTCMonth() !== 11) return;
    (old[d.getUTCDate()] ||= []).push({ k, name, time, file, i, theme: THEMES[i], f: P[k].posts[i].f });
  });
}

// ---------- New December content ----------
// fmt: reel | static | carousel | story
const N = [
 {d:1, fmt:'reel', time:'7:30 PM', title:'3 signs your ads are being run on guesswork', also:'YouTube Shorts, Facebook Reels',
  hook:'If your agency can\'t answer these 3 questions, they\'re guessing.',
  script:['0–3s · On screen: "Is your agency guessing?" Voice: the hook.','3–10s · "One: what did you test last week, and what did you learn?"','10–17s · "Two: what is your cost per QUALIFIED lead, not just cost per lead?"','17–24s · "Three: which ad brought your last sale?"','24–30s · "No clear answers? That\'s guessing. Follow for one ad fix a week."'],
  shoot:'Faceless. Text on screen over a slow scroll of an ads dashboard (blur all numbers) or a laptop on a desk. Voiceover.',
  caption:'Three questions every business should be able to ask its ad agency, and get a straight answer to.\n\n1. What did you test last week?\n2. What\'s our cost per qualified lead?\n3. Which ad brought our last sale?\n\nSave this for your next monthly review. 👇'},
 {d:2, fmt:'static', time:'10:00 AM', title:'UAE National Day greeting', also:'Facebook, LinkedIn (company page)', gcc:true,
  hook:'Happy UAE National Day 🇦🇪',
  shoot:'Single 1080×1350 image: navy background, AdKaizen symbol small at the bottom, "Happy UAE National Day" in large type, a thin red-green-white-black line. No falcon or flag clip-art.',
  caption:'Happy UAE National Day to everyone building businesses in the Emirates. 🇦🇪\n\nProud to work with brands across the UAE and the GCC.'},
 {d:3, fmt:'reel', time:'7:30 PM', title:'The 3 columns to add in Meta Ads Manager', also:'YouTube Shorts, Facebook Reels, LinkedIn (native video)',
  hook:'Your Meta Ads Manager is hiding the 3 numbers that matter.',
  script:['0–3s · Hook on screen over the Columns menu.','3–12s · Screen recording: Columns → Customise columns.','12–22s · Add "Cost per result", "Frequency", "CTR (link click-through rate)". Label each on screen.','22–28s · "Cost going up + frequency going up = your ad is tired, not your targeting."','28–32s · "Save this. Follow for one ad fix a week."'],
  shoot:'Screen recording of a demo or empty ad account. Hide client names and numbers. Zoom in on each click.',
  caption:'Three columns we add to every Meta Ads account on day one:\n\n• Cost per result\n• Frequency\n• Link CTR\n\nTogether they tell you when an ad is wearing out, before your cost per lead jumps.\n\nSave this for your next login.'},
 {d:5, fmt:'static', time:'12:00 PM', title:'What "Kaizen" means', also:'Facebook, LinkedIn, X, Google Business',
  hook:'改善 · Kaizen = change for the better',
  shoot:'Single 1080×1350 image: large 改善 characters, then "Kaizen: change for the better. Small improvements, every week." Brand navy with the emerald square.',
  caption:'Kaizen (改善) is a Japanese word for continuous improvement: small changes for the better, made again and again.\n\nIt\'s how we run every ad account. No big rebuilds. Test, keep what works, repeat.\n\nThat\'s the "Kaizen" in AdKaizen.'},
 {d:6, fmt:'story', time:'Anytime', title:'Poll: biggest ad headache', also:'Facebook Stories',
  hook:'What\'s your biggest ad headache right now?',
  shoot:'3 story frames. 1: poll sticker "Leads too expensive / Leads don\'t pick up / No time to manage ads". 2: share Friday\'s post. 3: "DM us your answer, we\'ll reply with one fix."',
  caption:'(Stories have no caption. Use the poll sticker.)'},
 {d:8, fmt:'reel', time:'7:30 PM', title:'One form question that filters out time-wasters', also:'YouTube Shorts, Facebook Reels',
  hook:'Add this ONE question to your lead form and watch the junk leads drop.',
  script:['0–3s · Hook on screen.','3–10s · "One-tap lead forms are easy to fill. That\'s why so many people never pick up."','10–20s · "Add one qualifying question. Study abroad: Which intake are you planning? Travel: When do you want to travel? Food: Is this for an event or home?"','20–27s · "Fewer leads, maybe. But the ones you get actually want to talk."','27–30s · "Follow for one ad fix a week."'],
  shoot:'Screen recording of building a Meta instant form (Higher intent + a custom question). Faceless voiceover.',
  caption:'Getting lots of leads but nobody picks up the phone?\n\nAdd one qualifying question to your lead form. It costs you a few form fills and saves your sales team hours.\n\nWhat would your one question be? 👇'},
 {d:10, fmt:'reel', time:'7:30 PM', title:'3 ad openers for study-abroad brands', also:'YouTube Shorts, Facebook Reels, LinkedIn',
  hook:'Study-abroad ads all sound the same. Try these 3 openers instead.',
  script:['0–3s · Hook on screen.','3–10s · "One: call out the exact person. \'Planning a UK master\'s for September 2027?\'"','10–17s · "Two: answer the worry. \'Worried about the visa? Here\'s what the process looks like.\'"','17–24s · "Three: show the moment. A student opening their offer letter."','24–30s · "Start the ad with the student, not your logo. Follow for more."'],
  shoot:'Text-led Reel: three cards, one per opener, over stock or your own footage of students, campus, a laptop. Faceless.',
  caption:'Most study-abroad ads open with a logo and "Admissions open!"\n\nThe first 2 seconds should speak to one student with one plan.\n\nWhich opener would stop you scrolling? 1, 2 or 3?'},
 {d:12, fmt:'static', time:'12:00 PM', title:'Before you boost a post: 5 checks', also:'Facebook, LinkedIn',
  hook:'Before you hit "Boost": 5 checks',
  shoot:'Checklist image, 1080×1350: 5 rows with tick boxes. 1 Is there one clear action? 2 Is the right audience selected (not just "people who like your page")? 3 Does the link go to a matching page? 4 Is tracking set up? 5 Do you know what a good result looks like?',
  caption:'Boosting a post is the fastest way to spend money on Instagram, and the easiest way to waste it.\n\nRun these 5 checks first. Save this for next time. ✅'},
 {d:13, fmt:'story', time:'Anytime', title:'Q&A box: ask us anything about ads', also:'Facebook Stories',
  hook:'Ask us any question about your ads 👇',
  shoot:'1 frame with a question sticker. Over the next few days, answer 3–5 questions as stories (text on brand background). Save the answers to the "Process" highlight.',
  caption:'(Use the question sticker.)'},
 {d:15, fmt:'reel', time:'7:30 PM', title:'Travel & Umrah ads in winter: what to show', also:'YouTube Shorts, Facebook Reels',
  hook:'Winter is busy season for Umrah and travel ads. Most of them show the wrong thing.',
  script:['0–3s · Hook on screen.','3–12s · "People don\'t buy a package list. They buy peace of mind: who handles the visa, the hotel distance, the flights."','12–22s · "Show the answer to their biggest worry in the first 3 seconds."','22–28s · "And put the WhatsApp button front and centre. Travel buyers want to talk to a person."','28–32s · "Follow for one ad fix a week."'],
  shoot:'Faceless. Text over calm travel footage (airport, hotel corridor, packing). No religious imagery used as decoration.',
  caption:'Umrah and travel buyers are asking one question: "Will this be handled properly?"\n\nAnswer that in your ad before you list prices.\n\nTravel brands: what\'s the #1 question your customers ask?'},
 {d:16, fmt:'story', time:'Anytime', title:'Bahrain National Day greeting', also:'Facebook Stories', gcc:true,
  hook:'Happy Bahrain National Day 🇧🇭',
  shoot:'1 story frame: brand navy, "Happy National Day, Bahrain" in large type, AdKaizen symbol small.',
  caption:'(Story only.)'},
 {d:17, fmt:'reel', time:'7:30 PM', title:'Boost vs Ads Manager: what\'s the difference?', also:'YouTube Shorts, Facebook Reels',
  hook:'"Boost post" and "Ads Manager" are not the same thing.',
  script:['0–3s · Hook on screen.','3–12s · "Boost: quick, but limited. You mostly pay for likes and reach."','12–22s · "Ads Manager: you choose the goal (leads, messages, sales), test several ads and see what each one costs."','22–28s · "Boost is fine for a post you want more people to see. For leads, use Ads Manager."','28–30s · "Follow for one ad fix a week."'],
  shoot:'Split-screen: left side the Boost button, right side Ads Manager campaign goals. Faceless voiceover.',
  caption:'Boost post vs Ads Manager, in one minute.\n\nBoost = more eyes on a post.\nAds Manager = a goal, a test, and a cost you can measure.\n\nWhich one are you using for leads?'},
 {d:18, fmt:'story', time:'Anytime', title:'Qatar National Day greeting', also:'Facebook Stories', gcc:true,
  hook:'Happy Qatar National Day 🇶🇦',
  shoot:'1 story frame: brand navy, "Happy National Day, Qatar" in large type, AdKaizen symbol small.',
  caption:'(Story only.)'},
 {d:19, fmt:'static', time:'12:00 PM', title:'Meta Ads or Google Ads first?', also:'Facebook, LinkedIn, X',
  hook:'Meta Ads or Google Ads: which first?',
  shoot:'Two-column comparison, 1080×1350. Google: people already searching for you, good when demand exists. Meta: you find people before they search, good for new offers and visual products. Bottom line: "Have search demand? Start with Google. Need to create demand? Start with Meta."',
  caption:'"Should I start with Meta or Google?" is the question we hear most.\n\nShort answer: it depends on whether people already search for what you sell.\n\nTell us your business in the comments and we\'ll tell you where we\'d start.'},
 {d:20, fmt:'story', time:'Anytime', title:'Quiz: what does Kaizen mean?', also:'Facebook Stories',
  hook:'Quiz: what does "Kaizen" mean?',
  shoot:'Frame 1: quiz sticker with options "A big change / Continuous improvement / Fast growth". Frame 2: the answer plus the Dec 5 post.',
  caption:'(Use the quiz sticker.)'},
 {d:22, fmt:'reel', time:'7:30 PM', title:'Why ad costs often rise in December', also:'YouTube Shorts, Facebook Reels, LinkedIn',
  hook:'Your ads didn\'t get worse in December. The auction got busier.',
  script:['0–3s · Hook on screen.','3–12s · "Holiday season = big brands spending more. More competition usually means higher costs per view."','12–22s · "Don\'t panic and rebuild. Keep your best ads running, trim the weak ones and focus budget on warm audiences: past visitors and leads."','22–28s · "Costs usually settle after the holidays. Be ready with fresh ads in January."','28–30s · "Follow for one ad fix a week."'],
  shoot:'Faceless. Simple animated text, or a chart with no numbers going up then down.',
  caption:'December ad costs often go up. That\'s usually the auction, not your account.\n\nWhat to do:\n→ Keep your proven ads on\n→ Pause the weak ones\n→ Spend more on warm audiences\n→ Prep new creative for January\n\nSave this for next December.'},
 {d:23, fmt:'carousel', time:'7:30 PM', title:'Year-end ad account review: 7 questions', also:'LinkedIn (as PDF document), Facebook',
  hook:'Before 2026 ends, ask your ad account these 7 questions.',
  slides:['Before 2026 ends, ask your ad account these 7 questions','1. Which ad brought the most qualified leads this year?','2. Which month had your cheapest leads, and why?','3. Is your tracking still counting the right thing?','4. How fast does your team reply to a new lead?','5. Which ads have been running for 3+ months without a refresh?','6. What did you test this year, and what did you keep?','7. What\'s the ONE change to test first in January?','Save this. Need a second pair of eyes? Free strategy call, link in bio.'],
  shoot:'9 slides, 1080×1350. Use a new colour: deep green (#064E3B) with cream text, so it stands apart from the first 10 carousels. Cover: a pen ticking a clipboard.',
  caption:'A 20-minute year-end review that sets up your whole January.\n\nSave it, block 20 minutes before New Year, and answer all 7.\n\nWhich question is hardest for you to answer?'},
 {d:24, fmt:'reel', time:'7:30 PM', title:'How we pick the change to test each week', also:'YouTube Shorts, Facebook Reels, LinkedIn',
  hook:'Here\'s how we decide what to test every week.',
  script:['0–3s · Hook on screen.','3–12s · "Step 1: find the biggest leak: the ad, the audience, the landing page or the follow-up."','12–20s · "Step 2: pick the change most likely to fix it, and write down what we expect."','20–27s · "Step 3: run it for 7 days next to what\'s already working. Keep the winner."','27–32s · "Small change. Every week. Follow to see more of how we work."'],
  shoot:'Behind the scenes, faceless: hands writing on a whiteboard or notebook with "Leak → Change → 7 days → Keep / Drop". No client names or numbers.',
  caption:'No magic. Just a process.\n\nFind the leak → test one fix → keep the winner → repeat.\n\nThat\'s every week, for every account.'},
 {d:25, fmt:'static', time:'11:00 AM', title:'Season\'s greetings', also:'Facebook, LinkedIn',
  hook:'Season\'s greetings from AdKaizen',
  shoot:'Simple 1080×1350 image: brand navy, "Season\'s greetings", "Thank you for a great 2026" and the symbol. Warm, no Santa clip-art.',
  caption:'Season\'s greetings from all of us at AdKaizen. ✨\n\nThank you to the brands we worked with this year. Here\'s to small improvements, every week, in 2027.'},
 {d:26, fmt:'story', time:'Anytime', title:'This or that: Reels or carousels?', also:'Facebook Stories',
  hook:'Reels or carousels: what do you want more of from us?',
  shoot:'1 frame, poll sticker "Reels / Carousels". Use the answer to plan January.',
  caption:'(Use the poll sticker.)'},
 {d:28, fmt:'carousel', time:'7:30 PM', title:'What to do with your ads from 26 Dec to 5 Jan', also:'LinkedIn (as PDF document), Facebook',
  hook:'Your team is on holiday. Your ads aren\'t. Here\'s the plan.',
  slides:['Your team is on holiday. Your ads aren\'t.','1. Set an auto-reply on WhatsApp and lead forms: "We\'ll call you on [date]"','2. Lower budgets on ads that need a fast callback','3. Keep warm audiences running (past visitors, past leads)','4. Check spend every 2–3 days, not every day','5. Prep January ads now, so they go live on day one','Holiday plan done. Follow for one ad fix a week.'],
  shoot:'7 slides, 1080×1350, warm orange and cream (#C2410C). Cover: an "Out of office" sticky note on a laptop.',
  caption:'Most businesses slow down between Christmas and the first week of January. Leads don\'t stop coming.\n\nThis is the simple holiday plan we use so leads don\'t go cold.\n\nSend it to whoever looks after your ads.'},
 {d:29, fmt:'reel', time:'7:30 PM', title:'The first thing to do in your ad account in January', also:'YouTube Shorts, Facebook Reels, LinkedIn',
  hook:'Do this in your ad account in the first week of January.',
  script:['0–3s · Hook on screen.','3–12s · "Check your tracking. Year-end website changes and new forms often break it quietly."','12–20s · "Then refresh your creative: holiday ads go stale on January 1st."','20–27s · "Then pick ONE test for week one. Just one."','27–30s · "Follow for one ad fix a week in 2027."'],
  shoot:'Faceless. A calendar flipping from December to January, then a checklist with 3 items ticking off.',
  caption:'January checklist for your ads:\n\n✅ Check tracking\n✅ Swap holiday creative\n✅ Pick one test for week one\n\nThat\'s it. Start small, keep going.'},
 {d:30, fmt:'carousel', time:'7:30 PM', title:'January plan: 4 weeks, 4 tests', also:'LinkedIn (as PDF document), Facebook',
  hook:'A simple January plan for your ads: 4 weeks, 4 tests.',
  slides:['January: 4 weeks, 4 tests','Week 1: Fix tracking and refresh holiday creative','Week 2: Test a new hook on your best ad','Week 3: Test your landing page: one action, one promise','Week 4: Test faster lead follow-up (instant WhatsApp reply)','Keep what wins. Drop what doesn\'t. Repeat in February.','Want us to plan yours? Free strategy call, link in bio.'],
  shoot:'7 slides, 1080×1350, crisp white with royal blue (#2F6BFF) and a calendar grid cover with 4 circled weeks.',
  caption:'New year, no rebuild.\n\nFour weeks, four small tests. By February you\'ll know more about your ads than most businesses learn all year.\n\nSave this and start on the 5th.'},
 {d:31, fmt:'static', time:'12:00 PM', title:'New Year: small changes, every week', also:'Facebook, LinkedIn, X, Google Business',
  hook:'2027 resolution for your ads: small changes, every week.',
  shoot:'1080×1350 image: "2027" large, then "Small changes. Every week." and the emerald step square. Brand navy.',
  caption:'Forget the big New Year overhaul.\n\nPick one thing to improve in your ads every week of 2027. Keep what works.\n\nHappy New Year from AdKaizen. 🎉'},
];


// ---------- Final Reels: real script, cover, caption + hashtags per Reel ----------
const R = 'C:/Users/AKBAR STUDY/Kaizen/adkaizen-reels/';
const REELS = JSON.parse(fs.readFileSync(R + 'reels.json', 'utf8'));
const CAPS = JSON.parse(fs.readFileSync(R + 'captions.json', 'utf8'));
const COVS = JSON.parse(fs.readFileSync(R + 'covers.json', 'utf8'));
const REEL_DAY = { 1: '01-agency-guessing', 3: '02-meta-columns', 8: '03-form-question', 10: '04-study-abroad-openers', 15: '05-umrah-travel-winter', 17: '06-boost-vs-ads-manager', 22: '07-december-ad-costs', 24: '08-how-we-pick-tests', 29: '09-january-first-step' };
for (const x of N) {
  const id = x.fmt === 'reel' && REEL_DAY[x.d]; if (!id) continue;
  const r = REELS.find(z => z.id === id), c = CAPS[id];
  x.reelId = id;
  x.title = COVS[id].t.replace(/\*/g, '');
  x.hook = r.beats[0].vo;
  x.script = r.beats.map(b => b.vo);
  x.shoot = 'Done: video, voiceover and cover are made. Upload the MP4, then tap Edit cover, Add from camera roll, and pick the cover PNG.';
  x.caption = c.caption; x.tags = c.tags; x.yt = c.yt;
}

let SYNC = ''; try { SYNC = fs.readFileSync(K + 'content-calendar/sync-url.txt', 'utf8').trim(); } catch (e) {}
const SB = 'kaizen-logo/social-banners/';
const FILES = { // day -> [path relative to Kaizen\, preview image]
 1:['adkaizen-reels/renders/01-agency-guessing.mp4'], 3:['adkaizen-reels/renders/02-meta-columns.mp4'], 8:['adkaizen-reels/renders/03-form-question.mp4'],
 10:['adkaizen-reels/renders/04-study-abroad-openers.mp4'], 15:['adkaizen-reels/renders/05-umrah-travel-winter.mp4'], 17:['adkaizen-reels/renders/06-boost-vs-ads-manager.mp4'],
 22:['adkaizen-reels/renders/07-december-ad-costs.mp4'], 24:['adkaizen-reels/renders/08-how-we-pick-tests.mp4'], 29:['adkaizen-reels/renders/09-january-first-step.mp4'],
 2:[SB+'december-posts/01-uae-national-day.png',SB+'december-posts/01-uae-national-day.png'], 5:[SB+'december-posts/02-what-kaizen-means.png',SB+'december-posts/02-what-kaizen-means.png'],
 12:[SB+'december-posts/03-before-you-boost.png',SB+'december-posts/03-before-you-boost.png'], 19:[SB+'december-posts/04-meta-or-google.png',SB+'december-posts/04-meta-or-google.png'],
 25:[SB+'december-posts/05-seasons-greetings.png',SB+'december-posts/05-seasons-greetings.png'], 31:[SB+'december-posts/06-new-year-2027.png',SB+'december-posts/06-new-year-2027.png'],
 23:[SB+'instagram-carousels/11-year-end-review/',SB+'instagram-carousels/11-year-end-review/slide-1.png'], 28:[SB+'instagram-carousels/12-holiday-plan/',SB+'instagram-carousels/12-holiday-plan/slide-1.png'],
 30:[SB+'instagram-carousels/13-january-plan/',SB+'instagram-carousels/13-january-plan/slide-1.png'],
};
for (const [d, id] of Object.entries(REEL_DAY)) FILES[d] = ['adkaizen-reels/renders/' + id + '.mp4', 'adkaizen-reels/covers/' + id + '.png', 'adkaizen-reels/covers/' + id + '.png'];
const FMT = { reel: ['Reel', '#E1306C'], static: ['Static post', '#2F6BFF'], carousel: ['Carousel', '#7C5CFF'], story: ['Story', '#F59E0B'] };
const OLDC = '#64748B';
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const day = n => new Date(Date.UTC(2026, 11, n));
const byDay = {}; N.forEach(x => (byDay[x.d] ||= []).push(x));

// Month grid (Mon-first)
let grid = ''; const first = (day(1).getUTCDay() + 6) % 7;
for (let i = 0; i < first; i++) grid += '<div class="cell empty"></div>';
for (let n = 1; n <= 31; n++) {
  const chips = (byDay[n] || []).map(x => `<span class="chip" style="--c:${FMT[x.fmt][1]}">${FMT[x.fmt][0]}</span>`).join('');
  const o = (old[n] || []).length;
  grid += `<a class="cell" href="#d${n}"><span class="dn">${n}</span>${chips}${o ? `<span class="oc">+${o} planned</span>` : ''}</a>`;
}

const counts = Object.fromEntries(Object.keys(FMT).map(f => [f, N.filter(x => x.fmt === f).length]));

let list = '';
for (let n = 1; n <= 31; n++) {
  const items = byDay[n] || [], o = old[n] || [];
  const dd = day(n);
  let h = `<section class="day" id="d${n}"><div class="dh"><b>${DOW[dd.getUTCDay()]} ${n} Dec</b>${!items.length && !o.length ? '<span class="rest">Rest day · reply to comments and DMs</span>' : ''}</div>`;
  items.forEach((x, j) => {
    const id = `n${n}-${j}`;
    const copy = x.fmt === 'story' ? '' : x.caption + '\n\n' + (x.tags || TAGS);
    h += `<article class="it" data-fmt="${x.fmt}" data-id="${id}" data-date="2026-12-${String(n).padStart(2, '0')}" data-platform="${esc('Instagram' + (x.also ? ', ' + x.also : ''))}" data-title="${esc(FMT[x.fmt][0] + ': ' + x.title)}"><div class="ih"><input type="checkbox" aria-label="Done"><span class="chip" style="--c:${FMT[x.fmt][1]}">${FMT[x.fmt][0]}</span><span class="t">${esc(x.title)}</span><span class="tm">${x.time}${x.time === 'Anytime' ? '' : ' IST'}</span></div>
<div class="hook">${esc(x.hook)}</div>
<div class="bd">${x.script ? `<div class="blk"><small>${x.reelId ? 'Voiceover' : 'Script'}</small><ol>${x.script.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>` : ''}${x.slides ? `<div class="blk"><small>Slides</small><ol>${x.slides.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>` : ''}
<div class="blk"><small>${x.reelId ? 'How to post' : x.fmt === 'reel' ? 'How to film' : 'Design'}</small><p>${esc(x.shoot)}</p></div>
${x.fmt === 'story' ? `<div class="blk"><small>Note</small><p>${esc(x.caption)}</p></div>` : `<div class="blk"><small>${x.tags ? 'Caption + hashtags (Instagram, Facebook, LinkedIn)' : 'Caption'}</small><pre>${esc(copy)}</pre><button class="copy" data-t="${encodeURIComponent(copy)}">Copy caption</button></div>${x.yt ? `<div class="blk"><small>YouTube Shorts title</small><pre>${esc(x.yt)}</pre><button class="copy" data-t="${encodeURIComponent(x.yt)}">Copy title</button></div>` : ''}`}
${x.fmt !== 'story' && FILES[n] ? `<div class="file">${FILES[n][1] ? `<img src="${FILES[n][1]}" alt="">` : '<span class="vid">▶</span>'}<div><small>${x.fmt === 'reel' ? 'Video file' : x.fmt === 'carousel' ? 'Slides folder' : 'Image file'}</small><code>Kaizen\\${FILES[n][0].split('/').join('\\')}</code>${x.fmt === 'carousel' ? `<span class="slides">${fs.readdirSync(K + FILES[n][0]).filter(f => /^slide-\d+\.png$/.test(f)).sort((a, b) => parseInt(a.slice(6)) - parseInt(b.slice(6))).map((f, k) => `<a href="${FILES[n][0]}${f}" target="_blank">Slide ${k + 1}</a>`).join('')}</span>` : x.fmt === 'static' ? `<a href="${FILES[n][0]}" target="_blank">Open image</a>` : ''}${x.fmt === 'reel' ? `<a href="${FILES[n][0]}">Play video</a>${FILES[n][2] ? `<small style="margin-top:8px">Cover image</small><code>Kaizen\\${FILES[n][2].split('/').join('\\')}</code>` : ''}` : ''}</div></div>` : ''}<div class="also"><b>Platforms:</b> Instagram${x.also ? ', ' + esc(x.also) : ''}${x.gcc ? ' · <i>GCC audience</i>' : ''}</div>${x.fmt === 'story' ? '' : '<div class="trk"><input class="lnk" type="url" placeholder="After posting, paste the post link here"><span class="when"></span></div>'}</div></article>`;
  });
  if (o.length) h += `<div class="old"><small>Already planned (from the platform guides)</small>${o.map(p => `<div class="orow" data-id="o-${p.k}-${p.i + 1}" data-date="2026-12-${String(n).padStart(2, '0')}" data-platform="${esc(p.name)}" data-title="${esc('Post ' + (p.i + 1) + ': ' + p.theme + ' (' + p.f + ')')}"><input type="checkbox" aria-label="Done"><a href="AdKaizen-social-guides/${p.file}#p${p.i + 1}">${esc(p.name)} · ${p.time} · Post ${p.i + 1}: ${esc(p.theme)} <em>${esc(p.f)}</em></a></div>`).join('')}</div>`;
  list += h + '</section>';
}


// ---------- Next months (plan only, content made the month before) ----------
FMT.li = ['LinkedIn post', '#0A66C2'];
const PLAN = JSON.parse(fs.readFileSync(K + 'content-plan-2027.json', 'utf8'));
const PF = { reel: ['7:30 PM', 'Instagram, Facebook Reels, YouTube Shorts'], carousel: ['7:30 PM', 'Instagram, Facebook, LinkedIn (PDF)'], static: ['12:00 PM', 'Instagram, Facebook, LinkedIn'], li: ['10:00 AM', 'LinkedIn, Google Business'], story: ['Anytime', 'Instagram + Facebook Stories'] };
const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function monthBlock(m) {
  const [Y, M] = m.id.split('-').map(Number);
  const by = {}; m.items.forEach((it, k) => (by[+it[0].slice(8)] ||= []).push([it, k]));
  const dim = new Date(Date.UTC(Y, M, 0)).getUTCDate();
  let g = ''; const f0 = (new Date(Date.UTC(Y, M - 1, 1)).getUTCDay() + 6) % 7;
  for (let i = 0; i < f0; i++) g += '<div class="cell empty"></div>';
  for (let n = 1; n <= dim; n++) g += `<a class="cell" href="#d${m.id}-${n}"><span class="dn">${n}</span>${(by[n] || []).map(([it]) => `<span class="chip" style="--c:${FMT[it[1]][1]}">${FMT[it[1]][0]}</span>`).join('')}</a>`;
  let l = '';
  for (let n = 1; n <= dim; n++) {
    const its = by[n] || []; const dd = new Date(Date.UTC(Y, M - 1, n));
    l += `<section class="day" id="d${m.id}-${n}"><div class="dh"><b>${DOW[dd.getUTCDay()]} ${n} ${MN[M - 1].slice(0, 3)}</b>${its.length ? '' : '<span class="rest">Share a story, reply to comments and DMs</span>'}</div>`;
    its.forEach(([it, k]) => {
      const [date, fmt, title, hook] = it; const pf = PF[fmt];
      l += `<article class="it" data-fmt="${fmt}" data-id="p${date.replace(/-/g, '')}-${fmt}-${k}" data-date="${date}" data-platform="${esc(pf[1])}" data-title="${esc(FMT[fmt][0] + ': ' + title)}"><div class="ih"><input type="checkbox" aria-label="Done"><span class="chip" style="--c:${FMT[fmt][1]}">${FMT[fmt][0]}</span><span class="t">${esc(title)}</span><span class="st2">To make</span><span class="tm">${pf[0]}${pf[0] === 'Anytime' ? '' : ' IST'}</span></div><div class="hook">${esc(hook)}</div><div class="also"><b>Platforms:</b> ${esc(pf[1])}</div>${fmt === 'story' ? '' : '<div class="trk"><input class="lnk" type="url" placeholder="After posting, paste the post link here"><span class="when"></span></div>'}</article>`;
    });
    l += '</section>';
  }
  const c = f => m.items.filter(x => x[1] === f).length;
  return `<section class="month" data-m="${m.id}" data-name="${MN[M - 1]}"><div class="mintro"><div class="eyebrow">Content plan</div><h2>${m.name}</h2><p>${esc(m.theme)}.</p><div class="stats"><span>${c('reel')} Reels</span><span>${c('carousel')} carousels</span><span>${c('static')} static posts</span><span>${c('li')} LinkedIn posts</span><span>${c('story')} story ideas</span></div><div class="how"><b>Status: planned, not made yet.</b> Every topic and hook is new (checked against the content log). Ask Claude to “make ${MN[M - 1]} content” in the last week of ${MN[(M + 10) % 12]} and the Reels, covers, images and captions get made, then this page is updated.</div></div><div class="grid">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<div class="wd">${d}</div>`).join('')}${g}</div><h3 class="dd">Day by day</h3>${l}</section>`;
}
const FUTURE = PLAN.months.map(monthBlock).join('\n');
const TABS = [['2026-12', 'Dec 2026'], ...PLAN.months.map(m => [m.id, MN[+m.id.slice(5) - 1].slice(0, 3) + ' ' + m.id.slice(0, 4)])];

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>AdKaizen Content Calendar</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;800&family=Inter:wght@400;500;600&display=swap">
<style>
:root{--bg:#F6F8FC;--card:#fff;--text:#0A1129;--body:#1B2440;--muted:#5B6480;--line:rgba(10,17,41,.10);--royal:#2F6BFF;--violet:#7C5CFF;--em:#10B981;--soft:rgba(47,107,255,.07);--chip:rgba(47,107,255,.09);--code:#F6F8FC;--shadow-sm:0 4px 14px -6px rgba(10,17,41,.14);--grad:linear-gradient(120deg,#2F6BFF 0%,#7C5CFF 100%)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--body);font:15px/1.6 Inter,system-ui,sans-serif;padding:0 16px 64px;-webkit-font-smoothing:antialiased}
.top{position:sticky;top:0;z-index:20;margin:0 -16px 20px;padding:12px 16px;background:rgba(246,248,252,.82);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.top .in{max-width:1040px;margin:0 auto;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.months{display:flex;gap:6px;flex-wrap:wrap;margin-left:auto}
.months button{font:600 13px Inter;padding:8px 14px;border-radius:100px;border:1px solid var(--line);background:#fff;color:var(--text);cursor:pointer}
.months button.on{background:var(--grad);border-color:transparent;color:#fff;box-shadow:0 8px 20px -10px rgba(47,107,255,.7)}
.wrap{max-width:1040px;margin:0 auto}
.month{display:none}.month.on{display:block}
.mintro{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:24px 26px;margin-bottom:14px;box-shadow:var(--shadow-sm);position:relative;overflow:hidden}
.mintro::after{content:"";position:absolute;right:-80px;top:-120px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(124,92,255,.16),transparent 70%);pointer-events:none}
.mintro h2{font:800 28px/1.15 Sora,sans-serif;color:var(--text);letter-spacing:-.02em;margin:0}
.mintro p{color:var(--muted);margin-top:6px;max-width:720px}
.eyebrow{font:600 11px Inter;letter-spacing:.2em;text-transform:uppercase;color:var(--royal);margin-bottom:6px}
.how{margin-top:14px;padding:12px 14px;border-radius:14px;background:var(--soft);color:var(--body);font-size:14px}.how b{color:var(--text)}
.st2{display:inline-block;font:600 11px Inter;padding:3px 9px;border-radius:99px;background:rgba(245,158,11,.14);color:#B45309}.st2.ready{background:rgba(16,185,129,.14);color:#047857}
.lock{display:flex;align-items:center;gap:10px;color:var(--text)}.lock svg{width:32px;height:32px}.lock b{font:800 19px/1 Sora,sans-serif;letter-spacing:-.02em}.lock b span{color:var(--royal)}.lock small{display:block;font:600 9px Inter;letter-spacing:.2em;text-transform:uppercase;color:var(--royal);margin-top:3px}
h1{font:800 28px/1.2 Sora,sans-serif;margin-top:18px;letter-spacing:-.02em}

.stats{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.stats span{font:600 12.5px Inter;padding:6px 12px;border-radius:100px;background:var(--chip);color:#1E4FD6}
.sched{margin-bottom:14px}.sched summary{cursor:pointer;font:700 14px Sora,sans-serif;color:var(--text);padding:6px 2px 10px;list-style-position:inside}.sched .rules{margin-bottom:0}
.rules{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
.rules div{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 16px;font-size:13.5px;color:var(--muted);box-shadow:var(--shadow-sm)}
.rules b{display:block;color:var(--text);font:800 15px Sora,sans-serif;margin-bottom:4px}
.filters{display:flex;flex-wrap:wrap;gap:8px;padding:6px 0 10px}
.filters button{font:600 13px Inter;padding:7px 13px;border-radius:99px;border:1px solid var(--line);background:var(--card);color:var(--text);cursor:pointer}
.filters button.on{background:var(--text);border-color:var(--text);color:#fff}
.chip{display:inline-block;font:600 11px Inter;padding:3px 8px;border-radius:99px;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);white-space:nowrap}
.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin:8px 0 24px}
.wd{font:600 12px Inter;color:var(--muted);text-align:center;padding:4px 0}
.cell{min-height:96px;background:var(--card);border:1px solid var(--line);border-radius:14px;box-shadow:0 2px 8px -6px rgba(10,17,41,.2);padding:8px;display:flex;flex-direction:column;gap:4px;text-decoration:none;color:var(--text)}
.cell:hover{border-color:var(--royal)}.cell.empty{background:transparent;border:0}
.dn{font:800 15px Sora,sans-serif;color:var(--text)}
.oc{font-size:11px;color:var(--muted);margin-top:auto}
h2{font:800 20px Sora,sans-serif;margin:8px 0 10px;letter-spacing:-.02em;color:var(--text)}
h3.dd{font:800 20px Sora,sans-serif;margin:8px 0 10px;letter-spacing:-.02em;color:var(--text)}
.day{margin-bottom:14px;scroll-margin-top:64px}
.dh{display:flex;align-items:center;gap:10px;padding:6px 2px}.dh b{font:800 16px Sora,sans-serif;color:var(--text)}
.rest{font-size:13px;color:var(--muted)}
.it{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px 18px;margin-bottom:10px;box-shadow:var(--shadow-sm)}
.it.done{opacity:.55}
.ih{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px}
.ih input{width:18px;height:18px;accent-color:var(--em)}
.t{font:700 15.5px Sora,sans-serif;flex:1;min-width:180px;color:var(--text)}
.tm{font:600 12.5px Inter;color:var(--muted)}
.hook{margin:10px 0;background:var(--soft);border-left:3px solid var(--royal);border-radius:10px;padding:10px 12px;font:700 15px/1.4 Sora,sans-serif;color:var(--text)}
.blk{margin-top:10px}.blk small{display:block;font:600 11px Inter;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
.blk ol{padding-left:20px;font-size:14px}.blk li{margin:2px 0}.blk p{font-size:14px}
pre{white-space:pre-wrap;font:14px/1.6 Inter,system-ui,sans-serif;background:var(--code);border:1px solid var(--line);border-radius:10px;padding:11px 12px}
.copy{margin-top:8px;font:600 12.5px Inter;padding:7px 13px;border-radius:99px;border:0;background:var(--royal);color:#fff;cursor:pointer}.copy.done{background:var(--em)}
.file{display:flex;gap:14px;align-items:center;margin-top:12px;padding:10px;border:1px solid var(--line);border-radius:12px;background:var(--code)}.file img{width:72px;border-radius:8px;flex:none}.file .vid{width:72px;height:96px;border-radius:8px;background:#0B1226;color:#fff;display:grid;place-items:center;font-size:24px;flex:none}.file small{display:block;font:600 11px Inter;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}.file code{display:block;font-size:12.5px;word-break:break-all;margin-top:2px}.file a{font:600 13px Inter;color:var(--royal);text-decoration:none}
.also{margin-top:10px;font-size:13px;color:var(--muted)}.also b{color:var(--text)}
.old{background:transparent;border:1px dashed var(--line);border-radius:14px;padding:10px 14px}
.old small{display:block;font:600 11px Inter;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
.old a{display:flex;align-items:center;gap:8px;font-size:13.5px;color:var(--text);text-decoration:none;padding:3px 0}
.old a:hover{color:var(--royal)}.old em{font-style:normal;color:var(--muted);font-size:12px}
.dot{width:7px;height:7px;border-radius:50%;background:${OLDC};flex:none}
.hide{display:none}
.top .in+.in{margin-top:10px}
.addbtn{margin-left:auto;font:600 13.5px Inter;padding:9px 16px;border-radius:100px;border:0;background:var(--grad);color:#fff;cursor:pointer;box-shadow:0 8px 20px -10px rgba(47,107,255,.7)}
.months{margin-left:0;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;width:100%;padding-bottom:2px}.months::-webkit-scrollbar{display:none}.months button{flex:none}
.months button[data-m="overview"]{border-color:var(--royal);color:var(--royal)}.months button[data-m="overview"].on{color:#fff}
.keyd{list-style:none;display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:10px;font-size:13.5px;color:var(--body)}.keyd li::before{content:"◆";color:var(--em);font-size:9px;margin-right:7px;vertical-align:2px}
.st2.you{background:rgba(124,92,255,.14);color:#5B3FD6}.chip.you{outline:2px dashed var(--c);outline-offset:-2px}
.it.mine{border-color:rgba(124,92,255,.35)}.notes{font-size:14px;margin-top:8px;white-space:pre-wrap}
.acts{margin-top:10px;text-align:right}.del{font:600 12.5px Inter;padding:6px 12px;border-radius:99px;border:1px solid var(--line);background:#fff;color:#B42318;cursor:pointer}
.ygrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.ycard{text-align:left;display:flex;flex-direction:column;gap:8px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px 18px;box-shadow:var(--shadow-sm);cursor:pointer;font:inherit;color:var(--body);transition:transform .2s,border-color .2s}
.ycard:hover{transform:translateY(-2px);border-color:var(--royal)}
.yh{display:flex;align-items:center;justify-content:space-between}.yh b{font:800 17px Sora,sans-serif;color:var(--text)}.yh em{font:600 11px Inter;font-style:normal;padding:3px 9px;border-radius:99px;background:rgba(245,158,11,.14);color:#B45309}.yh em.ok{background:rgba(16,185,129,.14);color:#047857}
.yt{font-size:13.5px;line-height:1.45}.yk{font-size:12.5px;color:var(--muted);line-height:1.6}
.yc{display:flex;flex-wrap:wrap;gap:5px}.yc i{font:600 11px Inter;font-style:normal;padding:3px 8px;border-radius:99px;background:color-mix(in srgb,var(--c) 14%,transparent);color:var(--c)}
.yp{display:flex;align-items:center;gap:10px;font:600 12px Inter;color:var(--muted);margin-top:auto}
dialog{border:0;border-radius:22px;padding:0;width:min(560px,calc(100vw - 32px));box-shadow:0 40px 90px -30px rgba(10,17,41,.45)}dialog::backdrop{background:rgba(10,17,41,.45)}
#addform{padding:22px 22px 18px;display:flex;flex-direction:column;gap:12px}#addform h3{font:800 20px Sora,sans-serif;color:var(--text)}.dsub{font-size:13px;color:var(--muted);margin-top:-8px}
#addform label{display:flex;flex-direction:column;gap:5px;font:600 12px Inter;color:var(--muted);flex:1}
#addform input,#addform select,#addform textarea{font:15px Inter;padding:10px 12px;border-radius:12px;border:1px solid rgba(10,17,41,.14);background:var(--code);color:var(--text);width:100%}
#addform input:focus,#addform select:focus,#addform textarea:focus{outline:2px solid var(--royal);outline-offset:0;background:#fff}
.frow{display:flex;gap:12px}.dact{display:flex;justify-content:flex-end;gap:8px;margin-top:4px}
.dact button{font:600 14px Inter;padding:10px 18px;border-radius:100px;cursor:pointer}.ghost{background:#fff;border:1px solid var(--line);color:var(--text)}.primary{border:0;background:var(--grad);color:#fff}
.trk{display:flex;gap:10px;align-items:center;margin-top:10px}.lnk{flex:1;min-width:0;font:14px Inter;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:var(--code);color:var(--text)}.when{font:600 12px Inter;color:var(--em);white-space:nowrap}
.orow{display:flex;align-items:center;gap:8px}.orow input{width:16px;height:16px;accent-color:var(--em);flex:none}.orow.done a{opacity:.5;text-decoration:line-through}
.slides{display:flex;flex-wrap:wrap;gap:6px 12px;margin-top:6px}
.sync{box-shadow:var(--shadow-sm);display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin:0 0 14px;padding:10px 14px;border-radius:12px;background:var(--card);border:1px solid var(--line);font-size:13.5px;color:var(--muted)}.sync b{color:var(--text)}.sync .st{font-weight:600}.sync .st.ok{color:var(--em)}.sync .st.err{color:#E5484D}.bar2{flex:1;min-width:120px;height:8px;border-radius:99px;background:var(--line);overflow:hidden}.bar2 i{display:block;height:100%;width:0;background:var(--em);transition:width .3s}
.foot{color:var(--muted);font-size:12.5px;text-align:center;margin-top:24px}
@media(min-width:761px) and (max-width:980px){.ygrid{grid-template-columns:1fr 1fr}}
@media(max-width:760px){.ygrid{grid-template-columns:1fr}.frow{flex-direction:column}.addbtn{padding:8px 13px;font-size:13px}.months{margin-left:0}.mintro h2{font-size:22px}.rules{grid-template-columns:1fr}.grid{gap:4px}.cell{min-height:64px;padding:5px}.cell .chip{font-size:0;padding:0;width:8px;height:8px;background:var(--c)}.oc{display:none}.dn{font-size:13px}h1{font-size:22px}}
</style></head><body><div class="wrap">
<div class="top"><div class="in"><div class="lock"><svg viewBox="0 0 256 256"><path fill="#0A1129" d="M221.97 95.8A100 100 0 1 1 145.36 31.52L139.81 63.03A68 68 0 1 0 191.9 106.74Z"/><path fill="#10B981" d="M184.3 25.7h34v34h-34z"/></svg><div><b><span>Ad</span>Kaizen</b><small>Content calendar</small></div></div><button class="addbtn" id="addbtn" type="button">+ Add content</button></div><div class="in"><div class="months" id="months"></div></div></div>
<div class="sync"><b id="prog">0 of 0 posted</b><span class="bar2"><i id="progbar"></i></span><span class="st" id="syncst">Loading…</span></div>
<details class="sched" id="sched"><summary>Posting schedule</summary><div class="rules">
<div><b>Reels · Tue & Thu</b>7:30 PM IST. Same video on Instagram, Facebook Reels and YouTube Shorts.</div>
<div><b>Carousels · Mon</b>7:30 PM IST. Instagram and Facebook; upload as a PDF on LinkedIn.</div>
<div><b>Static · Sat</b>12:00 PM IST. One image people save. Greetings go on the day itself.</div>
<div><b>LinkedIn · Wed</b>10:00 AM IST. A short text post. Add the same as a Google Business update.</div>
<div><b>Stories · daily</b>Share every post to stories. Sundays get a poll, quiz or question box.</div>
<div><b>X · weekdays</b>9:00 AM IST. One short tip taken from that week's Reel or carousel.</div>
</div></details>
<div class="filters" id="filters"><button class="on" data-f="all">All</button><button data-f="reel">Reels</button><button data-f="carousel">Carousels</button><button data-f="static">Static</button><button data-f="li">LinkedIn</button><button data-f="story">Stories</button><button data-f="old">Already planned</button></div>
<section class="month" data-m="2026-12" data-name="December"><div class="mintro"><div class="eyebrow">Ready to post</div><h2>December 2026</h2><p>New Reels, single-image posts, carousels and stories for every week, plus the 10 posts per platform already in your guides. Tick each item when it's posted and paste the link; ticks sync to the AdKaizen Google Sheet.</p><div class="stats"><span>${counts.reel} Reels</span><span>${counts.static} static posts</span><span>${counts.carousel} new carousels</span><span>${counts.story} story sets</span><span>All images and Reels made</span></div></div>
<div class="grid">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<div class="wd">${d}</div>`).join('')}${grid}</div>
<h3 class="dd">Day by day</h3>
${list}</section>
<div id="dyn"></div>
<section class="month" data-m="overview" data-name="the whole plan"><div id="overview"></div></section>
<dialog id="adddlg"><form id="addform" method="dialog"><h3>Add content</h3><p class="dsub">Saved to the AdKaizen Google Sheet, so it shows on every device.</p>
<div class="frow"><label>Date<input name="date" type="date" required></label><label>Type<select name="fmt"><option value="reel">Reel</option><option value="carousel">Carousel</option><option value="static">Static post</option><option value="li">LinkedIn post</option><option value="story">Story</option><option value="other">Other</option></select></label></div>
<label>Title<input name="title" required maxlength="120" placeholder="e.g. Behind the scenes at a client shoot"></label>
<label>Hook or first line<input name="hook" maxlength="200" placeholder="The first line people will see"></label>
<label>Notes<textarea name="notes" rows="3" maxlength="1000" placeholder="Caption idea, what to film, links to files…"></textarea></label>
<div class="frow"><label>Time<input name="time" maxlength="40"></label><label>Platforms<input name="platform" maxlength="120"></label></div>
<div class="dact"><button type="button" id="addcancel" class="ghost">Cancel</button><button type="submit" class="primary">Add to calendar</button></div></form></dialog>
<div class="foot">No made-up results anywhere: every post is about how ads work and how AdKaizen works. Blur client names and numbers in any screen recording.</div>
</div>
<script>window.SYNC=${JSON.stringify(SYNC)};window.PLAN=${JSON.stringify(PLAN)};</script><script src="__APP__"></script></body></html>`;
fs.writeFileSync(K + 'AdKaizen-December-2026-calendar.html', html.replace('__APP__', 'content-calendar/app.js'));
fs.mkdirSync(K + 'content-calendar', { recursive: true });
fs.writeFileSync(K + 'content-calendar/index.html', html.replace('__APP__', 'app.js?v=' + Date.now().toString(36)));
fs.copyFileSync(K + 'content-plan-2027.json', K + 'content-calendar/content-plan-2027.json');
console.log(counts, Object.keys(old).length + ' days with planned posts');

// VECTOR Calendar · free slot — zero dependencies.
// <section class="fs" data-assets="assets/"></section> becomes the whole app: the week and "Find a time".
// The free windows are the gaps between your events and Dad's shared calendar on Thursday;
// a duration keeps only the gaps it fits in, and the one you pick becomes the event.
;(() => {
  'use strict';

  const svg = (d, o = {}) => `<svg width="${o.s || 18}" height="${o.s || 18}" viewBox="0 0 24 24" fill="none" stroke="${o.c || 'currentColor'}" stroke-width="${o.w || 1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const P = {
    today: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    find: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 14h6M12 17v-6"/>',
    people: '<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5M16 6.5a3 3 0 0 1 0 5.6M17.5 14.8c1.6.6 2.6 2 3 4.2"/>',
    places: '<path d="M12 21s-6-5.4-6-10.5a6 6 0 0 1 12 0C18 15.6 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
  };
  const NAV = [['today', 'Today'], ['calendar', 'Calendar'], ['find', 'Find a time'], ['people', 'People'], ['places', 'Places'], ['bell', 'Reminders']];
  const DAYS = ['Mon 23', 'Tue 24', 'Wed 25', 'Thu 26', 'Fri 27', 'Sat 28', 'Sun 29'];
  const THU = 3, DAY_START = 8 * 60, DAY_END = 17 * 60;

  // minutes since midnight → "12:30", "AM"/"PM", ranges and lengths the way the app writes them
  const hm = m => `${(Math.floor(m / 60) + 11) % 12 + 1}:${String(m % 60).padStart(2, '0')}`;
  const ap = m => (m < 720 ? 'AM' : 'PM');
  const range = (a, b) => (ap(a) === ap(b) ? `${hm(a)} – ${hm(b)} ${ap(b)}` : `${hm(a)} ${ap(a)} – ${hm(b)} ${ap(b)}`);
  const len = m => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60}` : ''}`);
  const t = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };

  // the week: [day, start, end, title, calendar]
  const WEEK = [
    [0, '8:00', '8:45', 'School run', 'family'], [0, '9:30', '10:00', 'Standup', 'work'], [0, '11:00', '12:00', 'Product sync', 'work'],
    [0, '12:30', '13:30', 'Yoga at Kaya', 'health'], [0, '14:00', '15:30', 'Roadmap review', 'work'], [0, '16:00', '16:30', 'Pick up Ava', 'family'],
    [1, '8:00', '8:45', 'School run', 'family'], [1, '9:00', '12:00', 'Service design workshop', 'work'], [1, '12:30', '13:30', 'Lunch with Lena', 'personal'],
    [1, '14:00', '14:30', '1:1 with Jonah', 'work'], [1, '15:00', '16:30', 'Hiring panel', 'work'],
    [2, '8:00', '8:45', 'School run', 'family'], [2, '9:30', '10:00', 'Standup', 'work'], [2, '10:00', '12:00', 'Focus: pricing page', 'work'],
    [2, '13:00', '14:00', 'Pediatrician', 'health'], [2, '15:30', '16:30', 'Ava’s swim class', 'family'],
    [3, '8:00', '8:45', 'School run', 'family'], [3, '9:15', '10:30', 'Design review', 'work'], [3, '11:15', '12:30', 'Dentist', 'health'],
    [3, '13:45', '15:00', 'Budget sync', 'work'], [3, '15:30', '16:30', 'Ava’s swim class', 'family'],
    [4, '8:00', '8:45', 'School run', 'family'], [4, '9:30', '10:00', 'Standup', 'work'], [4, '10:30', '12:00', 'Design crit', 'work'],
    [4, '13:00', '14:00', 'Car service', 'personal'], [4, '15:00', '16:00', 'Team demo', 'work'],
    [5, '9:00', '10:30', 'Farmers market', 'personal'], [5, '11:00', '13:00', 'Ava’s swim meet', 'family'], [5, '16:00', '17:30', 'Movie night', 'personal'],
    [6, '8:00', '9:30', 'Long run', 'health'], [6, '11:00', '12:30', 'Brunch at Lena’s', 'personal'], [6, '15:00', '16:00', 'Call Grandma', 'family'],
  ];
  // Thursday in "Find a time": your events with details, and Dad's shared calendar (only "Busy")
  const YOU = [
    ['8:00', '8:45', 'School run', 'family', 'Ava · Linden Primary'], ['9:15', '10:30', 'Design review', 'work', 'Room 4B'],
    ['11:15', '12:30', 'Dentist', 'health', 'Dr. Ilse Brandt'], ['13:45', '15:00', 'Budget sync', 'work', 'Video call'],
    ['15:30', '16:30', 'Ava’s swim class', 'family', 'Elm Street Aquatic Centre'],
  ];
  const DAD = [['8:00', '8:36'], ['9:24', '10:18'], ['11:18', '12:18'], ['13:54', '14:48'], ['15:36', '16:24']];
  // the other days are not opened here: only the lengths of their shared gaps, in minutes
  const GAPS = [[30, 45, 60], [30, 45], [45], null, [30, 60, 45], [30, 45, 60, 90, 30, 75], [30, 60, 45, 120]];
  const DURS = [15, 30, 45, 60, 90];
  const PLACES = [
    ['noodles', 'Kiri Noodle Bar', 'Ramen · 9 min from you, 6 from Dad', 'Ramen bowl on a wooden counter'],
    ['bakery', 'Halde Bakery', 'Café · 12 min from you, 4 from Dad', 'Bakery café with morning light'],
    ['terrace', 'Linde Terrace', 'Bistro · 7 min from you, 14 from Dad', 'Café terrace with small tables'],
  ];

  // free windows = the day minus both calendars, merged
  function freeWindows(busy, from, to) {
    const out = [];
    let at = from;
    for (const [a, b] of busy.slice().sort((x, y) => x[0] - y[0])) {
      if (a > at) out.push([at, a]);
      at = Math.max(at, b);
    }
    if (to > at) out.push([at, to]);
    return out;
  }
  const WINDOWS = freeWindows([...YOU, ...DAD].map(([a, b]) => [t(a), t(b)]), DAY_START, DAY_END);

  class SlotApp {
    constructor(root) {
      this.root = root;
      const A = root.dataset.assets || 'assets/';
      const img = (n, alt, css, cls = 'fs-ph') => `<img class="${cls}" src="${A}${n}.jpg" alt="${alt}"${css ? ` style="${css}"` : ''}>`;
      const av = (n, s, alt = '') => img(n, alt, `width:${s}px;height:${s}px`, 'fs-av');
      const ev = (top, h, title, cal, sub, x, w) => `<div class="fs-ev c-${cal}${sub ? '' : ' is-short'}" style="left:${x}px;top:${top}px;width:${w}px;height:${h}px"><b>${title}</b>${sub ? `<i>${sub}</i>` : ''}</div>`;
      const hours = (k, x) => Array.from({ length: 10 }, (_, i) => `<div class="fs-rule" style="left:${x}px;top:${i * k}px"></div><span class="fs-hour fs-num" style="top:${i * k - 7}px">${(i + 7) % 12 + 1} ${i < 4 ? 'AM' : 'PM'}</span>`).join('');
      const wk = m => (m - DAY_START) * 64 / 60;   // the week: 64 px an hour
      root.innerHTML = `
<nav class="fs-side" aria-label="Main">
  <div class="fs-logo"><svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="3" y="5" width="20" height="18" rx="4" fill="none" stroke="#EDEAE3" stroke-width="2"/><path d="M3 11h20" stroke="#EDEAE3" stroke-width="2"/><rect x="13" y="14" width="6" height="5" rx="1.5" fill="#F2795E"/></svg><b>VECTOR</b><span>Calendar</span></div>
  ${NAV.map(([k, l]) => `<a class="fs-nav" href="#" data-nav="${k}">${svg(P[k])}${l}${k === 'bell' ? '<span class="fs-count fs-num">3</span>' : ''}</a>`).join('')}
  <div class="fs-month">
    <div class="fs-month-h"><b>November 2026</b><span>‹ ›</span></div>
    <div class="fs-dow">${'MTWTFSS'.split('').map(d => `<span>${d}</span>`).join('')}</div>
    <div class="fs-dates fs-num">${'<span></span>'.repeat(6)}${Array.from({ length: 30 }, (_, i) => `<span class="${i + 1 === 25 ? 'is-today' : i + 1 >= 23 && i + 1 <= 29 ? 'is-week' : ''}">${i + 1}</span>`).join('')}</div>
  </div>
  <div class="fs-cals"><div class="fs-small" style="height:auto;margin-bottom:4px">My calendars</div>
    ${[['#7FA3D9', 'Work'], ['#D9B26A', 'Family'], ['#74C2A0', 'Health'], ['#D98FB0', 'Personal'], ['#9A9CA8', 'Dad · shared']].map(([c, l]) => `<div><i style="background:${c}"></i>${l}</div>`).join('')}
  </div>
  <div class="fs-me">${av('nadia', 34, 'Nadia Rehm')}<div><div style="font-size:13.5px;font-weight:600">Nadia Rehm</div><div style="font-size:12px;color:var(--fs-muted)">Family plan · 4 people</div></div></div>
</nav>
<div class="fs-col">
  <header class="fs-top">
    <label class="fs-search">${svg(P.search, { s: 16, w: 2 })}<span class="fs-sr">Search</span><input type="search" placeholder="Search events, people, places"></label>
    <div class="fs-top-r">
      <button class="fs-new" type="button">${svg(P.plus, { s: 16, w: 2 })}New event</button>
      <button class="fs-ib" type="button" aria-label="Reminders, 3">${svg(P.bell, { s: 19 })}<span class="fs-badge fs-num">3</span></button>
      ${av('nadia', 34, 'Nadia Rehm')}
    </div>
  </header>
  <div class="fs-views">

    <div class="fs-view fs-week" data-view="week">
      <div class="fs-bar">
        <h1 class="fs-h1">November 23 – 29</h1><span style="font-size:13.5px;color:var(--fs-muted)">31 events · 2 shared calendars</span>
        <div class="fs-bar-r"><button class="fs-btn" type="button">Today</button><div class="fs-segs"><span>Day</span><span class="is-on">Week</span><span>Month</span></div></div>
      </div>
      <div class="fs-week-body">
        <section class="fs-grid-wrap" aria-label="Week of November 23">
          <div class="fs-days">${DAYS.map((d, i) => `<div class="${i === 2 ? 'is-today' : ''}" style="left:${52 + i * 110}px">${d.slice(0, 3)} <b class="fs-num">${d.slice(4)}</b></div>`).join('')}</div>
          <div class="fs-grid">
            <div class="fs-today-col"></div>
            ${hours(64, 52)}
            ${WEEK.map(([d, a, b, title, cal]) => { const s = t(a), e = t(b); return ev(wk(s) + 1, wk(e) - wk(s) - 2, title, cal, e - s > 30 ? range(s, e) : '', 52 + d * 110, 106); }).join('')}
            ${ev(wk(750) + 1, wk(810) - wk(750) - 2, 'Lunch with Dad', 'lunch', range(750, 810), 52 + THU * 110, 106)}
            <div class="fs-now"></div>
          </div>
        </section>
        <aside class="fs-plans" aria-label="Plans">
          <section class="fs-card fs-draft">
            <div class="fs-draft-h"><b>Draft · not on the calendar yet</b><span>today 9:12 AM</span></div>
            <div class="fs-who"><span class="fs-pair">${av('nadia', 34)}${av('dad', 34)}</span><div><div style="font-size:16px;font-weight:600">Lunch with Dad</div><div class="fs-small" style="margin-top:2px">Omar Rehm · shares his calendar</div></div></div>
            <div class="fs-tags"><span class="fs-num">30 min</span><span>This week</span><span>Near the office</span></div>
            <button class="fs-find" type="button" data-find>${svg(P.find)}Find a time</button>
          </section>
          <section class="fs-card fs-box">
            <div class="fs-box-h"><h2 class="fs-h2">Up next</h2><span class="fs-small fs-num">in 3 h 50 min</span></div>
            ${img('pool', 'Indoor swimming pool lanes', 'width:100%;height:112px;border-radius:10px')}
            <div><div style="font-size:14px;font-weight:600">Ava’s swim class</div><div class="fs-small fs-num" style="margin-top:2px">3:30 – 4:30 PM · Elm St Aquatic Centre, lane 4</div></div>
            <div class="fs-leave">Leave by 3:05 PM · 18 min drive</div>
          </section>
          <section class="fs-card fs-box" style="gap:12px">
            <div class="fs-box-h"><h2 class="fs-h2">This weekend</h2><a class="fs-link" href="#">Plan more</a></div>
            <div class="fs-plan">${img('market', 'Farmers market stall', 'width:56px;height:56px;border-radius:9px')}<div style="flex:1;min-width:0"><div style="font-size:13.5px;font-weight:600">Farmers market</div><div class="fs-small fs-num" style="font-size:12px;margin-top:2px">Sat 9:00 AM · with Lena</div></div>${av('lena', 28, 'Lena')}</div>
            <div class="fs-plan">${img('trail', 'Running trail by the river', 'width:56px;height:56px;border-radius:9px')}<div style="flex:1;min-width:0"><div style="font-size:13.5px;font-weight:600">Long run, river trail</div><div class="fs-small fs-num" style="font-size:12px;margin-top:2px">Sun 8:00 AM · 12 km</div></div><span class="fs-num" style="font-size:12px;color:#8FD3B4">6 °C</span></div>
          </section>
        </aside>
      </div>
    </div>

    <div class="fs-view fs-findv" data-view="find">
      <div class="fs-bar">
        <div><div class="fs-crumbs">Calendar / New event</div><h1 class="fs-h1">Lunch with Dad</h1><div class="fs-sub fs-num" data-sub></div></div>
        <div class="fs-bar-r"><button class="fs-btn" type="button" style="height:36px" data-back>Back to week</button><button class="fs-btn" type="button" style="height:36px">Event details</button></div>
      </div>
      <div class="fs-strip">${DAYS.map((d, i) => `<div class="fs-day${i === THU ? ' is-on' : ''}" data-day="${i}"><div class="fs-day-h"><span class="fs-num">${d}${i === 2 ? ' <small>today</small>' : ''}</span><span class="fs-dots">${'<i></i>'.repeat(6)}</span></div><span class="fs-day-n fs-num"></span></div>`).join('')}</div>
      <div class="fs-find-body">
        <section class="fs-thu" aria-label="Thursday, November 26">
          <div class="fs-dur"><span>Duration</span><div class="fs-durs" role="radiogroup" aria-label="Duration">${DURS.map(m => `<button class="fs-num" type="button" role="radio" data-dur="${m}">${len(m)}</button>`).join('')}</div></div>
          <div class="fs-lanes-h"><div style="left:56px">${av('nadia', 24)}You<span class="fs-num">${YOU.length} events</span></div><div style="left:396px">${av('dad', 24)}Dad<span>shared</span></div></div>
          <div class="fs-lanes">
            ${hours(60, 56)}
            ${YOU.map(([a, b, title, cal, sub]) => ev(t(a) - DAY_START + 1, t(b) - t(a) - 2, title, cal, `${range(t(a), t(b))} · ${sub}`, 56, 330)).join('')}
            ${DAD.map(([a, b]) => `<div class="fs-ev fs-busy" style="left:396px;top:${t(a) - DAY_START + 1}px;width:200px;height:${t(b) - t(a) - 2}px"><b>Busy</b></div>`).join('')}
            ${WINDOWS.map(([a, b], i) => `<button class="fs-win fs-num" type="button" data-win="${i}" style="top:${a - DAY_START + 1}px;height:${b - a - 2}px">
              <span class="fs-win-free"><b>${range(a, b)}</b><span>${len(b - a)}</span></span>
              <span class="fs-win-block"><span class="fs-fit"><b></b><span></span></span><span class="fs-lunch"><span><b>Lunch with Dad</b><i></i></span><span class="fs-pair">${av('nadia', 28)}${av('dad', 28)}</span></span></span>
              <span class="fs-spare"></span></button>`).join('')}
          </div>
        </section>
        <div class="fs-right">
          <section class="fs-card fs-free">
            <div class="fs-box-h"><h2 class="fs-h2">Free on Thu, Nov 26</h2><span class="fs-small fs-num" data-free-n></span></div>
            ${WINDOWS.map((w, i) => `<div class="fs-row" data-row="${i}"><span class="fs-row-t fs-num"></span><span class="fs-row-s fs-num"></span><button class="fs-pick" type="button" data-pick="${i}">Pick</button><span class="fs-done">${svg(P.check, { s: 14, w: 3, c: '#1A0B07' })}</span></div>`).join('')}
          </section>
          <section class="fs-card fs-places">
            <div class="fs-box-h"><h2 class="fs-h2">Lunch near both of you</h2><a class="fs-link" href="#">Map</a></div>
            <div class="fs-place-list">${PLACES.map(([n, name, m, alt], i) => `<button class="fs-place" type="button" aria-pressed="false" data-place="${i}"><span>${img(n, alt)}<span class="fs-tick">${svg(P.check, { s: 12, w: 3, c: '#1A0B07' })}</span></span><b>${name}</b><small class="fs-num">${m}</small></button>`).join('')}</div>
          </section>
          <section class="fs-card fs-foot">
            <div><b class="fs-num" data-foot-t></b><small class="fs-num" data-foot-s></small></div>
            <button class="fs-add fs-num" type="button" data-add>${svg(P.check, { s: 16, w: 3, c: '#F2795E' })}<span></span></button>
          </section>
        </div>
      </div>
    </div>
  </div>
</div>`;
      const $ = s => root.querySelector(s), $$ = s => [...root.querySelectorAll(s)];
      this.el = {
        views: $$('.fs-view'), navs: $$('.fs-nav'), durs: $$('[data-dur]'), wins: $$('[data-win]'), rows: $$('[data-row]'),
        days: $$('[data-day]'), places: $$('[data-place]'), sub: $('[data-sub]'), freeN: $('[data-free-n]'),
        footT: $('[data-foot-t]'), footS: $('[data-foot-s]'), add: $('[data-add]'), weekLunch: $('.fs-ev.c-lunch'),
      };
      $('[data-find]').addEventListener('click', () => this.go('find'));
      $('[data-back]').addEventListener('click', () => this.go('week'));
      this.el.navs.forEach(n => n.addEventListener('click', e => {
        e.preventDefault();
        if (n.dataset.nav === 'calendar' || n.dataset.nav === 'find') this.go(n.dataset.nav === 'find' ? 'find' : 'week');
      }));
      this.el.durs.forEach(b => { b.addEventListener('click', () => this.setDuration(+b.dataset.dur)); b.addEventListener('keydown', e => this.durKey(e)); });
      this.el.wins.forEach(w => w.addEventListener('click', () => this.pick(+w.dataset.win)));
      $$('[data-pick]').forEach(b => b.addEventListener('click', () => this.pick(+b.dataset.pick)));
      this.el.places.forEach(b => b.addEventListener('click', () => { if (!this.added) { this.place = +b.dataset.place; this.paint(); } }));
      this.el.add.addEventListener('click', () => this.add());
      this.reset();
    }

    quietly(fn) {
      this.root.classList.add('is-instant');
      fn();
      requestAnimationFrame(() => requestAnimationFrame(() => this.root.classList.remove('is-instant')));
    }

    go(view) {
      this.root.dataset.view = view;
      this.el.views.forEach(v => v.classList.toggle('is-on', v.dataset.view === view));
      this.el.navs.forEach(n => n.classList.toggle('is-on', n.dataset.nav === (view === 'find' ? 'find' : 'calendar')));
    }

    // a duration keeps the windows it fits in; when only one is left, it is picked for you
    setDuration(min) {
      if (this.added || !DURS.includes(min)) return;
      this.dur = min;
      const fits = WINDOWS.map(([a, b], i) => (b - a >= min ? i : -1)).filter(i => i >= 0);
      this.picked = fits.length === 1 ? fits[0] : null;
      this.paint();
    }

    pick(i) {
      const w = WINDOWS[i];
      if (this.added || !w || w[1] - w[0] < this.dur) return;
      this.picked = i;
      this.paint();
    }

    // the picked hour goes on Thursday: the window becomes "Lunch with Dad", Dad gets the invite
    add() {
      if (this.added || this.picked === null) return;
      this.added = true;
      this.paint();
    }

    paint() {
      const { dur, picked, added } = this, E = this.el, place = PLACES[this.place][1];
      const fits = WINDOWS.filter(([a, b]) => b - a >= dur).length;
      const start = picked === null ? 0 : WINDOWS[picked][0], end = start + dur;
      this.root.dataset.added = added;
      E.durs.forEach(b => { b.setAttribute('aria-checked', +b.dataset.dur === dur); b.tabIndex = +b.dataset.dur === dur ? 0 : -1; });
      E.places.forEach((b, i) => b.setAttribute('aria-pressed', i === this.place));
      E.sub.textContent = added ? `Thu, Nov 26 · ${range(start, end)} · ${place}` : 'You and Omar Rehm (Dad) · both calendars checked · weekdays 8 AM – 5 PM';

      // the week strip: how many shared gaps each day has for this duration
      E.days.forEach((d, i) => {
        const gaps = i === THU ? WINDOWS.map(([a, b]) => b - a) : GAPS[i];
        const n = gaps.filter(g => g >= dur).length, booked = added && i === THU;
        d.querySelectorAll('i').forEach((dot, k) => {
          dot.classList.toggle('is-gone', k >= Math.max(1, booked ? 1 : n));
          dot.classList.toggle('is-dim', n === 0 || booked);
        });
        const label = d.querySelector('.fs-day-n');
        label.textContent = booked ? `Lunch ${hm(start)} ${ap(start)}`
          : dur <= 30 ? `${n} free time${n === 1 ? '' : 's'}`
          : n ? `${n} fit${n === 1 ? 's' : ''} ${len(dur)}` : `no ${len(dur)} gap`;
        label.className = `fs-day-n fs-num${booked ? ' is-booked' : n ? '' : ' is-none'}`;
      });

      // the windows on Thursday and the same windows in the list, short ones go out one after another
      let k = 0;
      WINDOWS.forEach(([a, b], i) => {
        const short = b - a < dur, on = i === picked, w = E.wins[i], r = E.rows[i];
        const delay = short ? `${k++ * 70}ms` : '0ms';
        [w, r].forEach(x => { x.classList.toggle('is-short', short); x.classList.toggle('is-picked', on); x.style.setProperty('--d', delay); });
        w.disabled = short || added;
        w.querySelector('.fs-win-free span').textContent = `${len(b - a)} · ${short ? 'too short' : 'both free'}`;
        if (on) {
          w.classList.toggle('is-tight', dur < 45);
          w.querySelector('.fs-win-block').style.height = `${dur - 2}px`;
          w.querySelector('.fs-fit b').textContent = range(a, a + dur);
          w.querySelector('.fs-fit span').textContent = `Fits ${len(dur)} · both free`;
          w.querySelector('.fs-lunch i').textContent = `${range(a, a + dur)} · ${place}`;
          w.querySelector('.fs-spare').textContent = b - a - dur >= 15 ? `${len(b - a - dur)} to spare` : '';
        }
        r.querySelector('.fs-row-t').textContent = on && added ? range(a, a + dur) : range(a, b);
        r.querySelector('.fs-row-s').textContent = on ? (added ? 'Lunch with Dad · added' : `Fits ${len(dur)} · ${range(a, a + dur)}`)
          : `${len(b - a)} · ${short ? `too short for ${len(dur)}` : 'both free'}`;
      });
      E.freeN.textContent = added ? `${len(dur)} booked` : fits === WINDOWS.length ? `${fits} times for ${len(dur)}` : `${fits} of ${WINDOWS.length} fit${fits === 1 ? 's' : ''} ${len(dur)}`;

      // the footer button: waits for a pick → "Add 12:30 – 1:30 PM" → "Added to Thursday"
      E.footT.textContent = added ? `Lunch with Dad · Thu ${hm(start)} ${ap(start)}` : `Lunch with Dad · ${len(dur)}`;
      E.footS.textContent = added ? 'Invite sent to Omar Rehm · table for 2 held'
        : picked === null ? (fits ? 'Pick a free time to send the invite' : `No ${len(dur)} gap on Thursday`) : `Thu, Nov 26 · ${place}`;
      E.add.querySelector('span').textContent = added ? 'Added to Thursday' : picked === null ? 'Add to calendar' : `Add ${range(start, end)}`;
      E.add.disabled = added || picked === null;
      E.add.classList.toggle('is-ready', !added && picked !== null);
      E.add.classList.toggle('is-done', added);
      // the same lunch on the week grid (64 px an hour)
      Object.assign(E.weekLunch.style, { top: `${(start - DAY_START) * 64 / 60 + 1}px`, height: `${dur * 64 / 60 - 2}px` });
      E.weekLunch.querySelector('i').textContent = range(start, end);
    }

    reset() {
      this.quietly(() => {
        Object.assign(this, { dur: 30, picked: null, added: false, place: 0 });
        this.paint();
        this.go('week');
      });
    }

    // the duration group is one radio group: arrows move the choice, Tab leaves the group
    durKey(e) {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!step || this.added) return;
      e.preventDefault();
      const i = (DURS.indexOf(this.dur) + step + DURS.length) % DURS.length;
      this.setDuration(DURS[i]);
      this.el.durs[i].focus();
    }
  }

  document.querySelectorAll('.fs').forEach(el => { el.slotApp = new SlotApp(el); });
})();

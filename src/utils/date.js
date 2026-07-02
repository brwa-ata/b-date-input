export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const DOW = ['S','M','T','W','T','F','S'];

export const pad2 = (n) => String(n).padStart(2, '0');
export const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
export const sameDay = (a, b) => !!(a && b) && ymd(a) === ymd(b);
export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const startOfWeek = (d) => { const x = startOfDay(d); x.setDate(x.getDate() - x.getDay()); return x; };
export const endOfWeek = (d) => { const x = startOfWeek(d); x.setDate(x.getDate() + 6); return x; };
export const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
export const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth()+1, 0);
export const startOfYear = (d) => new Date(d.getFullYear(), 0, 1);
export const endOfYear = (d) => new Date(d.getFullYear(), 11, 31);
export const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth()+n, 1);
export const addYears = (d, n) => new Date(d.getFullYear()+n, d.getMonth(), d.getDate());
export const addDays = (d, n) => { const x = startOfDay(d); x.setDate(x.getDate()+n); return x; };

export function fmtDisplay(d, fmt = 'mm/dd/yyyy') {
  if (!d) return '';
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  const y = d.getFullYear();
  if (fmt === 'dd/mm/yyyy') return `${day}/${m}/${y}`;
  return `${m}/${day}/${y}`;
}

export function parseDisplay(s, fmt = 'mm/dd/yyyy') {
  if (!s) return null;
  const m = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
  if (!m) return null;
  let a = +m[1], b = +m[2], y = +m[3];
  if (y < 100) y += 2000;
  const [mo, day] = fmt === 'dd/mm/yyyy' ? [b, a] : [a, b];
  if (mo < 1 || mo > 12 || day < 1 || day > 31) return null;
  const d = new Date(y, mo - 1, day);
  if (d.getMonth() !== mo - 1) return null;
  return d;
}

export function buildMonthGrid(viewDate) {
  const first = startOfMonth(viewDate);
  const gridStart = startOfWeek(first);
  const cells = [];
  for (let i = 0; i < 42; i++) cells.push(addDays(gridStart, i));
  return cells;
}

export function buildShortcuts(mode) {
  const today = startOfDay(new Date());
  if (mode === 'range') {
    const yest = addDays(today, -1);
    const lastYear = addYears(today, -1);
    return [
      { id: 'today', label: 'Today', range: [today, today] },
      { id: 'yesterday', label: 'Yesterday', range: [yest, yest] },
      { id: 'last7', label: 'Last 7 days', range: [addDays(today, -6), today] },
      { id: 'thismonth', label: 'This month', range: [startOfMonth(today), endOfMonth(today)] },
      { id: 'lastmonth', label: 'Last month', range: [startOfMonth(addMonths(today, -1)), endOfMonth(addMonths(today, -1))] },
      { id: 'thisyear', label: 'This year', range: [startOfYear(today), endOfYear(today)] },
      { id: 'lastyear', label: 'Last year', range: [startOfYear(lastYear), endOfYear(lastYear)] },
    ];
  }
  return [
    { id: 'today', label: 'Today', date: today },
    { id: 'yesterday', label: 'Yesterday', date: addDays(today, -1) },
  ];
}

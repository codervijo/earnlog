export const PLATFORMS = [
  "Uber",
  "Lyft",
  "DoorDash",
  "Uber Eats",
  "Instacart",
  "Spark",
  "Amazon Flex",
  "Other",
] as const;
export type Platform = (typeof PLATFORMS)[number];

export const CA_MIN_WAGE = 16;

export interface Session {
  id: string;
  date: string;
  platform: Platform;
  grossPay: number;
  onlineHours: number;
  activeHours?: number;
  miles: number;
  gasPrice: number;
  mpg: number;
  otherCosts?: number;
}

export interface Settings {
  costPerMile: number;
  gasPrice: number;
  mpg: number;
}

export const DEFAULT_SETTINGS: Settings = {
  costPerMile: 0.25,
  gasPrice: 5.0,
  mpg: 28,
};

export interface Computed {
  fuelCost: number;
  vehicleCost: number;
  otherCosts: number;
  totalCosts: number;
  netProfit: number;
  grossHourly: number;
  realHourly: number;
  costPerMileActual: number;
}

export function compute(s: Session, costPerMile: number): Computed {
  const fuelCost = s.mpg > 0 ? (s.miles / s.mpg) * s.gasPrice : 0;
  const vehicleCost = s.miles * costPerMile;
  const otherCosts = s.otherCosts ?? 0;
  const totalCosts = fuelCost + vehicleCost + otherCosts;
  const netProfit = s.grossPay - totalCosts;
  const grossHourly = s.onlineHours > 0 ? s.grossPay / s.onlineHours : 0;
  const realHourly = s.onlineHours > 0 ? netProfit / s.onlineHours : 0;
  const costPerMileActual = s.miles > 0 ? totalCosts / s.miles : 0;
  return {
    fuelCost,
    vehicleCost,
    otherCosts,
    totalCosts,
    netProfit,
    grossHourly,
    realHourly,
    costPerMileActual,
  };
}

export const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
export const fmtHr = (n: number) => `$${n.toFixed(2)}/hr`;
export const fmtNum = (n: number, d = 0) =>
  n.toLocaleString("en-US", { maximumFractionDigits: d });

const SESSIONS_KEY = "driverstack:sessions";
const SETTINGS_KEY = "driverstack:settings";

export function loadSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return sampleSessions();
}

export function saveSessions(s: Session[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(s));
}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveSettings(s: Settings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function sampleSessions(): Session[] {
  return [
    { id: uid(), date: daysAgo(0), platform: "Uber", grossPay: 182, onlineHours: 8.67, activeHours: 6.2, miles: 143, gasPrice: 5, mpg: 28 },
    { id: uid(), date: daysAgo(1), platform: "DoorDash", grossPay: 156, onlineHours: 7.5, miles: 98, gasPrice: 5, mpg: 28 },
    { id: uid(), date: daysAgo(2), platform: "Instacart", grossPay: 210, onlineHours: 8.0, miles: 110, gasPrice: 5, mpg: 28 },
    { id: uid(), date: daysAgo(3), platform: "Uber Eats", grossPay: 98, onlineHours: 6.5, miles: 87, gasPrice: 5, mpg: 28 },
    { id: uid(), date: daysAgo(4), platform: "Lyft", grossPay: 142, onlineHours: 7.25, miles: 128, gasPrice: 5, mpg: 28 },
    { id: uid(), date: daysAgo(5), platform: "Uber", grossPay: 168, onlineHours: 8.0, miles: 134, gasPrice: 5, mpg: 28 },
    { id: uid(), date: daysAgo(6), platform: "DoorDash", grossPay: 124, onlineHours: 6.0, miles: 76, gasPrice: 5, mpg: 28 },
  ];
}

export function withinDays(dateStr: string, days: number) {
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 86400000;
  return diff <= days && diff >= -1;
}

export function isToday(dateStr: string) {
  return dateStr === new Date().toISOString().slice(0, 10);
}

export interface Aggregate {
  grossPay: number;
  totalCosts: number;
  netProfit: number;
  hours: number;
  miles: number;
  grossHourly: number;
  realHourly: number;
}

export function aggregate(sessions: Session[], costPerMile: number): Aggregate {
  let grossPay = 0, totalCosts = 0, netProfit = 0, hours = 0, miles = 0;
  for (const s of sessions) {
    const c = compute(s, costPerMile);
    grossPay += s.grossPay;
    totalCosts += c.totalCosts;
    netProfit += c.netProfit;
    hours += s.onlineHours;
    miles += s.miles;
  }
  return {
    grossPay,
    totalCosts,
    netProfit,
    hours,
    miles,
    grossHourly: hours > 0 ? grossPay / hours : 0,
    realHourly: hours > 0 ? netProfit / hours : 0,
  };
}

export function byPlatform(sessions: Session[], costPerMile: number) {
  const map = new Map<Platform, Session[]>();
  for (const s of sessions) {
    if (!map.has(s.platform)) map.set(s.platform, []);
    map.get(s.platform)!.push(s);
  }
  return Array.from(map.entries())
    .map(([platform, list]) => ({ platform, ...aggregate(list, costPerMile) }))
    .sort((a, b) => b.realHourly - a.realHourly);
}

export const RELATIONSHIP = {
  startDate: new Date("2026-02-24T00:00:00"),
  herName: "Angel",
  hisName: "Kyle",
  ourNames: "Kyle & Angel",
};

export function getRelationshipDuration() {
  const now = new Date();
  const start = RELATIONSHIP.startDate;
  const diff = now.getTime() - start.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days % 30;
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  return { years, months, days: remainingDays, hours: remainingHours, minutes: remainingMinutes, seconds: remainingSeconds, totalDays: days };
}

export function getNextMonthsary() {
  const now = new Date();
  const start = RELATIONSHIP.startDate;
  let next = new Date(start);

  while (next <= now) {
    next.setMonth(next.getMonth() + 1);
  }

  return next;
}

export function getNextAnniversary() {
  const now = new Date();
  const start = RELATIONSHIP.startDate;
  let next = new Date(start);

  while (next <= now) {
    next.setFullYear(next.getFullYear() + 1);
  }

  return next;
}

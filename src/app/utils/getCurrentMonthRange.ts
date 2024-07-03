export default function getLast30DaysRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);

  return { start, end };
}

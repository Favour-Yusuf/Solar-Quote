export function getGreeting(date: Date, firstName: string) {
  const hour = date.getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  return `Good ${timeOfDay}, ${firstName}`;
}

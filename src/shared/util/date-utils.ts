export function checkIfDateIsValid(date: string) {
  return date && Number.isNaN(Date.parse(date));
}

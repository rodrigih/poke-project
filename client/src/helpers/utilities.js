export function capitalize(str) {
  if (str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }

  return str;
}

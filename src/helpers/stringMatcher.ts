export function matchStringWithRegex(str: string, regex: RegExp): string | null {
  const matches = str.match(regex);
  if (!matches || matches.length < 2) {
    return null;
  }
  return matches[1];
}

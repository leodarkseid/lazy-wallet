export function extractNameFromPath(path: string): string {
  if (!path) {
    throw new Error('invalid path string');
  }
  const parts = path.split("/");
  return parts[parts.length - 1].split(".")[0];
}

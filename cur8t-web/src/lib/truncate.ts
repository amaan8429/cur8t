export function truncateUrl(url: string, maxLength: number = 30): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength - 3) + '...';
}

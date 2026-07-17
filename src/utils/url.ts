/**
 * Compact display form of a URL: strips protocol, `www.` and trailing
 * slashes — e.g. "https://github.com/Cruellest/" → "github.com/Cruellest".
 */
export function displayUrl(url: string): string {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    const path = parsed.pathname.replace(/\/+$/, '')
    return path && path !== '/' ? `${host}${path}` : host
  } catch {
    return url
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/[?#].*$/, '')
      .replace(/\/+$/, '')
  }
}

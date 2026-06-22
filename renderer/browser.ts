/**
 * Shared Puppeteer launch helpers.
 *
 * Expected pattern for every `puppeteer.launch()` in this repo: spread
 * `sandboxArgs()` into the args array rather than hardcoding `--no-sandbox`.
 */

/**
 * Chromium's setuid sandbox refuses to run as root and is unavailable in most
 * CI/Docker images, so `--no-sandbox` is required there. On normal local dev it
 * is unnecessary and strips the renderer process sandbox — the last containment
 * layer after any renderer exploit. Gate it behind a runtime check so the flag
 * is only passed where Chromium actually needs it. See #36.
 */
export function sandboxArgs(): string[] {
  const needsNoSandbox = process.getuid?.() === 0 || process.env.CI_DOCKER === '1'
  return needsNoSandbox ? ['--no-sandbox'] : []
}

/**
 * Tells IndexNow search engines (Bing, Yandex, Seznam, Naver…) that the
 * site changed, so they recrawl in hours instead of weeks. Google does not
 * take part; it reads the sitemap from Search Console instead.
 *
 * Reads the *live* sitemap rather than the build output, so it only ever
 * submits URLs that are actually being served. Run after a deploy:
 *
 *   bun scripts/indexnow.ts
 */
import { CANONICAL_URL, INDEXNOW_KEY } from '../site.config.ts'

const host = new URL(CANONICAL_URL).host
const keyLocation = `${CANONICAL_URL}/${INDEXNOW_KEY}.txt`

// Pages can take a minute to serve a fresh deploy.
async function fetchWithRetry(url: string, attempts = 10): Promise<Response> {
  for (let i = 1; ; i++) {
    const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } })
    if (res.ok || i === attempts) return res
    await new Promise((r) => setTimeout(r, 15_000))
  }
}

const key = await fetchWithRetry(keyLocation)
if (!key.ok || (await key.text()).trim() !== INDEXNOW_KEY) {
  console.error(`key file not served at ${keyLocation} (${key.status}) — not submitting`)
  process.exit(1)
}

const sitemap = await (await fetchWithRetry(`${CANONICAL_URL}/sitemap.xml`)).text()
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (!urlList.length) {
  console.error('sitemap has no <loc> entries — not submitting')
  process.exit(1)
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation, urlList }),
})
console.log(`indexnow: ${res.status} ${res.statusText} for ${urlList.length} urls`)
// 200 and 202 both mean accepted; anything else is worth seeing in CI
if (res.status !== 200 && res.status !== 202) process.exit(1)

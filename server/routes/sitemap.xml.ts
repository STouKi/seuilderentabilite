/** Plan du site, généré au build (page pré-rendue) avec l'URL publique du site. */
export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const lastModified = new Date().toISOString().slice(0, 10)

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastModified}</lastmod>
  </url>
</urlset>
`
})

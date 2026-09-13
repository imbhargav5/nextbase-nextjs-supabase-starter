/** @type {import('next-sitemap').IConfig} */
function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    'https://promptmarket.sh';

  return siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
}

module.exports = {
  siteUrl: getSiteUrl(),
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  exclude: [
    '/dashboard',
    '/dashboard/*',
    '/private-item',
    '/private-items',
    '/auth/*',
    '/api/*',
  ],
  changefreq: 'weekly',
  priority: 0.7,
};

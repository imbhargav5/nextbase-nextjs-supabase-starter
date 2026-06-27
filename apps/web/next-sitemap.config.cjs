/** @type {import('next-sitemap').IConfig} */
function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    'https://my-awesome-saas.com';

  return siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
}

module.exports = {
  siteUrl: getSiteUrl(),
  generateRobotsTxt: true,
};

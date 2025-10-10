import { MetadataRoute } from 'next'

const baseUrl = 'https://sport-hub.pro.vn' // Thay bằng domain thật khi deploy

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
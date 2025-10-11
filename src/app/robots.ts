import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: 'https://sport-hub.pro.vn/sitemap.xml',
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    
  }
}

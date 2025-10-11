import { MetadataRoute } from 'next'
import { getAllFieldServer } from '../services/fieldService';
import { ServerField } from '../types/field';

const baseUrl = 'https://sport-hub.pro.vn'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: new URL('/about', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: new URL('/fields', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: new URL('/booking', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: new URL('/dashboard', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: new URL('/profile', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: new URL('/rewards', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: new URL('/teams', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: new URL('/matches', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: new URL('/matches/discover', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: new URL('/matches/create', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: new URL('/matches/my-matches', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: new URL('/login', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: new URL('/register', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: new URL('/forgot-password', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: new URL('/reset-password', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: new URL('/verify-otp', baseUrl).href,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch dynamic field pages
  let fieldPages: MetadataRoute.Sitemap = [];
  
  try {
    const { data: fields } = await getAllFieldServer();
    
    fieldPages = fields.map((field: ServerField) => ({
      url: new URL(`/field-detail/${field.id}`, baseUrl).href,
      lastModified: new Date(field.createdDate),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching fields for sitemap:', error);
    // Fallback to example field if fetching fails
    fieldPages = [
      {
        url: new URL('/field-detail/example-field-id', baseUrl).href,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }
    ];
  }

  return [...staticPages, ...fieldPages];
}
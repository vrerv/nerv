import { MetadataRoute } from 'next'
import { AppConfig } from "@/utils/AppConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: AppConfig.site_name,
    short_name: AppConfig.site_name + ' App',
    description: AppConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#5c3d6b',
    icons: [
      {
        "src": "/assets/pwa/vrerv-logo-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/assets/pwa/vrerv-logo-256x256.png",
        "sizes": "256x256",
        "type": "image/png"
      },
      {
        "src": "/assets/pwa/vrerv-logo-384x384.png",
        "sizes": "384x384",
        "type": "image/png"
      },
      {
        "src": "/assets/pwa/vrerv-logo-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ],
  }
}
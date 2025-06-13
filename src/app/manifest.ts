import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Walkfitness',
    short_name: 'Walkfit',
    description: 'Walk to earn! Walkfitness is a web app that rewards you for walking. Track your steps, earn points, and redeem them for rewards.',
    start_url: '/logo',
    display: 'standalone',
    background_color: '#6a1b9a',
    theme_color: '#000000',
    icons: [
      {
        src: '/walkfit-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/walkfit-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
// scripts/populate-carousel.ts

import * as dotenv from 'dotenv'
dotenv.config({ path: './.env.local' })

import { insertCarouselImages } from '../hooks/image-storage'

const BUCKET_NAME = 'Images'

const galleries = [
  {
    name: 'Zak_Art_Photos',
    images: [
      // Update paths to include full bucket path if needed
      { path: 'Zak_Art_Photos/Church.webp', caption: 'Church Bells', order: 1, signedURL: true },
      { path: 'Zak_Art_Photos/CleanMean.webp', caption: 'SUNRAIN', order: 2, signedURL: true  },
      { path: 'Zak_Art_Photos/OneSongConvert.webp', caption: 'One Song', order: 3, signedURL: true  },
      { path: 'Zak_Art_Photos/onlyfriends.webp', caption: 'Only Friends', order: 4, signedURL: true  },
      { path: 'Zak_Art_Photos/Utopia.webp', caption: 'Utopia', order: 5, signedURL: true  },
      { path: 'Zak_Art_Photos/Roo.webp', caption: 'Australia', order: 6, signedURL: true  },
      { path: 'Zak_Art_Photos/Parrot.webp', caption: 'Costa Rica', order: 7, signedURL: true  },
      { path: 'Zak_Art_Photos/Horse.webp', caption: 'Казахстан', order: 8, signedURL: true  },
      { path: 'Zak_Art_Photos/KZ.webp', caption: 'Казахстан Два', order: 9, signedURL: true  },
      { path: 'Zak_Art_Photos/Norge.webp', caption: 'Norge', order: 10, signedURL: true  },
    ]
  },
]

async function populateCarousels() {
  for (const gallery of galleries) {
    await insertCarouselImages(
      BUCKET_NAME,
      gallery.name,
      gallery.images
    )
  }
}

populateCarousels()
  .then(() => console.log('Carousels populated'))
  .catch(console.error)
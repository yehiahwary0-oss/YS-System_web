export interface MediaConfig {
  maxFileSize: number
  allowedMimes: string[]
  generateThumbnails: boolean
  thumbnailSizes: Array<{ name: string; width: number; height: number }>
}

export interface MediaStats {
  totalFiles: number
  totalSize: number
  folders: number
  collections: number
}

const ADAPTER_ID = 'media'

export function getMediaAdapterId(): string {
  return ADAPTER_ID
}

export function getDefaultMediaConfig(): MediaConfig {
  return {
    maxFileSize: 10 * 1024 * 1024,
    allowedMimes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    generateThumbnails: true,
    thumbnailSizes: [
      { name: 'thumb', width: 150, height: 150 },
      { name: 'small', width: 300, height: 300 },
    ],
  }
}

/*
  TODO — Backend API contract:
  GET    /api/v1/admin/media            → { success: true, data: MediaItem[], meta: { stats: MediaStats, config: MediaConfig } }
  POST   /api/v1/admin/media/upload     → { success: true, data: MediaItem }
  DELETE /api/v1/admin/media/{id}       → { success: true }
  GET    /api/v1/admin/media/folders    → { success: true, data: MediaFolder[] }
  POST   /api/v1/admin/media/folders    → { success: true, data: MediaFolder }
  GET    /api/v1/admin/media/collections → { success: true, data: MediaCollection[] }
  POST   /api/v1/admin/media/collections → { success: true, data: MediaCollection }

  Backend needs:
  - Media model/migration (media_items, media_folders, media_collections tables)
  - MediaController
  - File upload handling
  - Thumbnail generation
  - Route: admin route
  - Permission: manage_media (to be created)
*/

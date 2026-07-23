'use client'

import { usePlatform } from '../PlatformProvider'

export function useStorage(disk?: string): {
  upload: (path: string, content: Buffer | string, visibility?: 'public' | 'private') => Promise<string>
  download: (path: string) => Promise<Buffer>
  delete: (path: string) => Promise<void>
  move: (from: string, to: string) => Promise<void>
  copy: (from: string, to: string) => Promise<void>
  exists: (path: string) => Promise<boolean>
  temporaryUrl: (path: string, expiresInSeconds?: number) => Promise<string>
} {
  const { kernel, loaded } = usePlatform()
  const storage = loaded && kernel ? kernel.resolve<any>('storageManager') : null

  const d = disk ? storage?.disk(disk) : storage

  return {
    upload: async (path, content, visibility) => d?.upload(path, content, visibility) ?? '',
    download: async (path) => d?.download(path) ?? Buffer.from(''),
    delete: async (path) => d?.delete(path),
    move: async (from, to) => d?.move(from, to),
    copy: async (from, to) => d?.copy(from, to),
    exists: async (path) => d?.exists(path) ?? false,
    temporaryUrl: async (path, expiresInSeconds) => d?.temporaryUrl(path, expiresInSeconds) ?? '',
  }
}

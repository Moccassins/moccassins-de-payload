import { Media } from './payload-types'

export function isMedia(obj: any): obj is Media {
  const formats = ['left', 'start', 'center', 'right', 'end', 'justify', '']

  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.alt === 'string' &&
    (obj.caption === undefined ||
      obj.caption === null ||
      (typeof obj.caption === 'object' &&
        typeof obj.caption.root === 'object' &&
        typeof obj.caption.root.type === 'string' &&
        Array.isArray(obj.caption.root.children) &&
        obj.caption.root.children.every(
          (child: any) =>
            typeof child === 'object' &&
            child !== null &&
            typeof child.type === 'string' &&
            typeof child.version === 'number',
        ) &&
        (obj.caption.root.direction === 'ltr' ||
          obj.caption.root.direction === 'rtl' ||
          obj.caption.root.direction === null) &&
        formats.indexOf(obj.caption.root.format) !== -1 &&
        typeof obj.caption.root.indent === 'number' &&
        typeof obj.caption.root.version === 'number')) &&
    typeof obj.updatedAt === 'string' &&
    typeof obj.createdAt === 'string' &&
    (obj.url === undefined || obj.url === null || typeof obj.url === 'string') &&
    (obj.thumbnailURL === undefined ||
      obj.thumbnailURL === null ||
      typeof obj.thumbnailURL === 'string') &&
    (obj.filename === undefined || obj.filename === null || typeof obj.filename === 'string') &&
    (obj.mimeType === undefined || obj.mimeType === null || typeof obj.mimeType === 'string') &&
    (obj.filesize === undefined || obj.filesize === null || typeof obj.filesize === 'number') &&
    (obj.width === undefined || obj.width === null || typeof obj.width === 'number') &&
    (obj.height === undefined || obj.height === null || typeof obj.height === 'number') &&
    (obj.focalX === undefined || obj.focalX === null || typeof obj.focalX === 'number') &&
    (obj.focalY === undefined || obj.focalY === null || typeof obj.focalY === 'number')
  )
}

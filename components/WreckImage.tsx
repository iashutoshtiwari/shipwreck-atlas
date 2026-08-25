'use client'

import { cn } from '@/lib/utils'
import type { WreckImage as WreckImageData } from '@/lib/types'
import { ImageOff } from 'lucide-react'
import Image from 'next/image'
import { memo, useState } from 'react'

type WreckImageProps = {
  image: WreckImageData
  sizes: string
  className?: string
  preload?: boolean
  width?: number
}

function getWikimediaThumbnail(src: string, width: number): string {
  try {
    const url = new URL(src)

    if (url.hostname !== 'upload.wikimedia.org' || url.pathname.includes('/thumb/')) return src

    const filename = url.pathname.split('/').at(-1)
    if (!filename) return src

    const directory = url.pathname.slice(0, -(filename.length + 1))
    const thumbnailDirectory = directory.replace('/wikipedia/commons', '/wikipedia/commons/thumb')

    return `${url.origin}${thumbnailDirectory}/${filename}/${width}px-${filename}`
  } catch {
    return src
  }
}

function WreckImageComponent({
  image,
  sizes,
  className,
  preload = false,
  width = 960,
}: WreckImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const optimizedSrc = getWikimediaThumbnail(image.src, width)
  const currentSrc = failedSrc === optimizedSrc ? image.src : optimizedSrc
  const failed = failedSrc === image.src

  if (failed) {
    return (
      <div
        className={cn(
          'grid h-full w-full place-items-center bg-muted text-muted-foreground',
          className,
        )}
        role='img'
        aria-label={`${image.alt}. Image unavailable.`}
      >
        <span className='flex flex-col items-center gap-2 text-xs'>
          <ImageOff className='h-5 w-5' aria-hidden='true' />
          Image unavailable
        </span>
      </div>
    )
  }

  return (
    <Image
      src={currentSrc}
      alt={image.alt}
      fill
      sizes={sizes}
      preload={preload}
      className={cn('object-cover', className)}
      onError={() => setFailedSrc(currentSrc)}
    />
  )
}

export const WreckImage = memo(WreckImageComponent)

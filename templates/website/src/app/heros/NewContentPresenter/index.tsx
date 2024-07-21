import React, { useEffect } from 'react'

import type { Page } from '../../../payload-types'
import HomePresenter from './Moccassins/HomePresenter'
import { isMedia } from 'src/payload-type-guards'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '../../../payload.config'

export const NewContentPresenterHero: React.FC<Page['hero']> = async ({
  links,
  media,
  richText,
}) => {
  const mediaImage = isMedia(media) ? media.url : media
  const payload = await getPayloadHMR({ config })
  const posts = await payload.find({
    collection: 'posts',
    sort: '-createdAt',
  })

  return (
    <div
      className="relative mt-14 flex items-center justify-center content-center text-foreground"
      data-theme="dark"
    >
      <HomePresenter
        backgroundImage={mediaImage}
        overlayImage="/media/Stoffwindellinchen.png"
        text={richText}
        maxHeight="50vh"
        posts={posts}
      />
    </div>
  )
}

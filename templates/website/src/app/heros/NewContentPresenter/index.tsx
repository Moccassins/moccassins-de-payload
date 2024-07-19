'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '../../../payload-types'

import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'
import RichText from '../../components/RichText'

export const NewContentPresenterHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div className="relative -mt-[10.4rem] flex items-end text-white" data-theme="dark">
      <div className="container mb-8 z-10 relative">
        <div className="max-w-[34rem]">
          <RichText className="mb-72" content={richText} enableGutter={false} />
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-[55vh] select-none">
        {typeof media === 'object' && (
          <React.Fragment>
            <Media fill imgClassName="-z-10 object-cover" priority resource={media} />            
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

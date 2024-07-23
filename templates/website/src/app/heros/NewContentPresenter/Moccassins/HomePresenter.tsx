'use client'
import React, { useRef, useEffect, useState } from 'react'
import './HomePresenter.css'
import RichText from '@/components/RichText'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { PaginatedDocs } from 'payload'
import { Media, Post } from 'src/payload-types'
import { Card } from '@/components/Card'
import useImageSourceRotator from './useImageSourceRotator'

interface HomePresenterProps {
  backgroundImage: string
  overlayImage: string
  text: Record<string, any> // string
  maxHeight: string
  posts: PaginatedDocs<Post>
}

export default function HomePresenter({
  backgroundImage,
  overlayImage,
  text,
  maxHeight,
  posts,
}: HomePresenterProps) {
  const { setHeaderTheme } = useHeaderTheme()

  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: '100%', height: 'auto' })
  const [scaleFactor, setScaleFactor] = useState(1)
  const newFive: string[] = posts.docs.slice(0, 5).map((doc) => {
    const media: any = doc.content.root.children.find((child) => {
      if (child.fields != undefined) {
        const fields: any = child.fields
        if (fields.blockType === 'mediaBlock' && fields.media != undefined) {
          return true
        }
      }
    })
    return media.fields.media.url
  })

  const currentImage = useImageSourceRotator({ imageUrls: newFive, interval: 5000 })
  const convertToPixels = (maxHeight: string): number => {
    if (maxHeight.includes('vh')) {
      return (parseFloat(maxHeight) / 100) * window.innerHeight
    } else if (maxHeight.includes('%')) {
      const parentHeight = containerRef.current?.parentElement?.offsetHeight || 0
      return (parseFloat(maxHeight) / 100) * parentHeight
    }
    return parseFloat(maxHeight)
  }

  useEffect(() => {
    setHeaderTheme('dark')
    const handleResize = () => {
      const container = containerRef.current
      if (!container) return

      const containerWidth = container.offsetWidth
      const maxHeightPixels = convertToPixels(maxHeight)

      const image = new Image()
      image.src = backgroundImage
      image.onload = () => {
        const imageAspectRatio = image.width / image.height
        const calculatedHeight = containerWidth / imageAspectRatio

        if (calculatedHeight > maxHeightPixels) {
          const newScaleFactor = maxHeightPixels / image.height
          setScaleFactor(newScaleFactor)
          setDimensions({
            width: `${maxHeightPixels * imageAspectRatio}px`,
            height: `${maxHeightPixels}px`,
          })
        } else {
          const newScaleFactor = containerWidth / image.width
          setScaleFactor(newScaleFactor)
          setDimensions({
            width: `${containerWidth}px`,
            height: `${calculatedHeight}px`,
          })
        }
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [backgroundImage, maxHeight])

  return (
    <div className="test-wrapper" ref={containerRef}>
      <div
        className="test-container"
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        <div
          className="background-image"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            width: '100%',
            height: '100%',
          }}
        />
        <div className="test-content" style={{ transform: `scale(${scaleFactor})` }}>
          <RichText className="test-text" content={text} enableGutter={false} />
          <img src={currentImage} alt="Overlay" className="overlay-image" />
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect, useMemo } from 'react'

interface useImageSourceRotatorProps {
  imageUrls: string[]
  interval: number
}

const useImageSourceRotator = ({ imageUrls, interval }: useImageSourceRotatorProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (imageUrls.length < 2) return
    const switchImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length)
    }

    const intervalId = setInterval(switchImage, interval)

    return () => clearInterval(intervalId) // Cleanup the interval on component unmount
  }, [imageUrls, interval])

  const currentImage = useMemo(() => imageUrls[currentImageIndex], [imageUrls, currentImageIndex])

  return currentImage
}

export default useImageSourceRotator

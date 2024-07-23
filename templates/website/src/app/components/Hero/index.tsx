import React from 'react'

import type { Page } from '../../../payload-types'

import { HighImpactHero } from '../../heros/HighImpact'
import { LowImpactHero } from '../../heros/LowImpact'
import { MediumImpactHero } from '../../heros/MediumImpact'
import { NewContentPresenterHero } from '@/heros/NewContentPresenter'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  newContentPresenterHero: NewContentPresenterHero,
}

export const Hero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}

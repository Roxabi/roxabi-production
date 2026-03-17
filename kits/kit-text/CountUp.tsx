import React from 'react'
import { useCurrentFrame } from '../../core'
import { cInterpolate } from '../../lib'

export interface CountUpProps {
  from?: number
  to: number
  /** Duration in frames */
  duration?: number
  startAt?: number
  /** Number of decimal places */
  decimals?: number
  prefix?: string
  suffix?: string
  /** Use locale formatting (e.g. 1,000,000) */
  locale?: boolean
  style?: React.CSSProperties
}

export const CountUp: React.FC<CountUpProps> = ({
  from = 0,
  to,
  duration = 60,
  startAt = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  locale = true,
  style,
}) => {
  const frame = useCurrentFrame()
  const value = cInterpolate(frame, [startAt, startAt + duration], [from, to])
  const formatted = locale
    ? value.toLocaleString('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : value.toFixed(decimals)

  return (
    <span
      style={{
        fontSize: 72,
        fontWeight: 800,
        color: 'white',
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

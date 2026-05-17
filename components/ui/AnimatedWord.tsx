'use client'

import { useState, useEffect } from 'react'

const words = ['begin.', 'belong.', 'become.', 'build.', 'believe.', 'battle.', 'breakthrough.']

export default function AnimatedWord() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      // fade out
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length)
        setVisible(true)
      }, 300)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className="text-[#dc2626] inline-block transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {words[index]}
    </span>
  )
}

import { readFileSync } from 'fs'
import { describe, expect, it } from 'vitest'

describe('light-only site', () => {
  const layout = readFileSync('app/layout.tsx', 'utf8')
  const css = readFileSync('app/globals.css', 'utf8')

  it('declares a light colour scheme so browsers do not auto-darken pages', () => {
    expect(layout).toMatch(/colorScheme:\s*'light'/)
    expect(layout).toContain('export const viewport')
    expect(css).toMatch(/color-scheme:\s*only light/)
  })

  it('has no dark-mode overrides in CSS or a theme toggle', () => {
    expect(css).not.toContain('prefers-color-scheme')
    expect(layout).not.toMatch(/next-themes|ThemeProvider/)
  })
})

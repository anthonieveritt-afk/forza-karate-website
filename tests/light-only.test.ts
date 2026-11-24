import { readFileSync } from 'fs'
import { describe, expect, it } from 'vitest'

describe('light-only site', () => {
  const layout = readFileSync('app/layout.tsx', 'utf8')
  const css = readFileSync('app/globals.css', 'utf8')
  const beltIcon = readFileSync('components/ui/BeltIcon.tsx', 'utf8')

  it('declares light only so browsers do not auto-darken pages', () => {
    expect(layout).toMatch(/colorScheme:\s*'light only'/)
    expect(layout).toContain('export const viewport')
    expect(layout).toMatch(/style=\{\{\s*colorScheme:\s*'light only'\s*\}\}/)
    expect(css).toMatch(/color-scheme:\s*light only/)
    // A plain 'light' declaration (without only) is not an opt-out.
    expect(layout).not.toMatch(/colorScheme:\s*'light'(?! only)/)
  })

  it('has no dark-mode overrides in CSS or a theme toggle', () => {
    expect(css).not.toContain('prefers-color-scheme')
    expect(layout).not.toMatch(/next-themes|ThemeProvider/)
  })

  it('belt icons use explicit fills and opt out of auto-dark', () => {
    expect(beltIcon).toContain("fill={color}")
    expect(beltIcon).toContain("stroke={border}")
    expect(beltIcon).toContain("className=\"belt-icon")
    expect(beltIcon).toMatch(/colorScheme:\s*'light only'/)
    expect(css).toContain('.belt-icon')
    expect(css).toContain('forced-color-adjust: none')
  })
})

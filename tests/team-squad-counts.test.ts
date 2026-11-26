import { readFileSync } from 'fs'
import { describe, expect, it } from 'vitest'

function constArray(src: string, name: string): string {
  const match = src.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\n\\]`))
  if (!match) throw new Error(`const ${name} not found`)
  return match[1]
}

function photoSrcs(block: string): string[] {
  return [...block.matchAll(/src: '(\/team\/[^']+)'/g)].map((m) => m[1])
}

describe('team squad counts match the photo cards shown', () => {
  const src = readFileSync('app/team/page.tsx', 'utf8')
  const kumite = photoSrcs(constArray(src, 'kumitePhotos'))
  const kata = photoSrcs(constArray(src, 'kataPhotos'))
  const para = photoSrcs(constArray(src, 'paraPhotos'))

  it('uses each photo array for both the heading count and the grid', () => {
    expect(src).toContain('{kumitePhotos.length} athletes')
    expect(src).toContain('{kataPhotos.length} athletes')
    expect(src).toContain('{paraPhotos.length} athlete')
    expect(src).toContain('kumitePhotos.map')
    expect(src).toContain('kataPhotos.map')
    expect(src).toContain('paraPhotos.map')
    expect(src).not.toMatch(/kumiteAthletes|kataAthletes|paraAthletes/)
  })

  it('has unique photos in each grid and the expected card counts', () => {
    expect(new Set(kumite).size).toBe(kumite.length)
    expect(new Set(kata).size).toBe(kata.length)
    expect(kumite).toHaveLength(11)
    expect(kata).toHaveLength(7)
    expect(para).toHaveLength(1)
    expect(kumite).toContain('/team/l-tran.jpg')
    expect(kata).toContain('/team/l-tran.jpg')
  })
})

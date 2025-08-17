export function replaceFirstNumber(text: string, newNumber: string): string {
  const re = /(\d+(?:\.\d+)?)/
  if (!re.test(text)) return text
  return text.replace(re, newNumber)
}

export function extractFirstNumber(text: string): string | null {
  const m = text.match(/(\d+(?:\.\d+)?)/)
  return m ? m[1] : null
}

export function getImageHref(el: Element): string | null {
  // href peut être sur 'href' (SVG2) ou 'xlink:href' (SVG1.1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyEl = el as any
  return (
    el.getAttribute('href') ||
    el.getAttribute('xlink:href') ||
    (anyEl?.href?.baseVal ?? null) ||
    (anyEl?.['xlink:href']?.baseVal ?? null)
  )
}

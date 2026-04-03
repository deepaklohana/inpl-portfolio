export type TOCItem = {
  id: string
  title: string
  level: number  // 2 = h2, 3 = h3
  children?: TOCItem[]
}

export function generateTOC(htmlContent: string): TOCItem[] {
  // Parse HTML string and extract h2, h3 headings
  // Use regex or DOMParser
  
  const headingRegex = /<h([23])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[23]>/gi
  
  // If headings don't have ids, generate them:
  const slugify = (text: string) => 
    text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
  
  const items: TOCItem[] = []
  let match
  
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    items.push({
      level: parseInt(match[1]),
      id: match[2] || slugify(match[3]),
      title: match[3].replace(/<[^>]*>/g, '') // strip any inner tags
    })
  }
  
  return items
}

export function addHeadingIds(htmlContent: string): string {
  // Add id attributes to h2, h3 tags if missing
  // So anchor links work
  return htmlContent.replace(
    /<h([23])([^>]*)>(.*?)<\/h[23]>/gi,
    (match, level, attrs, text) => {
      if (attrs.includes('id=')) return match
      const plainText = text.replace(/<[^>]*>/g, '')
      const id = plainText.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`
    }
  )
}

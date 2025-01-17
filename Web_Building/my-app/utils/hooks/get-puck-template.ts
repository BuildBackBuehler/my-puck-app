// lib/get-puck-template.ts
import { readFile } from 'fs/promises'
import path from 'path'

export async function getArticleTemplate() {
  try {
    const dbPath = path.join(process.cwd(), 'database.json')
    const dbContent = await readFile(dbPath, 'utf-8')

    // Find the start of the article template
    const templateStart = dbContent.indexOf('"/article":{')
    if (templateStart === -1) {
      throw new Error('Could not find article template start')
    }

    // Find the start of the next template section
    const nextTemplateMatch = dbContent.slice(templateStart + 1).match(/"\/[^"]+":{"root"/)
    if (!nextTemplateMatch) {
      throw new Error('Could not find next template section')
    }

    // Calculate where to end the template slice
    const nextTemplateStart = templateStart + 1 + nextTemplateMatch.index
    
    // Find the closing brackets/braces before the next template
    let depth = 0
    let templateEnd = templateStart
    for (let i = templateStart; i < nextTemplateStart; i++) {
      const char = dbContent[i]
      if (char === '{' || char === '[') depth++
      if (char === '}' || char === ']') depth--
      if (depth === 0) {
        templateEnd = i + 1
        break
      }
    }

    // Extract and parse just the article template
    const templateSection = dbContent.slice(templateStart, templateEnd)
    const wrappedTemplate = `{${templateSection}}`
    
    try {
      return JSON.parse(wrappedTemplate)['/article']
    } catch (parseError) {
      console.error('Error parsing template section:', parseError)
      console.log('Template section:', templateSection)
      throw new Error('Failed to parse template')
    }

  } catch (error) {
    console.error('Error reading template:', error)
    return null
  }
}

// Example usage / testing function
export async function validateTemplate() {
  const template = await getArticleTemplate()
  const isValid = template && 
    template.root && 
    template.content && 
    template.zones

  console.log('Template valid:', isValid)
  console.log('Template structure:', {
    hasRoot: !!template?.root,
    contentLength: template?.content?.length,
    zoneKeys: template?.zones ? Object.keys(template.zones) : []
  })

  return isValid
}
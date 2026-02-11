import fs from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { filename, content } = body

  if (!filename || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Filename and content are required'
    })
  }

  // Sanitize filename to prevent path traversal
  const safeName = path.basename(filename)
  const safeFilename = safeName.endsWith('.json') ? safeName : `${safeName}.json`
  
  // Construct path to frontend/app/schema
  // process.cwd() is usually the project root in Nuxt dev
  const schemaDir = path.join(process.cwd(), 'app', 'schema')
  const filePath = path.join(schemaDir, safeFilename)

  // Construct path to frontend/app/pages
  const pageName = safeName.replace(/\.json$/, '')
  const pageDir = path.join(process.cwd(), 'app', 'pages', pageName)

  try {
    // Ensure directory exists just in case
    await fs.mkdir(schemaDir, { recursive: true })
    
    // Create page directory in pages/
    await fs.mkdir(pageDir, { recursive: true })
    
    // Write schema file
    await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8')

    // Create index.vue content
    const vueContent = `<template>
    <!-- Template Create Lists Example -->
    <Card>
      <template #title>
        <span class="text-lg font-semibold">${content.table || 'Liste'}</span>
      </template>
      <template #content>
        <TemplateCreateLists 
          :schema="tableSchema"
          url="/api/${safeName || 'Liste'}"
        />
      </template>
    </Card>
</template>

<script setup lang="ts">

// Table Schema for Template Component
const tableSchema = ${JSON.stringify(content.schema || [], null, 2)}


</script>`

    // Write index.vue file
    const indexFilePath = path.join(pageDir, 'index.vue')
    await fs.writeFile(indexFilePath, vueContent, 'utf-8')
    
    return { success: true, message: 'File and page created successfully', path: filePath, page: indexFilePath }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to save file: ${error.message}`
    })
  }
})

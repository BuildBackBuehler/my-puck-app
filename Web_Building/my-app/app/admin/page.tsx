// app/admin/page.tsx
'use client'

import { useState } from 'react'
import { uploadImage } from '../../utils/hooks/upload'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File>()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!image) return

    const imageUrl = await uploadImage(image)

    await supabase.from('blogs').insert({
      title,
      content,
      image_url: imageUrl,
      views: 0,
      likes: 0
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Post content"
      />
      <input
        type="file"
        onChange={e => setImage(e.target.files?.[0])}
      />
      <button type="submit">Create Post</button>
    </form>
  )
}
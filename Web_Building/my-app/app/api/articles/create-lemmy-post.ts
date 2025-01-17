async function createArticleWithLemmyPost(articleData) {
    try {
      const response = await fetch('/api/articles/create-lemmy-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.API_KEY // if you set one
        },
        body: JSON.stringify({
          id: articleData.id,
          title: articleData.title,
          content: articleData.content,
          slug: articleData.slug
        })
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message);
      }
  
      return result;
    } catch (error) {
      console.error('Failed to create Lemmy post:', error);
      throw error;
    }
  }
'use client'

import { ArticleList } from './article-list'
import { useArticles } from '../../hooks/useArticles'

export function DynamicArticleList() {
  const { data: articles, isLoading } = useArticles()

  if (isLoading) {
    return <div className="animate-pulse">Loading articles...</div>
  }

  return (
    <ArticleList.render
      articles={articles}
      maxArticles={5}
      showDivider={true}
    />
  )
}
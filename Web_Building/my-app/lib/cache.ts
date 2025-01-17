import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { ArticleWithAuthor, ArticleEngagement, Author } from '@/utils/types/database'

class CacheService {
  private redis: Redis
  private ratelimit: Ratelimit
  private defaultTTL: number

  constructor() {
    this.redis = Redis.fromEnv()
    this.defaultTTL = 3600 // 1 hour
    this.ratelimit = new Ratelimit({
      redis: this.redis,
      limiter: Ratelimit.slidingWindow(20, '10s'),
    })
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.redis.get(key)
      if (!cached) return null
      
      if (typeof cached === 'string') {
        try {
          return JSON.parse(cached)
        } catch {
          return cached as unknown as T
        }
      }
      return cached as T
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL) {
    try {
      const valueToStore = typeof value === 'string' ? value : JSON.stringify(value)
      await this.redis.set(key, valueToStore, { ex: ttl })
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  async del(key: string) {
    try {
      await this.redis.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  generateKey(...parts: string[]) {
    return parts.join(':')
  }

  // Articles
  async getArticle(slug: string): Promise<ArticleWithAuthor | null> {
    return this.get<ArticleWithAuthor>(this.generateKey('article', slug))
  }

  async setArticle(slug: string, article: ArticleWithAuthor) {
    await this.set(this.generateKey('article', slug), article)
  }

  async deleteArticle(slug: string) {
    await this.del(this.generateKey('article', slug))
  }

  // Article Lists
  async getArticlesByCategory(category: string) {
    return this.get<ArticleWithAuthor[]>(this.generateKey('articles', 'category', category))
  }

  async setArticlesByCategory(category: string, articles: ArticleWithAuthor[]) {
    await this.set(this.generateKey('articles', 'category', category), articles, 600)
  }

  // Top Articles
  async getTopArticles() {
    return this.get<ArticleWithAuthor[]>('articles:top')
  }

  async setTopArticles(articles: ArticleWithAuthor[]) {
    await this.set('articles:top', articles, 300)
  }

  // Author
  async getAuthor(id: string): Promise<Author | null> {
    return this.get<Author>(this.generateKey('author', id))
  }

  async setAuthor(id: string, author: Author) {
    await this.set(this.generateKey('author', id), author)
  }

  // Engagement
  async getEngagement(articleId: string): Promise<ArticleEngagement | null> {
    return this.get<ArticleEngagement>(this.generateKey('engagement', articleId))
  }

  async setEngagement(articleId: string, engagement: ArticleEngagement) {
    await this.set(this.generateKey('engagement', articleId), engagement, 300)
  }

  async incrementEngagement(articleId: string, type: 'views' | 'likes') {
    const key = this.generateKey('engagement', articleId)
    const engagement = await this.getEngagement(articleId)
    
    if (engagement) {
      engagement[type]++
      await this.setEngagement(articleId, engagement)
    }
  }

  // Rate Limiting
  async checkRateLimit(ip: string) {
    return this.ratelimit.limit(ip)
  }

  // Cache Management
  async invalidateCategory(category: string) {
    await this.del(this.generateKey('articles', 'category', category))
  }

  async invalidateTopArticles() {
    await this.del('articles:top')
  }

  // Puck-specific methods
  async getPuckPage(slug: string) {
    return this.get(`puck:article:${slug}`)
  }

  async setPuckPage(slug: string, pageData: any) {
    await this.set(`puck:article:${slug}`, pageData, 3600) // Cache for 1 hour
  }

  async invalidatePuckPage(slug: string) {
    await this.del(`puck:article:${slug}`)
  }
}

export const cacheService = new CacheService()

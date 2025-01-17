import { generateId } from "./generate-id"
import fs from 'fs/promises'
import path from 'path'

export async function injectArticlePageData(slug: string, articleData: any) {
    try {
      const dbPath = path.join(process.cwd(), 'database.json')
      
      // Read existing database
      let existingData = {}
      try {
        const content = await fs.readFile(dbPath, 'utf-8')
        existingData = JSON.parse(content)
      } catch (error) {
        console.log('No existing database.json, creating new one')
      }
  
      // Get article template
      const articleTemplate = existingData['/article']
      if (!articleTemplate) {
        throw new Error('Article template not found in database.json')
      }
  
      // Create new page data from template
      const pageData = {
        root: {
          props: {
            title: articleData.title,
            pageType: "article",
            pageData: articleData
          }
        },
        content: [
          {
            type: "Sidebar",
            props: {
              navigation: [
                { label: "Lemmy ↗", href: "/forums", icon: "Snoo" },
                { label: "About Us", href: "/about", icon: "Contact" },
                { label: "Arts", href: "/arts", icon: "Palette" },
                { label: "Archive", href: "/archive", icon: "Archive" },
                { label: "Essentials", href: "/essentials", icon: "Sparkles" },
                { label: "Manifesto", href: "/manifesto", icon: "Unabomber" }
              ],
              socialHandle: "@lotuswav.es",
              showSubscribe: true,
              initialState: "open",
              showDivider: "false",
              id: `Sidebar-${generateId()}`
            }
          },
          {
            type: "JSONLD",
            props: {
              pageType: "article",
              pageData: articleData,
              id: `JSONLD-${generateId()}`
            }
          },
          {
            type: "LogoBar",
            props: {
              siteLogo: {
                src: "/GoldDust.svg",
                alt: "Site Logo",
                width: "45px",
                height: "45px"
              },
              siteUrl: "/",
              height: "42px",
              id: `LogoBar-${generateId()}`,
              animationStyle: "hover",
              headerHeight: "45px"
            }
          },
          {
            type: "ThreeColumns",
            props: {
              columns: [
                { width: 0, id: generateId('Column') },
                { width: 70, id: generateId('Column') },
                { width: 30, id: generateId('Column') }
              ],
              id: `ThreeColumns-${generateId()}`
            }
          }
        ],
        zones: {}
      }
  
      // Setup sidebar zones
      const sidebarId = pageData.content[0].props.id
      pageData.zones[`${sidebarId}:Toggle`] = [{
        type: "ThemeToggler",
        props: {
          defaultTheme: "light",
          size: "lg",
          position: "left",
          persistent: true,
          id: `ThemeToggler-${generateId('ThemeToggler')}`
        }
      }]
      pageData.zones[`${sidebarId}:Contact`] = [{
        type: "ContactDialog",
        props: {
          buttonText: "Contact Us",
          dialogTitle: "Contact Admin Team",
          dialogDescription: "Send us a message and we'll get back to you as soon as possible.",
          alertTitle: "Discard changes?",
          alertDescription: "If you leave now, your message will not be saved.",
          toastTitle: "Message Sent!",
          toastDescription: "Thank you for your message. We'll respond shortly.",
          id: `ContactDialog-${generateId('ContactDialog')}`
        }
      }]
  
      // Setup ThreeColumns zones
      const threeColumnsId = pageData.content[3].props.id;
      const middleColumnId = pageData.content[3].props.columns[1].id;
      const rightColumnId = pageData.content[3].props.columns[2].id;
  
      // Create ScrollFree
      const scrollFreeId = `ScrollFree-${generateId('ScrollFree')}`
      pageData.zones[`${threeColumnsId}:column-${middleColumnId}`] = [{
        type: "ScrollFree",
        props: {
          paddingX: "px-0",
          paddingY: "py-0",
          gap: "gap-0",
          zoneCount: 1,
          id: scrollFreeId
        }
      }];
  
      // Add Article to ScrollFree zone
      const articleId = generateId('Article')
      pageData.zones[`${scrollFreeId}:zone-${scrollFreeId}-0`] = [{
        type: "Article",
        props: {
          id: `Article-${articleId}`,
          slug: articleData.slug,
          title: articleData.title,
          content: articleData.content,
          showEngagement: true,
          socialShareUrls: {
            facebook: `https://yourdomain.com/articles/${articleData.slug}`,
            twitter: `https://yourdomain.com/articles/${articleData.slug}`,
            linkedin: `https://yourdomain.com/articles/${articleData.slug}`,
            reddit: `https://yourdomain.com/articles/${articleData.slug}`
          }
        }
      }]
  
      // Create right column with DropColumn
      const dropColumnId = `DropColumn-${generateId('DropColumn')}`
      pageData.zones[`${threeColumnsId}:column-${rightColumnId}`] = [{
        type: "DropColumn",
        props: {
          padding: "p-0",
          gap: "gap-0",
          zoneCount: 3,
          showDivider: true,
          initialState: "open",
          id: dropColumnId
        }
      }]
  
      // Add zones for DropColumn
      pageData.zones[`${dropColumnId}:zone-${dropColumnId}-0`] = [{
        type: "Ticker",
        props: {
          items: [
            { text: "Breaking News" },
            { text: "Latest Updates" },
            { text: "Featured Story" }
          ],
          direction: "left",
          speed: "medium",
          pauseOnHover: "true",
          theme: "light",
          id: `Ticker-${generateId('Ticker')}`,
          sources: {
            guardian: true,
            foreignPolicy: true,
            proPub: true
          },
          maxArticlesPerSource: 3
        }
      }]
  
      pageData.zones[`${dropColumnId}:zone-${dropColumnId}-1`] = [{
        type: "FeaturedHeader",
        props: {
          title: "Featured Articles",
          linkText: "See All",
          linkUrl: "/articles",
          showDivider: true,
          id: `FeaturedHeader-${generateId('FeaturedHeader')}`
        }
      }]
  
      pageData.zones[`${dropColumnId}:zone-${dropColumnId}-2`] = [{
        type: "ArticleList",
        props: {
          maxArticles: 5,
          id: `ArticleList-${generateId('ArticleList')}`,
          articles: articleData.featured_articles || []
        }
      }]
  
      // Update database
      const updatedData = {
        ...existingData,
        [`/articles/${slug}`]: pageData
      }
  
      await fs.writeFile(dbPath, JSON.stringify(updatedData, null, 2))
      return pageData
  
    } catch (error) {
      console.error('Error injecting article:', error)
      throw error
    }
  }
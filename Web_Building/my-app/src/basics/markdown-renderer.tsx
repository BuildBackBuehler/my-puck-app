import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { ComponentConfig } from "@measured/puck";

type MarkdownProps = {
  content: string;
  imageSize?: 'contain' | 'cover';
  aspectRatio?: 'video' | 'square' | 'auto';
};

const aspectRatioClass = {
  video: 'aspect-video',
  square: 'aspect-square',
  auto: 'aspect-auto'
};

export const MarkdownRenderer: ComponentConfig<MarkdownProps> = {
  fields: {
    content: { type: 'textarea' },
    imageSize: {
      type: 'radio',
      options: [
        { label: 'Contain', value: 'contain' },
        { label: 'Cover', value: 'cover' }
      ]
    },
    aspectRatio: {
      type: 'radio',
      options: [
        { label: 'Video (16:9)', value: 'video' },
        { label: 'Square (1:1)', value: 'square' },
        { label: 'Auto', value: 'auto' }
      ]
    }
  },

  defaultProps: {
    content: '',
    imageSize: 'contain',
    aspectRatio: 'video'
  },

  render: ({ content, imageSize = 'contain', aspectRatio = 'video' }) => {
    const components = {  
      p: ({ children }) => {
        const hasImgChild = Array.isArray(children) && 
          children.some(child => 
            typeof child === 'object' && 
            child?.type === 'img'
          );
        
        return hasImgChild ? <>{children}</> : <p>{children}</p>;
      },
      img: ({ src, alt }) => (
        <figure className="my-4">
          <div className={`relative ${aspectRatioClass[aspectRatio]}`}>
            <Image
              src={src || ''}
              alt={alt || ''}
              fill
              className={`object-${imageSize}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {alt && (
            <figcaption className="text-center text-sm mt-2 text-adaptive-secondaryAlt">
              {alt}
            </figcaption>
          )}
        </figure>
      )
    };

    return (
      <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }
};
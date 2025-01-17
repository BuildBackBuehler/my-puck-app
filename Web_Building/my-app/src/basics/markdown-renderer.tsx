import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { ComponentConfig } from "@measured/puck";
import React from 'react';
import ImageRender from '@/lib/Next-Image-Plugin/config';

type MarkdownProps = {
  content: string;
  imageSize?: 'contain' | 'cover';
  aspectRatio?: 'video' | 'square' | 'auto';
};

const ImageComponent = ({ src, alt, align }: { src: string; alt?: string; align?: string }) => (
  <span className={`block my-4 ${align === 'right' ? 'float-right ml-4' : ''}`}>
    <div className="relative h-48 w-64">
      <ImageRender
        image={{
          src: src,
          alt: alt || '',
          fill: true,
          type: 'cover'
        }}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  </span>
);

const processContent = (content: string) => {
  const imgRegex = /<img[^>]+>/g;
  return content.replace(imgRegex, (match) => {
    const srcMatch = match.match(/src="([^"]+)"/);
    const alignMatch = match.match(/align="([^"]+)"/);
    const altMatch = match.match(/alt="([^"]+)"/);
    
    if (!srcMatch) return match;
    
    const alt = altMatch?.[1] || '';
    const src = srcMatch[1];
    const align = alignMatch?.[1] || '';

    return align ? `![${alt}|${align}](${src})` : `![${alt}](${src})`;
  });
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
      // Custom component for paragraphs
      p: ({ children, ...props }) => {
        const childrenArray = React.Children.toArray(children);
        
        // Check if paragraph contains only an image
        if (childrenArray.length === 1 && React.isValidElement(childrenArray[0]) && childrenArray[0].type === 'img') {
          return <>{children}</>;
        }
        
        return <p {...props}>{children}</p>;
      },
      
      // Custom component for images
      img: ({ src, alt: rawAlt, ...props }) => {
        if (!src) return null;
        
        const [alt, align] = (rawAlt || '').split('|');
        
        return (
          <div className="my-4">
            <ImageComponent 
              src={src}
              alt={alt}
              align={align}
              {...props}
            />
          </div>
        );
      }
    };

    return (
      <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none text-adaptive-secondary">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={components}
          skipHtml
        >
          {processContent(content)}
        </ReactMarkdown>
      </div>
    );
  }
};
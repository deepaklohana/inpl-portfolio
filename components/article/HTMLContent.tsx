'use client';

import React from 'react';
import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
import { ArticleStats } from './ArticleStats';
import { ArticleCTA } from './ArticleCTA';

interface HTMLContentProps {
  content: string;
}

export function HTMLContent({ content }: HTMLContentProps) {
  // Pre-processing string: Convert shortcodes into custom placeholders
  // that can be accurately swapped out by html-react-parser.
  
  // Format: [STATS: 85%|Faster, 3x|More, 60%|Cheaper]
  // Format: [CTA: Ready to Transform? | Start your free trial | Button 1 | /link1 | Button 2 | /link2]
  
  const processedContent = content
    // Remove wrapping <p> tags around shortcodes to prevent hydration mismatch (div inside p)
    .replace(/<p>\s*(\[STATS:[\s\S]*?\])\s*<\/p>/g, '$1')
    .replace(/<p>\s*(\[CTA:[\s\S]*?\])\s*<\/p>/g, '$1')
    .replace(/\[STATS:\s*([\s\S]+?)\]/g, (match, inner) => {
      return `<div class="custom-shortcode-stats block my-8" data-content="${encodeURIComponent(inner)}"></div>`;
    })
    .replace(/\[CTA:\s*([\s\S]+?)\]/g, (match, inner) => {
      return `<div class="custom-shortcode-cta block my-12" data-content="${encodeURIComponent(inner)}"></div>`;
    });

  const options = {
    replace: (domNode: DOMNode) => {
      if (domNode instanceof Element && domNode.attribs && domNode.attribs.class) {
        
        // Handle STATS
        if (domNode.attribs.class.includes('custom-shortcode-stats')) {
          const raw = decodeURIComponent(domNode.attribs['data-content'] || '');
          const statItems = raw.split(',').map(s => {
            const [val, lab] = s.split('|').map(x => x.trim());
            return { value: val || '', label: lab || '' };
          });
          return <ArticleStats stats={statItems} />;
        }

        // Handle CTA
        if (domNode.attribs.class.includes('custom-shortcode-cta')) {
          const raw = decodeURIComponent(domNode.attribs['data-content'] || '');
          const parts = raw.split('|').map(x => x.trim());
          return (
            <ArticleCTA 
              title={parts[0] || 'Ready to Transform Your Analytics?'} 
              subtitle={parts[1] || 'Start your free 30-day trial today. No credit card required.'} 
              primaryText={parts[2]} 
              primaryLink={parts[3]} 
              secondaryText={parts[4]} 
              secondaryLink={parts[5]} 
            />
          );
        }
      }
    }
  };

  return (
    <div className="article-prose w-full">
      {parse(processedContent, options)}
    </div>
  );
}

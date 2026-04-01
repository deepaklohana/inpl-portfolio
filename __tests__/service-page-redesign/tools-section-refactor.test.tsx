// Feature: service-page-redesign
// Unit tests for ToolsWeUseSection refactoring (Task 6.3)

import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ToolsWeUseSection, { ToolsSection } from '@/components/sections/ToolsWeUseSection';

/**
 * Helper function to escape HTML entities for comparison
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

describe('ToolsWeUseSection - Refactored Component', () => {
  const mockToolsSection: ToolsSection = {
    description: 'We use industry-leading tools to deliver exceptional results.',
    categories: [
      {
        name: 'Design',
        tools: [
          { name: 'Figma', icon: '/icons/tools/figma.svg' },
          { name: 'Adobe XD', icon: '/icons/tools/adobe-xd.svg' },
        ],
      },
      {
        name: 'Development',
        tools: [
          { name: 'VS Code', icon: '/icons/tools/vscode.svg' },
          { name: 'GitHub', icon: '/icons/tools/github.svg' },
        ],
      },
    ],
  };

  it('renders the description text', () => {
    const element = createElement(ToolsWeUseSection, { data: mockToolsSection });
    const html = renderToStaticMarkup(element);
    
    expect(html).toContain(escapeHtml(mockToolsSection.description));
  });

  it('renders all category names', () => {
    const element = createElement(ToolsWeUseSection, { data: mockToolsSection });
    const html = renderToStaticMarkup(element);
    
    expect(html).toContain(escapeHtml('Design'));
    expect(html).toContain(escapeHtml('Development'));
  });

  it('renders all tool names', () => {
    const element = createElement(ToolsWeUseSection, { data: mockToolsSection });
    const html = renderToStaticMarkup(element);
    
    expect(html).toContain(escapeHtml('Figma'));
    expect(html).toContain(escapeHtml('Adobe XD'));
    expect(html).toContain(escapeHtml('VS Code'));
    expect(html).toContain(escapeHtml('GitHub'));
  });

  it('renders tool icons with correct paths', () => {
    const element = createElement(ToolsWeUseSection, { data: mockToolsSection });
    const html = renderToStaticMarkup(element);
    
    expect(html).toContain('figma.svg');
    expect(html).toContain('adobe-xd.svg');
    expect(html).toContain('vscode.svg');
    expect(html).toContain('github.svg');
  });

  it('renders empty description gracefully', () => {
    const dataWithoutDescription: ToolsSection = {
      description: '',
      categories: mockToolsSection.categories,
    };
    const element = createElement(ToolsWeUseSection, { data: dataWithoutDescription });
    const html = renderToStaticMarkup(element);
    
    expect(html).toContain(escapeHtml('Figma'));
    expect(html).toContain(escapeHtml('Design'));
  });

  it('groups tools by category correctly', () => {
    const element = createElement(ToolsWeUseSection, { data: mockToolsSection });
    const html = renderToStaticMarkup(element);
    
    // Verify both categories are present
    expect(html).toContain(escapeHtml('Design'));
    expect(html).toContain(escapeHtml('Development'));
    
    // Verify tools are associated with their categories
    expect(html).toContain(escapeHtml('Figma'));
    expect(html).toContain(escapeHtml('Adobe XD'));
    expect(html).toContain(escapeHtml('VS Code'));
    expect(html).toContain(escapeHtml('GitHub'));
  });

  it('handles multiple categories with varying tool counts', () => {
    const multiCategoryData: ToolsSection = {
      description: 'Test description',
      categories: [
        {
          name: 'Category A',
          tools: [{ name: 'Tool A1', icon: '/icon-a1.svg' }],
        },
        {
          name: 'Category B',
          tools: [
            { name: 'Tool B1', icon: '/icon-b1.svg' },
            { name: 'Tool B2', icon: '/icon-b2.svg' },
            { name: 'Tool B3', icon: '/icon-b3.svg' },
          ],
        },
      ],
    };
    
    const element = createElement(ToolsWeUseSection, { data: multiCategoryData });
    const html = renderToStaticMarkup(element);
    
    expect(html).toContain(escapeHtml('Category A'));
    expect(html).toContain(escapeHtml('Category B'));
    expect(html).toContain(escapeHtml('Tool A1'));
    expect(html).toContain(escapeHtml('Tool B1'));
    expect(html).toContain(escapeHtml('Tool B2'));
    expect(html).toContain(escapeHtml('Tool B3'));
  });
});

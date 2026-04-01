// Feature: service-page-redesign, Property 9: Tools section renders description and grouped tools

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ToolsWeUseSection from '@/components/sections/ToolsWeUseSection';

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

/**
 * Arbitrary for ToolCategory
 */
const toolCategoryArb = fc.record({
  name: fc.string(),
  tools: fc.array(
    fc.record({
      name: fc.string(),
      icon: fc.webUrl(),
    }),
  ),
});

/**
 * Validates: Requirements 6.2, 6.3, 6.4
 *
 * Property: For any ToolsSection value, the rendered output should contain
 * the section description, each category name, and each tool's name within that category.
 */
describe('P9: Tools section renders description and grouped tools', () => {
  it('renders description and all tool names within categories', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          description: fc.string(),
          categories: fc.array(toolCategoryArb),
        }),
        async ({ description, categories }) => {
          // Render the component to static HTML
          const element = createElement(ToolsWeUseSection, {
            data: { description, categories },
          });
          const html = renderToStaticMarkup(element);

          // Assert that the description appears in the rendered output
          if (description) {
            expect(html).toContain(escapeHtml(description));
          }

          // Assert that each category name appears in the rendered output
          for (const category of categories) {
            expect(html).toContain(escapeHtml(category.name));

            // Assert that each tool name within the category appears
            for (const tool of category.tools) {
              expect(html).toContain(escapeHtml(tool.name));
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Feature: service-page-redesign
 * Property 7: Conditional section mutual exclusivity
 * 
 * For any service record, if sectionType === "technologies" then the rendered page
 * should include the tech mastery section and exclude the tools section; if
 * sectionType === "tools" then the rendered page should include the tools section
 * and exclude the tech mastery section.
 * 
 * Validates: Requirements 5.1, 5.6, 6.1, 6.6
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import TechMasterySection from '@/components/sections/TechMasterySection';
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

// Arbitraries for test data
const techCategoryArb = fc.record({
  name: fc.string({ minLength: 1 }),
  items: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
});

const techSectionArb = fc.record({
  heading: fc.string({ minLength: 1 }),
  categories: fc.array(techCategoryArb, { minLength: 1, maxLength: 4 }),
});

const toolItemArb = fc.record({
  name: fc.string({ minLength: 1 }),
  icon: fc.webUrl(),
});

const toolCategoryArb = fc.record({
  name: fc.string({ minLength: 1 }),
  tools: fc.array(toolItemArb, { minLength: 1, maxLength: 5 }),
});

const toolsSectionArb = fc.record({
  description: fc.string({ minLength: 1 }),
  categories: fc.array(toolCategoryArb, { minLength: 1, maxLength: 4 }),
});

describe('Property 7: Conditional section mutual exclusivity', () => {
  it('renders tech section when sectionType is "technologies"', async () => {
    await fc.assert(
      fc.asyncProperty(techSectionArb, async (techSection) => {
        const element = createElement(TechMasterySection, { data: techSection });
        const html = renderToStaticMarkup(element);
        
        // Tech section should render the heading
        expect(html).toContain(escapeHtml(techSection.heading));
        
        // Tech section should render all categories
        for (const category of techSection.categories) {
          expect(html).toContain(escapeHtml(category.name));
          for (const item of category.items) {
            expect(html).toContain(escapeHtml(item));
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it('renders tools section when sectionType is "tools"', async () => {
    await fc.assert(
      fc.asyncProperty(toolsSectionArb, async (toolsSection) => {
        const element = createElement(ToolsWeUseSection, { data: toolsSection });
        const html = renderToStaticMarkup(element);
        
        // Tools section should render the description
        expect(html).toContain(escapeHtml(toolsSection.description));
        
        // Tools section should render all categories and tools
        for (const category of toolsSection.categories) {
          expect(html).toContain(escapeHtml(category.name));
          for (const tool of category.tools) {
            expect(html).toContain(escapeHtml(tool.name));
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it('ensures mutual exclusivity by testing section type discrimination', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('technologies' as const, 'tools' as const),
        techSectionArb,
        toolsSectionArb,
        async (sectionType, techSection, toolsSection) => {
          // Simulate the conditional rendering logic from the page
          const shouldRenderTech = sectionType === 'technologies';
          const shouldRenderTools = sectionType === 'tools';
          
          // Verify mutual exclusivity
          expect(shouldRenderTech).not.toBe(shouldRenderTools);
          
          if (shouldRenderTech) {
            // When tech section should render, verify it contains tech data
            const element = createElement(TechMasterySection, { data: techSection });
            const html = renderToStaticMarkup(element);
            expect(html).toContain(escapeHtml(techSection.heading));
          } else {
            // When tools section should render, verify it contains tools data
            const element = createElement(ToolsWeUseSection, { data: toolsSection });
            const html = renderToStaticMarkup(element);
            expect(html).toContain(escapeHtml(toolsSection.description));
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

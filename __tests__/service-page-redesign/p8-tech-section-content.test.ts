// Feature: service-page-redesign, Property 8: Tech section renders heading and grouped categories

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import TechMasterySection from '@/components/sections/TechMasterySection';

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
 * Arbitrary for TechCategory
 */
const techCategoryArb = fc.record({
  name: fc.string({ minLength: 1 }),
  items: fc.array(fc.string({ minLength: 1 })),
});

/**
 * Validates: Requirements 5.2, 5.3
 *
 * Property: For any TechSection value, the rendered output should contain
 * the section heading and each category name with its associated technology items.
 */
describe('P8: Tech section renders heading and grouped categories', () => {
  it('renders heading and all category names with their technology items', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          heading: fc.string({ minLength: 1 }),
          categories: fc.array(techCategoryArb),
        }),
        async ({ heading, categories }) => {
          // Render the component to static HTML
          const element = createElement(TechMasterySection, {
            data: { heading, categories },
          });
          const html = renderToStaticMarkup(element);

          // Assert that the section heading appears in the rendered output
          expect(html).toContain(escapeHtml(heading));

          // Assert that each category name appears in the rendered output
          for (const category of categories) {
            expect(html).toContain(escapeHtml(category.name));

            // Assert that each technology item within the category appears
            for (const item of category.items) {
              expect(html).toContain(escapeHtml(item));
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('renders correctly with empty categories array', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }),
        async (heading) => {
          // Render the component with empty categories array
          const element = createElement(TechMasterySection, {
            data: { heading, categories: [] },
          });
          const html = renderToStaticMarkup(element);

          // Assert that the heading is still present
          expect(html).toContain(escapeHtml(heading));
        },
      ),
      { numRuns: 100 },
    );
  });

  it('renders correctly with categories that have empty items arrays', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          heading: fc.string({ minLength: 1 }),
          categories: fc.array(
            fc.record({
              name: fc.string({ minLength: 1 }),
              items: fc.constant([]),
            }),
          ),
        }),
        async ({ heading, categories }) => {
          // Render the component with categories that have no items
          const element = createElement(TechMasterySection, {
            data: { heading, categories },
          });
          const html = renderToStaticMarkup(element);

          // Assert that the heading appears
          expect(html).toContain(escapeHtml(heading));

          // Assert that category names still appear even with no items
          for (const category of categories) {
            expect(html).toContain(escapeHtml(category.name));
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('renders correctly with single category and single item', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          heading: fc.string({ minLength: 1 }),
          categoryName: fc.string({ minLength: 1 }),
          itemName: fc.string({ minLength: 1 }),
        }),
        async ({ heading, categoryName, itemName }) => {
          // Render with minimal data
          const element = createElement(TechMasterySection, {
            data: {
              heading,
              categories: [{ name: categoryName, items: [itemName] }],
            },
          });
          const html = renderToStaticMarkup(element);

          // Assert all content is present
          expect(html).toContain(escapeHtml(heading));
          expect(html).toContain(escapeHtml(categoryName));
          expect(html).toContain(escapeHtml(itemName));
        },
      ),
      { numRuns: 100 },
    );
  });
});

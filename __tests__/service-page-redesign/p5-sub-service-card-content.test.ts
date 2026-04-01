// Feature: service-page-redesign, Property 5: Sub-service card renders all content fields

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import SubServiceCard from '@/components/service-page/SubServiceCard';

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
 * Validates: Requirements 3.2, 3.3, 3.4
 *
 * Property: For any SubService object, the rendered SubServiceCard output
 * should contain the sub-service's name, description, every feature string,
 * and every technology string.
 */
describe('P5: Sub-service card renders all content fields', () => {
  it('renders name, description, all features, and all technologies', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1 }),
          description: fc.string({ minLength: 1 }),
          features: fc.array(fc.string({ minLength: 1 })),
          technologies: fc.array(fc.string({ minLength: 1 })),
        }),
        async ({ name, description, features, technologies }) => {
          // Render the component to static HTML
          const element = createElement(SubServiceCard, {
            icon: 'Box', // Use a valid Lucide icon name
            name,
            description,
            features,
            technologies,
          });
          const html = renderToStaticMarkup(element);

          // Assert that name and description are present in the rendered output
          expect(html).toContain(escapeHtml(name));
          expect(html).toContain(escapeHtml(description));

          // Assert that every feature string appears in the rendered output
          for (const feature of features) {
            expect(html).toContain(escapeHtml(feature));
          }

          // Assert that every technology string appears in the rendered output
          for (const technology of technologies) {
            expect(html).toContain(escapeHtml(technology));
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('renders correctly with empty features array', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1 }),
          description: fc.string({ minLength: 1 }),
          technologies: fc.array(fc.string({ minLength: 1 })),
        }),
        async ({ name, description, technologies }) => {
          // Render the component with empty features array
          const element = createElement(SubServiceCard, {
            icon: 'Box',
            name,
            description,
            features: [],
            technologies,
          });
          const html = renderToStaticMarkup(element);

          // Assert that name and description are present
          expect(html).toContain(escapeHtml(name));
          expect(html).toContain(escapeHtml(description));

          // Assert that all technologies are present
          for (const technology of technologies) {
            expect(html).toContain(escapeHtml(technology));
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('renders correctly with empty technologies array', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1 }),
          description: fc.string({ minLength: 1 }),
          features: fc.array(fc.string({ minLength: 1 })),
        }),
        async ({ name, description, features }) => {
          // Render the component with empty technologies array
          const element = createElement(SubServiceCard, {
            icon: 'Box',
            name,
            description,
            features,
            technologies: [],
          });
          const html = renderToStaticMarkup(element);

          // Assert that name and description are present
          expect(html).toContain(escapeHtml(name));
          expect(html).toContain(escapeHtml(description));

          // Assert that all features are present
          for (const feature of features) {
            expect(html).toContain(escapeHtml(feature));
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('renders correctly with both empty features and technologies', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1 }),
          description: fc.string({ minLength: 1 }),
        }),
        async ({ name, description }) => {
          // Render the component with both arrays empty
          const element = createElement(SubServiceCard, {
            icon: 'Box',
            name,
            description,
            features: [],
            technologies: [],
          });
          const html = renderToStaticMarkup(element);

          // Assert that name and description are still present
          expect(html).toContain(escapeHtml(name));
          expect(html).toContain(escapeHtml(description));
        },
      ),
      { numRuns: 100 },
    );
  });
});

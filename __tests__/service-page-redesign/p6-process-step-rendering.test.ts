// Feature: service-page-redesign, Property 6: Process step renders number, heading, and description

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ServiceProcessSection from '@/components/service-page/ServiceProcessSection';

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
 * Validates: Requirements 4.2, 4.3
 *
 * Property: For any ProcessStep object, the rendered step output should contain
 * the step number, heading, and description.
 */
describe('P6: Process step renders number, heading, and description', () => {
  it('renders step number, heading, and description for any process step', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          number: fc.integer({ min: 1, max: 4 }),
          heading: fc.string({ minLength: 1 }),
          description: fc.string({ minLength: 1 }),
        }),
        async ({ number, heading, description }) => {
          // Create a single-step array to test individual step rendering
          const processSteps = [{ number, heading, description }];

          // Render the component to static HTML
          const element = createElement(ServiceProcessSection, {
            processSteps,
          });
          const html = renderToStaticMarkup(element);

          // Assert that the step number appears in the rendered output
          expect(html).toContain(String(number));

          // Assert that the heading appears in the rendered output
          expect(html).toContain(escapeHtml(heading));

          // Assert that the description appears in the rendered output
          expect(html).toContain(escapeHtml(description));
        },
      ),
      { numRuns: 100 },
    );
  });

  it('renders all four process steps with their respective content', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(
          fc.record({
            number: fc.constant(1),
            heading: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
          }),
          fc.record({
            number: fc.constant(2),
            heading: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
          }),
          fc.record({
            number: fc.constant(3),
            heading: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
          }),
          fc.record({
            number: fc.constant(4),
            heading: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
          }),
        ),
        async ([step1, step2, step3, step4]) => {
          const processSteps = [step1, step2, step3, step4];

          // Render the component to static HTML
          const element = createElement(ServiceProcessSection, {
            processSteps,
          });
          const html = renderToStaticMarkup(element);

          // Assert that all step numbers appear
          for (const step of processSteps) {
            expect(html).toContain(String(step.number));
            expect(html).toContain(escapeHtml(step.heading));
            expect(html).toContain(escapeHtml(step.description));
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('renders correctly with empty strings for heading and description', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 4 }),
        async (number) => {
          // Test with empty strings (edge case)
          const processSteps = [
            {
              number,
              heading: '',
              description: '',
            },
          ];

          // Render the component to static HTML
          const element = createElement(ServiceProcessSection, {
            processSteps,
          });
          const html = renderToStaticMarkup(element);

          // Assert that the step number still appears
          expect(html).toContain(String(number));
        },
      ),
      { numRuns: 100 },
    );
  });
});

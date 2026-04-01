// Feature: service-page-redesign, Property 1: JSON field round-trip

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type {
  StatItem,
  SubService,
  ProcessStep,
  TechSection,
  TechCategory,
  ToolsSection,
  ToolCategory,
  ToolItem,
} from '@/lib/actions/services';

/**
 * Validates: Requirements 1.3
 *
 * Property 1: JSON field round-trip
 * For any valid JSON field value, serializing to JSON and deserializing back
 * should produce a structurally equivalent value.
 */

describe('P1: JSON field round-trip', () => {
  // ── StatItem[] ──────────────────────────────────────────────────────────────

  it('StatItem[] round-trips through JSON serialization', () => {
    const statItemArb = fc.record({
      value: fc.string(),
      label: fc.string(),
    });

    fc.assert(
      fc.property(
        fc.array(statItemArb),
        (stats: StatItem[]) => {
          const roundTripped = JSON.parse(JSON.stringify(stats));
          expect(roundTripped).toEqual(stats);
        },
      ),
      { numRuns: 100 },
    );
  });

  // ── SubService[] ────────────────────────────────────────────────────────────

  it('SubService[] round-trips through JSON serialization', () => {
    const subServiceArb = fc.record({
      icon: fc.string(),
      name: fc.string(),
      description: fc.string(),
      features: fc.array(fc.string()),
      technologies: fc.array(fc.string()),
    });

    fc.assert(
      fc.property(
        fc.array(subServiceArb),
        (subServices: SubService[]) => {
          const roundTripped = JSON.parse(JSON.stringify(subServices));
          expect(roundTripped).toEqual(subServices);
        },
      ),
      { numRuns: 100 },
    );
  });

  // ── ProcessStep[] ───────────────────────────────────────────────────────────

  it('ProcessStep[] round-trips through JSON serialization', () => {
    const processStepArb = fc.record({
      number: fc.integer({ min: 1, max: 4 }),
      heading: fc.string(),
      description: fc.string(),
    });

    fc.assert(
      fc.property(
        fc.array(processStepArb, { minLength: 4, maxLength: 4 }),
        (steps: ProcessStep[]) => {
          const roundTripped = JSON.parse(JSON.stringify(steps));
          expect(roundTripped).toEqual(steps);
        },
      ),
      { numRuns: 100 },
    );
  });

  // ── TechSection ─────────────────────────────────────────────────────────────

  it('TechSection round-trips through JSON serialization', () => {
    const techCategoryArb: fc.Arbitrary<TechCategory> = fc.record({
      name: fc.string(),
      items: fc.array(fc.string()),
    });

    const techSectionArb: fc.Arbitrary<TechSection> = fc.record({
      heading: fc.string(),
      categories: fc.array(techCategoryArb),
    });

    fc.assert(
      fc.property(
        techSectionArb,
        (techSection: TechSection) => {
          const roundTripped = JSON.parse(JSON.stringify(techSection));
          expect(roundTripped).toEqual(techSection);
        },
      ),
      { numRuns: 100 },
    );
  });

  // ── ToolsSection ────────────────────────────────────────────────────────────

  it('ToolsSection round-trips through JSON serialization', () => {
    const toolItemArb: fc.Arbitrary<ToolItem> = fc.record({
      name: fc.string(),
      icon: fc.string(),
    });

    const toolCategoryArb: fc.Arbitrary<ToolCategory> = fc.record({
      name: fc.string(),
      tools: fc.array(toolItemArb),
    });

    const toolsSectionArb: fc.Arbitrary<ToolsSection> = fc.record({
      description: fc.string(),
      categories: fc.array(toolCategoryArb),
    });

    fc.assert(
      fc.property(
        toolsSectionArb,
        (toolsSection: ToolsSection) => {
          const roundTripped = JSON.parse(JSON.stringify(toolsSection));
          expect(roundTripped).toEqual(toolsSection);
        },
      ),
      { numRuns: 100 },
    );
  });
});

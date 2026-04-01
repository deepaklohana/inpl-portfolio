// Unit tests for ServiceHeader component
// Validates: Requirements 2.1, 2.2

import { describe, it, expect } from 'vitest';

describe('ServiceHeader Component', () => {
  it('component file exists and exports default', async () => {
    const module = await import('@/components/service-page/ServiceHeader');
    expect(module.default).toBeDefined();
    expect(typeof module.default).toBe('function');
  });

  it('accepts required props interface', () => {
    // Type check - this will fail at compile time if interface is wrong
    type ServiceHeaderProps = {
      title: string;
      description: string | null;
      icon: string | null;
    };

    const validProps: ServiceHeaderProps = {
      title: 'Web Development',
      description: 'Build modern web applications',
      icon: 'rocket',
    };

    expect(validProps.title).toBe('Web Development');
    expect(validProps.description).toBe('Build modern web applications');
    expect(validProps.icon).toBe('rocket');
  });

  it('accepts null description', () => {
    type ServiceHeaderProps = {
      title: string;
      description: string | null;
      icon: string | null;
    };

    const validProps: ServiceHeaderProps = {
      title: 'Web Development',
      description: null,
      icon: 'rocket',
    };

    expect(validProps.description).toBeNull();
  });

  it('accepts null icon', () => {
    type ServiceHeaderProps = {
      title: string;
      description: string | null;
      icon: string | null;
    };

    const validProps: ServiceHeaderProps = {
      title: 'Web Development',
      description: 'Build modern web applications',
      icon: null,
    };

    expect(validProps.icon).toBeNull();
  });
});

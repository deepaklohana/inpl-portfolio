'use client';

import React from 'react';
import Button from '@/components/ui/Button';

interface ArticleCTAProps {
  title: string;
  subtitle: string;
  primaryLink?: string;
  primaryText?: string;
  secondaryLink?: string;
  secondaryText?: string;
}

export function ArticleCTA({
  title,
  subtitle,
  primaryLink = '#',
  primaryText = 'Start Free Trial',
  secondaryLink,
  secondaryText,
}: ArticleCTAProps) {
  return (
    <div className="mt-16 mb-8 p-8 sm:p-12 rounded-3xl bg-[#2251B5] text-center not-prose text-white overflow-hidden relative">
      {/* Decorative background ellipses */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E96429] opacity-30 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#E96429] opacity-30 blur-2xl rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <h3 className="text-3xl font-bold mb-4">{title}</h3>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">{subtitle}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={primaryLink} className="w-full sm:w-auto">
            <Button variant="white" className="w-full">{primaryText}</Button>
          </a>
          {secondaryText && secondaryLink && (
            <a href={secondaryLink} className="w-full sm:w-auto">
              <Button variant="glass" className="w-full">{secondaryText}</Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

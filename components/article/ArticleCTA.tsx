'use client';

import React from 'react';

interface ArticleCTAProps {
  title?: string;
  subtitle?: string;
  primaryLink?: string;
  primaryText?: string;
  secondaryLink?: string;
  secondaryText?: string;
}

export function ArticleCTA({
  title = "Ready to Transform Your Analytics?",
  subtitle = "Start your free 30-day trial today. No credit card required.",
  primaryLink = '#',
  primaryText = 'Start Free Trial',
  secondaryLink = '#',
  secondaryText = 'Schedule Demo',
}: ArticleCTAProps) {
  return (
    <div 
      className="my-16 rounded-[16px] text-center not-prose flex flex-col items-center max-w-[800px] mx-auto w-full"
      style={{
        background: 'linear-gradient(90deg, rgba(34, 81, 181, 1) 0%, rgba(54, 86, 174, 1) 7%, rgba(71, 91, 168, 1) 14%, rgba(86, 94, 161, 1) 21%, rgba(100, 97, 154, 1) 29%, rgba(114, 100, 146, 1) 36%, rgba(128, 102, 138, 1) 43%, rgba(141, 104, 130, 1) 50%, rgba(154, 105, 122, 1) 57%, rgba(168, 105, 112, 1) 64%, rgba(181, 105, 102, 1) 71%, rgba(194, 105, 91, 1) 79%, rgba(207, 104, 78, 1) 86%, rgba(220, 102, 63, 1) 93%, rgba(233, 100, 41, 1) 100%)',
        padding: '32px 24px',
      }}
    >
      <div className="flex flex-col items-center gap-6 sm:px-4">
        
        {/* Texts */}
        <div className="flex flex-col items-center gap-2">
          <h3 
            className="text-white! text-[24px] sm:text-[30px] font-bold text-center m-0!"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: '1.2em' }}
          >
            {title}
          </h3>
          <p 
            className="text-[rgba(255,255,255,0.9)]! text-[16px] sm:text-[18px] text-center m-0!"
            style={{ fontFamily: "'Inter', sans-serif", lineHeight: '1.555em' }}
          >
            {subtitle}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <a href={primaryLink} className="w-full sm:w-auto no-underline!">
            <button 
              className="w-full sm:w-auto bg-white text-[#2251B5]! font-bold rounded-[12px] hover:bg-gray-100 flex items-center justify-center transition-colors no-underline!"
              style={{ padding: '14px 28px', fontSize: '16px', lineHeight: '1.5em', fontFamily: "'Inter', sans-serif" }}
            >
              {primaryText}
            </button>
          </a>
          
          {(secondaryText || (!secondaryText && subtitle.includes('trial'))) && (
            <a href={secondaryLink} className="w-full sm:w-auto no-underline!">
              <button 
                className="w-full sm:w-auto text-white! font-bold rounded-[12px] border border-white flex items-center justify-center transition-colors no-underline!"
                style={{ padding: '14px 30px', fontSize: '16px', lineHeight: '1.5em', fontFamily: "'Inter', sans-serif", backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                {secondaryText || 'Schedule Demo'}
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

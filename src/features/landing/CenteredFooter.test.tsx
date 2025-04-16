import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import rawMessages from '@/locales/en.json';

import { CenteredFooter } from './CenteredFooter';

// ✅ Fix: Ensure messages match expected format
const messages = {
  ...rawMessages,
  FAQ: {
    ...rawMessages.FAQ,
    items: {}, // Type-safe workaround
  },
};

describe('CenteredFooter', () => {
  describe('Render method', () => {
    it('should have copyright information', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CenteredFooter logo={null} name="" iconList={null} legalLinks={null}>
            Random children
          </CenteredFooter>
        </NextIntlClientProvider>,
      );

      const copyright = screen.getByText(/© Copyright/);

      expect(copyright).toBeInTheDocument();
    });
  });
});

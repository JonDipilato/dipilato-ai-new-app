import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { CTA } from '@/templates/CTA';
import { DemoBanner } from '@/templates/DemoBanner';
import { FAQ } from '@/templates/FAQ';
import { Features } from '@/templates/Features';
import { Footer } from '@/templates/Footer';
import { Hero } from '@/templates/Hero';
import { HowItWorks } from '@/templates/HowItWorks';
import { Navbar } from '@/templates/Navbar';
import { Pricing } from '@/templates/Pricing';
import { Sponsors } from '@/templates/Sponsors';
import { SuccessStories } from '@/templates/SuccessStories';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const IndexPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);

  return (
    <>
      <DemoBanner />
      <Navbar />
      <Hero />
      <section style={{ marginTop: '4rem', marginBottom: '4rem', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
        >
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
            🎯 Try Our AI Receptionist Demo
          </h2>
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            Experience how our AI handles appointment booking, customer questions, and scheduling - just like a real receptionist would.
          </p>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.9rem',
          }}
          >
            💡
            {' '}
            <strong>Try saying:</strong>
            {' '}
            "I'd like to book a haircut appointment" or "What are your hours?"
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: `
          <elevenlabs-convai agent-id="wdnnLYjeITsUPq7ORVkH"></elevenlabs-convai>
          <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
        `,
            }}
          />
        </div>
      </section>

      <Sponsors />
      <Features />
      <HowItWorks />
      <SuccessStories />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
};

export default IndexPage;

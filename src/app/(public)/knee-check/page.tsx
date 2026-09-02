import CredentialsBlock from '@/components/public/CredentialsBlock';
import YouTubeEmbed from '@/components/public/YouTubeEmbed';
import KneeCheckCTAButton from '@/components/public/KneeCheckCTAButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Is Your Knee Pain Something to Worry About? | Dr. Pulak Vatsya',
};

export default function KneeCheckPage() {
  return (
    <div className="video-landing">
      {/* Above Fold */}
      <section className="video-landing__above-fold">
        <div className="video-landing__photo">PV</div>
        <h1 className="video-landing__h1">Is Your Knee Pain Something to Worry About?</h1>
        <p className="video-landing__explainer">Take our free 90-second knee health check to find out.</p>
        <KneeCheckCTAButton>
          Start Free Knee Check
        </KneeCheckCTAButton>
      </section>

      {/* Below Fold */}
      <section className="video-landing__below-fold">
        <div className="video-landing__section">
          <YouTubeEmbed videoId="placeholder-video-id" title="Learn more about your knee pain" />
        </div>
        
        <div className="video-landing__section">
          <CredentialsBlock />
        </div>

        <div className="video-landing__centered-cta">
          <KneeCheckCTAButton>
            Start Free Knee Check
          </KneeCheckCTAButton>
        </div>
      </section>
    </div>
  );
}



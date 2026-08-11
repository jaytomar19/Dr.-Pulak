import CredentialsBlock from '@/components/public/CredentialsBlock';
import GoogleReviewsWidget from '@/components/public/GoogleReviewsWidget';
import YouTubeEmbed from '@/components/public/YouTubeEmbed';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Worried About Your ACL? Find Out in 90 Seconds',
};

export default function AclCheckPage() {
  return (
    <div className="video-landing">
      <section className="video-landing__above-fold">
        <div className="video-landing__photo">PV</div>
        <h1 className="video-landing__h1">Worried About Your ACL? Find Out in 90 Seconds</h1>
        <p className="video-landing__explainer">Take our free 90-second knee health check to find out.</p>
        <Link href="/assessment" className="video-landing__cta">
          Start Free Knee Check
        </Link>
      </section>

      <section className="video-landing__below-fold">
        <div className="video-landing__section">
          <YouTubeEmbed videoId="placeholder-acl-video" title="Understanding ACL Injuries" />
        </div>
        
        <div className="video-landing__section">
          <CredentialsBlock />
        </div>
        
        <div className="video-landing__section">
          <GoogleReviewsWidget maxReviews={3} />
        </div>

        <div className="video-landing__centered-cta">
          <Link href="/assessment" className="video-landing__cta">
            Start Free Knee Check
          </Link>
        </div>
      </section>
    </div>
  );
}

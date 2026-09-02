import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/shared/Reveal';
import Stagger from '@/components/shared/Stagger';
import ConditionHubCards from '@/components/public/ConditionHubCards';

export const metadata: Metadata = {
  title: 'Knee & Joint Treatments | Dr. Pulak Vatsya',
  description: 'Explore evidence-based orthopaedic treatments including robotic knee replacement, direct anterior hip replacement, ACL reconstruction, and non-surgical knee care.',
};

export default function TreatmentsPage() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1180px', margin: '0 auto' }}>
      <Reveal variant="fade-up">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="eyebrow">EVIDENCE-BASED CARE</span>
          <h1 style={{ fontSize: '2.75rem', color: 'var(--color-navy)', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Orthopaedic Treatments & Surgical Care
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.7 }}>
            Dr. Pulak Vatsya combines fellowship-trained surgical precision with a conservative-first clinical philosophy to preserve joint function and improve mobility.
          </p>
        </div>
      </Reveal>

      {/* Main Condition Hub Cards */}
      <ConditionHubCards />

      {/* Detailed Treatment Pathways */}
      <section style={{ marginTop: '5rem' }}>
        <Reveal variant="fade-up">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow">CLINICAL PATHWAYS</span>
            <h2 style={{ fontSize: '2.25rem', color: 'var(--color-navy)' }}>Specialized Surgical & Non-Surgical Options</h2>
          </div>
        </Reveal>

        <Stagger className="hub-cards__grid" staggerInterval={100}>
          <div className="hub-cards__wrapper">
            <div className="hub-cards__card">
              <div className="hub-cards__card-top">
                <span className="hub-cards__card-number">01</span>
                <span className="hub-cards__card-category">ROBOTIC ARTHROPLASTY</span>
              </div>
              <div className="hub-cards__card-body">
                <h3 className="hub-cards__card-title">Knee Replacement</h3>
                <p className="hub-cards__card-desc">
                  Sub-millimeter implant alignment using 3D CT mapping and robotic assistance for long-lasting joint restoration.
                </p>
              </div>
              <div className="hub-cards__card-footer">
                <Link href="/treatments/knee-replacement/" className="hub-cards__card-link">
                  <span>View Knee Replacement Details</span>
                  <span className="hub-cards__arrow">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="hub-cards__wrapper">
            <div className="hub-cards__card">
              <div className="hub-cards__card-top">
                <span className="hub-cards__card-number">02</span>
                <span className="hub-cards__card-category">DIRECT ANTERIOR APPROACH</span>
              </div>
              <div className="hub-cards__card-body">
                <h3 className="hub-cards__card-title">Hip Replacement (DAA)</h3>
                <p className="hub-cards__card-desc">
                  Muscle-sparing anterior hip replacement enabling faster post-operative mobilization and enhanced joint stability.
                </p>
              </div>
              <div className="hub-cards__card-footer">
                <Link href="/treatments/hip-replacement/" className="hub-cards__card-link">
                  <span>View Hip Replacement Details</span>
                  <span className="hub-cards__arrow">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="hub-cards__wrapper">
            <div className="hub-cards__card">
              <div className="hub-cards__card-top">
                <span className="hub-cards__card-number">03</span>
                <span className="hub-cards__card-category">SPORTS MEDICINE</span>
              </div>
              <div className="hub-cards__card-body">
                <h3 className="hub-cards__card-title">ACL Reconstruction & Repair</h3>
                <p className="hub-cards__card-desc">
                  Anatomical single-bundle and double-bundle ACL reconstruction techniques tailored for athletes and active individuals.
                </p>
              </div>
              <div className="hub-cards__card-footer">
                <Link href="/treatments/acl-surgery/" className="hub-cards__card-link">
                  <span>View ACL Reconstruction Details</span>
                  <span className="hub-cards__arrow">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="hub-cards__wrapper">
            <div className="hub-cards__card">
              <div className="hub-cards__card-top">
                <span className="hub-cards__card-number">04</span>
                <span className="hub-cards__card-category">JOINT PRESERVATION</span>
              </div>
              <div className="hub-cards__card-body">
                <h3 className="hub-cards__card-title">Knee Pain Care</h3>
                <p className="hub-cards__card-desc">
                  Structured clinical evaluation, intra-articular therapies, and physical conditioning for non-surgical pain management.
                </p>
              </div>
              <div className="hub-cards__card-footer">
                <Link href="/treatments/knee-pain/" className="hub-cards__card-link">
                  <span>View Knee Pain Care Details</span>
                  <span className="hub-cards__arrow">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="hub-cards__wrapper">
            <div className="hub-cards__card">
              <div className="hub-cards__card-top">
                <span className="hub-cards__card-number">05</span>
                <span className="hub-cards__card-category">REHABILITATION</span>
              </div>
              <div className="hub-cards__card-body">
                <h3 className="hub-cards__card-title">Knee Reset Rehab</h3>
                <p className="hub-cards__card-desc">
                  90-day structured joint recovery protocol focusing on muscle rebalancing, tracking stability, and pain reduction.
                </p>
              </div>
              <div className="hub-cards__card-footer">
                <Link href="/knee-reset/rehab/" className="hub-cards__card-link">
                  <span>Explore Knee Reset Rehab</span>
                  <span className="hub-cards__arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        </Stagger>
      </section>

      {/* Banner CTA */}
      <section style={{ marginTop: '5rem', padding: '3.5rem 2rem', background: 'var(--color-navy)', color: 'white', borderRadius: '24px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Unsure Which Treatment Fits Your Knee Condition?</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto 2rem' }}>
          Take our free doctor-approved 90-second Knee Reset Assessment to receive instant clinical guidance and risk categorization.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/knee-reset/assessment/" className="btn btn--secondary btn--lg">
            Take Knee Reset Assessment
          </Link>
          <Link href="/consult/" className="btn btn--outline btn--lg">
            Book OPD / Online Consult
          </Link>
        </div>
      </section>
    </div>
  );
}

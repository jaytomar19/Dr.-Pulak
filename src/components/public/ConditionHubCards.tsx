import Link from 'next/link';
import Stagger from '@/components/shared/Stagger';

export default function ConditionHubCards() {
  const hubs = [
    { 
      number: '01',
      category: 'ROBOTIC ARTHROPLASTY',
      title: 'Knee Replacement', 
      desc: 'Advanced robotic-assisted & minimally invasive solutions for severe osteoarthritis, mobility loss, and joint degeneration.', 
      link: '/treatments/knee-replacement/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18" />
          <path d="M3 12h18" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
    { 
      number: '02',
      category: 'MUSCLE-SPARING HIP',
      title: 'Hip Replacement (DAA)', 
      desc: 'Direct anterior approach hip arthroplasty enabling muscle preservation, rapid walking recovery, and joint stability.', 
      link: '/treatments/hip-replacement/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
    { 
      number: '03',
      category: 'SPORTS MEDICINE',
      title: 'ACL Surgery', 
      desc: 'Precision ligament reconstruction and anatomical repair designed for stability, rapid recovery, and active lifestyle restoration.', 
      link: '/treatments/acl-surgery/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      )
    },
    { 
      number: '04',
      category: 'CONSERVATIVE CARE',
      title: 'Knee Pain Care', 
      desc: 'Targeted clinical diagnostic evaluation, cartilage preservation, and structured non-surgical management protocols.', 
      link: '/treatments/knee-pain/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="5" r="2" />
          <path d="M10 22v-6l-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4l-2 2v6" />
        </svg>
      )
    },
    { 
      number: '05',
      category: 'FREE ASSESSMENT',
      title: 'Knee Reset Assessment', 
      desc: 'Take our doctor-approved 90-second knee assessment to evaluate symptom severity and receive personalized guidance.', 
      link: '/knee-reset/assessment/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      )
    },
    { 
      number: '06',
      category: 'HIP REPLACEMENT',
      title: 'Hip Replacement', 
      desc: 'Comprehensive evaluation and advanced surgical solutions for hip arthritis, pain, and mobility restoration.', 
      link: '/treatments/hip-replacement/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
        </svg>
      )
    },
    { 
      number: '07',
      category: 'KNEE REHAB',
      title: 'Knee Rehab', 
      desc: 'Personalized rehabilitation programs designed to strengthen, restore movement, and support long-term joint health.', 
      link: '/knee-reset/rehab/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M13 4v16" />
          <path d="M17 8l-4-4-4 4" />
          <path d="M17 16l-4 4-4-4" />
        </svg>
      )
    },
    { 
      number: '08',
      category: 'KNEE RECAP',
      title: 'Knee Recap', 
      desc: 'A comprehensive summary of your knee condition, treatment progress, and next steps for better outcomes.', 
      link: '/insights/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21.5 2v6h-6" />
          <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      )
    },
  ];

  return (
    <div className="hub-cards">
      <Stagger className="hub-cards__grid" staggerInterval={80}>
        {hubs.map((hub, idx) => (
          <div key={idx} className="hub-cards__wrapper">
            <Link href={hub.link} className="hub-cards__card" data-cursor="card">
              <div className="hub-cards__card-top">
                <div className="hub-cards__card-icon-wrap">
                  {hub.icon}
                </div>
                <div className="hub-cards__card-meta">
                  <span className="hub-cards__card-number">{hub.number}</span>
                  <span className="hub-cards__card-category">{hub.category}</span>
                </div>
              </div>

              <div className="hub-cards__card-body">
                <h3 className="hub-cards__card-title">{hub.title}</h3>
                <p className="hub-cards__card-desc">{hub.desc}</p>
              </div>

              <div className="hub-cards__card-footer">
                <span className="hub-cards__card-link">
                  <span>Explore Condition</span>
                  <span className="hub-cards__arrow" aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </div>
        ))}
      </Stagger>

      <div className="hub-cards__trust-banner">
        <span className="hub-cards__trust-icon">🛡️</span>
        <span>Evidence-Based Care. Better Outcomes.</span>
      </div>
    </div>
  );
}

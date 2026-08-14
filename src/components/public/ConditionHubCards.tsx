import Link from 'next/link';
import Stagger from '@/components/shared/Stagger';

export default function ConditionHubCards() {
  const hubs = [
    { 
      number: '01',
      category: 'JOINT REPLACEMENT',
      title: 'Knee Replacement', 
      desc: 'Advanced robotic-assisted & minimally invasive solutions for severe osteoarthritis, mobility loss, and joint degeneration.', 
      link: '/knee-replacement/',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18" />
          <path d="M3 12h18" />
          <circle cx="12" cy="12" r="3" fill="var(--color-primary-subtle)" />
        </svg>
      )
    },
    { 
      number: '02',
      category: 'SPORTS MEDICINE',
      title: 'ACL Injury & Arthroscopy', 
      desc: 'Precision ligament reconstruction and anatomical repair designed for stability, rapid recovery, and active lifestyle restoration.', 
      link: '/acl/',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
          <rect x="3" y="3" width="18" height="18" rx="4" />
        </svg>
      )
    },
    { 
      number: '03',
      category: 'CONSERVATIVE CARE',
      title: 'Chronic Knee Pain', 
      desc: 'Targeted clinical diagnostic evaluation, cartilage preservation, and structured non-surgical management protocols.', 
      link: '/knee-pain/',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      )
    },
  ];

  return (
    <div className="hub-cards">
      <Stagger className="hub-cards__grid" staggerInterval={100}>
        {hubs.map((hub, idx) => (
          <div key={idx} className="hub-cards__wrapper">
            <div className="hub-cards__card" data-cursor="card">
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
                <Link href={hub.link} className="hub-cards__card-link" data-cursor="link">
                  <span>Explore Condition</span>
                  <span className="hub-cards__arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Stagger>
    </div>
  );
}

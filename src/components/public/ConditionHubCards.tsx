import Link from 'next/link';

export default function ConditionHubCards() {
  const hubs = [
    { title: 'Knee Replacement', desc: 'Expert solutions for severe knee arthritis and joint damage.', link: '/knee-replacement/', icon: '🦵' },
    { title: 'ACL Injury', desc: 'Advanced arthroscopic treatments for ligament tears.', link: '/acl/', icon: '🏃' },
    { title: 'Knee Pain', desc: 'Comprehensive diagnosis and management of chronic knee pain.', link: '/knee-pain/', icon: '⚡' },
  ];

  return (
    <div className="hub-cards">
      <div className="hub-cards__grid">
        {hubs.map((hub, idx) => (
          <div key={idx} className="hub-cards__card">
            <div className="hub-cards__card-icon">{hub.icon}</div>
            <h3 className="hub-cards__card-title">{hub.title}</h3>
            <p className="hub-cards__card-desc">{hub.desc}</p>
            <Link href={hub.link} className="hub-cards__card-link">
              Learn More →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

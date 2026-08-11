import Link from 'next/link';

export default function ConditionHubCards() {
  const hubs = [
    { 
      number: '01',
      category: 'JOINT REPLACEMENT',
      title: 'Knee Replacement', 
      desc: 'Advanced robotic-assisted & minimally invasive solutions for severe osteoarthritis, mobility loss, and joint degeneration.', 
      link: '/knee-replacement/' 
    },
    { 
      number: '02',
      category: 'SPORTS MEDICINE',
      title: 'ACL Injury & Arthroscopy', 
      desc: 'Precision ligament reconstruction and anatomical repair designed for stability, rapid recovery, and active lifestyle restoration.', 
      link: '/acl/' 
    },
    { 
      number: '03',
      category: 'CONSERVATIVE CARE',
      title: 'Chronic Knee Pain', 
      desc: 'Targeted clinical diagnostic evaluation, cartilage preservation, and structured non-surgical management protocols.', 
      link: '/knee-pain/' 
    },
  ];

  return (
    <div className="hub-cards">
      <div className="hub-cards__grid">
        {hubs.map((hub, idx) => (
          <div key={idx} className="hub-cards__card">
            <div className="hub-cards__card-top">
              <span className="hub-cards__card-number">{hub.number}</span>
              <span className="hub-cards__card-category">{hub.category}</span>
            </div>
            <div className="hub-cards__card-body">
              <h3 className="hub-cards__card-title">{hub.title}</h3>
              <p className="hub-cards__card-desc">{hub.desc}</p>
            </div>
            <div className="hub-cards__card-footer">
              <Link href={hub.link} className="hub-cards__card-link">
                <span>Explore Condition</span>
                <span className="hub-cards__arrow">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

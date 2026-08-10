export default function CredentialsBlock() {
  return (
    <div className="credentials">
      <div className="credentials__header">
        <h2 className="credentials__name">Dr. Pulak Vatsya</h2>
        <h3 className="credentials__title">Senior Orthopaedic Surgeon</h3>
        <p className="credentials__clinic">StepUp Joints, Lajpat Nagar</p>
      </div>
      
      <div className="credentials__stats">
        <div className="credentials__stat-item">
          <span className="credentials__stat-icon">🎓</span>
          <span className="credentials__stat-value">MBBS, MS Orthopaedics</span>
          <span className="credentials__stat-label">Fellowship in Joint Replacement</span>
        </div>
        <div className="credentials__stat-item">
          <span className="credentials__stat-icon">⏱️</span>
          <span className="credentials__stat-value">15+ Years</span>
          <span className="credentials__stat-label">of Experience</span>
        </div>
        <div className="credentials__stat-item">
          <span className="credentials__stat-icon">📋</span>
          <span className="credentials__stat-value">5000+</span>
          <span className="credentials__stat-label">Surgeries Performed</span>
        </div>
      </div>
    </div>
  );
}

export default function LocationMapContact() {
  return (
    <div className="location-contact">
      <div className="location-contact__info">
        <h2>Clinic Location & Contact</h2>
        <h3>StepUp Joints</h3>
        <p className="location-contact__address">Lajpat Nagar, New Delhi</p>
        <p className="location-contact__phone">Phone: +91 XXXXXXXXXX</p>
        <p className="location-contact__email">Email: contact@drpulakvatsya.com</p>
        <div className="location-contact__hours">
          <h4>Working Hours</h4>
          <p>Mon-Sat: 10:00 AM - 6:00 PM</p>
        </div>
      </div>
      <div className="location-contact__map">
        <div style={{ width: '100%', height: '300px', backgroundColor: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Map Loading... (Placeholder)
        </div>
      </div>
    </div>
  );
}

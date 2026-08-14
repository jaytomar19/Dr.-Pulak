export interface PracticeConfig {
  doctorName: string;
  specialty: string;
  clinicName: string;
  location: string;
  fullAddress: string;
  phone: string;
  phoneRaw: string;
  phoneTel: string;
  email: string;
  whatsappNumber: string;
  whatsappUrl: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl?: string;
  isPlaceholder: boolean;
}

export const PRACTICE_CONFIG: PracticeConfig = {
  doctorName: 'Dr. Pulak Vatsya',
  specialty: 'Orthopaedic Knee Specialist & Joint Surgeon',
  clinicName: 'Step Up Joints',
  location: 'Lajpat Nagar 4, New Delhi',
  fullAddress: '1st Floor, 17-A Ring Road, Vikram Vihar, Lajpat Nagar 4, New Delhi 110024',
  phone: '+91 9711288726',
  phoneRaw: '9711288726',
  phoneTel: 'tel:+919711288726',
  email: 'Pulakvatsya7@gmail.com',
  whatsappNumber: '9711288726',
  whatsappUrl: 'https://wa.me/919711288726',
  googleMapsUrl: 'https://maps.app.goo.gl/GfqEFY5vKPBXV41a8?g_st=aw',
  googleMapsEmbedUrl: undefined,
  isPlaceholder: false,
};

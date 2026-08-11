export interface PracticeConfig {
  doctorName: string;
  specialty: string;
  clinicName: string;
  location: string;
  fullAddress: string;
  phone: string;
  email: string;
  whatsappNumber?: string;
  googleMapsUrl?: string;
  googleMapsEmbedUrl?: string;
  isPlaceholder: boolean;
}

export const PRACTICE_CONFIG: PracticeConfig = {
  doctorName: 'Dr. Pulak Vatsya',
  specialty: 'Orthopaedic Knee Specialist & Joint Surgeon',
  clinicName: 'StepUp Joints',
  location: 'Lajpat Nagar, South Delhi',
  fullAddress: '[CLIENT_INPUT_REQUIRED: StepUp Joints Full Postal Address, Lajpat Nagar, New Delhi]',
  phone: '[CLIENT_INPUT_REQUIRED: Phone Number]',
  email: 'contact@drpulakvatsya.com',
  googleMapsUrl: undefined,
  googleMapsEmbedUrl: undefined,
  isPlaceholder: true,
};

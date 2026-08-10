import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Dr. Pulak Vatsya - Orthopaedic Knee Surgeon';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #0f766e, #134e4a)',
          color: 'white',
          padding: '4rem',
        }}
      >
        <h1
          style={{
            fontSize: '5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textAlign: 'center',
            letterSpacing: '-0.025em',
          }}
        >
          Dr. Pulak Vatsya
        </h1>
        <p
          style={{
            fontSize: '2.5rem',
            fontWeight: 'normal',
            color: '#ccfbf1',
            textAlign: 'center',
          }}
        >
          Orthopaedic Knee Surgeon | StepUp Joints, New Delhi
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}

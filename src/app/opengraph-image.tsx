import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Learnhour — a steady hour of learning';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '68px 78px', background: '#FAF8F5', color: '#0F172A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 58, height: 58, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2D5A27', color: 'white', fontSize: 32, fontWeight: 800 }}>L</div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>Learnhour</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 900 }}>
          <div style={{ fontSize: 74, fontWeight: 800, lineHeight: 1.08, letterSpacing: -3 }}>One focused hour.</div>
          <div style={{ marginTop: 12, fontSize: 74, fontWeight: 800, lineHeight: 1.08, letterSpacing: -3, color: '#2D5A27' }}>Steady progress.</div>
          <div style={{ marginTop: 28, fontSize: 28, lineHeight: 1.4, color: '#374151' }}>Plan video courses into daily study sessions and keep your learning history in your browser.</div>
        </div>
        <div style={{ width: 120, height: 8, borderRadius: 999, background: '#C85A32' }} />
      </div>
    ),
    { ...size }
  );
}

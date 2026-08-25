import { ImageResponse } from 'next/og'

export const alt = 'Shipwreck Atlas — an interactive maritime history archive'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-static'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 84px',
          background: '#06151d',
          color: '#f3e4c7',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div
            style={{
              width: 58,
              height: 58,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #bc8b55',
              borderRadius: 999,
              color: '#bc8b55',
              fontSize: 30,
            }}
          >
            ⚓
          </div>
          <div
            style={{
              display: 'flex',
              color: '#bc8b55',
              fontFamily: 'sans-serif',
              fontSize: 22,
              letterSpacing: 5,
              textTransform: 'uppercase',
            }}
          >
            A maritime archive
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 102, letterSpacing: -5, lineHeight: 1 }}>
            Shipwreck Atlas
          </div>
          <div
            style={{
              display: 'flex',
              maxWidth: 900,
              marginTop: 28,
              color: '#aab7b7',
              fontFamily: 'sans-serif',
              fontSize: 29,
              lineHeight: 1.45,
            }}
          >
            Twenty-four historic wrecks, charted across two millennia of maritime history.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 24,
            borderTop: '1px solid #29404a',
            color: '#8fa0a2',
            fontFamily: 'sans-serif',
            fontSize: 20,
          }}
        >
          <span>c. 65 BCE—1994</span>
          <span>shipwreck-atlas.vercel.app</span>
        </div>
      </div>
    ),
    size,
  )
}

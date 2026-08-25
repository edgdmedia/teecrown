'use client'

export default function BeforeDashboard() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(0,0,128,0.96), rgba(0,11,36,0.96))',
        border: '1px solid rgba(97, 206, 112, 0.2)',
        borderRadius: '18px',
        color: '#fff',
        marginBottom: '24px',
        padding: '24px',
      }}
    >
      <div style={{ color: '#61ce70', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', marginBottom: '8px', textTransform: 'uppercase' }}>
        Tee&apos;Crown Consult
      </div>
      <h2 style={{ fontSize: '28px', lineHeight: 1.15, margin: '0 0 8px' }}>
        Content operations dashboard
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.78)', margin: 0, maxWidth: '48rem' }}>
        Keep your public website current by managing offers, editorial content, testimonials and media from one place.
      </p>
    </div>
  )
}

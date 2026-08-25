'use client'

import Image from 'next/image'

export default function BeforeLogin() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '20px',
      }}
    >
      <img
        src="/logo-landscape.webp"
        alt="Tee'Crown Consult"
        style={{ height: 'auto', width: '220px' }}
      />
      <p style={{ color: 'var(--theme-elevation-600)', margin: 0, maxWidth: '32rem' }}>
        Sign in to manage tours, stories, testimonials and media for Tee&apos;Crown Consult.
      </p>
    </div>
  )
}

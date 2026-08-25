'use client'

import Image from 'next/image'

export default function Logo() {
  return (
    <Image
      src="/logo-landscape.webp"
      alt="Tee'Crown Consult"
      width={170}
      height={42}
      style={{ height: 'auto', width: '170px' }}
      priority
    />
  )
}

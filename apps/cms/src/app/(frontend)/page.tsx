import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(payloadConfig.routes.admin)
  }

  const loginRoute = `${payloadConfig.routes.admin}/login`

  return (
    <div className="home">
      <div className="brand-lockup">
        <Image
          src="/logo-landscape.webp"
          alt="Tee'Crown Consult"
          width={220}
          height={56}
          className="brand-mark"
          priority
        />
        <div className="brand-copy">Travel content operations dashboard</div>
      </div>
      <div className="content">
        <div className="content-inner">
          <div className="eyebrow">Content Management System</div>
          <h1>
            Keep your <span>offers, stories</span> and brand media current
          </h1>
          <p className="lede">
            Use this dashboard to publish tour packages, update blog content,
            manage testimonials, and keep website assets aligned with the live
            Tee&apos;Crown Consult experience.
          </p>
          <div className="feature-grid">
            <div className="feature-card">
              <strong>Tours</strong>
              <span>Refresh pricing, itineraries and destination highlights.</span>
            </div>
            <div className="feature-card">
              <strong>Stories</strong>
              <span>Publish blog posts and trust-building testimonials.</span>
            </div>
            <div className="feature-card">
              <strong>Media</strong>
              <span>Keep logos, imagery and upload assets organized.</span>
            </div>
          </div>
          <div className="actions">
            <a className="login" href={loginRoute}>
              Sign in to Admin
            </a>
            <a className="site" href="https://teecrownconsult.org">
              Visit the public site
            </a>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>Tee&apos;Crown Consult CMS on Payload</p>
      </div>
    </div>
  )
}

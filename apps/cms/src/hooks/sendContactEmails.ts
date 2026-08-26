import type { CollectionAfterChangeHook } from 'payload'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@teecrownconsult.org'

export const sendContactEmails: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return

  const { name, email, phone, service, message, referral } = doc
  const payload = req.payload

  const serviceLabel = service || 'Not specified'
  const referralLabel = referral || 'Not specified'

  const userSubject = "We've received your enquiry — Tee'Crown Consult"
  const userHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
      <h2 style="color:#0a2463">Thank you, ${name}!</h2>
      <p>We've received your enquiry and our team will get back to you within 24 hours.</p>
      <hr style="border:none;border-top:1px solid #e0e0e0;margin:20px 0" />
      <p style="font-size:14px;color:#555"><strong>Service:</strong> ${serviceLabel}</p>
      <p style="font-size:14px;color:#555"><strong>Your message:</strong></p>
      <p style="font-size:14px;color:#555;background:#f5f5f5;padding:12px;border-radius:6px">${message}</p>
      <hr style="border:none;border-top:1px solid #e0e0e0;margin:20px 0" />
      <p style="font-size:13px;color:#888">If you need immediate assistance, call us or <a href="https://wa.me/2348096111333">message us on WhatsApp</a>.</p>
      <p style="font-size:13px;color:#888">— Tee'Crown Consult Ltd</p>
    </div>
  `

  const adminSubject = `New contact enquiry from ${name}`
  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
      <h2 style="color:#0a2463">New Contact Enquiry</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;font-weight:600;width:120px">Name</td><td>${name}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:8px 0;font-weight:600">Phone</td><td>${phone || '—'}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600">Service</td><td>${serviceLabel}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600">Referral</td><td>${referralLabel}</td></tr>
      </table>
      <p style="font-size:14px;margin-top:16px"><strong>Message:</strong></p>
      <p style="font-size:14px;background:#f5f5f5;padding:12px;border-radius:6px">${message}</p>
      <hr style="border:none;border-top:1px solid #e0e0e0;margin:20px 0" />
      <p style="font-size:13px;color:#888">Submitted via teecrownconsult.org contact form</p>
    </div>
  `

  try {
    await Promise.all([
      payload.sendEmail({
        to: email,
        subject: userSubject,
        html: userHtml,
      }),
      payload.sendEmail({
        to: ADMIN_EMAIL,
        subject: adminSubject,
        html: adminHtml,
        replyTo: { email, name },
      }),
    ])
  } catch (err) {
    console.error('Failed to send contact emails:', err)
  }
}

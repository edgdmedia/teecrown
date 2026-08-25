import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Content management system for teecrownconsult.org.',
  icons: {
    icon: '/favicon.ico',
  },
  title: "Tee'Crown Consult | Content Management",
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

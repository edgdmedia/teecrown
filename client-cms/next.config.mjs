import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { withPayload } from '@payloadcms/next/withPayload'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig = {
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },
}

export default withPayload(nextConfig)

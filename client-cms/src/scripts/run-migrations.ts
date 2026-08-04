import { getPayload } from 'payload'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const configModule = await import(pathToFileURL(path.resolve('.payload-tmp/payload.config.payload.js')).href)
const config = configModule.default

async function main() {
  process.env.DISABLE_PAYLOAD_HMR = 'true'
  process.env.PAYLOAD_MIGRATING = 'true'

  const payload = await getPayload({
    config,
    disableOnInit: true,
  })

  if (!payload.db) {
    throw new Error('No database adapter found')
  }

  await payload.db.migrate({
    forceAcceptWarning: true,
  })
  await payload.destroy()
}

void main()
